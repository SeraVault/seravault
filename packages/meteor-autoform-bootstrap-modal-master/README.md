Meteor [Autoform](https://github.com/aldeed/meteor-autoform) Bootstrap Modals
======================================================================

Allows to show autoforms in Bootstrap modals.

## Difference between [yogiben:autoform-modals](https://github.com/yogiben/meteor-autoform-modals) ##
The guys from [yogiben](https://github.com/yogiben) have created a great package thanks for this. But it has some issues that provoked me to develop this package. The main problem is that yogiben package uses static Boostrap Modal and session variables in order to setup Autoform settings. For the autoform with simple fields it can work good enough but if you have autoform that uses complex autoform fields - the autoform starts to show wrong values in complex fields after saving and opening Modal again. I call afField as Complex if it has .created, .rendered callbacks defined in its template. For example [yogiben:Autoform Tags](https://github.com/yogiben/meteor-autoform-tags) or [VeliovGroup:Autoform Files](https://github.com/VeliovGroup/meteor-autoform-file).

The main idea of this package is to use dynamic way of Modal template generation using ``Blaze.renderWithData``. It allows to get rid of using sessions and gives some sufficient advantages.

## Features ##
* Package uses dynamic way of Modal template generation / destruction using [PeppeL-G:Bootstrap-3-Modal](https://github.com/PeppeL-G/bootstrap-3-modal)
* Ability to pass subscriptions and have Template Level Subscription for Modal template
* Ability to remove documents by using [aldeed:meteor-delete-button](https://github.com/aldeed/meteor-delete-button) and get access to all callbacks that are provided by this package

## Setup ##

1. ```meteor add peppelg:bootstrap-3-modal``` [link](https://github.com/PeppeL-G/bootstrap-3-modal)
2. ```meteor add aldeed:delete-button``` [link](https://github.com/aldeed/meteor-delete-button)
3. ```meteor add aposidelov:autoform-bootstrap-modal```
4. Use `afModalShow` template to create a link that will trigger the modal

## How to use ##
### Insert Example ###
```meteor
{{#afModalShow formId="addProduct" collection="products" type="insert" class="btn btn-primary"}}
	Add
{{/afModalShow}}
```
### Update Example ###
```meteor
{{#afModalShow formId="editProduct" collection="products" type="update" doc=this._id class="btn btn-primary"}}
	Update
{{/afModalShow}}
```

### Update with Template Level Subscription Example ###
```javascript
...
Template.ProductItem.helpers({
    productSubscriptions: (instance) => {
        var productId = this._id;
        return (instance) => {
            instance.subscribe('products.one', productId);            
        }
    }
});
```
```meteor
<template name="ProductItem">
  {{#afModalShow formId="editProduct" collection="products" type="update" doc=this._id subscriptions=productSubscriptions class="btn btn-primary"}}
  	Update
  {{/afModalShow}}
</template>
```

### Autoform Callbacks/Hooks Example ###
It works the same way as with normal autoform.
```javascript
...
AutoForm.addHooks('editProduct', {  
  onSuccess: function() {              
    // your code
  }  
});
```
Read more in the autoform [callbacks/hooks](https://github.com/aldeed/meteor-autoform#callbackshooks) section.


### Remove Example ###
```meteor
{{#afModalShow collection="products" type="remove" doc=this._id class="btn btn-primary" title="Confirm modal" prompt="Are you sure?" buttonContent="Submit"}}
	Delete
{{/afModalShow}}
```

### Remove with callbacks Example ###
```javascript
...
Template.ProductItem.helpers({
  myBeforeRemove: (collection, id, quickRemoveButton) => {
    return (collection, id, quickRemoveButton) => {      
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        quickRemoveButton.remove();
      }
    }
  },
  myOnError: (error) => {
    return (error) => { alert("BOO!"); console.log(error); };
  },
  myOnSuccess: (result) => {
    return (result) => {
      alert("YAY!"); console.log(result);
    };
  }
});
```
```meteor
<template name="ProductItem">
  {{#afModalShow collection="products" type="remove" doc=this._id class="btn btn-primary" title="Confirm modal" prompt="Are you sure?" buttonContent="Confirm" closeButtonContent="Close" beforeRemove=myBeforeRemove afterRemove=myOnSuccess errorRemove=myOnError}}
  	Delete
  {{/afModalShow}}
</template>
```

### Attributes of afModalShow tempale ###
#### Required ####
* ``type`` - can be any autoform type (``insert``, ``update``, ``method`` .. etc .. [see more](https://github.com/aldeed/meteor-autoform#form-types)) and  ``remove`` type that is not the autoform type.
* ``collection`` - the name of collection.
* `doc` - document id or document object. Not required for `insert` type.

#### Common ####
* ``title`` - the title of the modal window.
* ``prompt`` - some text above autoform or delete buttons.
* ``buttonContent`` - The submit button content. If you don't set this, 'Create' is used for 'insert' type, 'Update' for 'update' type, 'Confirm' for 'remove' type and 'Submit' for other types.
* ``buttonClasses`` - Set the class attribute for the submit button. By default 'btn btn-primary' is used.
* ``dialogClass`` - can be used to add additional class for `.modal-dialog` (e.g. `modal-sm`)

#### Autoform ####
* ``formId`` - Optional. The id of autoform. by default 'afModalForm' is used.
* ``meteormethod`` - Optional. When type is "method" or "method-update", indicate the name of the Meteor method in this attribute. [Read more](https://github.com/aldeed/meteor-autoform#autoform-1)
* ``schema`` - Required if collection is not set. This schema will be used to generate and validate the form prior to submission, so you can specify this along with a collection if you want to use a schema that is slightly different from the one your collection uses. [Read more](https://github.com/aldeed/meteor-autoform#autoform-1)
* ``fields`` - Optional. Bind an array or specify a comma-delimited string of field names to include. Only the listed fields (and their subfields, if any) will be included, and they'll appear in the order you specify. [Read more](https://github.com/aldeed/meteor-autoform#autoform-1)
* ``omitFields`` - Optional. Bind an array or specify a comma-delimited string of field names to omit from the generated form. All first-level schema fields except the fields listed here (and their subfields, if any) will be included. [Read more](https://github.com/aldeed/meteor-autoform#autoform-1)
* ``template`` - Optional. See the [Autoform "Templates" section](https://github.com/aldeed/meteor-autoform#theme-templates)
* ``labelClass`` - defines a bootstrap class for use when the horizontal class is used, how many columns should the label take For example:
```
labelClass='col-sm-3'
```
* ``inputColClass`` - defines a bootstrap class for use when the horizontal class is used, how many columns should the input take? For example:
```
inputColClass='col-sm-9'
```
* ``placeholder`` - set to true if you wish to use the schema label for the input placeholder.
* ``backdrop`` - disables or enables modal-backdrop. Defaults to true (modal can be dismissed by mouse click). To disable use 'static' value. (See more [here](http://getbootstrap.com/javascript/#modals-options))
* ``subscriptions`` - should be a helper that return a function that accepts a single argument, instance, an allows to pass subscriptions and have Template Level Subscription for Modal template. See example in [Update with Template Level Subscription](#update-with-template-level-subscription-example) section.


#### Remove ####
* ``closeButtonContent`` - The cancel button content. 'Cancel' by default.
* ``closeButtonClasses`` - The cancel button classes. 'btn' by default.
* ``beforeRemove`` - should be a helper that return a function that  accepts three arguments, ``collection``, ``id`` and ``quickRemoveButton`` object, and is called before the document is removed. You can perform asynchronous tasks in this function, such as displaying a confirmation dialog. If the document should be removed, call ``quickRemoveButton.remove()``.  
* ``afterRemove`` - should be a helper that return a function that accepts a single argument, result, and is called only when the remove operation succeeds.
* ``errorRemove`` - should be a helper that return a function that accepts a single argument, error, and is called only when the remove operation fails. If you don't provide this callback, there is a default onError function that displays an alert and logs the error to the browser console.

How to use remove callbacks see example above in [Remove with callbacks](#remove-with-callbacks-example) section.
