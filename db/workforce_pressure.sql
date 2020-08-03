-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2020 at 03:32 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workforce_pressure`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_stats`
--

CREATE TABLE `activity_stats` (
  `id` int(11) NOT NULL,
  `facilityCode` varchar(50) NOT NULL,
  `year` varchar(20) NOT NULL,
  `activityCode` varchar(50) NOT NULL,
  `cadreCode` varchar(25) NOT NULL,
  `caseCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `activity_stats`
--

INSERT INTO `activity_stats` (`id`, `facilityCode`, `year`, `activityCode`, `cadreCode`, `caseCount`) VALUES
(9, 'djEJoDxWda6', '2020', '157a54fc-a76a-475b-8684-a8bf376654d4', 'wmiff88', 35),
(10, 'djEJoDxWda6', '2020', '19453745-8586-481f-aca2-04896dc7317e', 'wmiff88', 16),
(11, 'djEJoDxWda6', '2020', '29c9494c-3743-49a0-a5ad-3f6cf4d245fc', 'wmiff88', 71),
(12, 'djEJoDxWda6', '2020', '471ac1e9-608a-4b96-9ac9-a5906a2c70e5', 'wmiff88', 1533),
(13, 'djEJoDxWda6', '2020', '5956a3fe-a109-472a-91e5-d910f2ab6632', 'wmiff88', 6132),
(14, 'djEJoDxWda6', '2020', 'ae1700ff-67c1-47cd-a3db-13dfe27c9a55', 'wmiff88', 2235),
(15, 'djEJoDxWda6', '2020', 'c832ef65-ae15-48d6-8a13-6d4816493a9c', 'wmiff88', 468),
(16, 'djEJoDxWda6', '2020', 'e32ebd3d-8158-4379-b2c1-096e7d6f9991', 'wmiff88', 2703),
(17, 'djEJoDxWda6', '2020', 'f68b386d-a559-46c9-8796-d5edc2d8a610', 'wmiff88', 673),
(18, 'djEJoDxWda6', '2020', '296af4b9-cc56-46ac-a8ab-be2f583ea57a', 'wmiff88', 5415),
(19, 'djEJoDxWda6', '2020', '5d789a41-a11b-4f0c-b4e0-0c19351c2a06', 'wmiff88', 60);

-- --------------------------------------------------------

--
-- Table structure for table `archive`
--

CREATE TABLE `archive` (
  `id` int(11) NOT NULL,
  `cadreId` int(11) NOT NULL,
  `needed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `parameter` varchar(50) NOT NULL,
  `value` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `country_id`, `parameter`, `value`) VALUES
(8, 52, 'COUNTRY_PUBLIC_HOLIDAYS', '9');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `id` int(11) NOT NULL,
  `code` varchar(25) NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `holidays` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `code`, `name_fr`, `name_en`, `holidays`) VALUES
