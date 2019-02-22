import "./grid.html";

Template.App_item_grid.helpers({
  itemType: function() {
    return Session.get('type');
  },
  typePlural: function() {
    var type = Session.get('type');
    return TAPi18n.__(type + '_plural')
  },
  results: function() {
    return searchItems();
  },
  noData: function() {
    var type = Session.get('type');
    return searchItems().length == 0;
  },
  noResultsText: function() {
    switch (Session.get('type')) {
      case 'help':
        return TAPi18n.__("noSupportQuestions");        
      default:
        return TAPi18n.__('noResultsText1') + '&nbsp;<span class="icon mdi mdi-plus-square" style="font-size: 2em;"></span>&nbsp;' + TAPi18n.__('noResultsText2');        
    }
  },
});

Template.App_item_grid.events({
 
});

Template.App_item_grid.onRendered(function() {
   if (Session.get('runIntroJs')) {
    introJs().start();  
    Session.set('runIntroJs', false);
   }
});
