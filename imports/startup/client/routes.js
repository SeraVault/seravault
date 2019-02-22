//public routes
var exposed = FlowRouter.group({});


/*Private routes*/
var loggedIn = FlowRouter.group({
    triggersEnter: [
        function () {
            var route;
            if (!(Meteor.loggingIn() || Meteor.userId())) {
                route = FlowRouter.current();
                if (route.route.name !== 'App.login') {
                    Session.set('redirectAfterLogin', route.path);
                }
                FlowRouter.go('App.login');
            }
        }
    ]
});

// Set up all routes in the app
exposed.route('/', {
  name: 'App.home',
  action() {
    upgrade();
    /*if (Meteor.loggingIn() || Meteor.userId()) {
      FlowRouter.go('App.all');
    }*/
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);
    
    
    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  },
});

/* CHANGE LANGUAGE */
exposed.route('/fr', {
  action() {
    TAPi18n.setLanguage('fr');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});
exposed.route('/en', {
  action() {
    TAPi18n.setLanguage('en');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});
exposed.route('/es', {
  action() {
    TAPi18n.setLanguage('es');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});
exposed.route('/zh-CN', {
  action() {
    TAPi18n.setLanguage('zh-CN');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});

exposed.route('/da', {
  action() {
    TAPi18n.setLanguage('da');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});

exposed.route('/nl', {
  action() {
    TAPi18n.setLanguage('nl');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});

exposed.route('/de', {
  action() {
    TAPi18n.setLanguage('de');
    var title = TAPi18n.__('metaTitle');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', { content: 'App_home' });
    $(window).scrollTop(0);
  }
});

exposed.route('/leave', {
  name: 'App.leave',
  action() {    
    BlazeLayout.render('App_ui_home_container', { content: 'App_leave' });
  },
});
exposed.route('/login', {
  name: 'App.login',
  action() {
    upgrade();
    var title = TAPi18n.__('metaTitleLogin');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescriptionLogin')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);
    if (Meteor.userId()) {
      FlowRouter.go('App.items');
    }
    BlazeLayout.render('App_ui_home_container', { content: 'App_login'});
    $(window).scrollTop(0);
  }
});
exposed.route('/register', {
  name: 'App.register',
  action() {
    var title = TAPi18n.__('metaTitleRegister');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescriptionRegister')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);
    if (Meteor.userId()) {
      FlowRouter.go('App.items');
    }
    BlazeLayout.render('App_ui_home_container', { content: 'App_register'});
    $(window).scrollTop(0);
  }
});
exposed.route('/terms-and-conditions', {
  name: 'App.terms-of-use',
  action() {
    BlazeLayout.render('App_ui_home_container', { content: 'App_terms'});
  }
});

exposed.route('/privacy-policy', {
  name: 'App.privacy-policy',
  action() {
    BlazeLayout.render('App_ui_home_container', {content: 'App_privacy'});
  }
});

exposed.route('/security-tips', {
  name: 'App.blog',
  action() {
    var title = TAPi18n.__('metaTitleSecurityTips');
    DocHead.setTitle(title);    
    var metaInfo = {name: "description", content: TAPi18n.__('metaDescription')};
    DocHead.addMeta(metaInfo);
    var metaInfo = {name: "keywords", content: TAPi18n.__('metaKeywords')};
    DocHead.addMeta(metaInfo);

    BlazeLayout.render('App_ui_home_container', {content: 'App_blog_list'});
  }
})

exposed.route('/security-tips/:canonical_name', {
  name: 'App.blog-post',
  action() {    
    console.log(FlowRouter.getParam('canonical_name'));
    Tracker.autorun(function() {
      var post = BlogPosts && BlogPosts.findOne({canonical_name: FlowRouter.getParam('canonical_name')});
      if (post) {
        var title = "Seravault: " + post.title;
        DocHead.setTitle(title);    
        var metaInfo = {name: "description", content: post.meta_description};
        DocHead.addMeta(metaInfo);
        var metaInfo = {name: "keywords", content: post.meta_keywords};
        DocHead.addMeta(metaInfo);
      }
      BlazeLayout.render('App_ui_home_container', {content: 'App_blog_post'});
    });
  }
})

loggedIn.route('/app/dashboard', {
  name: 'App.dashboard',
  action() {
    upgrade();
    Session.set('searchIconVisible', false);
    Session.set('typeIcon', 'dashboard')
    Session.set('pageTitle', TAPi18n.__("Dashboard"));
    BlazeLayout.render('App_ui_main', { content: 'App_dashboard' });
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/help', {
  name: 'App.help',

  action() {
    upgrade();
    //BlazeLayout.render('App_ui_main', { content: 'App_help' });
    Session.set("type", "help");
    Session.set("typeIcon", "help");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Help"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

exposed.route('/logout', {
  name: 'App.logout',
  action() {
    Session.clear();
    Meteor.logout();
    BlazeLayout.render('App_ui_home_container', { content: 'App_user_logout'})
  }
});

loggedIn.route('/app/profile', {
  name: 'App.user.profile',
  action() {
    upgrade();
    Session.set('typeIcon', 'profile');
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Profile"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', { content: 'App_user_profile'});
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/:id/edit', {
  name: 'App.edit',
  action() {
    upgrade();
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Edit"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', { content: 'App_items_edit' });
     
  },
});

loggedIn.route('/app/:id/delete', {
  name: 'App.delete',
  action() {
    upgrade();
    BlazeLayout.render('App_ui_main', { main: 'App_items_delete' });
  },
});

loggedIn.route('/app/item/:id/view', {
  name: 'App.item.view',
  action() {
    upgrade();
    var item = Items.findOne(FlowRouter.getParam('id'));
    Session.set('search_folder', null);
    Session.set('pageTitle', item.title);
    Session.set('searchIconVisible', false);
    if (item && item.type == 'message') {
      BlazeLayout.render('App_ui_main', { content: 'App_items_edit' });
    }
    else
    {
      BlazeLayout.render('App_ui_main', { content: 'App_items_view' });
      $(window).scrollTop(0);
    }
  },
});

loggedIn.route('/app/:type/add', {
  name: 'App.item.add',
  action() {
    upgrade();
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Add"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', { content: 'App_items_add' });
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/myaccount', {
  name: 'App.user',
  action() {
    upgrade();
    Session.set('search_folder', null);
    Session.set('typeIcon', 'profile')
    Session.set('pageTitle', TAPi18n.__("Profile"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', { content: 'App_user' });
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/items', {
  name: 'App.items',
  action() {
    upgrade();
    Tracker.autorun(function() {
      var folder = ItemsDecrypted.findOne(Session.get('search_folder'));
      if (folder) {
        Session.set('typeIcon', 'folder');
        Session.set('pageTitle', folder.title)
      } else {
        Session.set('typeIcon', "allItems");
        Session.set('pageTitle', TAPi18n.__("Items"));
      }
    });
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/home', {
  name: 'App.all',
  action() {
    upgrade();
    Session.set("type", null)
    Session.set("typeIcon", "allItems");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("AllItems"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);    
  },
});

loggedIn.route('/app/notes', {
  name: 'App.notes',
  action() {
    upgrade();
    Session.set("type", "note")
    Session.set("typeIcon", "note");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Notes"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/credit_cards', {
  name: 'App.credit_cards',
  action() {
    upgrade();
    Session.set("type", "credit_card")
    Session.set("typeIcon", "credit_card");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("CreditCards"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/accounts', {
  name: 'App.accounts',
  action() {
    upgrade();
    Session.set("type", "account");
    Session.set("typeIcon", "account");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Accounts"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/keys', {
  name: 'App.keys',
  action() {
    upgrade();
    Session.set("type", "key");
    Session.set("typeIcon", "key");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Keys"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/files', {
  name: 'App.files',
  action() {
    upgrade();
    Session.set("type", "file");
    Session.set("typeIcon", "file");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Files"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/folders', {
  name: 'App.folders',
  action() {
    upgrade();
    Session.set("type", "folder");
    Session.set("typeIcon", "folderAll");
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Folders"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/messages', {
  name: 'App.messages',
  action() {
    upgrade();
    Session.set("type", "message");
    Session.set("typeIcon", "message");
    Session.set("search_folder", null);
    Session.set('pageTitle', TAPi18n.__("Messages"));
    Session.set('searchIconVisible', true);
    BlazeLayout.render('App_ui_main', { content: 'App_item_grid'});
    $(window).scrollTop(0);
  },
});

loggedIn.route('/app/files2', {
  name: 'App.files2',
  action() {
    BlazeLayout.render('App_ui_main', { content: 'uploadForm' });
  },
});


loggedIn.route('/app/messaging', {
  name: 'App.messaging',
  action() {
    upgrade();
    BlazeLayout.render('App_ui_main', {content: 'messaging'});
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/contacts', {
  name: 'App.contacts',
  action() {
    upgrade();
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Contacts"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'contactHome'});
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/contacts/manage', {
  name: 'App.contacts.manage',
  action() {
    upgrade();
    Session.set('search_folder', null);
    Session.set('pageTitle', TAPi18n.__("Contacts"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'contacts'})
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/contacts/groups', {
  name: 'App.contacts.groups',
  action() {
    upgrade();
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'contacts-groups'})
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/contacts/pending', {
  name: 'App.contacts.pending',
  action() {
    upgrade();
    Session.set('pageTitle', TAPi18n.__("Contacts"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'contactsPending'})
    $(window).scrollTop(0);
  }
});

loggedIn.route('/app/contacts/sent', {
  name: 'App.contacts.sent',
  action() {
    upgrade();
    Session.set('pageTitle', TAPi18n.__("Contacts"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'contactsSent'})
    $(window).scrollTop(0);
  }
});


loggedIn.route('/app/contacts/invite', {
  name: 'App.contacts.invite',
  action() {
    upgrade();
    Session.set('pageTitle', TAPi18n.__("Contacts"));
    Session.set('searchIconVisible', false);
    BlazeLayout.render('App_ui_main', {content: 'App_contact_invite'});
    $(window).scrollTop(0);
  }
});
loggedIn.route('/api/accept-sharing-request/:id', {
  action() {
    Meteor.call('acceptSharingRequest', FlowRouter.getParam('id'), function(err, message) {
      if (err) {
        SvError.throwError('error', err.reason);
      } else {
        toastr.success(TAPi18n.__('ContactAdded'))
      }
    });
  }
});

loggedIn.route('/admin/utils', {
  name: 'Admin.utils',
  action() {
    BlazeLayout.render('App_ui_main', {content: 'ui_admin_utils'});
  }
});

loggedIn.route('/app/contact_us', {
  name: 'App.contact_us',
  action() {
    BlazeLayout.render('App_ui_main', {content: 'App_contact_us'});
  }
});


loggedIn.route('/admin/posts', {
  name: 'Admin.posts',
  action() {
    BlazeLayout.render('App_ui_main', {content: 'blog_admin_list'});
  }
});

loggedIn.route('/admin/posts/add', {
  name: 'Admin.posts.add',
  action() {
    BlazeLayout.render('App_ui_main', {content: 'blog_admin_add'});
  }
})

loggedIn.route('/admin/posts/edit/:id', {
  name: 'Admin.posts.edit',
  action() {
    BlazeLayout.render('App_ui_main', {content: 'blog_admin_edit'});
  }
})

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_ui_main', { main: 'App_notFound' });
  },
};
