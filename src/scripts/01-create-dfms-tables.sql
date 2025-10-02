-- ========================================
-- DFMS Database Schema Setup
-- ========================================

-- 1. PDL Table (Persons Deprived of Liberty)
CREATE TABLE IF NOT EXISTS PDL (
    PDL_ID CHAR(11) PRIMARY KEY,
    Fname CHAR(50),
    Lname CHAR(50),
    Mname CHAR(50),
    DOB DATE,
    Gender CHAR(1),
    Nationality CHAR(50),
    Occupation VARCHAR(100),
    AgeduringArrest INT,
    Education VARCHAR(100),
    DetaineePic VARCHAR(200),
    DateOfArrest TIMESTAMP,
    ArrestingUnit VARCHAR(300),
    PlaceOfArrest VARCHAR(300),
    AttachedFile VARCHAR(200),
    CasesFiled VARCHAR(300),
    PlaceCaseFiled VARCHAR(200),
    DocketNumber CHAR(30),
    CCNum_ISNum VARCHAR(50),
    ProsRTCBranch CHAR(50),
    Status CHAR(50),
    Remarks VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VisitorsProfile Table
CREATE TABLE IF NOT EXISTS VisitorsProfile (
    VisitorID CHAR(11) PRIMARY KEY,
    Fname CHAR(50),
    Lname CHAR(50),
    Mname CHAR(50),
    Relationship CHAR(50),
    DOB DATE,
    Gender CHAR(1),
    Nationality CHAR(50),
    Occupation CHAR(50),
    PDLtoVisit VARCHAR(200),
    ContactNum CHAR(50),
    Remarks VARCHAR(5000),
    PhotoID VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DateOfVisits Table
CREATE TABLE IF NOT EXISTS DateOfVisits (
    VisitID CHAR(11) PRIMARY KEY,
    InmateID CHAR(11),
    VisitorID CHAR(11),
    VisitDate TIMESTAMP,
    Purpose VARCHAR(200),
    DutyPersonnel CHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InmateID) REFERENCES PDL(PDL_ID) ON DELETE CASCADE,
    FOREIGN KEY (VisitorID) REFERENCES VisitorsProfile(VisitorID) ON DELETE CASCADE
);

-- 4. Incidents Table
CREATE TABLE IF NOT EXISTS Incidents (
    IncidentID CHAR(11) PRIMARY KEY,
    PDL_ID CHAR(11),
    IncidentDate TIMESTAMP,
    NatureOfIncident CHAR(100),
    IncidentDesc VARCHAR(5000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PDL_ID) REFERENCES PDL(PDL_ID) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdl_status ON PDL(Status);
CREATE INDEX IF NOT EXISTS idx_pdl_name ON PDL(Lname, Fname);
CREATE INDEX IF NOT EXISTS idx_visits_date ON DateOfVisits(VisitDate);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON Incidents(IncidentDate);
CREATE INDEX IF NOT EXISTS idx_visitors_name ON VisitorsProfile(Lname, Fname);
