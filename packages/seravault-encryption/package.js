Package.describe({
  name: 'seravault:encryption',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'SeraVault client-side encryption package',
  // URL to the Git repository containing the source code for this package.
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use(['underscore', 'check', 'ecmascript'], ['client', 'server']);
  api.use('aldeed:schema-index', ['client', 'server']);
  api.use('cultofcoders:persistent-session', 'client');
  api.use('aldeed:collection2-core@2.1.0');
  api.use('ongoworks:security@1.2.0');
  api.use('matb33:collection-hooks@0.8.4');
  api.use('robertlowe:persistent-reactive-dict@0.1.2', 'client');
  api.use('jparker:crypto-core@0.1.0', 'client');
  api.use('jparker:crypto-base64@0.1.0', 'client');
  api.use('dburles:mongo-collection-instances@0.3.4', ['server']);
  api.use('practicalmeteor:underscore-deep@0.9.2', 'client');
  api.use('reactive-var', 'client');
  api.use('random', 'client');
  //api.use('perak:joins', ['client','server']);

  api.addFiles('tweetnacl-js-master/nacl-fast.min.js', 'client');
  api.addFiles('chance.min.js', 'client');
  //api.addFiles('sizeof.js', 'client');
  api.addFiles('collections.js', ['client', 'server']);
  api.addFiles('server.js', 'server');
  api.addFiles('sv-utils.js', 'client');
  api.addFiles('sv.js', 'client');
  api.addFiles('sv-collection.js', 'client');
  api.addFiles('client.js', 'client');

  api.export('Sv');
  api.export('SvUtils');
  api.export('SvCollection');
  api.export('DocKeys');
  api.export('SvNacl');
  //api.export('Feedback');
});
