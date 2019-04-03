-- Copyright (c) 2019, UW Medicine Research IT, University of Washington
-- Developed by Nic Dobbins and Cliff Spital, CRIO Sean Mooney
-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at http://mozilla.org/MPL/2.0/.
﻿USE [LeafDB]
GO
/****** Object:  StoredProcedure [adm].[sp_UpdateConceptSqlSet]    Script Date: 4/3/19 1:31:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =======================================
-- Author:      Cliff Spital
-- Create date: 2019/8/3
-- Description: Updates an app.ConceptSqlSet.
-- =======================================
CREATE PROCEDURE [adm].[sp_UpdateConceptSqlSet]
    @id int,
    @isEncounterBased bit,
    @isEventBased bit,
    @sqlSetFrom nvarchar(1000),
    @sqlFieldDate nvarchar(1000),
    @sqlFieldEventId nvarchar(400),
    @user auth.[User]
AS
BEGIN
    SET NOCOUNT ON

    IF (@id IS NULL OR @id = 0)
        THROW 70400, N'ConceptSqlSet.Id is required.', 1;
    
    IF (@sqlSetFrom IS NULL OR LEN(@sqlSetFrom) = 0)
        THROW 70400, N'ConceptSqlSet.SqlSetFrom is required.', 1;

    UPDATE app.ConceptSqlSet
    SET
        IsEncounterBased = @isEncounterBased,
        IsEventBased = @isEventBased,
        SqlSetFrom = @sqlSetFrom,
        SqlFieldDate = @sqlFieldDate,
        SqlFieldEventId = @sqlFieldEventId
    OUTPUT inserted.Id, inserted.IsEncounterBased, inserted.IsEventBased, inserted.SqlSetFrom, inserted.SqlFieldDate, inserted.SqlFieldEventId
    WHERE Id = @id;
END




GO
