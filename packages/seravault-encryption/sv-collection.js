import { Random } from 'meteor/random';

var CONFIG_PAT = Match.Optional({
    /**
     * gets called once a key is generated
     * should be defined by the user
     * @param privateKey
     * @param publicKey
     * @param document
     */
    /*onKeyGenerated: Match.Optional(Function),*/
    /**
     * gets called once a document is inserted and encrypted
     * should be defiend by the user
     * @param document - the encrypted document
     */
    /*onFinishedDocEncryption: Match.Optional(Function)*/
});

/**
 * register a collection to encrypt/decrypt automtically
 * @param collection - the collection instance
 * @param fields - array of fields which will be encrypted
 * @param config
 */
SvCollection = function (collection, fields, config, addOwner) {
    var self = this;

    // check if the config is valid
    check(config, CONFIG_PAT);

    var options = _.omit(config);
    self.config = _.defaults(options, self.config);

    // create a new instance of the mongo collection
    self.collection = collection;


    // store the properties
    self.fields = fields;

    // check if simple schema is being used
    if (_.isFunction(collection.simpleSchema) && !!collection.simpleSchema()) {
        self._initSchema(addOwner);
        self.schema = self.collection.simpleSchema();
    }

    // listen to findOne events from the database
    self._listenToFinds();
    // listen to before insert and after insert events
    self._listenToInserts();
    // listen to before update and after update events
    self._listenToUpdates();
    // listen to removes so we can remove the keys from DocKeys
    self._listenToRemove();
};

