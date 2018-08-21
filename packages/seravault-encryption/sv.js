import nacl from './tweetnacl-js-master/nacl-fast.js';

Sv = {
  setUserKeys: function (password, language, displayName) {
    // generate keypair
    var keyPair = nacl.box.keyPair();
    console.log('Generating a keypair...');
    //console.log(password);
    // encrypt the user's private key
    var nonce = SvUtils.generate24ByteNonce();
    password = SvUtils.generate32ByteKeyFromPassword(password);
    var privateKey = SvUtils.symEncryptWithKey(
      keyPair.secretKey,
      nonce,
      password.byteArray
    );
    //var sharingCode = Random.id();
    var chance = new Chance();
    var isGood = false;
    var sharingCode = '';
    while (isGood == false) {
      sharingCode = chance.word({
        syllables: 3
      }) + chance.integer({
        min: 0,
        max: 9
      });;
      isGood = Meteor.call('checkSharingCode', sharingCode)
    }
    //store encrypted keys to user accounts
    Meteor.call('storeKeys', privateKey, keyPair.publicKey, nonce, password.randomBytes, sharingCode, 'free', language, displayName, function (err, msg) {
      console.log(err);
    });

    // store the raw private key in the session as base64 string
    Session.setAuth('userKeys', {
      privateKey: keyPair.secretKey,
      publicKey: keyPair.publicKey,
      sharingCode: sharingCode
    });
  },
  getUserKeys: function (password) {
    var profile = Meteor.user().profile;
    if (profile) {
      userKeys = {
        enc_privateKey: Meteor.user().profile.enc_privateKey,
        enc_passwordBytes: Meteor.user().profile.enc_passwordBytes,
        enc_nonce: Meteor.user().profile.enc_nonce,
        enc_publicKey: Meteor.user().profile.enc_publicKey,
        sharing_code: Meteor.user().profile.sharing_code
      };
    } else {
      //console.log('Error decrypting keys...');
      return;
    }
    //console.log('Decrypting user keys...');
    // decrypt private key of the user using his password and nonce
    strongPassword = SvUtils.generate32ByteKeyFromPassword(password, userKeys.enc_passwordBytes);
    var privateKey = SvUtils.symDecryptWithKey(
      userKeys.enc_privateKey,
      userKeys.enc_nonce,
      strongPassword.byteArray
    );
    Session.setAuth('userKeys', {
      privateKey: privateKey,
      publicKey: userKeys.enc_publicKey,
      sharingCode: userKeys.sharing_code
    });
  },

  getDocUserKey: function(doc) {
    var keys = doc.keys && doc.keys.find(function (row) {
      if (row.userId == Meteor.userId()) {
        return row;
      }
    });
    if (keys) {
      userPrivateKey = new Uint8Array(_.values(Session.get('userKeys').privateKey)),
      documentKey = SvUtils.asymDecryptWithKey(keys.encKey,
        keys.asymNonce,
        doc.doc_pub_key,
        userPrivateKey
      )
      return documentKey;
    } else {
     return SvUtils.generateRandomKey();
    }
  },

  //the following is for use for file uploads
  /*generateDocKeys: function() {
    var keyPairForDocumentKey = nacl.box.keyPair();
    return {
      doc_priv_key: keyPairForDocumentKey.secretKey,
      doc_pub_key: keyPairForDocumentKey.publicKey,
      doc_symNonce: SvUtils.generate24ByteNonce(),
      doc_fileNonce: SvUtils.generate16ByteNonce(),
      doc_tmp_asymNonce: SvUtils.generate24ByteNonce(),
      doc_tmp_key: SvUtils.generateRandomKey()
    };
  },*/

  getDocKeys: function(doc) {
    doc = doc || {};
    var keyPairForDocumentKey = nacl.box.keyPair();
    doc.doc_priv_key = doc.doc_priv_key || keyPairForDocumentKey.secretKey;
    doc.doc_pub_key = doc.doc_pub_key || keyPairForDocumentKey.publicKey;
    doc.doc_symNonce = doc.doc_symNonce || SvUtils.generate24ByteNonce(); 
    doc.doc_fileNonce = doc.doc_fileNonce || SvUtils.generate16ByteNonce();
    doc.doc_tmp_key = this.getDocUserKey(doc);
    doc.encrypted = true;   
    return doc;
  },


  encryptDoc: function (doc, fields, collectionName, userId) {
    //console.log('encrypting doc...');
    //var keyPairForDocumentKey = nacl.box.keyPair();
    var self = this,
      user = Meteor.user(),
      newDoc = this.getDocKeys(doc),
      docAsymNonce = SvUtils.generate24ByteNonce(),
      userPublicKey = new Uint8Array(_.values(Session.get('userKeys').publicKey));
      
    //console.log(doc);

    //during file upload on a new doc, a doc key must be generated in order to encrypt the file.  Check if we have one:
    if (doc.doc_tmp_key) {
      //console.log(doc.doc_tmp_key);
      documentKey = new Uint8Array(_.values(doc.doc_tmp_key));
      newDoc.doc_tmp_key = null;
    } else {
      documentKey = this.getDocUserKey(doc);
    }      

    //console.log(newDoc);
    // encrypt the fields
    fields.forEach(function (field) {
      if (field.includes('.')) { //THIS IS AN ARRAY FIELD
        var a = field.split('.')[0];
        var b = field.split('.')[1];
        if (doc[a]) {
          //console.log(doc[a]);
          doc[a].forEach(function (data, index) {
            var value = data[b];
            if (value) {
              newDoc[a][index][b] = SvUtils.symEncryptWithKey(
                value,
                newDoc.doc_symNonce,
                documentKey
              );
            }
          });
        }
      } else {
        var value = doc[field];
        //console.log(value);
        if (value) {
          newDoc[field] = SvUtils.symEncryptWithKey(
            value,
            newDoc.doc_symNonce,
            documentKey
          );
        }
      }
      //console.log(newDoc);
    });
    //push all keys
    //debugger;
    //add user's key to doc
    newDoc.recipients = doc.recipients || [];
    newDoc.owner_id = doc.owner_id || Meteor.userId();
    if (!newDoc.recipients.includes(newDoc.owner_id)) {
      newDoc.recipients.push(newDoc.owner_id);
    }

    //console.log(newDoc);
    // make sure the doc owner is never removed:
    if (newDoc.owner_id && !newDoc.recipients.includes(newDoc.owner_id)) {
      newDoc.recipients.push(newDoc.owner_id);
    }
    //console.log(doc.recipients);
    //add recipients keys to doc
    newDoc.keys = [];
    newDoc.recipients && newDoc.recipients.forEach(function (userId) {
      contact = Contacts && Contacts.findOne({
        userId: userId
      });
      //console.log(contact);
      if (contact) {
        var newKey = {
          userId: userId,
          encKey: SvUtils.asymEncryptWithKey(documentKey, docAsymNonce, contact.pubKey, newDoc.doc_priv_key),
          asymNonce: docAsymNonce
        };
        newDoc.keys.push(newKey);
        //console.log(newKey);
      }
    });
    //console.log(newDoc);

    return newDoc;
  },

  decryptDoc: function (doc, fields) {
    docKey = this.getDocUserKey(doc);
    if (docKey) {
      fields.forEach(function (field) {
        //console.log(field)
        if (field.includes('.')) { //THIS IS AN ARRAY FIELD
          //console.log('fieldwith.:', field)
          var a = field.split('.')[0];
          var b = field.split('.')[1];
          if (doc[a]) {
            doc[a].forEach(function (data, index) {
              var value = data[b];
              //console.log('index:', index);
              //console.log(value);
              if (value) {
                doc[a][index][b] = SvUtils.symDecryptWithKey(
                  value,
                  doc.doc_symNonce,
                  docKey
                );
              }
            });
          }
        } else {
          if (doc[field]) {
            doc[field] = SvUtils.symDecryptWithKey(
              doc[field],
              doc.doc_symNonce,
              docKey
            );
          }
        }
      });
    }
    return doc;
  },

  changePassword: function (newPassword) {
    var self = this;
    // encrypt the user's private key
    var nonce = SvUtils.generate24ByteNonce();
    password = SvUtils.generate32ByteKeyFromPassword(newPassword);
    userPrivateKey = new Uint8Array(_.values(Session.get('userKeys').privateKey));
    var privateKey = SvUtils.symEncryptWithKey(
      userPrivateKey,
      nonce,
      password.byteArray
    );
    //store encrypted keys to user accounts
    /*Meteor.call('storeKeys', privateKey, userPublicKey, nonce, password.randomBytes, sharingCode, 'free', function(err, msg) {
      console.log(err);
    });*/
    Meteor.call('updatePrivateKey', privateKey, password.randomBytes, nonce);
  }
}