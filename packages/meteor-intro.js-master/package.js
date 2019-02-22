Package.describe({
  name: 'aramix:introjs',
  version: '2.9.3',
  summary: 'Meteor package for intro.js with improvements and new features',
  git: 'https://github.com/aramix/meteor-intro.js.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.add_files('./lib/intro.js/minified/intro.min.js', 'client');
  api.add_files('./lib/intro.js/minified/introjs.min.css', 'client');
  api.add_files('./lib/intro.js/themes/introjs-modern.css', 'client');
  api.add_files('./lib/main.js', 'client');
  api.export('introJs', 'client');
});

Package.onTest(function(api) {
  api.use(['aramix:introjs', 'tinytest'], ['client']);
  api.mainModule('test.js', ['client']);
});
