
AutoForm.addInputType("sv-upload", {
    template: "afSvUpload",
    valueOut: function () {
        console.log($('#dropzone').getQueuedFiles());
        return files;
        /*$('#files').files.forEach(function(file) {
            files.push(file);
        });
        console.log(files);
        return files;*/
    },
});

Template.afSvUpload.helpers({
    files: function() {
        self = this;
        console.log(self.data);
        return self.data;
    }
});

Template.afSvUpload.created = function () {
    Session.set('tmp_upload_files', []);
};

Template.afSvUpload.rendered = function () {
    myDropzone = new Dropzone("#dropzone", { url: 'localhost'});
    myDropzone.options.dropzone = {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 20, // MB
        autoProcessQueue: false,
        accept: function(file, done) {
          if (file.name == "justinbieber.jpg") {
            done("Naha, you don't.");
          }
          else { done(); }
        }
      };
    
};