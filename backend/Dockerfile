FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# сначала только gradle wrapper (для кеша)
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# потом весь проект
COPY . .

RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

EXPOSE 8080

CMD ["sh", "-c", "java -jar build/libs/*.jar"]
