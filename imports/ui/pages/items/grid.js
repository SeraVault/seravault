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
  // Masonary
  /*function cardMasonry() {
  setTimeout(function(){
    $('#card-masonry').masonry({

      itemSelector: '#card-masonry > div',
      //isAnimated: true,
    });
    $('#card-masonry').css({"opacity":"1"});
    }, 1000);};

  $(window).resize(function(){
    $('#card-masonry').masonry({
      itemSelector: '#card-masonry > div',
      //isAnimated: true,
    });
    cardMasonry();
  });

  $(function() {
    $('#tabs').bind('click', function (e) {
      $('#card-masonry').masonry({
      itemSelector: '#card-masonry > div',});
    });
  });
  cardMasonry();*/
});