(1, 'AF', '', 'Afghanistan', 20),
(2, 'AX', '', 'Åland Islands', 12),
(3, 'AL', '', 'Albania', 0),
(4, 'DZ', '', 'Algeria', 0),
(5, 'AS', '', 'American Samoa', 0),
(6, 'AD', '', 'Andorra', 0),
(7, 'AO', '', 'Angola', 0),
(8, 'AI', '', 'Anguilla', 0),
(9, 'AQ', '', 'Antarctica', 0),
(10, 'AG', '', 'Antigua and Barbuda', 0),
(11, 'AR', '', 'Argentina', 0),
(12, 'AM', '', 'Armenia', 0),
(13, 'AW', '', 'Aruba', 0),
(14, 'AU', '', 'Australia', 0),
(15, 'AT', '', 'Austria', 0),
(16, 'AZ', '', 'Azerbaijan', 0),
(17, 'BH', '', 'Bahrain', 0),
(18, 'BS', '', 'Bahamas', 0),
(19, 'BD', '', 'Bangladesh', 0),
(20, 'BB', '', 'Barbados', 0),
(21, 'BY', '', 'Belarus', 0),
(22, 'BE', '', 'Belgium', 0),
(23, 'BZ', '', 'Belize', 0),
(24, 'BJ', '', 'Benin', 0),
(25, 'BM', '', 'Bermuda', 0),
(26, 'BT', '', 'Bhutan', 0),
(27, 'BO', '', 'Bolivia, Plurinational State of', 0),
(28, 'BQ', '', 'Bonaire, Sint Eustatius and Saba', 0),
(29, 'BA', '', 'Bosnia and Herzegovina', 0),
(30, 'BW', '', 'Botswana', 0),
(31, 'BV', '', 'Bouvet Island', 0),
(32, 'BR', '', 'Brazil', 0),
(33, 'IO', '', 'British Indian Ocean Territory', 0),
(34, 'BN', '', 'Brunei Darussalam', 0),
(35, 'BG', '', 'Bulgaria', 0),
(36, 'BF', '', 'Burkina Faso', 0),
(37, 'BI', '', 'Burundi', 0),
(38, 'KH', '', 'Cambodia', 0),
(39, 'CM', '', 'Cameroon', 0),
(40, 'CA', '', 'Canada', 0),
(41, 'CV', '', 'Cape Verde', 0),
(42, 'KY', '', 'Cayman Islands', 0),
(43, 'CF', '', 'Central African Republic', 0),
(44, 'TD', '', 'Chad', 0),
(45, 'CL', '', 'Chile', 0),
(46, 'CN', '', 'China', 0),
(47, 'CX', '', 'Christmas Island', 0),
(48, 'CC', '', 'Cocos (Keeling) Islands', 0),
(49, 'CO', '', 'Colombia', 0),
(50, 'KM', '', 'Comoros', 0),
(51, 'CG', '', 'Congo', 0),
(52, 'CD', '', 'Congo, the Democratic Republic of the', 0),
(53, 'CK', '', 'Cook Islands', 0),
(54, 'CR', '', 'Costa Rica', 0),
(55, 'CI', '', 'Côte d\'Ivoire', 0),
(56, 'HR', '', 'Croatia', 0),
(57, 'CU', '', 'Cuba', 0),
(58, 'CW', '', 'Curaçao', 0),
(59, 'CY', '', 'Cyprus', 0),
(60, 'CZ', '', 'Czech Republic', 0),
(61, 'DK', '', 'Denmark', 0),
(62, 'DJ', '', 'Djibouti', 0),
(63, 'DM', '', 'Dominica', 0),
(64, 'DO', '', 'Dominican Republic', 0),
(65, 'EC', '', 'Ecuador', 0),
(66, 'EG', '', 'Egypt', 0),
(67, 'SV', '', 'El Salvador', 0),
(68, 'GQ', '', 'Equatorial Guinea', 0),
(69, 'ER', '', 'Eritrea', 0),
(70, 'EE', '', 'Estonia', 0),
(71, 'ET', '', 'Ethiopia', 0),
(72, 'FK', '', 'Falkland Islands (Malvinas)', 0),
(73, 'FO', '', 'Faroe Islands', 0),
(74, 'FJ', '', 'Fiji', 0),
(75, 'FI', '', 'Finland', 0),
(76, 'FR', '', 'France', 0),
(77, 'GF', '', 'French Guiana', 0),
(78, 'PF', '', 'French Polynesia', 0),
(79, 'TF', '', 'French Southern Territories', 0),
(80, 'GA', '', 'Gabon', 0),
(81, 'GM', '', 'Gambia', 0),
(82, 'GE', '', 'Georgia', 0),
(83, 'DE', '', 'Germany', 0),
(84, 'GH', '', 'Ghana', 0),
(85, 'GI', '', 'Gibraltar', 0),
(86, 'GR', '', 'Greece', 0),
(87, 'GL', '', 'Greenland', 0),
(88, 'GD', '', 'Grenada', 0),
(89, 'GP', '', 'Guadeloupe', 0),
(90, 'GU', '', 'Guam', 0),
(91, 'GT', '', 'Guatemala', 0),
(92, 'GG', '', 'Guernsey', 0),
(93, 'GN', '', 'Guinea', 0),
(94, 'GW', '', 'Guinea-Bissau', 0),
(95, 'GY', '', 'Guyana', 0),
(96, 'HT', '', 'Haiti', 0),
(97, 'HM', '', 'Heard Island and McDonald Islands', 0),
(98, 'VA', '', 'Holy See (Vatican City State)', 0),
(99, 'HN', '', 'Honduras', 0),
(100, 'HK', '', 'Hong Kong', 0),
(101, 'HU', '', 'Hungary', 0),
(102, 'IS', '', 'Iceland', 0),
(103, 'IN', '', 'India', 0),
(104, 'ID', '', 'Indonesia', 0),
(105, 'IR', '', 'Iran, Islamic Republic of', 0),
(106, 'IQ', '', 'Iraq', 0),
(107, 'IE', '', 'Ireland', 0),
(108, 'IM', '', 'Isle of Man', 0),
(109, 'IL', '', 'Israel', 0),
(110, 'IT', '', 'Italy', 0),
(111, 'JM', '', 'Jamaica', 0),
(112, 'JP', '', 'Japan', 0),
(113, 'JE', '', 'Jersey', 0),
(114, 'JO', '', 'Jordan', 0),
(115, 'KZ', '', 'Kazakhstan', 0),
(116, 'KE', '', 'Kenya', 0),
(117, 'KI', '', 'Kiribati', 0),
(118, 'KP', '', 'Korea, Democratic People\'s Republic of', 0),
(119, 'KR', '', 'Korea, Republic of', 0),
(120, 'KW', '', 'Kuwait', 0),
(121, 'KG', '', 'Kyrgyzstan', 0),
(122, 'LA', '', 'Lao People\'s Democratic Republic', 0),
(123, 'LV', '', 'Latvia', 0),
(124, 'LB', '', 'Lebanon', 0),
(125, 'LS', '', 'Lesotho', 0),
(126, 'LR', '', 'Liberia', 0),
(127, 'LY', '', 'Libya', 0),
(128, 'LI', '', 'Liechtenstein', 0),
(129, 'LT', '', 'Lithuania', 0),
(130, 'LU', '', 'Luxembourg', 0),
(131, 'MO', '', 'Macao', 0),
(132, 'MK', '', 'Macedonia, the Former Yugoslav Republic of', 0),
(133, 'MG', '', 'Madagascar', 0),
(134, 'MW', '', 'Malawi', 0),
(135, 'MY', '', 'Malaysia', 0),
(136, 'MV', '', 'Maldives', 0),
(137, 'ML', '', 'Mali', 0),
(138, 'MT', '', 'Malta', 0),
(139, 'MH', '', 'Marshall Islands', 0),
(140, 'MQ', '', 'Martinique', 0),
(141, 'MR', '', 'Mauritania', 0),
(142, 'MU', '', 'Mauritius', 0),
(143, 'YT', '', 'Mayotte', 0),
(144, 'MX', '', 'Mexico', 0),
(145, 'FM', '', 'Micronesia, Federated States of', 0),
(146, 'MD', '', 'Moldova, Republic of', 0),
(147, 'MC', '', 'Monaco', 0),
(148, 'MN', '', 'Mongolia', 0),
(149, 'ME', '', 'Montenegro', 0),
(150, 'MS', '', 'Montserrat', 0),
(151, 'MA', '', 'Morocco', 0),
(152, 'MZ', '', 'Mozambique', 0),
(153, 'MM', '', 'Myanmar', 0),
(154, 'NA', '', 'Namibia', 0),
(155, 'NR', '', 'Nauru', 0),
(156, 'NP', '', 'Nepal', 0),
(157, 'NL', '', 'Netherlands', 0),
(158, 'NC', '', 'New Caledonia', 0),
(159, 'NZ', '', 'New Zealand', 0),
(160, 'NI', '', 'Nicaragua', 0),
(161, 'NE', '', 'Niger', 0),
(162, 'NG', '', 'Nigeria', 0),
(163, 'NU', '', 'Niue', 0),
(164, 'NF', '', 'Norfolk Island', 0),
(165, 'MP', '', 'Northern Mariana Islands', 0),
(166, 'NO', '', 'Norway', 0),
(167, 'OM', '', 'Oman', 0),
(168, 'PK', '', 'Pakistan', 0),
(169, 'PW', '', 'Palau', 0),
(170, 'PS', '', 'Palestine, State of', 0),
(171, 'PA', '', 'Panama', 0),
(172, 'PG', '', 'Papua New Guinea', 0),
(173, 'PY', '', 'Paraguay', 0),
(174, 'PE', '', 'Peru', 0),
(175, 'PH', '', 'Philippines', 0),
(176, 'PN', '', 'Pitcairn', 0),
(177, 'PL', '', 'Poland', 0),
(178, 'PT', '', 'Portugal', 0),
(179, 'PR', '', 'Puerto Rico', 0),
(180, 'QA', '', 'Qatar', 0),
(181, 'RE', '', 'Réunion', 0),
(182, 'RO', '', 'Romania', 0),
(183, 'RU', '', 'Russian Federation', 0),
(184, 'RW', '', 'Rwanda', 0),
(185, 'BL', '', 'Saint Barthélemy', 0),
(186, 'SH', '', 'Saint Helena, Ascension and Tristan da Cunha', 0),
(187, 'KN', '', 'Saint Kitts and Nevis', 0),
(188, 'LC', '', 'Saint Lucia', 0),
(189, 'MF', '', 'Saint Martin (French part)', 0),
(190, 'PM', '', 'Saint Pierre and Miquelon', 0),
(191, 'VC', '', 'Saint Vincent and the Grenadines', 0),
(192, 'WS', '', 'Samoa', 0),
(193, 'SM', '', 'San Marino', 0),
(194, 'ST', '', 'Sao Tome and Principe', 0),
(195, 'SA', '', 'Saudi Arabia', 0),
(196, 'SN', '', 'Senegal', 0),
(197, 'RS', '', 'Serbia', 0),
(198, 'SC', '', 'Seychelles', 0),
(199, 'SL', '', 'Sierra Leone', 0),
(200, 'SG', '', 'Singapore', 0),
(201, 'SX', '', 'Sint Maarten (Dutch part)', 0),
(202, 'SK', '', 'Slovakia', 0),
(203, 'SI', '', 'Slovenia', 0),
(204, 'SB', '', 'Solomon Islands', 0),
(205, 'SO', '', 'Somalia', 0),
(206, 'ZA', '', 'South Africa', 0),
(207, 'GS', '', 'South Georgia and the South Sandwich Islands', 0),
(208, 'SS', '', 'South Sudan', 0),
(209, 'ES', '', 'Spain', 0),
(210, 'LK', '', 'Sri Lanka', 0),
(211, 'SD', '', 'Sudan', 0),
(212, 'SR', '', 'Suriname', 0),
(213, 'SJ', '', 'Svalbard and Jan Mayen', 0),
(214, 'SZ', '', 'Swaziland', 0),
(215, 'SE', '', 'Sweden', 0),
(216, 'CH', '', 'Switzerland', 0),
(217, 'SY', '', 'Syrian Arab Republic', 0),
(218, 'TW', '', 'Taiwan, Province of China', 0),
(219, 'TJ', '', 'Tajikistan', 0),
(220, 'TZ', '', 'Tanzania, United Republic of', 0),
(221, 'TH', '', 'Thailand', 0),
(222, 'TL', '', 'Timor-Leste', 0),
(223, 'TG', '', 'Togo', 0),
(224, 'TK', '', 'Tokelau', 0),
(225, 'TO', '', 'Tonga', 0),
(226, 'TT', '', 'Trinidad and Tobago', 0),
(227, 'TN', '', 'Tunisia', 0),
(228, 'TR', '', 'Turkey', 0),
(229, 'TM', '', 'Turkmenistan', 0),
(230, 'TC', '', 'Turks and Caicos Islands', 0),
(231, 'TV', '', 'Tuvalu', 0),
(232, 'UG', '', 'Uganda', 0),
(233, 'UA', '', 'Ukraine', 0),
(234, 'AE', '', 'United Arab Emirates', 0),
(235, 'GB', '', 'United Kingdom', 0),
(236, 'US', '', 'United States', 0),
(237, 'UM', '', 'United States Minor Outlying Islands', 0),
(238, 'UY', '', 'Uruguay', 0),
(239, 'UZ', '', 'Uzbekistan', 0),
(240, 'VU', '', 'Vanuatu', 0),
(241, 'VE', '', 'Venezuela, Bolivarian Republic of', 0),
(242, 'VN', '', 'Viet Nam', 0),
(243, 'VG', '', 'Virgin Islands, British', 0),
(244, 'VI', '', 'Virgin Islands, U.S.', 0),
(245, 'WF', '', 'Wallis and Futuna', 0),
(246, 'EH', '', 'Western Sahara', 0),
(247, 'YE', '', 'Yemen', 0),
(248, 'ZM', '', 'Zambia', 0),
(249, 'ZW', '', 'Zimbabwe', 0);

