import './blog-admin-edit.html';

Template.blog_admin_edit.helpers({
  blogPost: function() {
    return BlogPosts.findOne(FlowRouter.getParam('id'));
  }
})