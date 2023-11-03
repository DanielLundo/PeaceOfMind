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



CREATE TABLE if not exists HouseSitter (
    houseSitterID INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    experience varchar(255),
    bookingId INT,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (bookingId) REFERENCES Bookings(bookingId)
);



CREATE TABLE Bookings (
    BookingId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- The user making the booking
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

select * from user;
delete from user where userId = 13;

drop table booking;
drop table homeowner;
drop table housesitter;
drop table calendar;
drop table role;
drop table user;






