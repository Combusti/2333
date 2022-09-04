CREATE TABLE [dbo].[User] (
    [id]              INT IDENTITY (1, 1) NOT NULL,
    [username]        VARCHAR (200)  NOT NULL,
    [password]        VARCHAR (2000) NULL,
    [passwordHash]    VARCHAR (2000) NULL

    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC)
);
