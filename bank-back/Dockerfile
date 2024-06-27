FROM openjdk:21-oracle
COPY target/*.war bank.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "bank.war"]