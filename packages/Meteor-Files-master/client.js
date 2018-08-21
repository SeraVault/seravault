import { _ }               from 'meteor/underscore';
import { Mongo }           from 'meteor/mongo';
import { Meteor }          from 'meteor/meteor';
import { Cookies }         from 'meteor/ostrio:cookies';
import { formatFleURL }    from './lib.js';
import { check, Match }    from 'meteor/check';
import { UploadInstance }  from './upload.js';
import FilesCollectionCore from './core.js';

const NOOP = () => { };

/*
 * @locus Anywhere
 * @class FilesCollection
 * @param config           {Object}   - [Both]   Configuration object with next properties:
 * @param config.debug     {Boolean}  - [Both]   Turn on/of debugging and extra logging
 * @param config.ddp       {Object}   - [Client] Custom DDP connection. Object returned form `DDP.connect()`
 * @param config.schema    {Object}   - [Both]   Collection Schema
 * @param config.public    {Boolean}  - [Both]   Store files in folder accessible for proxy servers, for limits, and more - read docs`
 * @param config.chunkSize      {Number}  - [Both] Upload chunk size, default: 524288 bytes (0,5 Mb)
 * @param config.downloadRoute  {String}  - [Both]   Server Route used to retrieve files
 * @param config.collection     {Mongo.Collection} - [Both] Mongo Collection Instance
 * @param config.collectionName {String}  - [Both]   Collection name
 * @param config.namingFunction {Function}- [Both]   Function which returns `String`
 * @param config.onBeforeUpload {Function}- [Both]   Function which executes on server after receiving each chunk and on client right before beginning upload. Function context is `File` - so you are able to check for extension, mime-type, size and etc.
 * return `true` to continue
 * return `false` or `String` to abort upload
 * @param config.allowClientCode  {Boolean}  - [Both]   Allow to run `remove` from client
 * @param config.onbeforeunloadMessage {String|Function} - [Client] Message shown to user when closing browser's window or tab while upload process is running
 * @param config.disableUpload {Boolean} - Disable file upload, useful for server only solutions
 * @summary Create new instance of FilesCollection
 */
