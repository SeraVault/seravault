Package.describe({
  name: 'seravault:autoform-upload',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Encrypted file upload for Autoform',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.6.1');

  api.use([
    'check',
    'ecmascript',
    'underscore',
    'mongo',
    'reactive-var',
    'templating@1.3.2',
    'aldeed:autoform@6.3.0',
    'ostrio:files@1.9.8'
  ]);

  api.addFiles([
    'autoform-upload.html',
    'autoform-upload.js'
  ], 'client');
})
