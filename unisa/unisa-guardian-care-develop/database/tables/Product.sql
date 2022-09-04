CREATE TABLE [dbo].[Product] (
    [id]              INT IDENTITY (1, 1) NOT NULL,
    [name]            VARCHAR (200)  NOT NULL,
    [description]     VARCHAR (MAX) NULL,
    [amount]          INT NOT NULL DEFAULT 0,
    [isContactSales]  BIT NOT NULL,
    [isActive]        BIT NOT NULL,
    [isBestValue]     BIT NOT NULL DEFAULT 0,

    CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([Id] ASC)
);
