-- create an in-memory table
DECLARE @TEMP TABLE
(
    [id]              INT NOT NULL,
    [name]            VARCHAR (200) NOT NULL,
    [description]     VARCHAR (MAX) NULL,
    [amount]          INT NOT NULL DEFAULT 0,
    [isContactSales]  BIT NOT NULL,
    [isActive]        BIT NOT NULL,
    [isBestValue]     BIT NOT NULL
);

-- set default data
INSERT INTO @TEMP ([id], [name], [description], [amount], [isContactSales], [isActive], [isBestValue])
VALUES  (100, 'Free', 'Get started for free. No strings attached.', 0, 0, 1, 0),
        (200, 'Pro', 'Take your health seriously? For individuals who want to be the best version of themselves.', 1900, 0, 0, 0),
        (201, 'Pro', 'Take your health seriously? For individuals who want to be the best version of themselves.', 2900, 0, 1, 0),
        (300, 'Squad', 'Part of a team or a club? Work together and compete with each other to realise your potential, together.', 3900, 0, 0, 1),
        (301, 'Squad', 'Part of a team or a club? Work together and compete with each other to realise your potential, together.', 4900, 0, 1, 1),
        (400, 'Organisation', 'For businesses large and small who care about the humans that they employ.', 0, 1, 1, 0)

-- upsert default data
SET IDENTITY_INSERT dbo.[Product] ON

MERGE dbo.[Product] AS target
USING @TEMP AS source
ON (target.[id] = source.[id])

-- update values when id ad name match
WHEN MATCHED
THEN UPDATE SET 
	[name] = source.[name],
	[amount] = source.[amount],
	[description] = source.[description],
	[isContactSales] = source.[isContactSales],
    [isActive] = source.[isActive],
    [isBestValue] = source.[isBestValue]

-- insert values when there is no match
WHEN NOT MATCHED THEN
    INSERT ([id], [name], [description], [amount], [isContactSales], [isActive], [isBestValue]) 
    VALUES (source.[id], source.[name], source.[description], source.[amount], source.[isContactSales], source.[isActive], source.[isBestValue]);

SET IDENTITY_INSERT dbo.[Product] OFF

GO