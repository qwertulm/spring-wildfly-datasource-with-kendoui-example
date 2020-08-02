To use it with wildfly datasource change backend/src/main/resources/application.properties and frontend/src/consts.js.

Run steps:
1. Run frontend
```bash
cd frontend
npm start
```

2. Run backend
```bash
cd ../backend
mvn spring-boot:run
```


Build steps:
1. Build frontend
```bash
cd frontend
npm run build
```
copy files from frontend/build to backend/src/main/resources/static

2. Build backend
```bash
cd ../backend
mvn clean package
```



 
