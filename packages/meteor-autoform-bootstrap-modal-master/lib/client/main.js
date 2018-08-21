// get collection object by name
var collectionObj = function(name) {
  var result = name.split('.').reduce(function(o, x) {    
    return o[x];
  }, window);  
  return result;
};

// Provide ability to pass subscriptions on template level
Template.afModalWindow.onCreated(function() {    
    var self = this;
    self.autorun(function() {      
      if (typeof self.data.subscriptions === 'function') {
        // pass template instance as parameter
        self.data.subscriptions(self);
      }
    });
});

// make a modal to be closed by ESC click
Template.afModalWindow.rendered = function() {  
  var modal = $('#afModalWindow');
  var onEscKey = function(e) {
    if (e.keyCode === 27) {
      return modal.modal('hide');
    }
  };
  modal.on('shown.bs.modal', function() {
    $(window).bind('keyup', onEscKey);
  });  
  modal.on('hidden.bs.modal', function() {    
    $(window).unbind('keyup', onEscKey);    
  });  
  // disables or enables modal-backdrop. Defaults to true 
  // (modal can be dismissed by mouse click). To disable 
  // use 'static' value.
  modal
    .data('bs.modal')
    .options
    .backdrop = this.data.backdrop !== undefined ? 
    this.data.backdrop : true;
};

Template.afModalWindow.helpers({
  // use helper to prevent jshtml error that 
  // occurs when we pass doc object into autoform 
  // through renderWithData function
  afAtts: function () {
    var doc = this.doc;    
    if (this.operation === 'update') {
      if (typeof doc !== 'object') {
        doc = collectionObj(this.collection).findOne({_id: doc});
      }
    }
    this.afAtts['doc'] = doc;
    return this.afAtts;
  },
  // three callbacks for reaction on Delete button  
  beforeRemove: function () {
    var self = this;           
    return function (collection, id) {
      if (typeof self.beforeRemove === 'function') {
        return self.beforeRemove(collection, id, this);        
      }
      // if user callback is not attached - call this.remove() 
      // in order to provoke further deletion
      this.remove();      
    };
  },
  afterRemove: function () {
    var self = this;
    return function (result) {
      if (typeof self.afterRemove === 'function') {
        self.afterRemove(result);        
      }
      Modal.hide('afModalWindow');      
    };
  },  
  errorRemove: function () {
    var self = this;    
    return function (error) {
      if (typeof self.errorRemove === 'function') {
        self.errorRemove(error);
      }
    };
  }
});

Template.afModalShow.events({
  'click *': function(e, t) {    
    var afAtts = {};    
    // common attributes
    var linkTitle = t.$('*').html();
    var title = t.data.title || linkTitle;
    var doc = t.data.doc, docId; 
    var dialogClass = t.data['dialogClass'] !== undefined ? ' ' + t.data['dialogClass'] : ''; 

    afAtts['id'] = (t.data.formId !== undefined) ? t.data.formId : 'afModalForm';    
    // hide and remove modal after successful autoform submit    
    afAtts['title'] = title;
    // prompt
    if (t.data.prompt === undefined && t.data.type === 'remove') {
      t.data.prompt = 'Are you sure?';
    }
    // collection and doc
    if (t.data.collection !== undefined) {
      afAtts['collection'] = t.data.collection;             
    }             

    if (t.data.type !== undefined && t.data.type === 'remove') {
      docId = (typeof doc === 'object') ? doc._id : doc;           
      return Modal.show('afModalWindow', {
        title: title,  
        dialogClass: dialogClass,      
        docId: docId,
        operation: t.data.type,
        collection: t.data.collection,        
        prompt: t.data.prompt,        
        buttonContent: t.data.buttonContent !== undefined ? t.data.buttonContent : 'Confirm',
        buttonClasses: t.data.buttonClasses !== undefined ? t.data.buttonClasses : 'btn btn-danger',
        closeButtonContent: t.data.closeButtonContent !== undefined ? t.data.closeButtonContent : 'Cancel',
        closeButtonClasses: t.data.closeButtonClasses !== undefined ? t.data.closeButtonClasses : 'btn',
        beforeRemove: t.data.beforeRemove,
        afterRemove: t.data.afterRemove,
        errorRemove: t.data.errorRemove,
        backdrop: t.data.backdrop
      });
    }
    
    AutoForm.addHooks(afAtts['id'], {
      onSuccess: function() {        
        Modal.hide('afModalWindow');
      }
    });

    // for af with type != remove
    if (t.data.type !== undefined) {
      afAtts['type'] = t.data.type;
    }
    if (t.data.meteormethod !== undefined && (t.data.type === 'method' || t.data.type == 'method-update')) {
      afAtts['meteormethod'] = t.data.meteormethod;
    }    
    if (t.data.schema !== undefined) {
      afAtts['schema'] = t.data.schema;
    }    
    if (t.data.fields !== undefined) {
      afAtts['fields'] = t.data.fields;
    }
    if (t.data.omitFields !== undefined) {
      afAtts['omitFields'] = t.data.omitFields;
    }
    if (t.data.template !== undefined) {
      afAtts['template'] = t.data.template;
    }
    if (t.data.labelClass !== undefined || t.data['label-class'] !== undefined) {
      afAtts['label-class'] = t.data.labelClass || t.data['label-class'];
    }
    if (t.data.inputColClass !== undefined || t.data['input-col-class'] !== undefined) {
      afAtts['input-col-class'] = t.data.inputColClass || t.data['input-col-class'];
    }
    if (t.data.placeholder === true) {
      afAtts['afFieldInput-placeholder'] = 'schemaLabel';
    }    
    if (t.data.buttonContent) {
      afAtts['buttonContent'] = t.data.buttonContent;
    } else if (t.data.type === 'insert') {
      afAtts['buttonContent'] = 'Create';      
    } else if (t.data.type === 'update') {
      afAtts['buttonContent'] = 'Update';
    } else {
      afAtts['buttonContent'] = 'Submit';
    }     

    if (t.data.buttonClasses !== undefined) {
      afAtts['buttonClasses'] = t.data.buttonClasses;
    }       

    Modal.show('afModalWindow', {
      title: title,
      dialogClass: dialogClass,
      afAtts: afAtts,
      operation: afAtts['type'],
      collection: t.data.collection,
      doc: doc,
      prompt: t.data.prompt,
      subscriptions: t.data.subscriptions,
      backdrop: t.data.backdrop
    });

    return false;
  }
});
