import './password.html';

AutoForm.addInputType("svPassword", {
  template: "afSvInputPassword",
  valueOut: function () {
    return this.val();
  },
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray,
    "number": AutoForm.valueConverters.stringToNumber,
    "numberArray": AutoForm.valueConverters.stringToNumberArray,
    "boolean": AutoForm.valueConverters.stringToBoolean,
    "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
    "date": AutoForm.valueConverters.stringToDate,
    "dateArray": AutoForm.valueConverters.stringToDateArray
  },
  contextAdjust: function (context) {
    if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
      context.atts.maxlength = context.max;
    }
    return context;
  }
});

Template.afSvInputPassword.events({
  'click .generatePassword': function(event, template) {
    event.preventDefault();
    $("#svPassword").val(generatePassword());
  },
});

