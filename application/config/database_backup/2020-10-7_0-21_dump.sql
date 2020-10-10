# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: issues
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `issues` (
  `iid` varchar(36) NOT NULL,
  `issues` varchar(255) DEFAULT NULL,
  `pid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`iid`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: links
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `links` (
  `lid` varchar(36) NOT NULL,
  `links` varchar(255) DEFAULT NULL,
  `pid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`lid`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: origin
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `origin` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`oid`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = latin1;
# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: posts
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `posts` (
  `pid` varchar(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `jtitle` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `details` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tags
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tags` (
  `tgid` varchar(36) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `pid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`tgid`),
  KEY `pid` (`pid`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `posts` (`pid`),
  CONSTRAINT `tags_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `posts` (`pid`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;
# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tsftypes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tsftypes` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tid`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: issues
# ------------------------------------------------------------

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: links
# ------------------------------------------------------------

INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '00237ee2-3922-4806-b1ef-9fc46d0c8cc7',
    'https://www.amazon.com',
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '0dded59a-8a47-453d-a0e2-b610abe5fb18',
    'nintendo.com',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '183210ff-82d5-4a85-9a40-6645ac2e99c7',
    'www.a.com',
    'cc3098b5-3290-4299-990f-dbd40649b9c4'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '499cb710-2ce0-4c8d-a7eb-a3594131b0c3',
    'www.book.com/1984',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '4cf93b68-d6a0-44da-a378-b8c7e46353f4',
    'https://www.google.com',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '611f3fb5-f634-4720-8c44-1f5e61916b78',
    'https://www.nintendo.com',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '72048f00-8fcc-4b78-b5d2-be913f01fa7d',
    'sony.com',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '7712e12f-910a-49e2-a0d1-de853fc34dc9',
    'www.be.com/buy',
    '4f9272ae-0634-46ad-9817-da4e115b362e'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '98d54c8c-bc9e-4ebd-84ce-0b1237959f56',
    'www.ask.com',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    '9d4419d8-5e35-49f6-a0e5-700d3e0bf42c',
    'www.buy.com/Book/1984',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    'a29be5b0-3120-470c-aaf5-8d55b60e4726',
    'https://www.pizzahut.com',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    'cf1a7773-bb9e-421b-a50a-1153d3d68939',
    'www.mangadex.org',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `links` (`lid`, `links`, `pid`)
VALUES
  (
    'f19825c4-e08b-4b09-b5fa-5992e7e92cb7',
    'www.help.com',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
# ------------------------------------------------------------
# DATA DUMP FOR TABLE: origin
# ------------------------------------------------------------

INSERT INTO
  `origin` (`oid`, `name`)
VALUES
  (1, 'Manga');
INSERT INTO
  `origin` (`oid`, `name`)
VALUES
  (2, 'Doujinshi');
INSERT INTO
  `origin` (`oid`, `name`)
VALUES
  (3, 'Western');
INSERT INTO
  `origin` (`oid`, `name`)
VALUES
  (5, 'novel');
INSERT INTO
  `origin` (`oid`, `name`)
VALUES
  (6, 'Other');
# ------------------------------------------------------------
# DATA DUMP FOR TABLE: posts
# ------------------------------------------------------------

INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    '18d83cc0-2aab-478d-9147-497b887c621f',
    'Girl in dress',
    'This Hep/日語の表記体系',
    '日本語の表記体系',
    'A girl with a dress.',
    'Year: 1984\r\nMagazine: HGT',
    'Other',
    '1601163240016_04_character_full_angela_2d.png',
    '1601163240019_71gFEoE-MHL._AC_SL1500_.jpg',
    1,
    '2020-08-26 16:34:00',
    NULL
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    '4f9272ae-0634-46ad-9817-da4e115b362e',
    'to be you',
    'This Sucks/本の記体系',
    '語の表記体系',
    'I want.',
    'Year: 2010',
    'Other',
    '1601169066213_2B_Hotaru.jpg',
    '1601169066216_2B.png',
    1,
    '2020-08-26 18:11:06',
    NULL
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    '65dcad39-8ebc-409d-bffb-eeb34766b879',
    'Fashion Girl',
    'Themes',
    '語の表記',
    'A girl that likes fashion.',
    'Published on 1990.',
    'Other',
    '1601259286418_tumblr_a6ceb5219422bcbe22ea838c60b63fb2_2640d5af_1280.jpg',
    '1601259286424_tumblr_ou987jMtA81qa94xto1_1280.png',
    1,
    '2020-09-27 19:14:46',
    'Manga'
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6',
    'The Monster Within',
    'Roberto Aguilar',
    'NULL',
    'A boy becomes a monster girl.',
    'Published on December 2007 by Root Lou.',
    'Transformation',
    '1601778941211_31-ark_t01a.png',
    '1601184919966_Berserkerarc_extra.png',
    1,
    '2020-09-26 22:35:20',
    'Manga'
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    'c166de8c-d6e1-405a-895b-c3e597f88dae',
    '1984',
    'This Help/日語の表記',
    '日',
    'A book about books.',
    'Published on 1972 by The Book Fundation.',
    'Other',
    '1601167665515_Alice_casual_2.png',
    '1601167665520_Alice_casual.png',
    1,
    '2020-08-26 17:47:45',
    NULL
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    'cc3098b5-3290-4299-990f-dbd40649b9c4',
    'a',
    'This Help/日語の表記',
    '本',
    'A book.',
    'Year: 2020',
    'Other',
    '1601169162815___homura_xenoblade_and_xenoblade_2_drawn_by_saitou_masatsugu__sample-f2472da7290a7be6f735424aee9c56d8.jpg',
    '1601169162820___homura_xenoblade_and_xenoblade_2_drawn_by_athenawyrm__5037cc93889e211f508546c92c173fb5.jpg',
    1,
    '2020-09-26 18:12:42',
    NULL
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    'd72e28dd-d054-452b-b833-92b2f1d67261',
    'Girl',
    'This/日本語の表記体系',
    '日本語の表記体系',
    'A young female human.',
    'Year: 1998.\r\nPublisher: Square.',
    'Other',
    '1601779280374_05_character_full_riesz_2d.png',
    '1601779280377_05_character_full_riesz_3d_class_01_amazon.png',
    0,
    '2020-09-26 14:30:35',
    NULL
  );
INSERT INTO
  `posts` (
    `pid`,
    `title`,
    `author`,
    `jtitle`,
    `description`,
    `details`,
    `type`,
    `cover`,
    `image`,
    `status`,
    `date`,
    `origin`
  )
VALUES
  (
    'ec2ecb52-322d-4204-8abb-8789d056f1a4',
    'Lab Coat Girl',
    'This/日本語の表記体系',
    '日本語の表記体系',
    'A girl wears a lab coat',
    'Year: 2013\r\nMagazine: X',
    'Other',
    '1601085568993_07_character_full_belladonna_2d.png',
    '1601085569002_07_character_full_belladonna_3d.png',
    1,
    '2020-09-26 14:32:35',
    NULL
  );
# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tags
# ------------------------------------------------------------

INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '0453f18f-d859-46cf-a2d5-a9f612d6842c',
    'girl',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '3151ecb7-021f-4d62-b96d-a91161308a59',
    'transform',
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '31c7617c-e369-48a8-972e-c82644c5be31',
    'hell',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '35038532-d438-49eb-a929-d29da8f8fc45',
    'you',
    '4f9272ae-0634-46ad-9817-da4e115b362e'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '36f85477-c421-47e8-bd3e-6b249da1f4ed',
    'girl',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '3d161bc0-cc23-4489-858b-32e2d5ba0873',
    'be',
    '4f9272ae-0634-46ad-9817-da4e115b362e'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '5283bb94-0692-4822-aabe-f70a09bfea59',
    'girl',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '5f411a8a-5e60-4c10-ac5b-2774e6dc516a',
    'help',
    'cc3098b5-3290-4299-990f-dbd40649b9c4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '60300cfb-ddf2-45d8-b44b-f5cee84aafea',
    'book',
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '6c57eec3-5e84-4380-bf53-f9c02b7115c9',
    '10/10',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '778edec6-3ac7-4333-98ae-0a2b66b1276f',
    'illustrations',
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '7978bc41-81fa-406a-bab7-94441df4b1f1',
    'high heels',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '7f247016-f6ee-4900-8c2c-cc1e4a32b601',
    'dress',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '8109d9ef-92ea-45c7-b05f-6a3a70c90a93',
    'xd',
    '4f9272ae-0634-46ad-9817-da4e115b362e'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '8961f814-2a17-4b8e-aadb-3ae756627781',
    'coat',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    '9a23ad88-b58d-49fc-ba02-c7762c302905',
    'dress',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'a2628549-89a2-4367-ade3-7b92eb05466a',
    'book',
    'cc3098b5-3290-4299-990f-dbd40649b9c4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'ac607937-3e81-462d-824a-33118ed19464',
    'future',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'b7f9e753-4deb-4f5c-84b6-358900945b58',
    'dystopia',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'bb1c43e0-e671-40f4-b967-4028eab40863',
    'book',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'bbd84307-f131-49a4-aa90-e362bf64ac5a',
    'young',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'bcb61a6e-a054-4906-b760-e40f8a1ac67a',
    'human',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'bd0503b6-a232-4aaf-b9d7-0f6f6adb51f7',
    'Girl',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'c2105f23-e8ba-4747-8e5b-c498e6e9e97b',
    'normie',
    'cc3098b5-3290-4299-990f-dbd40649b9c4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'c670bb5a-9537-463e-9640-143607f3cd43',
    'lab',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'd1a25f21-d4dc-4058-b65e-fc20893674f0',
    'love',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'dae973ac-a711-4d43-a09f-3cb25dcf9f86',
    'book',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'df5f7a2f-c388-498a-ba1d-b9d6ca8f7e89',
    'lol',
    '4f9272ae-0634-46ad-9817-da4e115b362e'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'e505c82b-17f9-4f2c-9bcb-a86f1b452eec',
    'young',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'e82518f0-f85d-4ec8-b32b-9dc54097f485',
    'fashion',
    '65dcad39-8ebc-409d-bffb-eeb34766b879'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'f25888e9-73b6-4e2d-a4f6-d30d435dbe11',
    'utopia',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'f3b23e19-5e24-472f-8e0e-ca378663b667',
    'monster girl',
    '81386afb-1eac-4c7d-bd40-a1f83e0914a6'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'f51cc031-d2ef-44fe-81c3-cefff4cde1c1',
    'hello',
    '18d83cc0-2aab-478d-9147-497b887c621f'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'f687fbcb-3b9d-4601-884e-9d069f740cc3',
    'human',
    'd72e28dd-d054-452b-b833-92b2f1d67261'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'fc70baf4-e9f0-44aa-b6a5-0cddca17adce',
    '1984',
    'c166de8c-d6e1-405a-895b-c3e597f88dae'
  );
INSERT INTO
  `tags` (`tgid`, `tags`, `pid`)
VALUES
  (
    'fd45e43e-227e-446f-aa55-980fe60ffd3e',
    'lab coat',
    'ec2ecb52-322d-4204-8abb-8789d056f1a4'
  );
# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tsftypes
# ------------------------------------------------------------

INSERT INTO
  `tsftypes` (`tid`, `name`)
VALUES
  (1, 'Bodyswap');
INSERT INTO
  `tsftypes` (`tid`, `name`)
VALUES
  (2, 'Possession');
INSERT INTO
  `tsftypes` (`tid`, `name`)
VALUES
  (3, 'Transformation');
INSERT INTO
  `tsftypes` (`tid`, `name`)
VALUES
  (5, 'Skinsuit');
INSERT INTO
  `tsftypes` (`tid`, `name`)
VALUES
  (6, 'Other');