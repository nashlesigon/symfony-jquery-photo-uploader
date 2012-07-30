<?php


/**
 * Skeleton subclass for performing query and update operations on the 'apu_photo' table.
 *
 * 
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    plugins.AzulPhotoUploaderPlugin.lib.model
 */
class ApuPhotoPeer extends BaseApuPhotoPeer {

    const PRIMARY = 1, NOT_PRIMARY = 0;

    public static function retrieveByContextAndContextID($context, $contextID = 0, $offset = null, $limit = null)
    {
        $c = new Criteria;
        $c->add(self::CONTEXT, $context);
        if($contextID > 0)
        {
            $c->add(self::CONTEXT_ID, $contextID);
        }

        $count = self::doCount($c);

        if(!is_null($offset) AND !is_null($limit))
        {
            $c->setOffset($offset);
            $c->setLimit($limit);
        }

        $objects = self::doSelect($c);

        return array('count' => $count, 'objects' => $objects);
        
    }

    
    public static function retrieveRandomPhoto($excluded = array(),$limit=1)
    {
        $criteria = new Criteria();
        if(count($excluded))
        {
            $criteria->add(self::CONTEXT,$excluded,Criteria::NOT_IN);
        }
        $criteria->addAscendingOrderByColumn('rand()');
        $criteria->setLimit($limit);

        return self::doSelectOne($criteria);
    }

    public static function retrievePrimaryPhoto($context,$contextId)
    {
        $criteria = new Criteria();
        $criteria->add(self::CONTEXT,$context);
        $criteria->add(self::CONTEXT_ID,$contextId);
        $criteria->add(self::IS_PRIMARY,self::PRIMARY);

        return self::doSelectOne($criteria);
    }

    public static function retrieveAll($offset = null, $limit = null, $exclude = array())
    {
        $c = new Criteria;

        if(count($exclude))
        {
            // $exclude = implode(",",$exclude);
            $c->add(self::CONTEXT, $exclude, Criteria::NOT_IN);
        }

        $count = self::doCount($c);

        if(!is_null($offset) AND !is_null($limit))
        {
            $c->setOffset($offset);
            $c->setLimit($limit);
        }

        $objects = self::doSelect($c);

        return array('count' => $count, 'objects' => $objects);
    }

} // ApuPhotoPeer
