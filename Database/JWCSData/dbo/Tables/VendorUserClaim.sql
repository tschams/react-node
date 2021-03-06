﻿CREATE TABLE [dbo].[VendorUserClaim](
	[UserId] INT NOT NULL,
	[ClaimId] INT NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[VendorUserClaim]  WITH CHECK ADD  CONSTRAINT [FK_VendorUserClaim_ClaimId] FOREIGN KEY([ClaimId])
REFERENCES [dbo].[VendorAuthClaim] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[VendorUserClaim] CHECK CONSTRAINT [FK_VendorUserClaim_ClaimId]
GO
ALTER TABLE [dbo].[VendorUserClaim]  WITH CHECK ADD  CONSTRAINT [FK_VendorUserClaim_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[VendorUser] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[VendorUserClaim] CHECK CONSTRAINT [FK_VendorUserClaim_UserId]
GO
ALTER TABLE [dbo].[VendorUserClaim] ADD  CONSTRAINT [PK_VendorUserClaim] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[ClaimId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_VendorUserClaim_ClaimId] ON [dbo].[VendorUserClaim]
(
	[ClaimId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]