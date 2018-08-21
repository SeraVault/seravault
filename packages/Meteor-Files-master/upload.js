import { _ }            from 'meteor/underscore';
import { HTTP }         from 'meteor/http';
import { Meteor }       from 'meteor/meteor';
import { Random }       from 'meteor/random';
import { Tracker }      from 'meteor/tracker';
import { ReactiveVar }  from 'meteor/reactive-var';
import { EventEmitter } from 'eventemitter3';
import { check, Match } from 'meteor/check';
import { fixJSONParse, fixJSONStringify } from './lib.js';

const _rootUrl = (window.__meteor_runtime_config__.MOBILE_ROOT_URL || window.__meteor_runtime_config__.ROOT_URL).replace(/\/+$/, '');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/*
 * @locus Client
 * @name UploadInstance
 * @class UploadInstance
 * @summary Internal Class, used for file upload
 */
export class UploadInstance extends EventEmitter {
  constructor(config, collection) {
    super();
    this.config     = config;
    this.collection = collection;
    this.collection._debug('[FilesCollection] [insert()]');

    if (!this.config.ddp) {
      this.config.ddp = this.collection.ddp;
    }

    if (!this.config.meta) {
      this.config.meta = {};
    }

    if (!this.config.streams) {
      this.config.streams = 2;
    }

    if (this.config.streams < 1) {
      this.config.streams = 2;
    }

    if (!_.isString(this.config.transport)) {
      this.config.transport = 'ddp';
    }

    this.config.transport = this.config.transport.toLowerCase();

    if (this.config.transport !== 'ddp' && this.config.transport !== 'http') {
      this.config.transport = 'ddp';
    }

    if (!this.config.chunkSize) {
      this.config.chunkSize = this.collection.chunkSize;
    }

    if (!_.isBoolean(this.config.allowWebWorkers)) {
      this.config.allowWebWorkers = true;
    }

    check(this.config, {
      ddp: Match.Any,
      file: Match.Any,
      fileId: Match.Optional(String),
      meta: Match.Optional(Object),
      type: Match.Optional(String),
      onError: Match.Optional(Function),
      onAbort: Match.Optional(Function),
      streams: Match.OneOf('dynamic', Number),
      onStart: Match.Optional(Function),
      fileName: Match.Optional(String),
      isBase64: Match.Optional(Boolean),
      transport: Match.OneOf('http', 'ddp'),
      chunkSize: Match.OneOf('dynamic', Number),
      onUploaded: Match.Optional(Function),
      onProgress: Match.Optional(Function),
      onBeforeUpload: Match.Optional(Function),
      allowWebWorkers: Boolean
    });

    if (this.config.isBase64 === true) {
      check(this.config.file, String);

      if (!this.config.fileName) {
        throw new Meteor.Error(400, '"fileName" must me specified for base64 upload!');
      }

      if (!!~this.config.file.indexOf('data:')) {
        this.config.file = this.config.file.replace('data:', '');
      }

      if (!!~this.config.file.indexOf(',')) {
        const _file = this.config.file.split(',');
        this.fileData = {
          size: Math.floor(((_file[1].replace(/\=/g, '')).length / 4) * 3),
          type: _file[0].split(';')[0],
          name: this.config.fileName,
          meta: this.config.meta
        };
        this.config.file = _file[1];
      } else if (!this.config.type) {
        throw new Meteor.Error(400, '"type" must me specified for base64 upload! And represent mime-type of the file');
      } else {
        this.fileData = {
          size: Math.floor(((this.config.file.replace(/\=/g, '')).length / 4) * 3),
          type: this.config.type,
          name: this.config.fileName,
          meta: this.config.meta
        };
      }
    }

    if (this.config.file) {
      if (!this.config.isBase64) {
        try {
          if (!this.config.file.name || !this.config.file.size) {
            throw new Meteor.Error(500, 'Not a File!');
          }
        } catch (e) {
          throw new Meteor.Error(500, '[FilesCollection] [insert] Insert method accepts File, not a FileList. You need to provide a real File. File must have `.name` property, and its size must be larger than zero.');
        }

        this.fileData = {
          size: this.config.file.size,
          type: this.config.type || this.config.file.type,
          name: this.config.fileName || this.config.file.name,
          meta: this.config.meta
        };
      }

      if (this.collection.debug) {
        console.time(`insert ${this.fileData.name}`);
        console.time(`loadFile ${this.fileData.name}`);
      }

      if (this.collection._supportWebWorker && this.config.allowWebWorkers) {
        try {
          this.worker = new Worker(this.collection._webWorkerUrl);
        } catch (wwError) {
          this.worker = false;
          this.collection._debug('[FilesCollection] [insert] [create WebWorker]: Can\'t create WebWorker, fallback to MainThread', wwError);
        }
      } else {
        this.worker = null;
      }

      this.startTime     = {};
      this.config.debug  = this.collection.debug;
      this.config._debug = this.collection._debug;
      this.currentChunk  = 0;
      this.transferTime  = 0;
      this.trackerComp   = null;
      this.sentChunks    = 0;
      this.fileLength    = 1;
      this.EOFsent       = false;
      this.fileId        = this.config.fileId || Random.id();
      this.FSName        = this.collection.namingFunction ? this.collection.namingFunction(this.fileData) : this.fileId;
      this.pipes         = [];

      this.fileData = _.extend(this.fileData, this.collection._getExt(this.fileData.name), {mime: this.collection._getMimeType(this.fileData)});
      this.fileData['mime-type'] = this.fileData.mime;

      this.result = new FileUpload(_.extend(this.config, {
        fileData: this.fileData,
        fileId: this.fileId,
        _Abort: this.collection._methodNames._Abort
      }));

      this.beforeunload = (e) => {
        const message = _.isFunction(this.collection.onbeforeunloadMessage) ? this.collection.onbeforeunloadMessage.call(this.result, this.fileData) : this.collection.onbeforeunloadMessage;

        if (e) {
          e.returnValue = message;
        }
        return message;
      };

      this.result.config.beforeunload = this.beforeunload;
      window.addEventListener('beforeunload', this.beforeunload, false);

      this.result.config._onEnd = () => this.emit('_onEnd');

      this.addListener('end', this.end);
      this.addListener('start', this.start);
      this.addListener('upload', this.upload);
      this.addListener('sendEOF', this.sendEOF);
      this.addListener('prepare', this.prepare);
      this.addListener('sendChunk', this.sendChunk);
      this.addListener('proceedChunk', this.proceedChunk);
      this.addListener('createStreams', this.createStreams);

      this.addListener('calculateStats', _.throttle(() => {
        const _t = (this.transferTime / this.sentChunks) / this.config.streams;
        this.result.estimateTime.set((_t * (this.fileLength - this.sentChunks)));
        this.result.estimateSpeed.set((this.config.chunkSize / (_t / 1000)));

        const progress = Math.round((this.sentChunks / this.fileLength) * 100);
        this.result.progress.set(progress);
        this.config.onProgress && this.config.onProgress.call(this.result, progress, this.fileData);
        this.result.emit('progress', progress, this.fileData);
      }, 250));

      this.addListener('_onEnd', () => {
        if (this.result.estimateTimer) {
          Meteor.clearInterval(this.result.estimateTimer);
        }
        if (this.worker) {
          this.worker.terminate();
        }
        if (this.trackerComp) {
          this.trackerComp.stop();
        }
        if (this.beforeunload) {
          window.removeEventListener('beforeunload', this.beforeunload, false);
        }
        if (this.result) {
          return this.result.progress.set(0);
        }
        return void 0;
      });
    } else {
      throw new Meteor.Error(500, '[FilesCollection] [insert] Have you forget to pass a File itself?');
    }
  }

