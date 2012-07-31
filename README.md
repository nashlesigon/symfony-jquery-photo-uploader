AzulPhotoUploaderPlugin
============================
Author: Nash Lesigon <br/>
Email: nashlesigon@gmail.com <br/>
Date Created: May 2012 <br/>
Version: 1.0 Beta <br/>

============================

Add the uploader to your template:

$("#uploader").azulphotouploader({<br/>
	context: your_image_context,<br/>
	hasTitle: true, // default value is false<br/>
	post_url: path_to_post_url<br/>
});


In the action that process the image use the api with either of these:


$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();

OR

$result = ApUploaderApi::getInstance()->saveImage();


Example:
==========================

<div id="uploader">

// plugin will add the mark up here

</div>

$("#uploader").azulphotouploader({<br/>
	context: your_image_context,<br/>
	hasTitle: true, // default value is false<br/>
	post_url: path_to_post_url<br/>
});

And then on the server side:

$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();