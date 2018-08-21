import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

SchemaCollectionFields = new SimpleSchema({
  owner_id: {
    type: String,
    index: 1,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      }
    }
  },
  shared_with: {
    type: Array,
    optional: true
  },
  'shared_with.$': {
    type: String
  },

});

SchemaCollectionFieldsNoOwner = new SimpleSchema({
  owner_id: {
    type: String,
  },
  shared_with: {
    type: Array,
    optional: true
  },
  'shared_with.$': {
    type: String
  }
});

SchemaEncryptedKeys = new SimpleSchema({
  owner_id: {
    type: String,
    index: 1,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  user_id: {
    type: String,
    index: 1
  },
  doc_id: {
    type: String,
    index: true
  },
  encrypted_key: {
    type: Uint8Array
  },
  asymNonce: {
    type: Uint8Array
  },
  collection: {
    type: String
  },
  permissions: {
    type: String,
    defaultValue: '----'
  }
});

SchemaKeys = new SimpleSchema({
  doc_priv_key: {
    type: Uint8Array,
    optional: true,
    autoform: {
      type: "hidden"
    },
  },
  doc_pub_key: {
    type: Uint8Array,
    optional: true,
    autoform: {
      type: "hidden"
    },
  },
  doc_symNonce: {
    type: Uint8Array,
    optional: true,
    autoform: {
      type: "hidden"
    },
  },
  doc_fileNonce: {
    type: Uint8Array,
    optional: true,
    autoform: {
      type: "hidden"
    }
  },
  doc_tmp_key: {
    type: Uint8Array,
    optional: true,
    autoform: {
      type: "hidden"
    },
  },  
  encrypted: {
    type: Boolean,
    defaultValue: false
  },
  key_update_only: {
    type: Boolean,
    defaultValue: false
  },
  size: {
    type: Number,
    defaultValue: 0
  },
  tmp_removeuser: {
    type: String,
    optional: true
  }
});

