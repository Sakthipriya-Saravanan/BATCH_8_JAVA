# Use Java 17
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy all files
COPY . .

# Build the project
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the jar
CMD ["sh", "-c", "java -jar target/*.jar"]

