
<h2>About</h2>
Seravault is a progressive web app that allows users to encrypt confidential information and securely share with others.  The app implements end-to-end encryption so that the man-in-the-middle attack vector is eliminated.  Multi-factor authentication is implemented to decrease the probability that an attacker can impersonate a user to gain access.  Find out more at https://www.seravault.com


<h2>Installation</h2>
<h3>Install Meteor</h3>
<pre>https://www.meteor.com/install</pre>

<h3>Install dependencies</h3>
Navigate to the root folder and run the following command

<pre>
meteor npm install
</pre>

<h3>Configure</h3>
Seravault allows encrypted file uploads.  You'll need to define the location where these files are saved.  See <b><i>settings.json</i></b>.

Seravault also needs an smtp server in order for two factor authentication to work.  See <b><i>run.sh</i></b>

<h2>Run App</h2>
Navigate to the root folder and run the following command (Linux/Unix)
<pre>./run.sh</pre>
If you get an error that you don't have permission, you'll need to make this shell script executable:
<pre>chmod +x run.sh</pre>
The run.sh script contains Linux/Unix commands.  For Windows, you'll need to build your own batch file using the bash script as an example.

<h2>Open App</h2>
Navigate to http://localhost:3000 in your web browser to use the app.

To change the port, you can always edit the <i>run.sh</i> script. See https://docs.meteor.com/commandline.html for more info.

-------------------------------
<h2>See it in action</h2>
https://www.seravault.com