export class FilesCollection extends FilesCollectionCore {
  constructor(config) {
    super();
    if (config) {
      ({
        ddp: this.ddp,
        debug: this.debug,
        schema: this.schema,
        public: this.public,
        chunkSize: this.chunkSize,
        collection: this.collection,
        downloadRoute: this.downloadRoute,
        disableUpload: this.disableUpload,
        namingFunction: this.namingFunction,
        collectionName: this.collectionName,
        onBeforeUpload: this.onBeforeUpload,
        allowClientCode: this.allowClientCode,
        onbeforeunloadMessage: this.onbeforeunloadMessage,
      } = config);
    }

    const self = this;
    const cookie = new Cookies();
    if (!_.isBoolean(this.debug)) {
      this.debug = false;
    }

    if (!_.isBoolean(this.public)) {
      this.public = false;
    }

    if (!this.chunkSize) {
      this.chunkSize = 1024 * 512;
    }
    this.chunkSize = Math.floor(this.chunkSize / 8) * 8;

    if (!_.isString(this.collectionName) && !this.collection) {
      this.collectionName = 'MeteorUploadFiles';
    }

    if (!this.collection) {
      this.collection = new Mongo.Collection(this.collectionName);
    } else {
      this.collectionName = this.collection._name;
    }

    this.collection.filesCollection = this;
    check(this.collectionName, String);

    if (this.public && !this.downloadRoute) {
      throw new Meteor.Error(500, `[FilesCollection.${this.collectionName}]: "downloadRoute" must be precisely provided on "public" collections! Note: "downloadRoute" must be equal or be inside of your web/proxy-server (relative) root.`);
    }

    if (!_.isBoolean(this.disableUpload)) {
      this.disableUpload = false;
    }

    if (!_.isString(this.downloadRoute)) {
      this.downloadRoute = '/cdn/storage';
    }

    this.downloadRoute = this.downloadRoute.replace(/\/$/, '');

    if (!_.isFunction(this.namingFunction)) {
      this.namingFunction = false;
    }

    if (!_.isFunction(this.onBeforeUpload)) {
      this.onBeforeUpload = false;
    }

    if (!_.isBoolean(this.allowClientCode)) {
      this.allowClientCode = true;
    }

    if (!this.ddp) {
      this.ddp = Meteor;
    }

    if (!this.onbeforeunloadMessage) {
      this.onbeforeunloadMessage = 'Upload in a progress... Do you want to abort?';
    }

    const setTokenCookie = () => {
      if ((!cookie.has('x_mtok') && Meteor.connection._lastSessionId) || (cookie.has('x_mtok') && (cookie.get('x_mtok') !== Meteor.connection._lastSessionId))) {
        cookie.set('x_mtok', Meteor.connection._lastSessionId, {
          path: '/'
        });
      }
    };

    const unsetTokenCookie = () => {
      if (cookie.has('x_mtok')) {
        cookie.remove('x_mtok', '/');
      }
    };

    if (typeof Accounts !== 'undefined' && Accounts !== null) {
      Meteor.startup(() => {
        setTokenCookie();
      });
      Accounts.onLogin(() => {
        setTokenCookie();
      });
      Accounts.onLogout(() => {
        unsetTokenCookie();
      });
    }

    check(this.onbeforeunloadMessage, Match.OneOf(String, Function));

    try {
      const _URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL || false;
      if (window.Worker && window.Blob && _URL) {
        this._supportWebWorker = true;
        this._webWorkerUrl     = _URL.createObjectURL(new Blob(['!function(a){"use strict";a.onmessage=function(b){var c=b.data.f.slice(b.data.cs*(b.data.cc-1),b.data.cs*b.data.cc);if(b.data.ib===!0)postMessage({bin:c,chunkId:b.data.cc});else{var d;a.FileReader?(d=new FileReader,d.onloadend=function(a){postMessage({bin:(d.result||a.srcElement||a.target).split(",")[1],chunkId:b.data.cc,s:b.data.s})},d.onerror=function(a){throw(a.target||a.srcElement).error},d.readAsDataURL(c)):a.FileReaderSync?(d=new FileReaderSync,postMessage({bin:d.readAsDataURL(c).split(",")[1],chunkId:b.data.cc})):postMessage({bin:null,chunkId:b.data.cc,error:"File API is not supported in WebWorker!"})}}}(this);'], {type: 'application/javascript'}));
      } else if (window.Worker) {
        this._supportWebWorker = true;
        this._webWorkerUrl     = Meteor.absoluteUrl('packages/ostrio_files/worker.min.js');
      } else {
        this._supportWebWorker = false;
      }
    } catch (e) {
      self._debug('[FilesCollection] [Check WebWorker Availability] Error:', e);
      this._supportWebWorker = false;
    }

    if (!this.schema) {
      this.schema = FilesCollectionCore.schema;
    }

    check(this.debug, Boolean);
    check(this.schema, Object);
    check(this.public, Boolean);
    check(this.chunkSize, Number);
    check(this.downloadRoute, String);
    check(this.disableUpload, Boolean);
    check(this.namingFunction, Match.OneOf(false, Function));
    check(this.onBeforeUpload, Match.OneOf(false, Function));
    check(this.allowClientCode, Boolean);
    check(this.ddp, Match.Any);

    this._methodNames = {
      _Abort: `_FilesCollectionAbort_${this.collectionName}`,
      _Write: `_FilesCollectionWrite_${this.collectionName}`,
      _Start: `_FilesCollectionStart_${this.collectionName}`,
      _Remove: `_FilesCollectionRemove_${this.collectionName}`
    };
  }

  /*
   * @locus Anywhere
   * @memberOf FilesCollection
   * @name _getMimeType
   * @param {Object} fileData - File Object
   * @summary Returns file's mime-type
   * @returns {String}
   */
  _getMimeType(fileData) {
    let mime;
    check(fileData, Object);
    if (_.isObject(fileData)) {
      mime = fileData.type;
    }

    if (!mime || !_.isString(mime)) {
      mime = 'application/octet-stream';
    }
    return mime;
  }

  /*
   * @locus Anywhere
   * @memberOf FilesCollection
   * @name _getUser
   * @summary Returns object with `userId` and `user()` method which return user's object
   * @returns {Object}
   */
  _getUser() {
    const result = {
      user() {
        return null;
      },
      userId: null
    };

    if (_.isFunction(Meteor.userId)) {
      result.user = () => Meteor.user();
      result.userId = Meteor.userId();
    }

    return result;
  }

