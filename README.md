AzulPhotoUploaderPlugin
============================
Author: Nash Lesigon
Email: nashlesigon@gmail.com
Date Created: May 2012
Version: 1.0 Beta
============================


$result = ApUploaderApi::getInstance()->setFile($request->getFiles('image'))->saveImage();
OR
$result = ApUploaderApi::getInstance()->saveImage();