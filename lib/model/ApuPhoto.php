<?php


/**
 * Skeleton subclass for representing a row from the 'apu_photo' table.
 *
 * 
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    plugins.AzulPhotoUploaderPlugin.lib.model
 */
class ApuPhoto extends BaseApuPhoto {

    public function getPath($size = null, $version = false)
    {
        $default_settings = sfConfig::get('app_azul_photo_uploader_settings',null);
        
        $upload_path = DIRECTORY_SEPARATOR . $default_settings['upload_path'] . DIRECTORY_SEPARATOR . strtolower($this->getContext());
        
        $size = is_null($size) ? "" : $size."_";

        $time = date('Ymd');
        $filename = $size . $this->getFilename();
        $file = $upload_path . DIRECTORY_SEPARATOR . $filename;
        $nUploadPath = sfConfig::get('sf_upload_dir') . DIRECTORY_SEPARATOR . "assets" . DIRECTORY_SEPARATOR . strtolower($this->getContext());
        $nFile = $nUploadPath . DIRECTORY_SEPARATOR . $filename ;
        if(!file_exists($nFile))
        {
            $contexts = sfConfig::get('app_azul_photo_uploader_contexts',null);
            // var_dump($contexts);
            $context_settings = AzulPhotoUploaderPluginConfiguration::getAPGRegisteredContextSettings($this->getContext());
            $first_key = key($context_settings['sizes']);
            $nFile = $nUploadPath . DIRECTORY_SEPARATOR . $first_key . "_" . $this->getFilename();
            $file = (file_exists($nFile)) ? 
                        $upload_path . DIRECTORY_SEPARATOR . $first_key . "_" . $this->getFilename() : 
                            $file;
            // $file = $upload_path . DIRECTORY_SEPARATOR . $first_key . "_" . $this->getFilename();
        }
        if($version)
        {
            $file .= "?v=$time";
        }
        
        return $file;
    }

    // public function delete(PropelPDO $con = null)
    // {
        
    // }
} // ApuPhoto
