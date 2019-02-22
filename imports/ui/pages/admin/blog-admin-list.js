import './blog-admin-list.html';

Template.blog_admin_list.helpers({
  posts: function() {
    return BlogPosts.find();
  }
})