  end(error, data) {
    this.collection._debug('[FilesCollection] [UploadInstance] [end]', this.fileData.name);
    if (this.collection.debug) {
      console.timeEnd(`insert ${this.fileData.name}`);
    }

    this.emit('_onEnd');
    this.result.emit('uploaded', error, data);
    this.config.onUploaded && this.config.onUploaded.call(this.result, error, data);

    if (error) {
      this.collection._debug('[FilesCollection] [insert] [end] Error:', error);
      this.result.abort();
      this.result.state.set('aborted');
      this.result.emit('error', error, this.fileData);
      this.config.onError && this.config.onError.call(this.result, error, this.fileData);
    } else {
      this.result.state.set('completed');
      this.collection.emit('afterUpload', data);
    }
    this.result.emit('end', error, (data || this.fileData));
    return this.result;
  }

  sendChunk(evt) {
    const opts = {
      fileId: this.fileId,
      binData: evt.data.bin,
      chunkId: evt.data.chunkId
    };

    if (this.config.isBase64) {
      const pad = opts.binData.length % 4;
      if (pad) {
        let p = 0;
        while (p < pad) {
          opts.binData += '=';
          p++;
        }
      }
    }

    this.emit('data', evt.data.bin);
    if (this.pipes.length) {
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        opts.binData = this.pipes[i](opts.binData);
      }
    }

