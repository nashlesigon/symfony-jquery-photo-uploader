<?php


/**
 * This class defines the structure of the 'apu_photo' table.
 *
 *
 *
 * This map class is used by Propel to do runtime db structure discovery.
 * For example, the createSelectSql() method checks the type of a given column used in an
 * ORDER BY clause to know whether it needs to apply SQL to make the ORDER BY case-insensitive
 * (i.e. if it's a text column type).
 *
 * @package    plugins.AzulPhotoUploaderPlugin.lib.model.map
 */
class ApuPhotoTableMap extends TableMap {

	/**
	 * The (dot-path) name of this class
	 */
	const CLASS_NAME = 'plugins.AzulPhotoUploaderPlugin.lib.model.map.ApuPhotoTableMap';

	/**
	 * Initialize the table attributes, columns and validators
	 * Relations are not initialized by this method since they are lazy loaded
	 *
	 * @return     void
	 * @throws     PropelException
	 */
	public function initialize()
	{
	  // attributes
		$this->setName('apu_photo');
		$this->setPhpName('ApuPhoto');
		$this->setClassname('ApuPhoto');
		$this->setPackage('plugins.AzulPhotoUploaderPlugin.lib.model');
		$this->setUseIdGenerator(true);
		// columns
		$this->addPrimaryKey('ID', 'Id', 'INTEGER', true, 10, null);
		$this->addColumn('CONTEXT', 'Context', 'VARCHAR', true, 45, null);
		$this->addColumn('CONTEXT_ID', 'ContextId', 'INTEGER', true, 10, null);
		$this->addColumn('FILENAME', 'Filename', 'VARCHAR', true, 100, null);
		$this->addColumn('SIZE', 'Size', 'INTEGER', false, 11, null);
		$this->addColumn('IS_PRIMARY', 'IsPrimary', 'TINYINT', true, 3, 0);
		$this->addColumn('TITLE', 'Title', 'VARCHAR', false, 100, null);
		$this->addColumn('TITLE_LINK', 'TitleLink', 'VARCHAR', false, 250, null);
		$this->addColumn('CAPTION', 'Caption', 'VARCHAR', false, 500, null);
		$this->addColumn('DATE_ADDED', 'DateAdded', 'TIMESTAMP', true, null, null);
		// validators
	} // initialize()

	/**
	 * Build the RelationMap objects for this table relationships
	 */
	public function buildRelations()
	{
	} // buildRelations()

	/**
	 * 
	 * Gets the list of behaviors registered for this table
	 * 
	 * @return array Associative array (name => parameters) of behaviors
	 */
	public function getBehaviors()
	{
		return array(
			'symfony' => array('form' => 'true', 'filter' => 'true', ),
			'symfony_behaviors' => array(),
		);
	} // getBehaviors()

} // ApuPhotoTableMap
