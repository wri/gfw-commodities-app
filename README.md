# Global Forest Watch Commodities Phase II

> Please Read this when starting work on this project.


## Getting Started
<strong>All necesary bower components are already installed, no need to run bower install.</strong>
<p>If you are using Grunt.  The project is configured already with grunt.  Just run <code>npm install</code> in the root directory to install all of grunt's dependencies.</p>
<p>All css is written in stylus and then compiled by grunt into a single css file called app.css.  Typing <code>grunt develop</code> will start the watch task and compile all .styl files in the css directory. (This may change later when trying to optimize loading to load a smaller css file which contains only the necessary css to load the homepage and then a larger one with all the rest, but probably wont)</p>
<p>Their will be two grunt tasks, <code>grunt build</code> and <code>grunt minify</code>.  The build task and minify task are the same except that the build task will automatically deploy the code after its built to staging whereas the minify will do nothing after building, which can be good for testing before deploying.</p>
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

