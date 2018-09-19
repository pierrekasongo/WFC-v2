-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 19 Septembre 2018 à 14:30
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `workforce_pressure`
--

-- --------------------------------------------------------

--
-- Structure de la table `cadre`
--

CREATE TABLE IF NOT EXISTS `cadre` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Job_Cadre` varchar(200) NOT NULL,
  `Hours_Per_Week` int(11) NOT NULL,
  `Admin_Task` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- Structure de la table `dhis2`
--

CREATE TABLE IF NOT EXISTS `dhis2` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FacilityId` varchar(50) NOT NULL,
  `Quarter` varchar(20) NOT NULL,
  `Year` varchar(20) NOT NULL,
  `TreatmentId` int(11) NOT NULL,
  `Patients` int(11) NOT NULL,
  KEY `Id` (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Structure de la table `facilities`
--

CREATE TABLE IF NOT EXISTS `facilities` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `regionName` varchar(200) NOT NULL,
  `districtName` varchar(200) NOT NULL,
  `FacilityCode` varchar(100) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `selected` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17627 ;

-- --------------------------------------------------------

--
-- Structure de la table `ihris`
--

CREATE TABLE IF NOT EXISTS `ihris` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Surname` varchar(25) NOT NULL,
  `First_Name` varchar(25) NOT NULL,
  `FacilityId` int(20) NOT NULL,
  `FacilityCode` varchar(150) NOT NULL,
  `CadreId` int(20) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3091147 ;

-- --------------------------------------------------------

--
-- Structure de la table `keywords`
--

CREATE TABLE IF NOT EXISTS `keywords` (
  `tagword` varchar(25) NOT NULL,
  PRIMARY KEY (`tagword`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `timeontask`
--

CREATE TABLE IF NOT EXISTS `timeontask` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Task` varchar(150) NOT NULL,
  `MinutesPerPatient` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

-- --------------------------------------------------------

--
-- Structure de la table `treatments`
--

CREATE TABLE IF NOT EXISTS `treatments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Treatment` varchar(250) NOT NULL,
  `imported` tinyint(1) NOT NULL,
  `code` varchar(50) NOT NULL,
  `Ratio` int(20) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=24980 ;

-- --------------------------------------------------------

--
-- Structure de la table `treatmentsteps`
--

CREATE TABLE IF NOT EXISTS `treatmentsteps` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TreatmentId` int(11) NOT NULL,
  `TaskId` int(11) NOT NULL,
  `CadreId` int(20) DEFAULT NULL,
  `MinutesPerPatient` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=45 ;

-- --------------------------------------------------------

--
-- Structure de la table `wdidata`
--

CREATE TABLE IF NOT EXISTS `wdidata` (
  `Country_Name` varchar(25) NOT NULL,
  `2016` int(11) NOT NULL,
  `2015` int(11) NOT NULL,
  `2014` int(11) NOT NULL,
  `2013` int(11) NOT NULL,
  `2012` int(11) NOT NULL,
  `2011` int(11) NOT NULL,
  `2010` int(11) NOT NULL,
  `2009` int(11) NOT NULL,
  `2008` int(11) NOT NULL,
  `2007` int(11) NOT NULL,
  `2006` int(11) NOT NULL,
  `2005` int(11) NOT NULL,
  `2004` int(11) NOT NULL,
  `2003` int(11) NOT NULL,
  `2002` int(11) NOT NULL,
  `2001` int(11) NOT NULL,
  `2000` int(11) NOT NULL,
  `Country_Code` varchar(10) NOT NULL,
  `Indicator_Name` varchar(25) NOT NULL,
  `Indicator_Code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
