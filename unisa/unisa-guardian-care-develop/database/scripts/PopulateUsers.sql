-- create an in-memory table
DECLARE @TEMP TABLE
(
    [id]              INT NOT NULL,
    [username]        VARCHAR (200)  NOT NULL,
    [password]        VARCHAR (2000) NULL,
    [passwordHash]    VARCHAR (2000) NULL
);

-- set default data
INSERT INTO @TEMP ([id], [username], [password], [passwordHash])
VALUES  (1, 'admin', 'admin', null),
        (2, 'tim', 'the3nchantr', null),
        (3, 'arthur', 'k1ngofth3br1ts', null)

-- upsert default data
SET IDENTITY_INSERT dbo.[User] ON


MERGE dbo.[User] AS target
USING @TEMP AS source
ON (target.[id] = source.[id])

-- update values when id ad username match
WHEN MATCHED AND 
(
	source.[username] <> target.[username]
) 
THEN UPDATE SET 
	[username] = source.[username],
	[password] = source.[password],
	[passwordHash] = source.[passwordHash]

-- insert values when there is no match
WHEN NOT MATCHED THEN
    INSERT ([id], [username], [password], [passwordHash]) 
    VALUES (source.[id], source.[username], source.[password], source.[passwordHash]);

SET IDENTITY_INSERT dbo.[User] OFF

GO