AzulPhotoUploaderPlugin
============================
Author: Nash Lesigon <br/>
Email: nashlesigon@gmail.com <br/>
Date Created: May 2012 <br/>
Version: 1.0 Beta <br/>

============================

Install
-------

	1. Download package and place on the plugin directory
	2. Enable plugin in the project configuration file
	3. run the ./symfony plugin:publish-asset command

How to use:
-----------

	1. Add the javascript and the css file to the page where you want to use the uploader
		
		<?php use_javascript('/AzulPhotoUploaderPlugin/js/azulphotouploader-2.0a.js') ?>
		<?php use_stylesheet('/AzulPhotoUploaderPlugin/css/photouploader.css') ?>

	2. Add the uploader to your template with this code:
		$("#uploader").azulphotouploader({<br/>
			context: your_image_context,<br/>
			hasTitle: true, // default value is false<br/>
			post_url: path_to_post_url<br/>
		});
	3. In the server side, use either of the following codes:

		a. $result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();
		b. $result = ApUploaderApi::getInstance()->saveImage();

Example:
--------

	<div id="uploader">
		// plugin will add the mark up here
	</div>

	<script type="text/javascript">
		$("#uploader").azulphotouploader({
			context: your_image_context,
			hasTitle: true, // default value is false
			post_url: path_to_post_url
		});

	</script>

	// And then on the server side:

	$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();
	OR
	$result = ApUploaderApi::getInstance()->saveImage();