    if (this.fileLength === evt.data.chunkId) {
      if (this.collection.debug) {
        console.timeEnd(`loadFile ${this.fileData.name}`);
      }
      this.emit('readEnd');
    }

    if (opts.binData) {
      if (this.config.transport === 'ddp') {
        this.config.ddp.call(this.collection._methodNames._Write, opts, (error) => {
          this.transferTime += (+new Date) - this.startTime[opts.chunkId];
          if (error) {
            if (this.result.state.get() !== 'aborted') {
              this.emit('end', error);
            }
          } else {
            ++this.sentChunks;
            if (this.sentChunks >= this.fileLength) {
              this.emit('sendEOF');
            } else if (this.currentChunk < this.fileLength) {
              this.emit('upload');
            }
            this.emit('calculateStats');
          }
        });
      } else {
        HTTP.call('POST', `${_rootUrl}${this.collection.downloadRoute}/${this.collection.collectionName}/__upload`, {
          content: opts.binData,
          headers: {
            'x-mtok': (_.isObject(Meteor.connection) ? Meteor.connection._lastSessionId : undefined) || null,
            'x-fileid': opts.fileId,
            'x-chunkid': opts.chunkId,
            'content-type': 'text/plain'
          }
        }, (error) => {
          this.transferTime += +new Date() - this.startTime[opts.chunkId];
          if (error) {
            if (`${error}` === 'Error: network') {
              this.result.pause();
            } else {
              if (this.result.state.get() !== 'aborted') {
                this.emit('end', error);
              }
            }
          } else {
            ++this.sentChunks;
            if (this.sentChunks >= this.fileLength) {
              this.emit('sendEOF');
            } else if (this.currentChunk < this.fileLength) {
              this.emit('upload');
            }
            this.emit('calculateStats');
          }
        });
      }
    }
  }

  sendEOF() {
    this.collection._debug('[FilesCollection] [UploadInstance] [sendEOF]', this.EOFsent);
    if (!this.EOFsent) {
      this.EOFsent = true;
      const opts = {
        eof: true,
        fileId: this.fileId
      };

      if (this.config.transport === 'ddp') {
        this.config.ddp.call(this.collection._methodNames._Write, opts, (error, result) => {
          this.emit('end', error, result);
        });
      } else {
        HTTP.call('POST', `${_rootUrl}${this.collection.downloadRoute}/${this.collection.collectionName}/__upload`, {
          content: '',
          headers: {
            'x-eof': '1',
            'x-mtok': (_.isObject(Meteor.connection) ? Meteor.connection._lastSessionId : undefined) || null,
            'x-fileId': opts.fileId,
            'content-type': 'text/plain'
          }
        }, (error, _result) => {
          let result;
          try {
            result = JSON.parse((_.isObject(_result) ? _result.content : undefined) || {});
          } catch (e) {
            console.warn('Something went wrong! [sendEOF] method doesn\'t returned JSON! Looks like you\'re on Cordova app or behind proxy, switching to DDP transport is recommended.');
            result = {};
          }

          if (result.meta) {
            result.meta = fixJSONParse(result.meta);
          }

          this.emit('end', error, result);
        });
      }
    }
  }

  proceedChunk(chunkId) {
    const chunk = this.config.file.slice((this.config.chunkSize * (chunkId - 1)), (this.config.chunkSize * chunkId));

    if (this.config.isBase64) {
      this.emit('sendChunk', {
        data: {
          bin: chunk,
          chunkId
        }
      });
    } else {
      let fileReader;
      if (window.FileReader) {
        fileReader = new window.FileReader;

        fileReader.onloadend = (evt) => {
          this.emit('sendChunk', {
            data: {
              bin: ((_.isObject(fileReader) ? fileReader.result : undefined) || (evt.srcElement ? evt.srcElement.result : undefined) || (evt.target ? evt.target.result : undefined)).split(',')[1],
              chunkId
            }
          });
        };

        fileReader.onerror = (e) => {
          this.emit('end', (e.target || e.srcElement).error);
        };

        fileReader.readAsDataURL(chunk);
      } else if (window.FileReaderSync) {
        fileReader = new window.FileReaderSync;

        this.emit('sendChunk', {
          data: {
            bin: fileReader.readAsDataURL(chunk).split(',')[1],
            chunkId
          }
        });
      } else {
        this.emit('end', 'File API is not supported in this Browser!');
      }
    }
  }

  upload() {
    if (this.result.onPause.get()) {
      return this;
    }

    if (this.result.state.get() === 'aborted') {
      return this;
    }

    if (this.currentChunk <= this.fileLength) {
      ++this.currentChunk;
      if (this.worker) {
        this.worker.postMessage({
          f: this.config.file,
          sc: this.sentChunks,
          cc: this.currentChunk,
          cs: this.config.chunkSize,
          ib: this.config.isBase64
        });
      } else {
        this.emit('proceedChunk', this.currentChunk);
      }
    } else {
      this.emit('sendEOF');
    }
    this.startTime[this.currentChunk] = +new Date();
    return this;
  }

  createStreams() {
    this.collection._debug('[FilesCollection] [UploadInstance] [createStreams]');
    let i = 1;
    while (i <= this.config.streams) {
      this.emit('upload');
      i++;
    }
  }

  prepare() {
    let _len;

    this.config.onStart && this.config.onStart.call(this.result, null, this.fileData);
    this.result.emit('start', null, this.fileData);

    if (this.config.chunkSize === 'dynamic') {
      this.config.chunkSize = this.fileData.size / 1000;
      if (this.config.chunkSize < 327680) {
        this.config.chunkSize = 327680;
      } else if (this.config.chunkSize > 1048576) {
        this.config.chunkSize = 1048576;
      }

      if (this.config.transport === 'http') {
        this.config.chunkSize = Math.round(this.config.chunkSize / 2);
      } else if (isSafari) {
        this.config.chunkSize = Math.ceil(this.config.chunkSize / 8);
      }
    }

    if (this.config.isBase64) {
      this.config.chunkSize = Math.floor(this.config.chunkSize / 4) * 4;
      _len = Math.ceil(this.config.file.length / this.config.chunkSize);
    } else {
      this.config.chunkSize = Math.floor(this.config.chunkSize / 8) * 8;
      _len = Math.ceil(this.fileData.size / this.config.chunkSize);
    }

    if (this.config.streams === 'dynamic') {
      this.config.streams = _.clone(_len);
      if (this.config.streams > 24) { this.config.streams = 24; }

      if (this.config.transport === 'http') {
        this.config.streams = Math.round(this.config.streams / 2);
      } else if (isSafari) {
        this.config.streams = 1;
      }
    }

    this.fileLength = _len <= 0 ? 1 : _len;
    if (this.config.streams > this.fileLength) {
      this.config.streams = this.fileLength;
    }
    this.result.config.fileLength = this.fileLength;

    const opts = {
      file: this.fileData,
      fileId: this.fileId,
      chunkSize: this.config.isBase64 ? ((this.config.chunkSize  / 4) * 3) : this.config.chunkSize,
      fileLength: this.fileLength
    };

    if (this.FSName !== this.fileId) {
      opts.FSName = this.FSName;
    }

    const handleStart = (error) => {
      if (error) {
        this.collection._debug('[FilesCollection] [_Start] Error:', error);
        this.emit('end', error);
      } else {
        this.result.continueFunc = () => {
          this.collection._debug('[FilesCollection] [insert] [continueFunc]');
          this.emit('createStreams');
        };
        this.emit('createStreams');
      }
    };

    if (this.config.transport === 'ddp') {
      this.config.ddp.call(this.collection._methodNames._Start, opts, handleStart);
    } else {
      if (_.isObject(opts.file) ? opts.file.meta : undefined) {
        opts.file.meta = fixJSONStringify(opts.file.meta);
      }

      HTTP.call('POST', `${_rootUrl}${this.collection.downloadRoute}/${this.collection.collectionName}/__upload`, {
        data: opts,
        headers: {
          'x-start': '1',
          'x-mtok': (_.isObject(Meteor.connection) ? Meteor.connection._lastSessionId : undefined) || null
        }
      }, handleStart);
    }
  }

  pipe(func) {
    this.pipes.push(func);
    return this;
  }

  start() {
    let isUploadAllowed;
    if (this.fileData.size <= 0) {
      this.end(new Meteor.Error(400, 'Can\'t upload empty file'));
      return this.result;
    }

    if (this.config.onBeforeUpload && _.isFunction(this.config.onBeforeUpload)) {
      isUploadAllowed = this.config.onBeforeUpload.call(_.extend(this.result, this.collection._getUser()), this.fileData);
      if (isUploadAllowed !== true) {
        return this.end(new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : 'config.onBeforeUpload() returned false'));
      }
    }

    if (this.collection.onBeforeUpload && _.isFunction(this.collection.onBeforeUpload)) {
      isUploadAllowed = this.collection.onBeforeUpload.call(_.extend(this.result, this.collection._getUser()), this.fileData);
      if (isUploadAllowed !== true) {
        return this.end(new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : 'collection.onBeforeUpload() returned false'));
      }
    }

    Tracker.autorun((computation) => {
      this.trackerComp = computation;
      if (!this.result.onPause.curValue && !Meteor.status().connected) {
        this.collection._debug('[FilesCollection] [insert] [Tracker] [pause]');
        this.result.pause();
      }
    });

    if (this.worker) {
      this.collection._debug('[FilesCollection] [insert] using WebWorkers');
      this.worker.onmessage = (evt) => {
        if (evt.data.error) {
          this.collection._debug('[FilesCollection] [insert] [worker] [onmessage] [ERROR:]', evt.data.error);
          this.emit('proceedChunk', evt.data.chunkId);
        } else {
          this.emit('sendChunk', evt);
        }
      };

      this.worker.onerror = (e) => {
        this.collection._debug('[FilesCollection] [insert] [worker] [onerror] [ERROR:]', e);
        this.emit('end', e.message);
      };
    } else {
      this.collection._debug('[FilesCollection] [insert] using MainThread');
    }

    this.emit('prepare');
    return this.result;
  }

  manual() {
    this.result.start = () => {
      this.emit('start');
    };

    const self = this;
    this.result.pipe = function (func) {
      self.pipe(func);
      return this;
    };
    return this.result;
  }
}

