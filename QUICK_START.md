# 🚀 Quick Start Guide (TL;DR)

For collaborators who want the shortest version:

## Prerequisites
- Java 17+
- MySQL Server
- Node.js 16+
- Git

## Setup in 5 Steps

### 1. Clone the repo
```bash
git clone <REPOSITORY_URL>
cd "springpro - Copy"
```

### 2. Create & import database
```bash
mysql -u root -p -e "CREATE DATABASE springpro_db;"
mysql -u root -p springpro_db < springpro_db_dump.sql
```

### 3. Update your MySQL password
Edit `backend/main/resources/application.properties` line 6:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 4. Install frontend dependencies
```bash
cd frontend
npm install
```

### 5. Run the application

**Terminal 1 (Backend):**
```bash
./mvnw spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

---

**Need detailed instructions? See `COLLABORATOR_SETUP_GUIDE.md`**
