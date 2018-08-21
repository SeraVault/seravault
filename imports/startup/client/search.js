searchItems = function() {
  var search_term = Session.get('search_term');
  var search_folder = Session.get('search_folder');
  var search_type = Session.get('type');
  var search_userid = Session.get('search_userid');
  var sort_type = Meteor.user() && Meteor.user().profile.sort_type;
  var sort_direction= Meteor.user() && Meteor.user().profile.sort_direction;
  var item_type; //TRANSLATE ITEM TYPE TO LANGUAGE
  var sort = {};
  var query = {};
  if (search_term) {
    query.$or = [{
        title: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        notes: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        type: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        url: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        login: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        notes: {
          $regex: search_term,
          $options: 'i'
        }
      },
      {
        keywords: {
          $regex: search_term,
          $options: 'i'
        }
      }
    ];
  }
  if (search_type) {
    query.type = search_type;
  }

  if (search_folder) {
    //UNIQUE CASE : A FOLDER NEEDS TO RETURN 
    var relatedItems = ItemsDecrypted && ItemsDecrypted.findOne(search_folder).related;
    query._id = {$in: relatedItems || []};    
  }

  if (search_userid) {
      query.owner_id = search_userid;
  }

  if (sort_type == 'created') {
    sort = {sort:{'createdAt' : sort_direction}}
  }
  if (sort_type == 'modified') {
    sort = {sort:{'updatedAt' : sort_direction}}
  }
  if (sort_type == 'alphabetical') {
    sort = {sort:{'title' : sort_direction}}
  }

  //console.log('query:', query);

  return ItemsDecrypted && ItemsDecrypted.find(query, sort).fetch();
};

searchInbox = function() {
  var search_term = Session.get('mail_search_term');
  var query = {recipients: {$regex : ".*"+Meteor.userId()+".*"}};
  if (search_term) {
    query.$or = [
      {subject: {
        $regex: search_term,
        $options: 'i'
          }
      },
      {body: {
        $regex: search_term,
        $options: 'i'
        }
      }
    ];
  };
  //console.log(query);
  return MailDecrypted.find(query, {sort: {createdAt: -1}}).fetch();
};

searchContacts = function() {
  var search_term = Session.get('contact_search_term');
  var query = {visible: {$ne: false}};
  if (search_term) {
    query.$or = [
      {displayName: {
        $regex: search_term,
        $options: 'i'
          }
      },
    ]
  };
  return Contacts.find(query);
};

searchGlobal = function() {
  return searchItems()
}
