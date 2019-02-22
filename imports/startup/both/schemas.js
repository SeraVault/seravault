Schema = {};
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random';
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = false;

Schema.Items = new SimpleSchema({
  _id: {
    type: String,
    optional: false,
    autoform: {
      type: "hidden"
    }
  },
  type: {
    type: String,
    index: 1
  },
  title: {
    type: String,    
  },
  keywords: {
    type: String,
    optional: true
  },
  login: {
    type: String,
    optional: true    
  },
  password: {
    type: String,
    optional: true
  },
  url: {
    type: String,
    optional: true,    
  },
  public_key: {
    type: String,
    optional: true,    
  },
  private_key: {
    type: String,
    optional: true,    
  },
  cardholder_name: {
    type: String,
    optional: true
  },
  card_type: {
    type: String,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: false,
      options: [
        {value: 'Visa', label: 'Visa'},
        {value: 'MasterCard', label: 'MasterCard'},
        {value: 'American Express', label: 'American Express'},
        {value: 'Diners Club', label: 'Diners Club'},
        {value: 'Discover', label: 'Discover'},
        {value: 'JCB', label: 'JCB'},
        {value: 'UnionPay', label: 'UnionPay'},
        {value: 'Maestro', label: 'Maestro'},
        {value: 'Elo', label: 'Elo'},
        {value: 'Mir', label: 'Mir'},
        {value: 'Hiper', label: 'Hiper'},
        {value: 'Hipercard', label: 'Hipercard'},
      ]
    }
  },
  card_number: {
    type: String,
    optional: true
  },
  security_code: {
    type: String,
    optional: true
  },
  
  card_month: {
    type: String,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: false,
      options: 
        [
          {value: '01', label: '01'},
          {value: '02', label: '02'},
          {value: '03', label: '03'},
          {value: '04', label: '04'},
          {value: '05', label: '05'},
          {value: '06', label: '06'},
          {value: '07', label: '07'},
          {value: '08', label: '08'},
          {value: '09', label: '09'},
          {value: '10', label: '10'},
          {value: '11', label: '11'},
          {value: '12', label: '12'}
        ]
      }
  },
  card_year: {
    type: String,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: false,
      options: 
        [
          {value: '2018', label: '2018'},
          {value: '2019', label: '2019'},
          {value: '2020', label: '2020'},
          {value: '2021', label: '2021'},
          {value: '2022', label: '2022'},
          {value: '2023', label: '2023'},
          {value: '2024', label: '2024'},
          {value: '2025', label: '2025'},
          {value: '2026', label: '2026'},
          {value: '2027', label: '2027'},
          {value: '2028', label: '2028'},
          {value: '2029', label: '2029'},
          {value: '2030', label: '2030'}
        ]
      }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'summernote',
        settings: {
          height: 180,
          toolbar: [
              // [groupName, [list of button]]
              ['font', ['fontname','fontsize', 'color']],
              ['style', ['bold', 'italic', 'underline', 'strikethrough','clear']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['insert', ['table', 'picture']],
              ['height', ['height']],
              ['misc', ['undo','redo','fullscreen']]
            ]
          }
        }
    }
  },
  files: {
    type: Array,
    optional: true,    
  },
  'files.$': {
    type: String,
    autoform: {
      type: 'fileUpload',
      collection: 'Files'
    }
  },
  folders: {
    type: Array,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: true,
      afFieldInput: {
        class: 'pmd-select2-tags'
      },
      options: function() {
        opts = [];
        ItemsDecrypted.find({type: 'folder'}).forEach(function(folder) {
          opts.push({
            value: folder._id,
            label: folder.title
          });
        });
        return opts;
      }
    },
  },
  'folders.$': {
    type: String
  },
  'related': {
    type: Array,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: true,
      afFieldInput: {
        class: 'pmd-select2-tags'
      },
      options: function() {
        opts = [];
        ItemsDecrypted.find().forEach(function(item) {
          opts.push({
            value: item._id,
            label: item.type + ': ' + item.title
          });
        });
        return opts;
      }
    },
  },
  'related.$': {
    type: String
  },
  recipients: {
    type: Array,
    optional: true,
    autoform: {
      type: 'select2',
      multiple: true,
      options: function() {
        opts = [];
        Contacts.find({visible: {$ne: false}}).forEach(function(contact) {
          opts.push({
            value: contact.userId,
            label: contact.displayName
          })
        })
        return opts;
      }
    }
  },
  'recipients.$': {
    type: String,    
  },
  message: {
    type: Array,
    optional: true,
  },
  'message.$': {
    type: Object
  },
  'message.$.body': {
    type: String,
    optional: false,
    autoform: {
      afFieldInput: {
        type: 'summernote',
        settings: {toolbar: [
              // [groupName, [list of button]]
              ['style', ['bold', 'italic', 'underline', 'clear']],
              ['font', ['strikethrough', 'superscript', 'subscript']],
              ['fontsize', ['fontsize']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']]
            ]
          }
        }
    }
  },
  'message.$.from': {
    type: String,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      }
    },
    autoform: {
      omit: true
    }
  },
  'message.$.createdAt': {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
    autoform: {
      omit: true
    }
  },
  help: {
    type: Boolean,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  },
  keys: {
    type: Array,
    optional: true,
  },
  'keys.$': {
    type: Object
  },
  'keys.$.userId': {
    type: String,    
  },
  'keys.$.encKey': {
    type: Uint8Array,        
  },
  'keys.$.asymNonce': {
    type: Uint8Array,    
  },
  'keys.$.createdAt': {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
});

