create database if not exists PeaceOfMind;

CREATE TABLE if not exists User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    isHomeOwner BOOLEAN DEFAULT 0,
    isHouseSitter BOOLEAN DEFAULT 0
);

CREATE TABLE if not exists Role (
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL
);

CREATE TABLE if not exists Calendar (
    calendarId INT AUTO_INCREMENT PRIMARY KEY,
    ownerUserId INT,
    FOREIGN KEY (ownerUserId) REFERENCES User(userId)
);

CREATE TABLE if not exists HouseSitter (
    userId INT PRIMARY KEY,
    houseSitterID INT,
    experience varchar(255),
    availability varchar(30),
    reviews varchar(255),
    calendarId INT,
    roleId INT,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (roleId) REFERENCES Role(roleId),
    FOREIGN KEY (calendarId) REFERENCES Calendar(calendarId)
);

CREATE TABLE if not exists HomeOwner (
    userId INT PRIMARY KEY,
    roleId INT,
    description varchar(255),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (roleId) REFERENCES Role(roleId)
);

CREATE TABLE if not exists Booking (
    bookingId INT AUTO_INCREMENT PRIMARY KEY,
    homeownerId INT,
    houseSitterId INT,
    startDate DATE,
    endDate DATE,
    status ENUM('Pending', 'Accepted', 'Declined', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (homeownerId) REFERENCES HomeOwner(userId),
    FOREIGN KEY (houseSitterId) REFERENCES HouseSitter(userId)
);

select * from user;





