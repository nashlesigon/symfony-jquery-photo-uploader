<?php


class ApuImageEditor{

	private static $_instance = null;

	private $imagefile;
	private $filename;
	private $imagetype;
	private $destination;
	private $width;
	private $height;

	var $options	=	array(
        'quality'     => 100,
        'scaleMethod' => 'smooth',
        'canvasColor' => array(255, 255, 255),'pencilColor'=>array(0,0,0),'textColor'=>array(0,0,0));


	public static function getInstance(){
		if (is_null( self :: $_instance))
		self :: $_instance = new self;
			
		return self :: $_instance;
	}


	private function __construct(){

	}

	function setImageFile($imagefile){
		$this->imagefile = $imagefile;
	}

	function getImageFile(){
		return $this->imagefile;
	}

	function setFilename($filename){
		$this->filename = $filename;
	}

	function getFilename(){
		return $this->filename;
	}

	function setDestination($destination){
		$this->destination = $destination;
	}

	function getDestination(){
		return $this->destination;
	}

	function setImagetype($imagetype){
		$this->imagetype = $imagetype;
	}

	function setArea($area){
		$this->area = $area;
	}


	function resize($alias,$W, $H){
		require_once 'Image/Transform.php';
		$i = Image_Transform::factory('GD');
		$i->setOptions($this->options);
		$i->load($this->imagefile);
		$i->fit($W,$H);
		$i->save($this->destination.$alias.$this->filename);
	}

	function crop($alias, $cropW, $cropH){
		require_once 'Image/Transform.php';
		$i = Image_Transform::factory('GD');
		$i->setOptions($this->options);
		$i->load($this->imagefile);

		if($i->getImageWidth() >$cropW || $i->getImageHeight() >$cropH){
			/*
			 * 	check which is GT parameter value
			 *	IF $cropW is GT than $cropH
			 *		make size of hieght to $cropW
			 *	ELSE
			 *	make size of hieght to $cropH
			 */
			if($cropW >= $cropH){
				$i->getImageWidth()>=$i->getImageHeight()?$i->fitY($cropW):$i->fitX($cropW);
				$i->save($this->destination.$alias.$this->filename);
				$i->load($this->destination.$alias.$this->filename);
			}else{
				$i->getImageWidth()>=$i->getImageHeight()?$i->fitY($cropH):$i->fitX($cropH);
				$i->save($this->destination.$alias.$this->filename);
				$i->load($this->destination.$alias.$this->filename);
			}
				
			$x = ($i->getImageWidth()-$cropW)/2<=0?0:($i->getImageWidth()-$cropW)/2;
			$y = ($i->getImageHeight()-$cropH)/2<=0?0:($i->getImageHeight()-$cropH)/2;
				
			$i->crop($cropW,$cropH, $x , $y);
			$i->save($this->destination.$alias.$this->filename);
				
		}else{
			$i->save($this->destination.$alias.$this->filename);
		}

	}
	
	function scale($alias){
		require_once 'Image/Transform.php';
		$i = Image_Transform::factory('GD');
		$i->setOptions($this->options);
		$i->load($this->imagefile);
		
		if($i->getImageWidth() > $i->getImageHeight()){
			// scale by width
			$i->scaleByX(430);
		}
	//	else if($i->getImageHeight() > $i->getImageWidth()) {
		else {
			// scale by height
			$i->scaleByY(280);
		}
		
		
	//	$i->scale($size);
		$i->save($this->destination.$alias.$this->filename);
		
	}

		
}
