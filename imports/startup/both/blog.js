Blog.config({
  //blogIndexTemplate: 'myBlogIndexTemplate', // '/blog' route
  //blogShowTemplate: 'myShowBlogTemplate',    // '/blog/:slug' route
  //blogLayoutTemplate: 'App_ui_blank'
});
Blog.config({
  adminRole: 'blogAdmin',
  authorRole: 'blogAuthor'
});
Blog.config({
  comments: {
    disqusShortname: 'https-www-seravault-com'
  }
});