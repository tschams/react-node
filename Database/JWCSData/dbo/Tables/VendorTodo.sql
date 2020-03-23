CREATE TABLE [dbo].[VendorTodo]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [VendorId] INT NOT NULL, 
    [CreatedByVendorUserId] INT NOT NULL, 
    [UpdatedByVendorUserId] INT NOT NULL,
    [Done] BIT NOT NULL, 
    [Title] NVARCHAR(MAX) NOT NULL, 
    [ConcurrencyStamp] NVARCHAR(MAX) NULL, 
    CONSTRAINT [FK_VendorTodo_Vendor] FOREIGN KEY ([VendorId]) REFERENCES [Vendor]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_VendorTodo_CreatedBy] FOREIGN KEY ([CreatedByVendorUserId]) REFERENCES [Vendor]([Id]),
    CONSTRAINT [FK_VendorTodo_UpdatedBy] FOREIGN KEY ([UpdatedByVendorUserId]) REFERENCES [Vendor]([Id])
)
GO
CREATE INDEX [IX_VendorTodo_Vendor] ON [dbo].[VendorTodo] ([VendorId])