/*
 * @locus Client
 * @name FileUpload
 * @class FileUpload
 * @summary Internal Class, instance of this class is returned from `.insert()` method
 */
export class FileUpload extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.config._debug('[FilesCollection] [FileUpload] [constructor]');

    if (!this.config.isBase64) {
      this.file        = _.extend(this.config.file, this.config.fileData);
    } else {
      this.file        = this.config.fileData;
    }
    this.state         = new ReactiveVar('active');
    this.onPause       = new ReactiveVar(false);
    this.progress      = new ReactiveVar(0);
    this.continueFunc  = () => { };
    this.estimateTime  = new ReactiveVar(1000);
    this.estimateSpeed = new ReactiveVar(0);
    this.estimateTimer = Meteor.setInterval(() => {
      if (this.state.get() === 'active') {
        const _currentTime = this.estimateTime.get();
        if (_currentTime > 1000) {
          this.estimateTime.set(_currentTime - 1000);
        }
      }
    }, 1000);
  }
  pause() {
    this.config._debug('[FilesCollection] [insert] [.pause()]');
    if (!this.onPause.get()) {
      this.onPause.set(true);
      this.state.set('paused');
      this.emit('pause', this.file);
    }
  }
  continue() {
    this.config._debug('[FilesCollection] [insert] [.continue()]');
    if (this.onPause.get()) {
      this.onPause.set(false);
      this.state.set('active');
      this.emit('continue', this.file);
      this.continueFunc();
    }
  }
  toggle() {
    this.config._debug('[FilesCollection] [insert] [.toggle()]');
    if (this.onPause.get()) {
      this.continue();
    } else {
      this.pause();
    }
  }
  abort() {
    this.config._debug('[FilesCollection] [insert] [.abort()]');
    window.removeEventListener('beforeunload', this.config.beforeunload, false);
    this.config.onAbort && this.config.onAbort.call(this, this.file);
    this.emit('abort', this.file);
    this.pause();
    this.config._onEnd();
    this.state.set('aborted');
    if (this.config.debug) {
      console.timeEnd(`insert ${this.config.fileData.name}`);
    }

    this.config.ddp.call(this.config._Abort, this.config.fileId);
  }
}
