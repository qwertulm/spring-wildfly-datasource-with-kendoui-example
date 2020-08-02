To use it with wildfly datasource change:
backend/src/main/resources/application.properties,
frontend/src/consts.js.

Run steps:
1. Run frontend
cd frontend
npm start

2. Run backend
cd ../backend
mvn spring-boot:run


Build steps:
1. Build frontend
cd frontend
npm run build
copy files from frontend/build to backend/src/main/resources/static

2. Build backend
cd ../backend
mvn clean package



 