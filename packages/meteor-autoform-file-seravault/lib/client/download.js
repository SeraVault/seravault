import { decrypt }     from 'nacl-blob/dist';

decryptDownloadFile = function(file) {
    var doc = Items.findOne(file.meta.itemId);
    var nonce = doc.doc_fileNonce;
    var key = Sv.getDocUserKey(doc);

    fetch(file.link(),{mode: 'no-cors'}).then(function (response) {
      console.log(response);
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Invalid network response.");
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
          decryptor.on('progress', ({ position, length }) => {
              Session.set('tmp_decrypting_percent', Math.round(position / length* 100));
          });
        });
      }).then(decryptedBlob => { 
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        url = window.URL.createObjectURL(decryptedBlob);
        if (Meteor.isCordova) {
          url = WebAppLocalServer.localFileSystemUrl(url);
        };
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);        
      }).catch(err => {
        toastr.error(err);
      }).then(() => {
        //decryptButton.innerText = 'Download and decrypt'
        //decryptButton.removeAttribute('disabled')
      });
};