<h1>OptimizedHTML 5</h1>
<p>Lightweight startup HTML5 template, based on Gulp.</p>

<p>
	<img src="https://raw.githubusercontent.com/agragregra/oh5/master/app/img/_src/preview.jpg" alt="Start HTML Template">
</p>

<p>Author: <a href="https://webdesign-master.ru" target="_blank">WebDesign Master</a></p>

<p><strong>OptimizedHTML 5</strong> - lightweight startup HTML5 template with <strong>Gulp 4</strong>, <strong>Sass</strong>, <strong>Browsersync</strong>, <strong>Autoprefixer</strong>, <strong>Uglify-ES</strong>, <strong>Clean-CSS</strong>, <strong>Rsync</strong>, <strong>CSS Reboot</strong> (Bootstrap reboot), uses best practices for optimizing responsive images and contains a <strong>.htaccess</strong> file for server-side resources caching (images, fonts, HTML, CSS, JS and other content types).</p>

<h2>How to use OptimizedHTML 5</h2>

<pre>git clone http://github.com/agragregra/oh5</pre>

<ol>
	<li>Clone or <a href="https://github.com/agragregra/OptimizedHTML-5/archive/master.zip">Download</a> <strong>OptimizedHTML 5</strong> from GitHub</li>
	<li>Install Node Modules: <strong>npm i</strong></li>
	<li>Run: <strong>gulp</strong></li>
</ol>

<h2>Main Gulp tasks:</h2>

<ul>
	<li><strong><em>gulp</em></strong>: run default gulp task ('img', 'styles', 'scripts', 'browser-sync', 'watch')</li>
	<li><strong><em>cleanimg</em></strong>: Clean @*x responsive IMG's</li>
	<li><strong><em>rsync</em></strong>: project deployment via <strong>RSYNC</strong></li>
</ul>

<h2>Basic rules</h2>

<ol>
	<li>All custom <strong title="scripts task"><em>scripts</em></strong> located in <strong>app/js/_custom.js</strong></li>
	<li>All custom <strong title="styles task"><em>styles</em></strong> located in <strong>app/sass/main.sass</strong></li>
	<li>All Sass <strong>vars</strong> placed in <strong>app/sass/_vars.sass</strong></li>
	<li>All <strong>fonts</strong> plug in <strong>app/sass/_fonts.sass</strong></li>
	<li>All CSS styles of <strong>libraries</strong> placed in <strong>app/sass/_libs.sass</strong></li>
	<li>Rename <strong>ht.access</strong> to <strong>.htaccess</strong> before place it in your web server. This file contain rules for server-side resources caching</li>
</ol>

