--
-- Table structure for table `apu_photo`
--

DROP TABLE IF EXISTS `apu_photo`;

CREATE TABLE IF NOT EXISTS `apu_photo` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `context` varchar(45) NOT NULL,
  `context_id` int(10) unsigned NOT NULL,
  `filename` varchar(100) NOT NULL,
  `size` int(11) default NULL,
  `is_primary` tinyint(3) unsigned NOT NULL default '0',
  `title` varchar(100) default NULL,
  `title_link` varchar(250) default NULL,
  `caption` varchar(500) default NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;