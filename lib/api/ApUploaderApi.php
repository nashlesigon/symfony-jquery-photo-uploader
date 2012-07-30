<?php 

class ApUploaderApi 
{
    protected $options = array();
    protected $file = null;
    private static $instance = null;
    public static function getInstance()
    {
        if( is_null(self::$instance) )
        {
            self::$instance = new self;
        }
        return self::$instance;
    }

    private function __construct(){}

    public function saveImage()
    {
        $this->_buildOptions();
        // var_dump($this->options);
        $uploader = new ApUploader($this->options);
        return $uploader;
    }

    public function getPhotos($context, $contextID = 0, $offset = null, $limit = null)
    {
        $result = ApuPhotoPeer::retrieveByContextAndContextID($context, $contextID, $offset, $limit);
        if(is_null($offset) AND is_null($limit))
        {
            return $result['objects'];
        }
        return $result;
    }

    public function getPhotoById($id)
    {
        return ApuPhotoPeer::retrieveByPk($id);
    }

    public function getAllPhotos($offset = null, $limit = null, $exclude = array())
    {
        $result = ApuPhotoPeer::retrieveAll($offset, $limit, $exclude);
        if(is_null($offset) AND is_null($limit))
        {
            return $result['objects'];
        }
        return $result;
    }

    public function setFile($file)
    {
        $this->file = $file;
        return $this;
    }

    private function _buildOptions()
    {
        $request = sfContext::getInstance()->getRequest();
        $params = $request->getParameterHolder()->getAll();
        
        $is_ajax = ($request->isXmlHttpRequest()) ? 1 : 0;
        
        $this->file = (!$is_ajax AND is_null($this->file)) ? $request->getFiles('images') : $this->file ;
        
        $this->options = array(
            'id' => isset($params['id']) ? $params['id'] : 0,
            'e_id' => isset($params['e_id']) ? $params['e_id'] : '',
            'is_ajax' => $is_ajax,
            'file' => ($is_ajax) ? $params['file'] : $this->file,
            'context' => strtolower($params['context']),
            'context_id' => isset($params['context_id']) ? $params['context_id'] : 0,
            'title' => isset($params['title']) ? $params['title'] : '',
            'link' => isset($params['link']) ? $params['link'] : '',
            'caption' => isset($params['caption']) ? $params['caption'] : ''
            );
    }
    
}