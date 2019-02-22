import './blog-list.html';

Template.App_blog_list.helpers({
  posts: function() {
    return BlogPosts.find();
  }
})