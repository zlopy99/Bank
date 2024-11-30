FROM openjdk:21-oracle
COPY target/*.war bank.war
ENTRYPOINT ["java", "-jar", "bank.war"]