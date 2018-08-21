Schema = {};
import SimpleSchema from 'simpl-schema';

Schema.UserOnline = new SimpleSchema({
  userId: {
    type: String,
    /*autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: Meteor.userId()
        };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }*/
  },
  online: {
    type: Boolean,
    defaultValue: false
  }
});

UserOnline = new Mongo.Collection('UserOnline');
UserOnline.attachSchema(Schema.UserOnline);
