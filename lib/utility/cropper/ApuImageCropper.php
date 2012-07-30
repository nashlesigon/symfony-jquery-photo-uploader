<?php

class ApuImageCropper {
	
	private static $instance = null;
	
	public static function getInstance(){
		if( is_null(self::$instance) ){
			self::$instance = new self;
		}
		return self::$instance;
	}
	
	public function crop($file, $newFilename, $context){
	//	var_dump($file); exit;
		
		$filename = $file['name'];
		$tempFile = $file['tmp_name'];
		// $filesize = $file['size'];
		
		$temp_file = $file['tmp_name'];
		
		$ImageEditor = ApuImageEditor::getInstance();

		$custom_settings = AzulPhotoUploaderPluginConfiguration::getAPGRegisteredContextSettings($context);

        $default_settings = sfConfig::get('app_azul_photo_uploader_settings',null);

		$destinationFolder = sfConfig::get('sf_web_dir') . DIRECTORY_SEPARATOR . $default_settings['upload_path'] . DIRECTORY_SEPARATOR . $context . DIRECTORY_SEPARATOR;

		$ImageEditor->setDestination($destinationFolder);

		$ImageEditor->setImageFile($temp_file);
		$ImageEditor->setFilename($newFilename);

		// create standard image
		// $ImageEditor->scale("standard_");
		$ImageEditor->resize("standard_", 1000, 1000);
        // var_dump($custom_settings['sizes']);
		foreach($custom_settings['sizes'] as $size => $dimention)
		{
			$prefix = $size."_";
			$ImageEditor->crop("$prefix",$dimention['width'],$dimention['height']);
		}
		
		if(isset($custom_settings['scale']))
        {
            $dimentions = $custom_settings['scale'];
            $ImageEditor->resize("scale_", $dimentions['width'], $dimentions['height']);
        }
	}
}