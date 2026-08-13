# 1. Java 17 자바 실행 환경
# FROM openjdk:17-jdk-slim
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 2. 빌드된 jar 파일을 컨테이너 안으로 복사
COPY build/libs/*.jar app.jar

# 3. 8080 포트 노출 및 앱 실행
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]