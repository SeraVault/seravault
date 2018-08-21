Accounts.onLogin(function (info) {
  //console.log(info);
  var userId = info.user._id;
  AppPlans.sync({userId: userId});

  var plan = AppPlans.get({userId: userId});
  if (!plan) {
    AppPlans.set('free', {userId: userId});
  }
});
