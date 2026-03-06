# WebVibes Technology Backend

Spring Boot REST API backend for the WebVibes Technology website.

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Data JPA**: Database access layer
- **MySQL**: Database
- **Maven**: Build tool
- **Lombok**: Reduce boilerplate code

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/webvibes/
│   │   │   ├── controller/     # REST controllers
│   │   │   ├── service/        # Business logic
│   │   │   ├── repository/     # Data access layer
│   │   │   ├── entity/         # JPA entities
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── exception/      # Exception handlers
│   │   │   └── WebVibesApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/webvibes/
└── pom.xml
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Build

```bash
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Test

```bash
mvn test
```

## API Endpoints

API endpoints will be documented as they are implemented.

## Configuration

Database and other configurations are managed in `src/main/resources/application.properties`