  /*
   * @locus Client
   * @memberOf FilesCollection
   * @name insert
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
   * @param {Object} config - Configuration object with next properties:
   *   {File|Object} file           - HTML5 `files` item, like in change event: `e.currentTarget.files[0]`
   *   {String}      fileId         - Optionnal `fileId` used at insert
   *   {Object}      meta           - Additional data as object, use later for search
   *   {Boolean}     allowWebWorkers- Allow/Deny WebWorkers usage
   *   {Number|dynamic} streams     - Quantity of parallel upload streams, default: 2
   *   {Number|dynamic} chunkSize   - Chunk size for upload
   *   {String}      transport      - Upload transport `http` or `ddp`
   *   {Object}      ddp            - Custom DDP connection. Object returned form `DDP.connect()`
   *   {Function}    onUploaded     - Callback triggered when upload is finished, with two arguments `error` and `fileRef`
   *   {Function}    onStart        - Callback triggered when upload is started after all successful validations, with two arguments `error` (always null) and `fileRef`
   *   {Function}    onError        - Callback triggered on error in upload and/or FileReader, with two arguments `error` and `fileData`
   *   {Function}    onProgress     - Callback triggered when chunk is sent, with only argument `progress`
   *   {Function}    onBeforeUpload - Callback triggered right before upload is started:
   *       return true to continue
   *       return false to abort upload
   * @param {Boolean} autoStart     - Start upload immediately. If set to false, you need manually call .start() method on returned class. Useful to set EventListeners.
   * @summary Upload file to server over DDP or HTTP
   * @returns {UploadInstance} Instance. UploadInstance has next properties:
   *   {ReactiveVar} onPause  - Is upload process on the pause?
   *   {ReactiveVar} state    - active|paused|aborted|completed
   *   {ReactiveVar} progress - Current progress in percentage
   *   {Function}    pause    - Pause upload process
   *   {Function}    continue - Continue paused upload process
   *   {Function}    toggle   - Toggle continue/pause if upload process
   *   {Function}    abort    - Abort upload
   *   {Function}    readAsDataURL - Current file as data URL, use to create image preview and etc. Be aware of big files, may lead to browser crash
   */
  insert(config, autoStart = true) {
    if (this.disableUpload) {
      console.warn('[FilesCollection] [insert()] Upload is disabled with [disableUpload]!');
      return {};
    }
    return (new UploadInstance(config, this))[autoStart ? 'start' : 'manual']();
  }

  /*
   * @locus Anywhere
   * @memberOf FilesCollection
   * @name remove
   * @param {String|Object} selector - Mongo-Style selector (http://docs.meteor.com/api/collections.html#selectors)
   * @param {Function} callback - Callback with one `error` argument
   * @summary Remove documents from the collection
   * @returns {FilesCollection} Instance
   */
  remove(selector = {}, callback) {
    this._debug(`[FilesCollection] [remove(${JSON.stringify(selector)})]`);
    check(selector, Match.OneOf(Object, String));
    check(callback, Match.Optional(Function));

    if (this.allowClientCode) {
      this.ddp.call(this._methodNames._Remove, selector, (callback || NOOP));
    } else {
      callback && callback(new Meteor.Error(401, '[FilesCollection] [remove] Run code from client is not allowed!'));
      this._debug('[FilesCollection] [remove] Run code from client is not allowed!');
    }

    return this;
  }
}

/*
 * @locus Client
 * @TemplateHelper
 * @name fileURL
 * @param {Object} fileRef - File reference object
 * @param {String} version - [Optional] Version of file you would like to request
 * @summary Get download URL for file by fileRef, even without subscription
 * @example {{fileURL fileRef}}
 * @returns {String}
 */
Meteor.startup(() => {
  if (typeof Template !== 'undefined' && Template !== null) {
    Template.registerHelper('fileURL', (fileRef, version = 'original') => {
      if (!_.isObject(fileRef)) {
        return '';
      }

      version = (!_.isString(version)) ? 'original' : version;
      return formatFleURL(fileRef, version);
    });
  }
});