_.extend(SvCollection.prototype, {
    /**
     * returns the key of the encrypted field
     * that indicates whether the doc is in encrypted or decrypted form
     */
    getEncryptedFieldKey: function () {
        encryptedFieldKey = 'encrypted';
        return encryptedFieldKey;
    },
    /**
     * addes the encrypted property to the schema of the collection
     */
    _initSchema: function (addOwner) {
        var self = this,
            schema = {};

        // init the encryption schema for the given collection client-side
        /*schema[self.getEncryptedFieldKey()] = {
            type: Boolean,
            defaultValue: false
        };*/
        // attach the schema
        self.collection.attachSchema(SchemaKeys);

        if (addOwner) {
          self.collection.attachSchema(SchemaCollectionFields);
        } else {
          self.collection.attachSchema(SchemaCollectionFieldsNoOwner);
        };

        // tell server to init the encryption schema for the given collection
        Meteor.call(
            'initSchema',
            self.collection._name,
            addOwner
        );
    },
    /**
     * listen to findOne operations on the given collection in order to decrypt
     * automtically
     */
    _listenToFinds: function () {
        var self = this;

        // listen to findOne events
        self.collection.after.findOne(function (userId, selector, options, doc) {
            doc = self._decryptDoc(doc)
        });
    },
    /**
     * decrypts the given doc and stores it into minimongo
     * @param doc
     */
    _decryptDoc: function (doc) {
        var self = this;
        if (!doc || !doc.encrypted) {
            return;
        }
        // if the doc already is decrypted, don't do anything
        /*if (!_.deep(doc, self.getEncryptedFieldKey())) {
            return;
        }*/
        doc = Sv.decryptDoc(doc, self.fields);
        return doc;
    },
    /**
     * listen to insert operations on the given collection in order to encrypt
     * automtically
     */
    _listenToInserts: function () {
        var self = this;
        self.collection.before.insert(function (userId, doc) {
            //generate an ID: for file uploads, we need to add a reference to the document _id so it was generated earlier and stored in tmp_id.        
            var docId = Session.get('tmp_id') || Random.id();
            doc._id = docId;
            Session.set('tmp_id', null);    
            //during file upload on a new doc, a doc nonce must be generated in order to encrypt the file.  Check if we have one:
            fileNonce = Session.get('tmp_fileNonce');
            doc.doc_fileNonce = fileNonce;
            Session.set('tmp_fileNonce', null);
            doc = self.startDocEncryption(doc, userId);
            //console.log(doc);
        });
        /*self.collection.after.insert(function(userId, doc) {
          //console.log('after insert');
          //console.log('doc:', doc);
          if (doc.recipients) {
            ItemsEncryption.shareDocByRecipients(doc, 'RWED');
          }

        })*/
    },
    /**
     * listen to update operations on the given collection in order to (re)encrypt
     * automtically
     */
    _listenToUpdates: function () {
        var self = this;
        self.collection.before.update(function (userId, doc,
            fieldNames, modifier) {
              /*console.log('before update');
              console.log(doc);
              console.log(modifier);
              console.log(fieldNames);*/
            modifier = self.startDocUpdate(userId,
                doc, fieldNames, modifier);
        });
        /*self.collection.after.update(function(userId, doc){
            console.log(doc);
            if (doc.recipients) {
                ItemsEncryption.shareDocByRecipients(doc, 'RWED');
            }
    
        })*/
    },
    //Listen to removes so that we can delete from the DocKeys collection
    _listenToRemove: function () {
        var self = this;
        // once a document gets removed we also remove the corresponding DocKey
        self.collection.after.remove(function (userId, doc) {
            // find the id of the DocKey in order to remove
            var id = DocKeys.findOne({doc_id: doc._id})._id;
            // if there is a DocKey then remove it
            if (id) {
                DocKeys.remove({_id: id});
            }
        });
    },
    startDocEncryption: function (doc, userId) {
        var self = this;
        //console.log('insert: ', doc);
        return self.finishDocEncryption(doc, userId);
    },
    startDocUpdate: function (userId, doc, fieldNames, modifier) {
      //console.log('start doc update');
      var self = this;
      var newDoc = doc;
      var needsEncryption = false;
      //console.log('update: ', modifier);
      modifier.$set = modifier.$set || {};
      // check if a field that should be encrypted was edited
      _.each(fieldNames, function(field) {
        var fieldValue = modifier.$set[field];
        SvUtils.setValue(doc, field, fieldValue);
        if (self.fields.indexOf(field)) {
          needsEncryption = true;
        }
      });
      self.fields.forEach(function (field) {
          var fieldValue = modifier.$set[field];
          SvUtils.setValue(doc, field, fieldValue);
          if (!!fieldValue) {
              // store the unencrypted value for later encryption
              SvUtils.setValue(doc, field, fieldValue);
              needsEncryption = true;
          } else {
              SvUtils.setValue(doc, field, undefined);
          }
      });
      // if no encrypted fields were modified, just return
      /*if (!needsEncryption) {
          return modifier;
      }*/
      //console.log('modifier', modifier);
      modifier.$set = self.finishDocEncryption(doc, userId);
      //console.log('modifier', modifier);
      if (modifier.$unset) {
        var unset = modifier.$unset;
        delete unset.recipients;
        modifier.$unset = unset;
      }
      //console.log(modifier);
      return modifier;
    },
    finishDocEncryption: function (doc, userId) {
      //console.log(doc);
      var self = this;
      if (!doc) {return;};
      //console.log('docforenc:', doc);
      encryptedDoc = Sv.encryptDoc(doc, self.fields, self.collection._name, userId);
      encryptedDoc.size = sizeof(encryptedDoc);
      //console.log('finishDocEncryption', encryptedDoc);
      return encryptedDoc;
    },
});

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */
function sizeof(object){

  // initialise the list of objects and size
  var objects = [object];
  var size    = 0;

  // loop over the objects
  for (var index = 0; index < objects.length; index ++){

    // determine the type of the object
    switch (typeof objects[index]){

      // the object is a boolean
      case 'boolean': size += 4; break;

      // the object is a number
      case 'number': size += 8; break;

      // the object is a string
      case 'string': size += 2 * objects[index].length; break;

      // the object is a generic object
      case 'object':

        // if the object is not an array, add the sizes of the keys
        if (Object.prototype.toString.call(objects[index]) != '[object Array]'){
          for (var key in objects[index]) size += 2 * key.length;
        }

        // loop over the keys
        for (var key in objects[index]){

          // determine whether the value has already been processed
          var processed = false;
          for (var search = 0; search < objects.length; search ++){
            if (objects[search] === objects[index][key]){
              processed = true;
              break;
            }
          }

          // queue the value to be processed if appropriate
          if (!processed) objects.push(objects[index][key]);

        }

    }

  }

  // return the calculated size
  return size;

}
