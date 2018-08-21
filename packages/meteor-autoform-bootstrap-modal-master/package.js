Package.describe({
  name: 'aposidelov:autoform-bootstrap-modal',
  summary: "Create, update and delete collections with bootstrap modals",
  version: "0.1.0",
  git: "https://github.com/aposidelov/meteor-autoform-bootstrap-modal"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.use([
    'jquery',
    'templating',
    'less@2.5.0_2',
    'session',    
    'ui',
    'peppelg:bootstrap-3-modal@1.0.4',
    'aldeed:autoform@6.3.0',
    'raix:handlebar-helpers@0.2.5',
    'aldeed:delete-button@2.0.0'    
  ], 'client');

  api.add_files('lib/client/main.html', 'client');
  api.add_files('lib/client/main.js', 'client');
  api.add_files('lib/client/style.less', 'client');
});
