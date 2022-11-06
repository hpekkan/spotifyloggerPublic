CREATE TABLE users(
    USER_ID int unsigned not null auto_increment, PRIMARY KEY (USER_ID),
    USER_URI varchar(255) NOT null,
    USER_NAME varchar(255) not null,
    IMAGE_URL VARCHAR(255) null
);



