express --view=ejs PilotQueryManagementSystem
cd PilotQueryManagementSystem
npm install  
npm install express-flash --save
npm install express-session --save 
npm install method-override --save
npm install mysql --save
npm install express-validator@5.3.0
npm install moment --save   # npm


//create database

create database PQMS;
create table pilot_query(
id int auto_increment ,
query_type varchar(30),
message varchar(200),
query_time timestamp,
other_data varchar(500),
 primary key (id));

 run code npm start;
   
   url :
      http://127.0.0.1:3000/pilots