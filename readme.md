<h1>OptimizedHTML 5</h1>
<p>Lightweight production ready Gulp starter.</p>

<p>
	<img src="https://raw.githubusercontent.com/agragregra/oh5/master/app/images/src/preview.jpg" alt="Start HTML Template">
</p>

<p><strong>OptimizedHTML 5</strong> - lightweight startup environment with <strong>Gulp 4</strong>, <strong>Preprocessors (Sass, Scss, Less, Stylus)</strong>, <strong>clean-css</strong>, <strong>Browsersync</strong>, <strong>Autoprefixer</strong>, <strong>webpack-stream</strong>, <strong>Babel</strong>, <strong>Rsync</strong>, <strong>CSS Reboot</strong> (Bootstrap reboot), Server-side <strong>HTML imports</strong> (SSI), <strong>build</strong>. It uses best practices for responsive images, JavaScript, CSS optimizing and contains a <strong>.htaccess</strong> code for resources caching (images, fonts, HTML, CSS, JS and other content types).</p>

<h2>How to use OptimizedHTML 5</h2>

<p>Clone into the current folder and remove all unnecessary (one command):</p>

<pre>git clone https://github.com/agragregra/oh5 .; rm -rf trunk .gitignore readme.md .git dist</pre>

<ol>
	<li>Clone or <a href="https://github.com/agragregra/OptimizedHTML-5/archive/master.zip">Download</a> <strong>OptimizedHTML 5</strong> from GitHub</li>
	<li>Install Node Modules: <strong>npm i</strong></li>
	<li>Run: <strong>gulp</strong></li>
</ol>

<h2>Main Gulpfile.js options:</h2>

<ul>
	<li><strong>preprocessor</strong>: Optional preprocessor (sass, less, styl). 'sass' also work with the Scss syntax in "styles/sass/blocks/" import folder</li>
	<li><strong>fileswatch</strong>: List of files extensions for watching & hard reload</li>
</ul>

<h2>Main Gulp tasks:</h2>

<ul>
	<li><strong>gulp</strong>: run default gulp task (scripts, images, styles, browsersync, startwatch)</li>
	<li><strong>scripts, styles, images, assets</strong>: build assets (css, js, images or all)</li>
	<li><strong>deploy</strong>: project deployment via <strong>RSYNC</strong></li>
	<li><strong>build</strong>: project build</li>
</ul>

<h2>Basic rules</h2>

<h4>src's & dist's:</h4>

<ol>
	<li>All <strong>src | dist scripts</strong> located in <strong>app/js/app.js | app.min.js</strong></li>
	<li><strong>Main Sass|Less|Styl</strong> src files located in <strong>app/styles/{preprocessor}/main.*</strong></li>
	<li>All <strong>compressed styles</strong> located in <strong>app/css/main.min.css</strong></li>
	<li>Project <strong>styles config</strong> placed in <strong>app/styles/{preprocessor}/_config.*</strong></li>
	<li>All <strong>src images</strong> placed in <strong>app/images/src/</strong> folder</li>
	<li>All <strong>compressed images</strong> placed in <strong>app/images/dist/</strong> folder</li>
</ol>

<h4>Include parts of HTML code:</h4>

<p>Include parts of html code is implemented using SSI Browsersync server side. You can import any part of the code using construction in any of html files:</p>

<pre>&lt;!--#include virtual="/parts/header.html" --&gt;</pre>

<p>Variables? No problem:</p>

<pre>
&lt;!--#set var="title" value="OptimizedHTML 5" --&gt;
&lt;!--#include virtual="/parts/header.html" --&gt;
</pre>

<p>In "/parts/header.html":</p>

<pre>
&lt;title&gt;&lt;!--#echo var="title" --&gt;&lt;/title&gt;
</pre>

<h4>Include parts of Preprocessor code:</h4>

<p>All included parts of preprocessor files placed in the folder "styles/{preprocessor}/blocks/". Any number of preprocessor files can be placed here and in any order. They will be automatically included in the "styles/{preprocessor}/main.*" file and processed by the selected preprocessor.</p>

<h2>Included features</h2>

<ol>
	<li><a href="https://getbootstrap.com/docs/4.0/content/reboot/">bootstrap-reboot</a> - Bootstrap Reboot CSS collection</li>
	<li>
		<a href="https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints">_breakpoints.scss</a> - Bootstrap Breakpoints mixin (available only for sass and scss)</li>
		<li><a href="https://getbootstrap.com/docs/4.0/layout/grid/">bootstrap-grid</a> (optional) - Bootstrap Grid collection</li>
</ol>

<h2>Helpers</h2>

<h3>Fonts</h3>

<p>The woff2 fonts are currently recommended.</p>

<p>Converter recommended: <a href="https://www.fontsquirrel.com/tools/webfont-generator">https://www.fontsquirrel.com/tools/webfont-generator</a><br>
Or get from google-webfonts-helper: <a href="https://google-webfonts-helper.herokuapp.com/fonts">https://google-webfonts-helper.herokuapp.com/fonts</a></p>

<h3>font-weight helper</h3>

<ul>
	<li><strong>100</strong> - Extra Light or Ultra Light</li>
	<li><strong>200</strong> - Light or Thin</li>
	<li><strong>300</strong> - Book or Demi</li>
	<li><strong>400</strong> - Regular or Normal</li>
	<li><strong>500</strong> - Medium</li>
	<li><strong>600</strong> - Semibold or Demibold</li>
	<li><strong>700</strong> - Bold</li>
	<li><strong>800</strong> - Black or Extra Bold or Heavy</li>
	<li><strong>900</strong> - Extra Black or Fat or Ultra Blac or Heavy</li>
</ul>

<h2>Caching</h2>

<p>Create or open <strong>.htaccess</strong> file in root folder of website (Apache). Place this code for resources caching:</p>

<pre>
&lt;ifModule mod_expires.c&gt;

# Add correct content-type for fonts & SVG
AddType application/font-woff2 .woff2
AddType image/svg+xml .svg

ExpiresActive On
ExpiresDefault "access plus 5 seconds"

# Cache Images
ExpiresByType image/x-icon "access plus 2592000 seconds"
ExpiresByType image/jpeg "access plus 2592000 seconds"
ExpiresByType image/png "access plus 2592000 seconds"
ExpiresByType image/gif "access plus 2592000 seconds"
ExpiresByType image/svg+xml "access plus 2592000 seconds"

# Cache Fonts
ExpiresByType application/font-woff2 "access plus 2592000 seconds"
ExpiresByType image/svg+xml "access plus 2592000 seconds"

# Cache other content types (CSS, JS, HTML, XML)
ExpiresByType text/css "access plus 604800 seconds"
ExpiresByType text/javascript "access plus 2592000 seconds"
ExpiresByType application/javascript "access plus 2592000 seconds"
ExpiresByType application/x-javascript "access plus 2592000 seconds"
ExpiresByType text/html "access plus 600 seconds"
ExpiresByType application/xhtml+xml "access plus 600 seconds"

&lt;/ifModule&gt;

&lt;ifModule mod_deflate.c&gt;

AddOutputFilterByType DEFLATE text/html text/plain text/xml application/xml application/xhtml+xml text/css text/javascript application/javascript application/x-javascript application/font-woff2 image/svg+xml

&lt;/ifModule&gt;
</pre>

<h2>Issues</h2>

<ol>
	<li>Long Preprocessor compile: Disable the "safe write" option in PHPStorm settings.</li>
</ol>
