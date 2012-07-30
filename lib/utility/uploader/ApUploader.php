<?php 

class ApUploader 
{
    protected $apuPhoto = array();
    protected $response = "{}";
    protected $uploadedFilename = null;
    protected $uploadedFilesize = 0;
    protected $object = null;
    private $options = array();

    public function __construct($v = array())
    {
        error_reporting(E_ERROR | E_WARNING | E_PARSE);
        $this->options = $v;
        $this->processImage();
    }

    protected function processImage()
    {
        if($this->options['is_ajax'] == 1)
        {
            $this->ajaxProcess();
        }
        else
        {
            if($this->options['file']['error'] == 0)
            {
                $this->simpleProcess();
            }
            else 
            {
                // this means we only have to update the other details of the photo object
                $this->apuPhoto = array(
                    'context' => $this->options['context'],
                    'context_id' => $this->options['context_id'],
                    'is_primary' => 0,
                    'title' => $this->options['title'],
                    'title_link' => $this->options['link'],
                    'caption' => $this->options['caption'],
                    'date_added' => ($this->options['id'] == 0) ? date('Y-m-d H:i:s') : null
                    );
                $this->save();
            }
        }

    }

    protected function ajaxProcess()
    {
        $upload_path = $this->_getUploadPath();
        $newFilename = $this->_getNewFilename();
        
        $newFile = $upload_path.DIRECTORY_SEPARATOR.$newFilename;
        $input = fopen("php://input", "r");
        
        $temp_path = sfConfig::get('sf_upload_dir') . DIRECTORY_SEPARATOR . "tmp";
        if(!is_writable($temp_path)){
            mkdir("$temp_path",0777);
        }

        $tempFilename = tempnam($temp_path, 'temp_');
        $tempfile = fopen($tempFilename, 'w');
        $filesize = stream_copy_to_stream($input, $tempfile);
        
        fclose($tempfile);
        fclose($input);
        
        $filename = $this->options['file'];
        $file = array('name' => "$filename", 'tmp_name' => "$tempFilename");

        ApuImageCropper::getInstance()->crop($file, $newFilename, $this->options['context']);

        

        if(rename($tempFilename,$newFile))
        {
            $this->uploadedFilename = $newFilename;
            $this->uploadedFilesize = $filesize;
            $this->_setOptions();
            $this->save();
        }
        else 
        {
            $this->response = '{ "error" => "An error has occurred while trying to upload your image!", "e_id" : "'.$e_id.'" }';
        }
    }

    protected function simpleProcess()
    {
        $upload_path = $this->_getUploadPath();
        $newFilename = $this->_getNewFilename();

        $file = array('name' => $this->options['file']['name'], 'tmp_name' => $this->options['file']['tmp_name']);
        $filesize = @filesize($this->options['file']['tmp_name']);

        ApuImageCropper::getInstance()->crop($file, $newFilename, $this->options['context']);

        $newFile = $upload_path.DIRECTORY_SEPARATOR.$newFilename;

        if(move_uploaded_file($this->options['file']['tmp_name'], $newFile))
        {
            $this->uploadedFilename = $newFilename;
            $this->uploadedFilesize = $filesize;
            $this->_setOptions();
            $this->save();
        }
    }

    protected function save()
    {
        $photo = ($this->options['id'] == 0) ? new ApuPhoto : ApuPhotoPeer::retrieveByPk($this->options['id']);
        $photo->fromArray($this->apuPhoto, BasePeer::TYPE_FIELDNAME);
        $photo->save();
        $this->object = $photo;
        $this->_setResponse();
        return $photo;
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function getFilename()
    {
        return $this->uploadedFilename;
    }

    public function getFilesize()
    {
        return $this->uploadedFilesize;
    }

    public function getPhotoObject()
    {
        return $this->object;
    }

    private function _getNewFilename()
    {   
        $fileInfo = ($this->options['is_ajax'] == 1) ? pathinfo($this->options['file']) : pathinfo($this->options['file']['name']) ;
        $newFilename = sha1($fileInfo['filename']).time().".".$fileInfo['extension'];
        return $newFilename;
    }

    private function _getUploadPath()
    {
        $default_settings = sfConfig::get('app_azul_photo_uploader_settings',null);
        $upload_path = $default_settings['upload_path'] . DIRECTORY_SEPARATOR . strtolower($this->options['context']);
        if(!is_writable($upload_path)){
            mkdir("$upload_path", 0777);
        }
        return $upload_path;
    }

    private function _setOptions()
    {
        $this->apuPhoto = array(
                'context' => $this->options['context'],
                'context_id' => $this->options['context_id'],
                'filename' => $this->getFilename(),
                'size' => $this->getFilesize(),
                'is_primary' => 0,
                'title' => isset($this->options['title']) ? $this->options['title'] : '',
                'title_link' => isset($this->options['link']) ? $this->options['link'] : '',
                'caption' => $this->options['caption'],
                'date_added' => ($this->options['id'] == 0) ? date('Y-m-d H:i:s') : null
                );
    }

    private function _setResponse()
    {
        $e_id = isset($this->options['e_id']) ? $this->options['e_id'] : '';
        $this->response = '{ "success" : "Success!", "e_id" : "'.$e_id.'", "filename" : "'.$this->getPhotoObject()->getFilename().'", "thumbnail" : "'.$this->getPhotoObject()->getPath('thumbnail').'" }';
    }
}