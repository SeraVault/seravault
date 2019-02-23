
<h2>About</h2>
Seravault is an application that allows users to encrypt confidential imformation and securely share with others.  The app implements end-to-end encryption so that the man-in-the-middle attack vector is eliminated.


<h2>Installation</h2>
<h3>Install Meteor</h3>
<pre>https://www.meteor.com/install</pre>

<h3>Install dependencies</h3>
Navigate to the root folder and run the following command

<pre>
meteor npm install --save @babel/runtime jquery simpl-schema meteor-node-stubs meteor-accounts-t9n parsleyjs filereader-stream concat-stream
</pre>

<h3>Configure</h3>
Seravault allows encrypted file uploads.  You'll need to define the location where the files are saved.  See <i>settings.json</i>.

Seravault also needs an smtp server in order for two factor authentication to work.  See <i>run.sh</i>

<h2>Run App</h2>
Navigate to the root folder and run the following command
<pre>./run.sh</pre>
If you get an error that you don't have permission, you'll need to make this shell script executable:
<pre>chmod +x run.sh</pre>

Navigate to http://localhost:3000 in your web browser to use the app.

-------------------------------
<h2>See it in action:</h2>
https://www.seravault.com