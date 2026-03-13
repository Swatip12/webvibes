# Backend Rebuild Required

The backend JAR file needs to be rebuilt to include the admin panel code (AuthController, SecurityConfig, etc.).

## Issue
The current running JAR was built before the admin panel implementation. It's missing:
- AuthController (/api/auth/login endpoint)
- SecurityConfig (Spring Security configuration)
- CORS configuration for admin endpoints
- All admin-related controllers and services

## Solution
You need to rebuild the backend using Maven. Here are the options:

### Option 1: Using Maven Command Line
If Maven is installed and in your PATH:
```bash
cd backend
mvn clean package -DskipTests
```

### Option 2: Using IDE (IntelliJ IDEA / Eclipse / VS Code)
1. Open the backend project in your IDE
2. Right-click on `pom.xml`
3. Select "Maven" → "Reload Project" or "Reimport"
4. Run Maven goal: `clean package -DskipTests`

### Option 3: Using Maven from Full Path
If you know where Maven is installed:
```bash
cd backend
"C:\Path\To\Maven\bin\mvn.cmd" clean package -DskipTests
```

## After Rebuilding
Once the build completes successfully:
1. The new JAR will be at: `backend/target/webvibes-backend-1.0.0.jar`
2. Start the backend with:
   ```bash
   cd backend
   java -jar target/webvibes-backend-1.0.0.jar --spring.config.location=file:./application.properties
   ```
3. The login should then work at http://localhost:4200/login

## Verification
After starting the rebuilt backend, you should see in the logs:
- Spring Security configuration loading
- CORS configuration being applied
- AuthController being mapped to /api/auth/login
