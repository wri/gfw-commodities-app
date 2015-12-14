# Global Forest Watch Commodities Phase II

> Please Read this when starting work on this project.

## IMPORTANT
Change the FTP folder in Gruntfile.js before you begin.  Modify "dest" property in this section of code:
<code>
    ftp_push: {
            build: {
                options: {
                    host: 'staging.blueraster.com',
                    dest: 'html/wri/gfw-commodities/v20/',
                    authKey: 'staging'
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['**']
                }]
            }
        },
</code>

## Getting Started
<strong>All necesary bower components are already installed, no need to run bower install.</strong>

### Setup
<p>The project is configured already with grunt.  If you need grunt, run <code>npm install -g grunt-cli</code>.  Just run <code>npm install</code> in the root directory to install all of grunt's dependencies.</p>
<p>All css is written in stylus and then compiled by grunt into a single css file called app.css.  Typing <code>grunt develop</code> will start the watch task and compile all .styl files in the css directory. (This may change later when trying to optimize loading to load a smaller css file which contains only the necessary css to load the homepage and then a larger one with all the rest, but probably wont)</p>
<p>Warning: If you run this project over an Apache server, it is possible that your server configurations will clash with the project's <strong>.htaccess</strong> file.  If this project is not visible on your web server or you cannot view it in the browser, comment out your <strong>.htaccess</strong> file, <strong> but make sure your edits are not tracked in git</strong>.  Just run <code>git update-index --assume-unchanged .htaccess</code> in the root directory to ensure that any changes you make to the <strong>.htaccess</strong> file will not affect production.</p>

### Prepare to Build
The bootload.js file loads the classes differently when running locally vs on a server.  Change the "deps" and "callback" as needed. (Also see comments around line 34 in bootloader.js.)
#### Local
<p><strong>deps</strong> includes <code>main/Main</code>. <strong>callback</strong> runs <code>Main.init();</code> and comments out <code>loadScript('app/js/app.min.js');</code></p>
#### Staging/Production
<p><strong>deps</strong> comments out <code>main/Main</code>. <strong>callback</strong> comments out <code>Main.init();</code> and runs <code>loadScript('app/js/app.min.js');</code></p>

### Build
<p>Their will be two grunt tasks, <code>grunt build</code> and <code>grunt minify</code>.  The build task and minify task are the same except that the build task will automatically deploy the code after its built to staging whereas the minify will do nothing after building, which can be good for testing before deploying.</p>
##### NOTE: grunt build is no longer used, use grunt minify, grunt build can be used if reconfigured but auth file and destination are not currently set.
<p>The task <code>grunt build</code> needs a <strong>.ftpauth</strong> file located in the same directory as the Gruntfile.js which contains credentials for the task to log into ftp.  You can skip creating that file and specify them manually but <strong>DO NOT COMMIT YOUR CREDENTIALS TO ANY REPO</strong>.  If you really want to, you can get instructions on how to do that at my github page <a href='https://github.com/Robert-W/grunt-ftp-push' target='_blank'>https://github.com/Robert-W/grunt-ftp-push</a>.  The Recommended way is as follows: (NOTE: .ftpauth is added to .gitignore already so it wont be committed to the repo)</p>

#### Create a file called .ftpauth with the following contents
<pre><code>{
	"staging": {
		"username": "yourusername",
		"password": "yourpassword"
	}
}
</code></pre>
<p>The "staging" keyword is the key the plugin is configured to use, if you change tht you will need to modify the task in the Gruntfile, just leave it as is.</p>
