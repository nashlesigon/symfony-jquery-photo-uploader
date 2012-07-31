AzulPhotoUploaderPlugin
============================
Author: Nash Lesigon <br/>
Email: nashlesigon@gmail.com <br/>
Date Created: May 2012 <br/>
Version: 1.0 Beta <br/>
Compatibility: Symfony 1.4+

Description:
------------
This plugin gives the ability to upload multiple photos with caption, title and target link using jQuery ajax request.

Requirements:
-------------
You must have image_transform pear package installed. If you don't have it, you can download it <a href="http://pear.php.net/package/Image_Transform/redirected">here</a>.

Install
-------

	1. Download package and place on the plugin directory
	2. Import sql file: config/azulphotouploader.sql
	3. Enable plugin in the project configuration file
	4. run the ./symfony plugin:publish-asset command

How to use:
-----------

	1. Add the javascript and the css file to the page where you want to use the uploader
		
		<?php use_javascript('/AzulPhotoUploaderPlugin/js/azulphotouploader-2.0a.js') ?>
		<?php use_stylesheet('/AzulPhotoUploaderPlugin/css/photouploader.css') ?>

	2. Add the uploader to your template with this code:
		$("#uploader").azulphotouploader({
			context: your_image_context, // replace with your defined context
			hasTitle: true, // default value is false
			post_url: path_to_post_url // replace with your post path
		});
	3. In the server side, use either of the following codes:
		a. $result = ApUploaderApi::getInstance()->saveImage();
		b. $result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();

Example:
--------

	<div id="uploader">
		// plugin will add the mark up here
	</div>

	<script type="text/javascript">
		$("#uploader").azulphotouploader({
			context: "sample", // replace with your defined context
			hasTitle: true, // default value is false
			post_url: "/photo-upload/process" // replace with your post path
		});

	</script>

	// And then on the server side:
	$result = ApUploaderApi::getInstance()->saveImage();