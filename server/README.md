**Initial Setup**
  
install docker client && pgAdmin/datagrip  

FOR DOCKER ON SCHOOL MACS:  
https://dashboard.hive.fi/topics/81/messages?cursus_id=1  
  
after installing docker client:  
	&emsp; `docker-compose -h`  
	&emsp; 	`cd server/`


  
run all setted up containers in background:  
	&emsp; `docker-compose up -d`  
  
connect to postgres:  
	&emsp; `psql postgresql://localhost:5432/matcha -U postgres`  
  
show all containers to get an ID:  
	&emsp; `docker ps`  
  
remove container:  
	&emsp; `docker stop <ID>`  
	&emsp; `docker rm <ID>`  
  
**Migrations**
  
To create new migration run:  
&emsp; `npm run migration:create --  <migrationName>`  
  
Run migration:  
&emsp; `npm run migrate`  
  
If Postgres drop database error: pq: cannot drop the currently open database:  
&emsp; `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'tablename';`  
After that can drop all tables.  
  
**Tests**  
Run test migration:  
&emsp; `npm run migrate:test`  
  
to run one test, use for.ex:  
&emsp; `npm test -- tests/user_api.test.js`  
or  
&emsp; `npm test -- -t 'test desc/name'`  
  
links:  
https://node-postgres.com/features/pooling#single-query  
https://dev.to/steadylearner/how-to-set-up-postgresql-and-pgadmin-with-docker-51h  
https://www.npmjs.com/package/db-migrate  
https://github.com/db-migrate/node-db-migrate#readme  
https://db-migrate.readthedocs.io/en/latest/  
  
**express-async-handler**  
middleware added for handling missed errors on async functions  
every endpoint should be wrapped with asyncHandler();  
https://www.npmjs.com/package/express-async-handler  
  
  
**db-migrate**  
Database migration framework for node.js  
Basic usage: db-migrate [up|down|reset|create|db] [[dbname/]migrationName|all] [options]  
https://db-migrate.readthedocs.io/en/latest/  
