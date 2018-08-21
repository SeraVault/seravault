import "./generic_modal.html";

Template.App_generic_modal.helpers({

});

Template.App_generic_modal.events ({
  'click .yes': function(event, template) {    
    Modal.hide('App_generic_modal');
    if (template.data.callback){
      template.data.callback(true);
    }
  }
});
