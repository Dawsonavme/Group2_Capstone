# syntax=docker/dockerfile:1

################################################################################
# Build Stage
################################################################################
FROM eclipse-temurin:25-jdk-jammy AS build

WORKDIR /build

# Copy Maven wrapper
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw

# Build the application
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw clean package -DskipTests

################################################################################
# Runtime Stage
################################################################################
FROM eclipse-temurin:25-jre-jammy

WORKDIR /app

# Create non-root user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/usr/sbin/nologin" \
    --no-create-home \
    --uid ${UID} \
    appuser

USER appuser

# Copy the Spring Boot JAR
COPY --from=build /build/target/*.jar app.jar

EXPOSE 5000
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]