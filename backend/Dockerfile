FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app
COPY . .

RUN chmod +x gradlew && ./gradlew build -x test

EXPOSE 8080

CMD sh -c "java -jar $(ls build/libs/*SNAPSHOT.jar | grep -v plain)"
