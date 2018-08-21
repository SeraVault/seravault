##### Template Helper `fileURL` [*Client*]

```javascript
this.Files = new FilesCollection({collectionName: 'Files'});

if (Meteor.isClient) {
  Meteor.subscribe('files.all');

  Template.example.helpers({
    fileRef: Files.collection.findOne({})
  })

} else {

  Meteor.publish('files.all', function () {
    return Files.collection.find({});
  });
}
```

##### Get download URL for file, pass `fileRef` object to helper:
```html
<a href="{{fileURL fileRef}}?download=true" target="_parent" download="{{fileRef.name}}">
  {{fileRef.name}}
</a>
```

-----

##### Get specific version of the file, pass second argument `version`:
__Note:__ If requested version of file is not available - the original file will be returned.

For more info about file's subversions see: [create subversions](https://github.com/VeliovGroup/Meteor-Files/wiki/Create-and-Manage-Subversions) section
```html
<a href="{{fileURL fileRef 'small'}}?download=true" target="_parent" download="{{compare fileRef.versions.small.name '||' fileRef.name}}">
  {{fileRef.name}}
</a>
<!-- For `compare` helper see ostrio:templatehelpers -->
```
For `compare` helper see [ostrio:templatehelpers](https://atmospherejs.com/ostrio/templatehelpers)

-----

##### Display thumbnail:
__Note:__ If thumbnail (*subversion of the file*) is not available the original file will be returned.

For more info about file's subversions see: [create subversions](https://github.com/VeliovGroup/Meteor-Files/wiki/Create-and-Manage-Subversions) section
```html
<img src="{{fileURL fileRef 'thumb'}}" alt="{{fileRef.name}}" />
```

-----

##### Example for video with multiple subversions:
For more info about file's subversions see: [create subversions](https://github.com/VeliovGroup/Meteor-Files/wiki/Create-and-Manage-Subversions) section
```html
<video width="80%" height="auto" controls="controls" poster="{{fileURL fileRef 'videoPoster'}}">
  <source src="{{fileURL fileRef 'ogg'}}?play=true" type="video/ogg" />
  <source src="{{fileURL fileRef 'mp4'}}?play=true" type="video/mp4" />
  <source src="{{fileURL fileRef 'webm'}}?play=true" type="video/webm" />
</video>
```