-- --------------------------------------------------------

--
-- Table structure for table `country_treatment`
--

CREATE TABLE `country_treatment` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `countryId` int(11) NOT NULL,
  `cadre_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `treatment_type` enum('SERVICE','ADDITIONAL','INDIVIDUAL') NOT NULL,
  `duration` int(11) NOT NULL,
  `ratio` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `country_treatment`
--

INSERT INTO `country_treatment` (`id`, `code`, `countryId`, `cadre_code`, `name`, `treatment_type`, `duration`, `ratio`) VALUES
(1, '157a54fc-a76a-475b-8684-a8bf376654d4', 52, 'wmiff88', 'Accompagnement des patients référés/Transfert', 'SERVICE', 360, 1),
(2, '19453745-8586-481f-aca2-04896dc7317e', 52, 'wmiff88', 'Section césarienne/Caesarean section', 'SERVICE', 330, 1),
(3, '296af4b9-cc56-46ac-a8ab-be2f583ea57a', 52, 'wmiff88', 'Consultations ambulatoires/consultation', 'SERVICE', 30, 1),
(4, '29c9494c-3743-49a0-a5ad-3f6cf4d245fc', 52, 'wmiff88', 'Chirurgie mineur et Circoncision/Minor operation and male circumcisions', 'SERVICE', 25, 1),
(5, '471ac1e9-608a-4b96-9ac9-a5906a2c70e5', 52, 'wmiff88', 'Patients hautement dépendant/Routine nursing care (high dependent patients)', 'SERVICE', 351, 1),
(6, '5956a3fe-a109-472a-91e5-d910f2ab6632', 52, 'wmiff88', 'Patients autonomes/Routine nursing care (self care patients)', 'SERVICE', 95, 1),
(7, '5d789a41-a11b-4f0c-b4e0-0c19351c2a06', 52, 'wmiff88', 'Consultations aux urgences/Emergency', 'SERVICE', 60, 1),
(8, 'ae1700ff-67c1-47cd-a3db-13dfe27c9a55', 52, 'wmiff88', 'Sortants autorises/guéris/Discharge a patient', 'SERVICE', 24, 1),
(9, 'c832ef65-ae15-48d6-8a13-6d4816493a9c', 52, 'wmiff88', 'Audit de décès/Death: Last office', 'SERVICE', 42, 1),
(10, 'e32ebd3d-8158-4379-b2c1-096e7d6f9991', 52, 'wmiff88', 'Admission de patient/Admit a patient', 'SERVICE', 52, 1),
(11, 'f68b386d-a559-46c9-8796-d5edc2d8a610', 52, 'wmiff88', 'Opération majeure/Major operation', 'SERVICE', 330, 1);

-- --------------------------------------------------------

--
-- Table structure for table `country_treatment_dhis2`
--

CREATE TABLE `country_treatment_dhis2` (
  `id` int(11) NOT NULL,
  `treatment_code` varchar(150) NOT NULL,
  `dhis2_code` varchar(150) NOT NULL,
  `dhis2_dataset` varchar(50) NOT NULL,
  `dhis2_name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `country_treatment_dhis2`
