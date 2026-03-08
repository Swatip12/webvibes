# Quick Start Guide - WebVibes Backend

This guide will help you quickly start and verify the WebVibes Technology backend.

## Prerequisites

Before starting, ensure you have:

1. **Java 17 or higher** installed
   ```bash
   java -version
   ```

2. **Maven 3.6+** installed
   ```bash
   mvn -version
   ```

3. **MySQL 8.0+** installed and running
   ```bash
   # Check if MySQL is running
   mysql --version
   ```

## Step 1: Configure Database

1. Start MySQL server (if not already running)

2. The application will automatically create the database `webvibes_db` on first run

3. If you need to change database credentials, edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=password
   ```

## Step 2: Build the Application

From the `backend` directory, run:

```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests (if any)
- Create the JAR file

## Step 3: Run the Application

### Option 1: Using Maven (Recommended for Development)

```bash
mvn spring-boot:run
```

### Option 2: Using the JAR file

```bash
java -jar target/webvibes-backend-1.0.0.jar
```

The application will start on **http://localhost:8080**

## Step 4: Verify the Application

### Check Application Logs

Look for these messages in the console:

```
Started WebVibesApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

### Verify Database Schema

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Run the verification script:
   ```bash
   mysql -u root -p < verify-database.sql
   ```

   Or manually:
   ```sql
   USE webvibes_db;
   SHOW TABLES;
   ```

   You should see 4 tables:
   - internship_applications
   - course_enrollments
   - contact_messages
   - projects

### Test API Endpoints

#### Option 1: Using PowerShell Script (Windows)

```powershell
.\test-endpoints.ps1
```

#### Option 2: Using cURL (Linux/Mac/Windows)

Test internship application:
```bash
curl -X POST http://localhost:8080/api/internships/apply \
  -H "Content-Type: application/json" \
  -d '{"studentName":"John Doe","email":"john@example.com","phone":"1234567890","internshipType":"Java Internship","message":"Test"}'
```

Test get all projects:
```bash
curl http://localhost:8080/api/projects
```

#### Option 3: Using Postman

1. Import the following endpoints into Postman:

   **POST** `http://localhost:8080/api/internships/apply`
   ```json
   {
     "studentName": "John Doe",
     "email": "john@example.com",
     "phone": "1234567890",
     "internshipType": "Java Internship",
     "message": "I am interested"
   }
   ```

   **POST** `http://localhost:8080/api/courses/enroll`
   ```json
   {
     "studentName": "Jane Smith",
     "email": "jane@example.com",
     "phone": "9876543210",
     "courseName": "Spring Boot",
     "message": "Looking forward"
   }
   ```

   **POST** `http://localhost:8080/api/contact`
   ```json
   {
     "name": "Alice Johnson",
     "email": "alice@example.com",
     "message": "I would like more information"
   }
   ```

   **POST** `http://localhost:8080/api/projects`
   ```json
   {
     "title": "E-Commerce Website",
     "description": "A full-stack application",
     "githubLink": "https://github.com/example/ecommerce",
     "imageUrl": "https://example.com/image.png"
   }
   ```

   **GET** `http://localhost:8080/api/projects`

## Step 5: Verify CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:4200` (Angular dev server)

If you need to add more origins, edit `src/main/java/com/webvibes/config/CorsConfig.java`

## Common Issues and Solutions

### Issue 1: Port 8080 Already in Use

**Solution**: Change the port in `application.properties`:
```properties
server.port=8081
```

### Issue 2: MySQL Connection Failed

**Error**: `Communications link failure`

**Solutions**:
1. Verify MySQL is running
2. Check username/password in `application.properties`
3. Ensure MySQL is listening on port 3306

### Issue 3: Database Not Created

**Solution**: The database should be created automatically. If not, create it manually:
```sql
CREATE DATABASE webvibes_db;
```

### Issue 4: Maven Not Found

**Solution**: 
- Install Maven from https://maven.apache.org/download.cgi
- Or use your IDE's built-in Maven support

### Issue 5: Java Version Mismatch

**Error**: `Unsupported class file major version`

**Solution**: Ensure you're using Java 17 or higher:
```bash
java -version
```

## Next Steps

Once the backend is verified and running:

1. ✅ All API endpoints are accessible
2. ✅ Database tables are created
3. ✅ CORS is configured
4. ✅ Validation is working

You can proceed to:
- **Frontend Development** (Task 9+)
- **Integration Testing** with Angular frontend
- **Adding more features** as needed

## Stopping the Application

Press `Ctrl+C` in the terminal where the application is running.

## Additional Resources

- **Full Verification Report**: See `VERIFICATION_REPORT.md`
- **API Documentation**: See `README.md`
- **Database Schema**: See `verify-database.sql`
- **Test Script**: See `test-endpoints.ps1`

## Support

If you encounter issues:
1. Check the application logs for error messages
2. Verify MySQL is running and accessible
3. Ensure all prerequisites are installed
4. Review the VERIFICATION_REPORT.md for detailed component information
