# 💫 Document Tracking System (DTS)

<!-- Background github cover with short introduction down below 
<img src="https://github.com/flexycode/CTINFMGL/blob/main/asset/Information-Management.png" />
-->

### Team Name: [Artificial Ledger Technology](https://github.com/flexycode)    
### Subject & Section: [CCSFEN1L - COM232](https://www.youtube.com/watch?v=fFqxDrmQLnQ&list=RDfFqxDrmQLnQ&start_radio=1)
### Schedule: [MON 3:00PM - 05:40 PM 517 MB - THU 03:00PM - 07:00 PM 408 MB](https://www.youtube.com/watch?v=dL7Vn7hJDAk&list=RDdL7Vn7hJDAk&start_radio=1)
### Professor: [Eliseo Q. Ramirez](https://github.com/)     
### No. of Units: [3 Units](https://www.youtube.com/watch?v=UVJSA2N39NU&list=RDUVJSA2N39NU&start_radio=1)
### Prerequisite: [CCDATRCL - DATA STRUCTURES AND ALGORITHMS](https://github.com/flexycode/CCDATRCL)
### Course Subject Link: [Click Here](https://github.com/flexycode/CCSFEN1L)

<!-- 🤖 Software Engineering 🤖 -->
<div align="center">
<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NTRmeHg0b2kwaW1qeGtvaDFjenpxdXB4YThyZzhjampncWRncnZsbCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Y06e2KFCG48qwNMGK2/giphy.gif" width="250">
<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3end4eTE0ejQxNG0wbml6anVmcW02NG4zeG1kMTVkcThwdmg1YTViZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/nVId9DzWXVjMQc6SMn/giphy.gif" width="300">
<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eHhhY3k5bjZ2cjh6eHI5c253YTk1M29wcGI4MWkzYng4OGhyN3huaCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/yWYjFi5Uh6ehJrJ4Rc/giphy.gif" width="250">
</div>

