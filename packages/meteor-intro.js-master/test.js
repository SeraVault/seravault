Tinytest.add('IntroJs can be initalized', function (test) {
  test.isNotNull(introJs, 'introjs should exist');
  test.isTrue(typeof(introJs) === "function", 'introjs should be a function');
  test.isTrue(typeof(introJs().start) === "function", 'start should be a function');
});