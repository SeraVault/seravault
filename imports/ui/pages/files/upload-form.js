import "./upload-form.html";

import SvUtil from 'meteor/seravault:encryption';
import SvNacl from 'meteor/seravault:encryption';
import fileReaderStream from 'filereader-stream';
import concat from 'concat-stream';

/*TESTING KEYS*/

sym_nonce = new Uint8Array([143, 55, 141, 115, 136, 162, 129, 94, 232, 69, 112, 156, 216, 172, 162, 169, 92, 201, 136, 186, 36, 124, 96, 94]);
sym_key = new Uint8Array([124, 186, 206, 2, 30, 181, 133, 145, 18, 52, 185, 252, 176, 98, 5, 157, 158, 132, 235, 222, 164, 174, 234, 179, 211, 236, 232, 79, 101, 158, 241, 127]);

doc_priv_key = new Uint8Array(32) [4, 191, 163, 175, 103, 2, 178, 128, 65, 114, 49, 162, 156, 100, 220, 10, 231, 64, 40, 240, 32, 152, 231, 252, 168, 131, 134, 18, 116, 202, 50, 161]
doc_pub_key = new Uint8Array(32) [169, 197, 7, 19, 146, 106, 230, 36, 200, 117, 193, 125, 145, 41, 227, 187, 202, 130, 104, 29, 226, 242, 245, 99, 63, 137, 184, 131, 106, 125, 240, 13]
doc_symNonce = new Uint8Array(24) [143, 55, 141, 115, 136, 162, 129, 94, 232, 69, 112, 156, 216, 172, 162, 169, 92, 201, 136, 186, 36, 124, 96, 94]

enc_nonce = new Uint8Array(24) [73, 171, 57, 172, 101, 86, 153, 76, 153, 211, 73, 122, 17, 250, 7, 8, 75, 61, 227, 85, 176, 192, 181, 120]
enc_passwordBytes = new Uint8Array(23) [13, 36, 80, 133, 9, 126, 231, 112, 124, 167, 48, 129, 251, 161, 167, 222, 174, 115, 107, 139, 218, 45, 18]
enc_privateKey = new Uint8Array(48) [133, 130, 31, 6, 43, 100, 180, 154, 228, 108, 152, 135, 170, 22, 102, 230, 7, 1, 180, 55, 61, 110, 158, 44, 89, 246, 102, 46, 8, 10, 57, 175, 15, 2, 60, 164, 64, 76, 184, 125, 60, 236, 40, 156, 55, 36, 28, 219]
enc_publicKey = new Uint8Array(32) [56, 172, 86, 241, 11, 152, 35, 194, 77, 215, 126, 109, 102, 143, 203, 244, 66, 32, 0, 234, 113, 250, 37, 185, 120, 1, 171, 128, 152, 240, 138, 14]

Template.uploadForm.helpers({
  files: function() {
    return Files.find();
  },
  getLink: function(id) {
    return Files.findOne(id).link();
  }
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

var encrypt = function (data) {
  return data;
};

var saveFile = function(file) {
  reader = fileReaderStream(file).pipe(concat(function(contents) {
    contents
  }));
  var writer = fs.createWriteStream('my.log');

  reader.on('data', (chunk) => {
    writer.write(SvUtils.symEncryptWithKey(chunk, sym_nonce, sym_key));
  });
  readable.on('end', () => {
    writer.end();
  });

}

Template.uploadForm.events({
  'change #fileInput'(e, template) {
    log = function(text) {
      console.log(text);
    }

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      console.log('uploading');
      //var file = saveFile(e.currentTarget.files[0]);
      //console.log("finalFile", file);


      // We upload only one file, in case
      // multiple files were selected
      var upload = Files.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        }, false);
      upload.on('data', function(chunk) {
        file.push(SvUtils.symEncryptWithKey(chunk, sym_nonce, sym_key));
      });
      upload.on('start', function () {
        template.currentUpload.set(this);
      });
      upload.on('end', function (error, fileObj) {
        //Session.set('fileUploading', false);
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });
      upload.start();
    }
  },
  'click .convert': function (event, template) {
    var url = event.currentTarget.getAttribute("data-file");
    var id = event.currentTarget.getAttribute("data-id");
    var file = Files.findOne(id);
    var fileKeys = DocKeys.findOne({doc_id: id});

    var self = this,
    symNonce = file.meta.symNonce,
    filePubKey = file.meta.pubKey,
    asymNonce = fileKeys.asymNonce,
    documentKey = fileKeys.encrypted_key,
    userPrivateKey = new Uint8Array(_.values(Session.get('userKeys').privateKey));
    var userPublicKey = new Uint8Array(_.values(Session.get('userKeys').publicKey));
    var decryptedDocumentKey = SvUtils.asymDecryptWithKey(documentKey,
      asymNonce,
      filePubKey,
      userPrivateKey
    );
    console.log('docKey:', decryptedDocumentKey);

    function download( url, filename ) {
      var link = document.createElement('a');
      link.setAttribute('href',url);
      link.setAttribute('download',filename);
      link.click();
    }


    /*var socket = io.connect(url);
    var stream = ss.createStream();
    var filename = 'profile.jpg';

    ss(socket).emit('profile-image', stream, {name: filename});
    fs.createReadStream(filename).pipe(stream);*/

    http.get(url, function (res) {
    	var div = document.getElementById('result');
    	div.innerHTML += 'GET /beep<br>';

    	res.on('data', function (buf) {
        console.log('symNonce:', symNonce);
        console.log('decryptedDocumentKey:', decryptedDocumentKey);
        console.log('buf:', buf);

        //encrypted message is base64

        buf = bufferToBase64(buf);
    		div.innerHTML +=  SvUtils.symDecryptWithKey(buf, symNonce, decryptedDocumentKey);
    	});

    	res.on('end', function () {
    		div.innerHTML += '<br>__END__';
    	});
    })

    /*http.get(url, function (res) {
    	var div = document.getElementById('result');
    	div.innerHTML += 'GET /beep<br>';

    	res.on('data', function (buf) {
    		div.innerHTML += buf;
    	});

    	res.on('end', function () {
    		div.innerHTML += '<br>__END__';
    	});
    })*/


    /*function pushChunks(chunks) {
      byteArrays.push(chunks)
    }

    function readAllChunks(readableStream) {
      const reader = readableStream.getReader();
      const chunks = [];
      function pump() {
        return reader.read().then(({ value, done }) => {
          if (done) {
            return chunks;
          }
          pushChunks(value);
          //chunks.push(value);
          return pump();
        });
      }
      return pump();
    }

    function buildFile() {
      console.log("byteArrays", byteArrays);
      var decryptedFile = new File(byteArrays, file.name, {type: file.type, lastModified: Date.now()});
      download(URL.createObjectURL(decryptedFile));
    }



    fetchStream(url, file)
    .then(response => readAllChunks(response.body))
    .then(buildFile());
    */
  },


  'change #fileLocal': function(e) {

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var file = e.currentTarget.files[0];
      console.log("File: ", file);
      var fileStream = fs.createReadStream(file)
      fileStream.on('readable', function(){
        var chunk

        while( (chunk = fileStream.read() ) != null )
          console.log(chunk);
      })

      fileStream.on('end', function(){
        console.log('Filestream ended!')
      })
    }
  }
});
