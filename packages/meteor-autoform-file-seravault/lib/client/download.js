import {
  decrypt
} from 'nacl-blob/dist';
var FileSaver = require('file-saver');

decryptDownloadFile = function (file) {
  var doc = Items.findOne(file.meta.itemId);
  var nonce = doc.doc_fileNonce;
  var key = Sv.getDocUserKey(doc);

  fetch(file.link(), {mode: 'no-cors'}).then(function (response) {
    console.log(response);
    if (response.ok) {
      return response.blob();
    }    
    throw new Error(response.status);    
  }).then(encryptedBlob => {
    if (!Meteor.user().profile.decryptedDownloadAcknowledgement) {
      Modal.show('App_decrypt_modal');
    } else {
      toastr.warning(TAPi18n.__('decryptedDownloadSaveWarning'));
    }
    return new Promise((resolve, reject) => {
      //const key = nacl.util.decodeBase64(decryptKey.value)
      //const nonce = nacl.util.decodeBase64(decryptNonce.value)
      const decryptor = decrypt(key, nonce, encryptedBlob, (err, decryptedBlob) => {
        if (err) return reject(err);
        resolve(decryptedBlob);
      });
      decryptor.on('progress', ({
        position,
        length
      }) => {
        Session.set('tmp_decrypting_percent', Math.round(position / length * 100));
      });
    });
  }).then(decryptedBlob => {    
    if (Meteor.isCordova) {
      toastr.success('It IS a cordova app!');
      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (directoryEntry) {
        directoryEntry.getFile(file.name, {
          create: true
        }, function (fileEntry) {
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function (e) {
              // for real-world usage, you might consider passing a success callback
              console.log('Write of file "' + file.name + '"" completed.');

              /*function alertDismissed() {}
              navigator.notification.alert(
                'Fichier sauvegardé', // message
                alertDismissed, // callback
                'Sauvegarde', // title
                'ok' // buttonName
              );*/
            };

            fileWriter.onerror = function (e) {
              // you could hook this up with our global error handler, or pass in an error callback
              console.log('Write failed: ' + e.toString());
            };
            /*var out = doc.getZip().generate({
              type: "blob",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            })*/
            fileWriter.write(decryptedBlob);
          }, errorHandler.bind(null, file.name));
        }, errorHandler.bind(null, file.name));
      }, errorHandler.bind(null, file.name));
    } else {
      FileSaver.saveAs(decryptedBlob, file.name);
    }
  }).catch(err => {
    toastr.error(err);
  }).then(() => {
    //decryptButton.innerText = 'Download and decrypt'
    //decryptButton.removeAttribute('disabled')
  });
};