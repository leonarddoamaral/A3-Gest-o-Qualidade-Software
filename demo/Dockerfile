# syntax=docker/dockerfile:1

# ---------- Build ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
# Os testes são executados no pipeline (CI) e em `mvn verify`; aqui só empacotamos.
RUN --mount=type=cache,target=/root/.m2 mvn -B -q package -DskipTests

# ---------- Runtime ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN groupadd --system app && useradd --system --gid app app
COPY --from=build /workspace/target/*.jar /app/app.jar
USER app
EXPOSE 8081
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