Schema.Contacts = new SimpleSchema({
  owner_id: {
    type: String
  },
  userId: {
    type: String,
  },
  displayName: {
    type: String,
    optional: true,
    /*autoValue: function() {
      console.log(this.field('userId'));
      return Meteor.users.findOne(this.field('userId')).profile.displayName;
    }*/
  },
  status: {
    type: String,
    optional: true
  },
  notes: {
    type: String,
    optional: true
  },
  pubKey: {
    type: Uint8Array,
    optional: true,    
  },
  visible: {
    type: Boolean,
    optional: true,
  },
  tmp_reset: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  }
});

Schema.Groups = new SimpleSchema({
  name: {
    type: String
  },
  contacts: {
    type: Array,
    autoform: {
      type: 'select2',
      multiple: true,
      options: function() {
        opts = [];
        Contacts.find({visible: {$ne: true}}).forEach(function(contact) {
          opts.push({
            value: contact.userId,
            label: contact.displayName
          })
        })
        return opts;
      }
    }
  },
  'contacts.$': {
    type: String
  }
});

/*Schema.Files = new SimpleSchema({
  file: {
    type: String,
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "Files"
      }
    }
  },
})*/

Schema.Feedback = new SimpleSchema({
  subject: {
    type: String
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  }
});

Schema.UserSettings = new SimpleSchema({
  userId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: Meteor.userId()
        };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  },
  'mail': {
    type: Object
  },
  'mail.inbox': {
    type: Object
  },
  'mail.inbox.read': {
    type: Array
  },
  'mail.inbox.read.$': {
    type: String
  },
  'decryptedDownloadAcknowledgement': {
    type: Boolean,
    optional: true
  }
});

Schema.ShareRequests = new SimpleSchema({
  fromUserId: {
    type: String
  },
  fromUserDisplayName: {
    type: String
  },
  toUserId: {
    type: String
  },
  toUserDisplayName: {
    type: String
  },
  status: {
    type: String
  },
  note: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  }
});

Schema.Notifications = new SimpleSchema({
  userId: {
    type: String,
  },
  fromId: {
    type: String,
    optional: true
  },
  message: {
    type: String,    
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true
  },
  link: {
    type: String,
    optional: true
  },
  icon: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  },
  objectId: {
    type: String,
    optional: true
  }
});

Schema.BlogPosts = new SimpleSchema({
  author: {
    type: String
  },
  canonical_name: {
    type: String
  },
  status: {
    type: String,
    autoform: {
      type: 'select2',
      multiple: false,
      options: 
        [
          {value: 'active', label: 'Active'},
          {value: 'draft', label: 'Draft'}
        ]
      }
  },
  title: {
    type: String
  },
  summary: {
    type: String
  },
  article: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'summernote'     
      }
    }
  },
  meta_description: {
    type: String,
    optional: true
  },
  meta_keywords: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoform: {
      type: 'hidden'
    },
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }    
  },
});



/*Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files", {
    path: "~/uploads"
  })]
});*/
