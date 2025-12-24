# 🚀 Complete Setup Guide for Collaborators

Welcome to the SkillForge project! Follow these steps carefully to set up the project on your computer.

---

## 📋 Prerequisites (Install These First)

Before you begin, make sure you have these installed:

### 1. **Java Development Kit (JDK) 17 or higher**
- Download from: https://www.oracle.com/java/technologies/downloads/
- Verify installation: Open Command Prompt and type `java -version`

### 2. **MySQL Server**
- Download from: https://dev.mysql.com/downloads/mysql/
- During installation, remember your **root password** (you'll need it!)
- Make sure MySQL is running on port **3306**

### 3. **Node.js (version 16 or higher)**
- Download from: https://nodejs.org/
- Verify installation: Open Command Prompt and type `node -v`

### 4. **Git**
- Download from: https://git-scm.com/downloads
- Verify installation: Open Command Prompt and type `git --version`

### 5. **IntelliJ IDEA** (Recommended) or any Java IDE
- Download from: https://www.jetbrains.com/idea/download/

---

## 🔧 Step-by-Step Setup Instructions

### **STEP 1: Clone the Repository**

1. Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux)
2. Navigate to where you want to save the project:
   ```bash
   cd C:\Users\YourUsername\Documents
   ```
3. Clone the repository:
   ```bash
   git clone <REPOSITORY_URL>
   ```
   *(Replace `<REPOSITORY_URL>` with the actual GitHub repository URL)*

4. Navigate into the project folder:
   ```bash
   cd "springpro - Copy"
   ```

---

### **STEP 2: Set Up the Database**

#### **Option A: Using MySQL Workbench (Easiest - Recommended)**

1. **Open MySQL Workbench**
2. **Connect to your local MySQL server**
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: *your MySQL root password*

3. **Create the database:**
   - Click on the SQL editor icon
   - Type this command:
     ```sql
     CREATE DATABASE springpro_db;
     ```
   - Click the lightning bolt icon to execute

4. **Import the database dump:**
   - Go to **Server** → **Data Import**
   - Select **"Import from Self-Contained File"**
   - Click **"..."** and browse to: `springpro - Copy/springpro_db_dump.sql`
   - Under **"Default Target Schema"**, select **springpro_db**
   - Click **"Start Import"**
   - Wait for the import to complete (you'll see a success message)

#### **Option B: Using Command Line**

1. **Open Command Prompt**
2. **Navigate to the project folder:**
   ```bash
   cd "C:\Users\YourUsername\Documents\springpro - Copy"
   ```

3. **Create the database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE springpro_db;"
   ```
   *(Enter your MySQL root password when prompted)*

4. **Import the database dump:**
   ```bash
   mysql -u root -p springpro_db < springpro_db_dump.sql
   ```
   *(Enter your MySQL root password when prompted)*

---

### **STEP 3: Configure Database Connection**

1. **Open the project in your IDE** (IntelliJ IDEA recommended)

2. **Navigate to:**
   ```
   backend/main/resources/application.properties
   ```

3. **Find line 6** and update it with YOUR MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
   ```
   
   **Example:** If your MySQL password is `mypassword123`, change it to:
   ```properties
   spring.datasource.password=mypassword123
   ```

4. **IMPORTANT:** 
   - ⚠️ **DO NOT commit this change to GitHub!** 
   - This file should remain local to your machine
   - Keep your password private

---

### **STEP 4: Install Frontend Dependencies**

1. **Open Command Prompt** and navigate to the frontend folder:
   ```bash
   cd "C:\Users\YourUsername\Documents\springpro - Copy\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(This may take a few minutes)*

---

### **STEP 5: Run the Application**

You need to run **both** the backend and frontend:

#### **Running the Backend (Spring Boot)**

**Option A: Using IntelliJ IDEA**
1. Open the project in IntelliJ
2. Wait for IntelliJ to index the project
3. Find the main application file (usually `SpringproApplication.java`)
4. Right-click on it and select **"Run 'SpringproApplication'"**
5. Wait for the server to start (you'll see "Started SpringproApplication" in the console)
6. Backend will run on: `http://localhost:8080`

**Option B: Using Command Line**
1. Navigate to the project root:
   ```bash
   cd "C:\Users\YourUsername\Documents\springpro - Copy"
   ```
2. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows, use `mvnw.cmd spring-boot:run`)*

#### **Running the Frontend (React)**

1. **Open a NEW Command Prompt window**
2. Navigate to the frontend folder:
   ```bash
   cd "C:\Users\YourUsername\Documents\springpro - Copy\frontend"
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. You'll see a message like:
   ```
   Local: http://localhost:5173
   ```
5. **Open your browser** and go to: `http://localhost:5173`

---

## ✅ Verify Everything is Working

1. **Backend is running:** You should see Spring Boot logs in the console
2. **Frontend is running:** The React app should open in your browser
3. **Database is connected:** Try logging in with existing credentials or creating a new account

---

## 🐛 Troubleshooting Common Issues

### **Issue 1: "Access denied for user 'root'"**
**Solution:** 
- Check that you updated the password in `application.properties` correctly
- Make sure your MySQL server is running

### **Issue 2: "Unknown database 'springpro_db'"**
**Solution:** 
- You didn't create the database. Go back to STEP 2 and create it

### **Issue 3: "Port 8080 already in use"**
**Solution:** 
- Another application is using port 8080
- Stop the other application or change the port in `application.properties`:
  ```properties
  server.port=8081
  ```

### **Issue 4: "npm: command not found"**
**Solution:** 
- Node.js is not installed or not in your PATH
- Reinstall Node.js and restart your terminal

### **Issue 5: Frontend can't connect to backend**
**Solution:** 
- Make sure the backend is running on `http://localhost:8080`
- Check the frontend API configuration

### **Issue 6: "mysqldump/mysql command not found"**
**Solution:** 
- MySQL bin folder is not in your system PATH
- Use the full path to mysql:
  - **Windows:** `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`
  - **Mac:** `/usr/local/mysql/bin/mysql`

---

## 📝 Important Notes

### **About the Database:**
- ⚠️ Each collaborator has their **OWN LOCAL COPY** of the database
- Changes you make to your database **will NOT be visible** to others
- This is for **development and testing purposes only**
- If you need shared data, consider using a cloud database

### **Git Best Practices:**
- **NEVER commit** your `application.properties` file with your password
- Add it to `.gitignore` if not already there
- Pull the latest changes regularly: `git pull origin main`
- Create feature branches for new work

### **File Uploads:**
- The application stores uploaded files in the `./uploads` folder
- This folder is local to your machine
- Other collaborators won't see your uploaded files

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure all prerequisites are installed correctly
3. Verify that MySQL is running
4. Check the console logs for error messages
5. Contact the project owner for assistance

---

## 🎉 You're All Set!

Once everything is running, you can:
- Create an account or log in
- Explore the application features
- Start developing new features
- Test existing functionality

**Happy Coding! 🚀**
