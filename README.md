AzulPhotoUploaderPlugin
============================
Author: Nash Lesigon
Email: nashlesigon@gmail.com
Date Created: May 2012
Version: 1.0 Beta
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