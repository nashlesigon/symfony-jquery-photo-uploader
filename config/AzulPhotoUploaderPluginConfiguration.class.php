<?php

class AzulPhotoUploaderPluginConfiguration extends sfPluginConfiguration
{
    private static $registered_contexts = array();
    
    public function initialize()
    {
        $contexts = sfConfig::get('app_azul_photo_uploader_contexts',null);
        if(count($contexts))
        {
            foreach($contexts as $context => $settings)
            {
                if(strlen($context) > 30)
                {
                    throw new Exception("Context must not exceed 20 characters!");
                }

                self::$registered_contexts[strtolower($context)] = $settings;
                
            }
        }
        
        
    }
    
    public static function getAPGRegisteredContexts()
    {
        return self::$registered_contexts;
    }
    
    public static function getAPGRegisteredContextSettings($context)
    {
        if(isset(self::$registered_contexts[strtolower($context)]))
        {
            return self::$registered_contexts[strtolower($context)];
        }
        return array();
    }
    

}