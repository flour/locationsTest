# Test Swagger application


#### Description
Test application with using Swagger + Express and MongoDB as storage

Got only two routes:
 - http://localhost:10010/locations GET - gets all requests ordered by date (MongoDB _id)
 - http://localhost:10010/locations POST - request distance between two geolocation points and stores request + result into DB


##### How to start:
Install docker
```
git clone git@gitlab.com:Flour/locationsTest.git
cd locationsTest
docker-compose up --build
```
Use http://localhost:10010 for requests
