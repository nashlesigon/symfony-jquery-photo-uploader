AzulPhotoUploaderPlugin Version 1.0
============================
Author: Nash Lesigon <br/>
Email: nashlesigon@gmail.com <br/>
Date Created: May 2012 <br/>
Version: 1.0 Beta <br/>

============================

Add the uploader to your template:

$("#uploader").azulphotouploader({
	context: your_image_context,
	hasTitle: true, // default value is false
	post_url: path_to_post_url
});


In the action that process the image use the api with either of these:


$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();

OR

$result = ApUploaderApi::getInstance()->saveImage();


Example:

<div id="uploader"></div>

$("#uploader").azulphotouploader({
	context: your_image_context,
	hasTitle: true, // default value is false
	post_url: path_to_post_url
});

And then on the server side:

$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();