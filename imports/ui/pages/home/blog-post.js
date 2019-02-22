import './blog-post.html';

Template.App_blog_post.helpers({
  blogPost: function() {
    return BlogPosts.findOne({canonical_name: FlowRouter.getParam('canonical_name')});
  }
})

Template.App_blog_post.rendered = function() {
  /*var postId = Session.get('postId');
  var post = BlogPosts && BlogPosts.findOne(postId);
  console.log('---------------------------------------------');
  console.log(postId);
  console.log(post);
  var disqus_config = function () {
    this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = post._id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function () { // DON'T EDIT BELOW THIS LINE
    var d = document,
      s = d.createElement('script');
    s.src = 'https://https-www-seravault-com.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();*/
}