## Table of Contents
- [Introduction](#-introduction)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [System Design](#-system-design)
- [Implementation](#-implementation)
- [Evaluation](#-evaluation)
- [System Architecture](#-system-architecture)
- [Database Schema (ERD)](#-database-schema)
- [Getting Started](#-getting-started)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [Application Flow](#-application-flow)
- [Contributing](#-contributing)
- [Changelogs](#-changelogs)

<!-- Introduction down below -->
# 🧠 [Introduction](#introduction)

The **Document Tracking System (DTS)** is a comprehensive digital solution designed to modernize and optimize the tracking of official documents and memoranda within government institutions. This project aims to replace traditional manual document handling processes with a centralized, role-based platform that enables real-time monitoring and transparent document routing.
Built specifically for the Philippine Drug Enforcement Agency – National Capital Region (PDEA-NCR), the system facilitates faster document retrieval, minimizes search time, and reduces reliance on physical document handling while ensuring enhanced accountability and transparency.

## 🏦 Case Study:PDEA-NCR Document Management

### Current Challenges:

* **Manual Processing:** Traditional paper-based document routing leading to inefficiencies
* **Lack of Traceability:** Difficulty in tracking document status and location
* **Misplaced Files:** Risk of losing important documents in manual systems
* **Processing Delays:** Slow document approval and routing processes
* **Limited Accountability:** Insufficient audit trails for document handling

### Proposed Solution:
A centralized digital platform that streamlines document workflow across various divisions and sections within PDEA-NCR, providing real-time status updates and comprehensive tracking capabilities.

<!-- Techstacks down below (temporary need some proper decision for the group team in order to inlign for the project -->
# 💻 [Technology Stack](#-technology-stack)

### Option 1: AngularJS/Angular Stack (Modern)

* **Frontend:** Angular 17+ with TypeScript
* **UI Framework:** Angular Material or PrimeNG
* **State Management:** NgRx or Akita
* **HTTP Client:** Angular HttpClient
* **Styling:** Angular Flex Layout + SCSS/Tailwind CSS
* **Desktop Wrapper:** Electron + Angular

### Option 2: React/TypeScript Stack

* **Framework:** Electron.js with React/TypeScript
* **UI Components:** Material-UI (MUI) or Ant Design
* **State Management:** Redux Toolkit or Zustand
* **Styling:** Tailwind CSS or Styled Components

### Option 3: Vue.js Stack

* **Frontend:** Vue.js 3 + Composition API + TypeScript
* **UI Framework:** Vuetify or Quasar
* **State Management:** Pinia
* **Desktop Wrapper:** Electron + Vue

### Backend (Universal for all options)

* **Runtime:** Node.js with TypeScript
* **Framework:** Express.js, Fastify, or NestJS
* **Authentication:** JWT + bcrypt or Passport.js
* **File Upload:** Multer or Express-fileupload
* **Validation:** Joi, Yup, or class-validator

### Database Options

* **Primary:** PostgreSQL or MySQL
* **ORM:** Prisma, TypeORM, or Sequelize
* **Migration:** Database-specific migration tools
* **Cache:** Redis (optional)

### AngularJS Specific Recommendations

* **Desktop:** Electron + Angular + Angular CLI
* **Backend:** NestJS (Angular-style backend framework)
* **Database:** PostgreSQL + TypeORM
* **Authentication:** Angular Guards + JWT
* **UI Components:** Angular Material + CDK
* **Testing:** Jasmine + Karma + Protractor

# 🎯 Features

### Core Functionality

* ✅ Role-Based Access Control (Admin, Encoder, Reviewer, Approver)
* ✅ Document Upload & Classification with metadata tagging
* ✅ Real-Time Document Tracking with status updates
* ✅ Inter-Departmental Routing with approval workflows
* ✅ Advanced Search & Filtering capabilities
* ✅ Audit Trail & Logging for accountability
* ✅ Report Generation with export options
* ✅ Dashboard Analytics for workflow insights

### Security Features

* 🔐 Secure user authentication and authorization
* 🔐 Document access restrictions based on user roles
* 🔐 Comprehensive audit logging
* 🔐 Data encryption and secure file storage

# 📊 System Design
### Architecture Pattern

* **Desktop Application:** Electron-based architecture with local database
* **Web Alternative:** Three-tier architecture (Frontend, API, Database)

Image of System Architecture
```
Image 
```

### User Roles & Permissions

1. **Admin:** Full system access, user management, system configuration
2. **Encoder:** Document upload, initial data entry, basic tracking
3. **Reviewer:** Document review, status updates, routing decisions
4. **Approver:** Final approval authority, document sign-off

# 🗄️ Database Schema (ERD)
### Core Entities

* **Users:** Authentication and role management
* **Documents:** Document metadata and file references
* **Departments:** Organizational structure
* **Document_Routes:** Tracking document movement
* **Audit_Logs:** System activity logging
* **Document_Status:** Status tracking and history

# 🚀 Implementation Timeline
### Phase 1: Requirements Gathering

* **Stakeholder Interviews:** Conduct interviews with PDEA-NCR personnel
* **Document Functional Requirements:** Define system specifications and user needs

### Phase 2: Analysis

* **Feasibility Study:** Assess technical and operational feasibility
* **Define System Scope:** Establish project boundaries and limitations

### Phase 3: System Design

* **UI/UX Wireframes:** Create user interface mockups and prototypes
* **System Architecture Design:** Design overall system structure and data flow

### Phase 4: Development / Coding

* **Create Database Schema:** Design and implement database structure
* **Implement PDL Module:** Develop Primary Document Logic functionality
* **Implement Visitor Module:** Build user interface and interaction components
* **Integrate Reporting & Statistics:** Add analytics and reporting features

### Phase 5: Testing & Debugging

* **Alpha Testing:** Internal testing and initial bug identification
* **Bug Fixes & Optimization:** Resolve issues and improve performance
* **Beta Testing with PDEA NCR:** User acceptance testing with actual stakeholders

### Phase 6: Documentation

* **User Manual Preparation:** Create comprehensive user guides
* **Technical Documentation:** Document system architecture and maintenance procedures

### Phase 7: Final Presentation & Submission

* **Prepare Final Presentation:** Create project demonstration and presentation materials
* **Submit Project to PDEA NCR:** Deliver final system and documentation

<!-- Always document your changes, pull-request, bugfix, updates, patch notes for this final project. Always use this "🧊 Flight Booking" for commiting message for "pushing code" or "Pull-request"   -->
# 📫 Changelogs 
Chronological list of updates, bug fixes, new features, and other modifications for ```name of the project```.

### 📦 Version 1.0.0 - Augst 14, 2025
**Project Initialization**
- ✨ Created initial repository structure
- ✨ Set up project folder organization
- ✨ Established development workflow
- 🔧 Initial project configuration and setup

### 📊 Version 1.0.1 - TBA
**Design & Architecture**
- ✨ TBA
- 📋 TBA
- 📁 TBA
- 🗄️ TBA
- 🍃 TBA
- 📖 TBA


---

**Legend:**
- ✨ New Feature
- 🔄 Changed/Updated
- 🐛 Bug Fix
- 🔧 Technical Improvement
- 📖 Documentation
- 🎨 UI/UX Enhancement
- 🔐 Security
- 📊 Data/Analytics
- 🚀 Performance

---

🧊 CCSFEN1L FINAL PROJECT

<!-- Introduction Pannel button link, it will redirect to the top -->

#### [Back to Table of Content](#-introduction)


<!-- End point line insert Thanks for visiting enjoy your day, feel free to modify this  -->
---

<p align="center">
<img src="https://readme-typing-svg.demolab.com/?lines=Thanks+For+Visiting+Enjoy+Your+Day+~!;" alt="mystreak"/>
</p>

<!-- Siero Miero -->
<div align="center">
<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmxsYm56NWNjMWJzZmtoc2Fkb25ucnBvNXU4emd5cGphY3V0bGNwaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/nD0DiLJXj9c5Tg7QFk/giphy.gif" width="300">
</div>

<!-- End point line insert Comeback again next time, feel free to modify this  -->
<p align="center">
<img src="https://readme-typing-svg.demolab.com/?lines=Come+Back+Again+next+time" alt="mystreak"/>
</p>

</p>
    
