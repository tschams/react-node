CREATE TABLE [dbo].[Vendor]
(
	[Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY, 
    [Name] NVARCHAR(75) NOT NULL
)

GO

CREATE INDEX [IX_Vendor_Name] ON [dbo].[Vendor] ([Name]);
