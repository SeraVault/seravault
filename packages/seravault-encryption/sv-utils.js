import nacl from './tweetnacl-js-master/nacl-fast.js';
import naclutil from './tweetnacl-js-master/nacl-util.js';

SvNacl = nacl;

SvUtils = {
  symEncryptWithKey: function (message, nonce, key) {
    //console.log('doc key: ', key);
    //console.log('nonce: ', nonce);
    var returnAsString = _.isString(message);
    if (returnAsString) {
      message = naclutil.decodeUTF8(message);
    }
    var encryptedMessage = nacl.secretbox(message, nonce, key);
    if (returnAsString) {
      return naclutil.encodeBase64(encryptedMessage);
    }
    return encryptedMessage;
  },
  symDecryptWithKey: function (cipher, nonce, key) {
    /*console.log('CIPHER', cipher);
    console.log('NONCE', nonce);
    console.log('KEY', key);*/
    var returnAsString = _.isString(cipher);
    if (returnAsString) {
      cipher = naclutil.decodeBase64(cipher);
    }
    var decryptedMessage = nacl.secretbox.open(cipher, nonce, key);
    if (returnAsString) {
      return naclutil.encodeUTF8(decryptedMessage);
    }
    return decryptedMessage;
  },
  /**
  * encrypts the given message asymmetrically with the given (public) key
  * @param message - the message to be encrypted
  * @param nonce - the nonce used for the encryption
  * @param publicKey - the public key that is used to encrypt the message
  * @param secretKey - the private key that represents the message
  */
  asymEncryptWithKey: function (message, nonce, publicKey, secretKey) {
    return nacl.box(message, nonce, publicKey, secretKey);
  },
  /**
  * decrypts the given message asymmetrically with the given (private) key
  * @param message - the message to be decrypted
  * @param nonce - the nonce used for the decryption
  * @param publicKey - the public key that represents the message
  * @param secretKey - the private key of the user that wants to decrypt the message
  */
  asymDecryptWithKey: function (message, nonce, publicKey, secretKey) {
    return nacl.box.open(message, nonce, publicKey, secretKey);
  },
  generate24ByteNonce: function () {
    return nacl.randomBytes(24);
  },
  generate16ByteNonce: function () {
    return nacl.randomBytes(16);
  },  
  generateRandomKey: function() {
    return nacl.randomBytes(32);
  },
  generate32ByteKeyFromPassword: function (password, randomBytes) {
    //console.log(nacl);
    var self = this,
    byteArray = naclutil.decodeUTF8(password);

    if (byteArray.length < 32) {
      // if there are no randomBytes provided -> generate some
      if (!randomBytes) {
        randomBytes = nacl.randomBytes(32 - byteArray.length);
      }
      // store the random bytes so we can use them again when we want to decrypt
      byteArray = self.appendBuffer(byteArray, randomBytes);

    } else {
      byteArray = byteArray.slice(0, 31);
    }
    // return the byte array and the added bytes
    return {
      byteArray: byteArray,
      randomBytes: randomBytes
    };
  },
  appendBuffer: function (buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.length + buffer2.length);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.length);
    return tmp;
  },
  setValue: function (obj, path, value) {
      var i;
      //console.log('obj:', obj);
      //console.log('path:', path);
      //console.log('value:', value);
      path = path.split('.');
      for (i = 0; i < path.length - 1; i++) {
          var emptyObj = {};
          emptyObj[path[i]] = null;
          obj = obj[path[i]] || emptyObj;
      }
      if (!value) {
        delete obj[path[i]];
      } else {
        obj[path[i]] = value;
      }
      //console.log('newObj:', obj);
  },
}
