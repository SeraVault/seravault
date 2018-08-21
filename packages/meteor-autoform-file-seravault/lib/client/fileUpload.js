import { _ }           from 'meteor/underscore';
import { Meteor }      from 'meteor/meteor';
import { AutoForm }    from 'meteor/aldeed:autoform';
import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo }       from 'meteor/mongo';
import { encrypt }     from 'nacl-blob/dist';
import { Random }      from 'meteor/random';

const defaultInsertOpts = {
  meta: {},
  isBase64: false,
  transport: 'ddp',
  streams: 'dynamic',
  chunkSize: 'dynamic',
  allowWebWorkers: true
};

Template.afFileUpload.onCreated(function () {
  const self = this;
  if (!this.data) {
    this.data = {
      atts: {}
    };
  }

  this.collection      = Mongo.Collection.get
    ? Mongo.Collection.get(this.data.atts.collection).filesCollection
    : (global[this.data.atts.collection] || Meteor.connection._mongo_livedata_collections[this.data.atts.collection].filesCollection);
  this.uploadTemplate  = this.data.atts.uploadTemplate || null;
  this.previewTemplate = this.data.atts.previewTemplate || null;
  this.insertConfig    = Object.assign({}, this.data.atts.insertConfig || {});
  delete this.data.atts.insertConfig;
  this.insertConfig    = Object.assign(this.insertConfig, _.pick(this.data.atts, Object.keys(defaultInsertOpts)));

  if (!isNaN(this.insertConfig.streams) || this.insertConfig.streams !== 'dynamic') {
    this.insertConfig.streams = parseInt(this.insertConfig.streams);
  }
  if (!isNaN(this.insertConfig.chunkSize) || this.insertConfig.chunkSize !== 'dynamic') {
    this.insertConfig.chunkSize = parseInt(this.insertConfig.chunkSize);
  }

  if (!this.collection) {
    throw new Meteor.Error(404, '[meteor-autoform-files] No such collection "' + this.data.atts.collection + '"');
  }

  this.collectionName = function () {
    return self.data.atts.collection;
  };

  this.currentUpload = new ReactiveVar(false);
  this.encrypting = new ReactiveVar(false);
  this.encryptProgress = new ReactiveVar(0);
  this.inputName     = this.data.name;
  this.fileId        = new ReactiveVar(this.data.value || false);
  this.formId        = this.data.atts.id;
  return;
});

Template.afFileUpload.helpers({
  previewTemplate() {
    return Template.instance().previewTemplate;
  },
  uploadTemplate() {
    return Template.instance().uploadTemplate;
  },
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  encryptProgress() {
    return Template.instance().encryptProgress.get();
  },
  fileId() {
    return Template.instance().fileId.get() || this.value;
  },
  uploadedFile() {
    const template = Template.instance();
    const _id = template.fileId.get() || this.value;
    if (typeof _id !== 'string' || _id.length === 0) {
      return null;
    }
    return template.collection.findOne({_id});
  },

});



Template.afFileUpload.events({
  'click [data-reset-file]'(e, template) {
    e.preventDefault();
    template.fileId.set(false);
    return false;
  },
  'click [data-remove-file]'(e, template) {
    e.preventDefault();
    template.fileId.set(false);
    try {
      this.remove();
    } catch (error) {
      // we're good here
    }
    return false;
  },
  'change [data-files-collection-upload]'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var docId = AutoForm.getFieldValue('_id', 'editItems');
      var blob = e.currentTarget.files[0];
      template.currentUpload.set(true);
      
      if (docId) {
        doc = Items.findOne(AutoForm.getFieldValue('_id', 'editItems'));
        nonce = doc.doc_fileNonce;
        key = Sv.getDocUserKey(doc);
        //Session.set('nonce', doc.doc_fileNonce);
        //Session.set('key', Sv.getDocUserKey(doc));        
      } else {        
        docId = Session.get('tmp_id') || Random.id();
        Session.set('tmp_id', docId);
        doc = Sv.getDocKeys();
        if (!Session.get('tmp_fileNonce')) {Session.set('tmp_fileNonce', doc.doc_fileNonce);}
        if (!Session.get('tmp_key')) {Session.set('tmp_key', doc.doc_tmp_key);}
        nonce = Session.get('tmp_fileNonce');
        key = Session.get('tmp_key');
      }

      if (!enoughDisk(blob.size)) {
        toastr.error(TAPi18n.__("outOfDiskSpace"));
        template.currentUpload.set(false);
        return;
      }

      $('.btn-save').prop("disabled",true);

      const encryptor = encrypt(key, nonce, blob, handleUpload);

      encryptor.on('progress', function(data) {
        var percent = Math.round(data.position / data.length * 100);
        template.encryptProgress.set(percent);
      });

      function handleUpload (err, encryptedBlob) {
        if (err) {
          // TOOD How to handle error? Shoe it in UI?
          toastr.error(err);
          return;
        }

        defaultInsertOpts.meta = {itemId: docId};
      
        const opts = Object.assign({}, defaultInsertOpts, template.insertConfig, {
          file: encryptedBlob
        });

        const upload = template.collection.insert(opts, false);
        const ctx    = AutoForm.getValidationContext(template.formId);

        upload.on('start', function () {
          ctx.reset();
          template.currentUpload.set(this);
          return;
        });

        upload.on('error', function (error) {
          ctx.reset();
          ctx.addValidationErrors([{name: template.inputName, type: 'uploadError', value: error.reason}]);
          template.$(e.currentTarget).val('');
          return;
        });

        upload.on('end', function (error, fileObj) {
          if (!error) {
            if (template) {
              template.fileId.set(fileObj._id);
            }
          }
          template.currentUpload.set(false);
          template.encrypting.set(false);
          
          $('.btn-save').prop("disabled",false);
          return;
        });

        upload.start();
      }
    }
  }
});