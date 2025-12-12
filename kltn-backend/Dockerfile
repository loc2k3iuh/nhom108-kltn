# Stage 1: Build
# Sử dụng Gradle với JDK 24
FROM gradle:8.14-jdk24 AS build

WORKDIR /app
COPY . .

# Build ứng dụng
RUN gradle build -x test

# Stage 2: Runtime
# Sử dụng Eclipse Temurin 24 (OpenJDK 24)
FROM eclipse-temurin:24-jre

WORKDIR /app

# Copy file jar từ stage build
COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