--

INSERT INTO `country_treatment_dhis2` (`id`, `treatment_code`, `dhis2_code`, `dhis2_dataset`, `dhis2_name`) VALUES
(5, '29c9494c-3743-49a0-a5ad-3f6cf4d245fc', 'HpOj9VHOvVt', '', 'Abstinence'),
(6, '29c9494c-3743-49a0-a5ad-3f6cf4d245fc', 'T5eTqtEeqGG', '', 'AMF et Cas Contacts conseillés'),
(7, '157a54fc-a76a-475b-8684-a8bf376654d4', 'wmSFP6I7Crl', '', 'ABC+3TC+EFV'),
(9, '19453745-8586-481f-aca2-04896dc7317e', 'nP77dfk7XKK', '', 'AMF et Cas Contacts ayant retiré les résultats'),
(10, '296af4b9-cc56-46ac-a8ab-be2f583ea57a', 'RcVqkBim8W5', 'NrjKIBdpmNV', 'Cons_NC conseillés');

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `countryId` int(11) NOT NULL,
  `is_default` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dashboard`
--

INSERT INTO `dashboard` (`id`, `name`, `detail`, `countryId`, `is_default`) VALUES
(1, 'My-dashboard', 'My test dashboard -just test', 52, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_items`
--

CREATE TABLE `dashboard_items` (
  `id` int(11) NOT NULL,
  `dashboard_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dashboard_items`
--

INSERT INTO `dashboard_items` (`id`, `dashboard_id`, `item_id`) VALUES
(1, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_old`
--

CREATE TABLE `dashboard_old` (
  `id` int(11) NOT NULL,
  `countryId` int(11) NOT NULL,
  `cadreCode` varchar(25) NOT NULL,
  `facilityCode` varchar(25) NOT NULL,
  `current` float NOT NULL,
  `needed` float NOT NULL,
  `is_default` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `facility`
--

CREATE TABLE `facility` (
  `id` int(11) NOT NULL,
  `countryCode` int(11) NOT NULL,
  `facilityType` int(255) NOT NULL,
  `region` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `code` varchar(25) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `facility`
--

INSERT INTO `facility` (`id`, `countryCode`, `facilityType`, `region`, `district`, `code`, `name`) VALUES
(14246, 52, 8738778, 'Nord-Ubangi', 'Karawa', 'djEJoDxWda6', 'HGR Karawa'),
(14247, 52, 8738778, 'Nord-Ubangi', 'Karawa', 'TsbCLPX5EAd', 'CS Karawa Cité'),
(14248, 52, 8738778, 'Haut-Katanga', 'Lubumbashi', 'ot1gXRKpxiX', 'CS Trinité');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `facilityId` int(11) NOT NULL,
  `cadreId` int(11) NOT NULL,
  `required` int(11) NOT NULL,
  `available` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `results_record`
--

CREATE TABLE `results_record` (
  `id` int(11) NOT NULL,
  `cadreCode` varchar(50) NOT NULL,
  `facilityCode` int(100) NOT NULL,
  `current` double NOT NULL,
  `needed` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `results_record`
--

INSERT INTO `results_record` (`id`, `cadreCode`, `facilityCode`, `current`, `needed`) VALUES
(2, 'wmiff88', 14246, 38, 16.9),
(3, '2908Jjkdh', 14246, 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `facilityCode` varchar(25) NOT NULL,
  `cadreCode` varchar(25) NOT NULL,
  `staffCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `facilityCode`, `cadreCode`, `staffCount`) VALUES
(1, 'djEJoDxWda6', 'wmiff88', 38),
(11, 'djEJoDxWda6', '2908Jjkdh', 4);

-- --------------------------------------------------------

--
-- Table structure for table `std_cadre`
--

CREATE TABLE `std_cadre` (
  `code` varchar(50) NOT NULL,
  `countryId` int(11) NOT NULL,
  `facility_type_id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `work_days` float NOT NULL,
  `work_hours` float NOT NULL,
  `annual_leave` float NOT NULL,
  `sick_leave` float NOT NULL,
  `other_leave` float NOT NULL,
  `admin_task` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `std_cadre`
--

INSERT INTO `std_cadre` (`code`, `countryId`, `facility_type_id`, `name`, `work_days`, `work_hours`, `annual_leave`, `sick_leave`, `other_leave`, `admin_task`) VALUES
('1012hurh', 52, '8738778', 'Lab tech', 5, 8, 0, 0, 0, 10),
('2908Jjkdh', 52, '8738778', 'Medical Doctor', 5, 8, 0, 0, 0, 10),
('code', 52, 'facility type code', 'name', 0, 0, 0, 0, 0, 0),
('osnk9032i', 52, '8738778', 'Wise wife', 5, 8, 0, 0, 0, 10),
('wmiff88', 52, '8738778', 'Nurse', 5.5, 8, 30, 2, 6.2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `std_facility_type`
--

CREATE TABLE `std_facility_type` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `countryId` int(11) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `std_facility_type`
--

INSERT INTO `std_facility_type` (`id`, `code`, `countryId`, `name`) VALUES
(1, '8738778', 52, 'Hôpital général'),
(2, '8738779', 52, 'Centre de santé');

-- --------------------------------------------------------

--
-- Table structure for table `std_treatment`
--

CREATE TABLE `std_treatment` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `cadre_code` varchar(50) NOT NULL,
  `countryId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `treatment_type` enum('SERVICE','ADDITIONAL','INDIVIDUAL') NOT NULL DEFAULT 'SERVICE',
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `std_treatment`
--

INSERT INTO `std_treatment` (`id`, `code`, `cadre_code`, `countryId`, `name`, `treatment_type`, `duration`) VALUES
(1, '157a54fc-a76a-475b-8684-a8bf376654d4', 'wmiff88', 52, 'Transfert', 'SERVICE', 360),
(2, '19453745-8586-481f-aca2-04896dc7317e', 'wmiff88', 52, 'Caesarean section', 'SERVICE', 330),
(3, '296af4b9-cc56-46ac-a8ab-be2f583ea57a', 'wmiff88', 52, 'consultation', 'SERVICE', 30),
(4, '29c9494c-3743-49a0-a5ad-3f6cf4d245fc', 'wmiff88', 52, 'Minor operation and male circumcisions', 'SERVICE', 50),
(5, '471ac1e9-608a-4b96-9ac9-a5906a2c70e5', 'wmiff88', 52, 'Routine nursing care (high dependent patients)', 'SERVICE', 351),
(6, '5956a3fe-a109-472a-91e5-d910f2ab6632', 'wmiff88', 52, 'Routine nursing care (self care patients)', 'SERVICE', 95),
(7, '5d789a41-a11b-4f0c-b4e0-0c19351c2a06', 'wmiff88', 52, 'Emergency', 'SERVICE', 60),
(8, 'ae1700ff-67c1-47cd-a3db-13dfe27c9a55', 'wmiff88', 52, 'Discharge a patient', 'SERVICE', 24),
(9, 'c832ef65-ae15-48d6-8a13-6d4816493a9c', 'wmiff88', 52, 'Death: Last office', 'SERVICE', 42),
(10, 'e32ebd3d-8158-4379-b2c1-096e7d6f9991', 'wmiff88', 52, 'Admit a patient', 'SERVICE', 52),
(11, 'f68b386d-a559-46c9-8796-d5edc2d8a610', 'wmiff88', 52, 'Major operation', 'SERVICE', 165);

-- --------------------------------------------------------

--
-- Table structure for table `system_languages`
--

CREATE TABLE `system_languages` (
  `name` varchar(50) NOT NULL,
  `code` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `system_languages`
--

INSERT INTO `system_languages` (`name`, `code`) VALUES
('English', 'en'),
('Français', 'fr');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` varchar(25) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `countryId` int(11) NOT NULL,
  `languageCode` varchar(10) NOT NULL DEFAULT 'en',
  `roleId` int(11) NOT NULL,
  `last_login` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `name`, `email`, `password`, `countryId`, `languageCode`, `roleId`, `last_login`) VALUES
(1, 'pierre', 'pierre kasongo', 'pierrekasongo88@gmail.com', '$2a$10$TPXZEHRG8j9ioWWHDnvcROjxU647xA4CrPQs.itnvK3H.mT2V9QPq', 52, 'en', 1, '2020-08-03 02:07:58'),
(2, 'admin-sa', 'Admin saudia', 'adm@gmail.com', '$2a$10$CL5ZJTIVpW7DYy.5mZ2GPuFD/QEp367IAqmfIsBehgQmUE5MjJhLq', 52, 'en', 2, '2020-08-03 03:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `name`) VALUES
(1, 'super_user'),
(2, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `years`
--

CREATE TABLE `years` (
  `id` int(11) NOT NULL,
  `year` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `years`
--

INSERT INTO `years` (`id`, `year`) VALUES
(1, '2020');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_stats`
--
ALTER TABLE `activity_stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `archive`
--
ALTER TABLE `archive`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country_treatment`
--
ALTER TABLE `country_treatment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country_treatment_dhis2`
--
ALTER TABLE `country_treatment_dhis2`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dashboard_items`
--
ALTER TABLE `dashboard_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dashboard_old`
--
ALTER TABLE `dashboard_old`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facility`
--
ALTER TABLE `facility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_record`
--
ALTER TABLE `results_record`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `std_cadre`
--
ALTER TABLE `std_cadre`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `std_facility_type`
--
ALTER TABLE `std_facility_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `std_treatment`
--
ALTER TABLE `std_treatment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_languages`
--
ALTER TABLE `system_languages`
  ADD PRIMARY KEY (`code`),
  ADD KEY `code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `years`
--
ALTER TABLE `years`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_stats`
--
ALTER TABLE `activity_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `archive`
--
ALTER TABLE `archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT for table `country_treatment`
--
ALTER TABLE `country_treatment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `country_treatment_dhis2`
--
ALTER TABLE `country_treatment_dhis2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dashboard_items`
--
ALTER TABLE `dashboard_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dashboard_old`
--
ALTER TABLE `dashboard_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14250;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results_record`
--
ALTER TABLE `results_record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `std_facility_type`
--
ALTER TABLE `std_facility_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `std_treatment`
--
ALTER TABLE `std_treatment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `years`
--
ALTER TABLE `years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
