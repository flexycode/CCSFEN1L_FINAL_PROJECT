# 🏢 Detention Facility Management System (DFMS)

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
- [Implementation Timeline](#-implementation)
- [Project Objectives](#-project-objectives)
- [Evaluation](#-evaluation)
- [System Architecture](#%EF%B8%8F-system-architecture)
- [Database Schema (ERD)](#%EF%B8%8F-database-schema-erd)
- [Getting Started](#-getting-started)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Application Flow](#application-flow)
- [Contributing](#-contributing)
- [Changelogs](#-changelogs)

<!-- Introduction down below -->
# 🧠 [Introduction](#introduction)

The **Detention Facility Management System (DFMS)** is a comprehensive digital solution designed to automate and streamline detention operations within government correctional facilities. This project aims to modernize the management of Persons Deprived of Liberty (PDL), visitor tracking, and incident logging processes through a centralized, role-based digital platform.
The system automates critical detention operations including inmate management, visitor tracking, and comprehensive incident reporting. The DFMS facilitates efficient PDL record management, enhances security protocols, and provides data-driven insights for better facility administration.

## 🏦 Case Study: Detention Facility Operations

### Current Challenges:

* **Manual PDL Management:** Paper-based inmate records leading to inefficiencies and data inconsistencies
* **Visitor Tracking Issues:** Difficulty in monitoring and logging visitor information systematically
* **Incident Documentation:** Insufficient digital logging of facility incidents and activities
* **Report Generation Delays:** Time-consuming manual compilation of statistics and reports
* **Limited Data Analytics:** Lack of insights from PDL demographics and facility operations
* **Security Concerns:** Risk of data loss and unauthorized access with manual systems

### Proposed Solution:
A centralized digital platform that automates detention facility operations, providing real-time PDL management, visitor tracking, incident logging, and comprehensive reporting capabilities for enhanced security and operational efficiency.

<!-- Techstacks down below (temporary need some proper decision for the group team in order to inlign for the project -->
# 💻 [Technology Stack](#-technology-stack)

### Option 1: Angular 17+ with TypeScript + PrimeNG (Modern)

* **Frontend:** Angular 17+ with TypeScript
* **UI Framework:** PrimeNG
* **Desktop Wrapper:** Electron
* **Backend:** NestJS with Node.js
* **Database:** PostgreSQL with TypeORM
* **Authentication:** JWT + Angular Guards
* **Styling:** Angular Flex Layout + SCSS/Tailwind CSS
* **State Management:** NgRx
* **HTTP Client:** Angular HttpClient
* **Additional:** Chart.js for analytics, Electron Store for local data
* **Testing:** Jasmine + Karma + Protractor

# 🎯 [Features](-features)

### Core Functionality

* **✅ PDL Record Management** - Digital profiles and status tracking for Persons Deprived of Liberty
* **✅ Visitor Management System** - Comprehensive visitor logging and search capabilities
* **✅ Incident Logging** - Digital documentation of facility incidents and activities
* **✅ Report Generation** - Automated reports on PDL counts, incident logs, and activity records
* **✅ PDL Statistics & Analytics** - Data-driven insights from PDL profiles and demographics
* **✅ Role-Based Access Control** (Admin, Officer, Security, Medical Staff)
* **✅ Real-Time Monitoring** - Live updates on facility status and activities
* **✅ Search & Filtering** - Advanced search across PDL records and visitor logs

### Security & Compliance Features

* 🔐 Secure user authentication and role-based authorization
* 🔐 Data encryption and secure information storage
* 🔐 Comprehensive audit logging and activity tracking
* 🔐 GDPR and data protection compliance features
* 🔐 Backup and disaster recovery mechanisms

### Reporting & Analytics

* 📊 PDL demographic analysis and statistics
* 📊 Visitor traffic patterns and analytics
* 📊 Incident trend analysis and reporting
* 📊 Facility capacity and occupancy reports
* 📊 Custom report generation with export options

# 📊 [System Design](system-design)
### Architecture Pattern

* **Desktop Application:** Electron-based architecture with local database
* **Web Alternative:** Three-tier architecture (Frontend, API, Database)

### Image of System Architecture
```
Image 
```

### User Roles & Permissions

1. **Admin:** Full system access, user management, system configuration, all reports
2. **Duty Officer:** PDL management, visitor approval, incident reporting, daily operations
3. **Security Personnel:** Visitor screening, incident logging, security monitoring
4. **Medical Staff:** PDL health records, medical incident reports (if applicable)
5. **Report Viewer:** Read-only access to reports and statistics

### Database Schema (ERD)

### Core Entities:

* **Users:** Authentication and role management
* **Documents:** Document metadata and file references
* **Departments:** Organizational structure
* **Document_Routes:** Tracking document movement
* **Audit_Logs:** System activity logging
* **Document_Status:** Status tracking and history

# 🚀 [Implementation](#-implementation)
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

* **Create Database Schema:** Design and implement database structure for PDL, visitors, and incidents
* **Implement PDL Module:** Develop PDL record management, profiles, and status tracking
* **Implement Visitor Module:** Build visitor registration, logging, and management system
* **Integrate Reporting & Statistics:** Add analytics, reporting features and PDL statistics generation

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

# 🎯 [Project Objectives](-project-objectives)
### 📢 Stakeholder Interview Update
Following our successful stakeholder interview with PDEA Office duty officers, the project focus has been refined to address critical detention facility management needs.

### General Objective
**To automate detention operations such as inmate management, visitor tracking, and incident logging** through a comprehensive digital management system that enhances security, efficiency, and accountability in PDEA-NCR detention facilities.

### Specific Objectives

1.**📋 PDL Record Management Module**
Digitally record, update, and retrieve profiles and status of Persons Deprived of Liberty (PDL) with secure data management and real-time updates.

2.**👥 Visitor Management Module**
Enable comprehensive visitor logging and search capabilities for streamlined tracking, security screening, and visit history management.

3.**📊 Report Generation System**
Provide automated reports on PDL counts, incident logs, histories, and activity records with export capabilities and scheduling options.

4.**📈 PDL Statistics & Analytics**
Generate comprehensive statistics based on PDL profiles for data-driven insights, demographic analysis, and operational planning.

5.**🧪 System Evaluation & Testing**
Conduct thorough alpha and beta testing with PDEA NCR users, targeting at least 80% user satisfaction rating in the final month of implementation through structured user feedback and system optimization.

# 📜 [Evaluation](-evaluation)
```
Image Coming Soon!!!
```

# 🖥️ [System Architecture](--system-architecture)
```
This section is under development process
```

# 🗄️ [Database Schema (ERD)](--database-schema)

### Core Entities

* **PDL_Records:** Person Deprived of Liberty profiles and information
* **Visitors:** Visitor registration and tracking data
* **Visit_Logs:** Detailed visitor session records
* **Incidents:** Facility incident documentation and tracking
* **Users:** System user authentication and role management
* **Reports:** Generated reports and analytics data
* **Audit_Logs:** System activity and security logging

# 🔧 [Getting Started](-getting-started)

### Prerequisites
```
# For Desktop Application (Electron)
Node.js >= 18.x
npm or yarn
```

### Installation
```
# Clone the repository
git clone https://github.com/CCSFEN1L_FINAL_PROJECT.git

# Navigate to project directory
cd CCSFEN1L_FINAL_PROJECT

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run db:migrate

# Start the application
npm run dev
```

# [Authentication](authentication)
```
This section is under development process
```

# [User Roles](user-roles)
```
This section is under development process
```

# [Application Flow](application-flow)
```
This section is under development process
```

# 👋 [Contributors](-contributors)

### 🤝 Contributing
We welcome contributions to improve the Document Tracking System. Please follow these guidelines:

* **1. Fork the repository**
* **2. Create a feature branch** (`git checkout -b feature/AmazingFeature`)
* **3. Commit your changes** (`git commit -m '🧊 DTS: Add some AmazingFeature'`)
* **4. Push to the branch** (`git push origin feature/AmazingFeature`)
* **5. Open a Pull Request**

Special thanks to all project team members:

### 💼 Project Team ⚡

* 😎 [Jay Arre Talosig](https://github.com/flexycode) - Machine Learning Engineer | Blockchain Developer | Bioinformatics Scientist
* 🕵️ Marvin T. Mendoza - Project Manager | Lead Developer | Systems Architect
* 🚀 [Reynan G. Jalamana](https://github.com/jalamana21) - Software Engineer | Frontend Developer | UI/UX Designer

<!--  License will provide soon --> 
# 📄 [License](https://github.com/flexycode/CCSFEN1L_FINAL_PROJECT/blob/main/LICENSE)
This project is developed as part of academic requirements for CCSFEN1L - Software Engineering course.

```
Coming Soon In the License tab 
```
## National University of Manila License   

The National University of Manila License grants permission to students of the National University of Manila to use, modify, and distribute this project for educational purposes within the scope of their coursework and assignments.

### Usage 

- You may use this project as a reference or learning material for your studies at the National University of Manila.
- You may modify the project to suit your educational needs and requirements.
- You may share the project with your fellow students or instructors for educational purposes.

### Restrictions

- You may not use this project for commercial purposes.
- You may not redistribute or publish this project outside the National University of Manila without explicit permission.

## Disclaimer

This project is provided "as is" without warranty of any kind, express or implied. The National University of Manila and the project contributors disclaim any liability or responsibility for any direct, indirect, incidental, special, exemplary, or consequential damages arising out of the use or misuse of this project.

### 🎯 Alignment with SDG 16
This project directly supports **UN Sustainable Development Goal 16: Peace, Justice, and Strong Institutions** by:

* Promoting transparent and accountable governance
* Enhancing institutional effectiveness
* Improving access to information and documentation
* Strengthening public administration systems


# 🔭 [Acknowledgements](-acknowledgements)     

<!--  Need to revise this background info of Professor Eliseo Ramirez  -->
### ✨ Professor
```
Professor Mr. Eliseo Ramirez background coming soon.
```
<!-- Always document your changes, pull-request, bugfix, updates, patch notes for this final project. Always use this "🧊 CCSFEN1L FINAL PROJECT - Detention Facility Management System" for commiting message for "pushing code" or "Pull-request"   -->
# 📫 [Changelogs](-changelogs) 
Chronological list of updates, bug fixes, new features, and other modifications for ```name of the project```.

### 📦 Version 1.0.0 - August 14, 2025
**Project Initialization**
- ✨ Created initial repository structure
- ✨ Set up project folder organization
- ✨ Established development workflow
- 🔧 Initial project configuration and setup

### 📊 Version 1.0.1 - August 26, 2025
**Design & Architecture**
- ✨ Database schema design and ERD creation
- 📋 User interface mockups and wireframes
- 📁 System architecture documentation
- 🗄️ Technology stack finalization
- 🍃 Development environment setup
- 📖 Technical documentation updates

### 🚀 Version 2.0.0 - September 15, 2025
**Core Development Phase**

- ✨ Authentication and authorization system
- 📋 Document upload and management features
- 🔄 Routing and workflow implementation
- 🗄️ Database integration and ORM setup
- 🎨 User interface development

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

🧊 CCSFEN1L FINAL PROJECT - Detention Facility Management System

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
    
