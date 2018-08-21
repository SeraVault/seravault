if (Meteor.isClient) {  
  ItemsEncryption = new SvCollection(
    Items,
    ['title','login','url','notes','password','public_key', 'private_key', 'keywords', 'message.body'],
    {},
    true //add owner_id field
  );
  GroupsEncryption = new SvCollection(
    Groups,
    ['name','notes'],
    {},
    true //add owner_id field
  );
  ContactsEncryption = new SvCollection(
    Contacts,
    ['notes'],
    {},
    false
  );
  /*FilesEncryption = new SvCollection(
    Files,
    ['name'],
    {},
    false
  );*/
}