"use strict";
class User {
    role;
    constructor() { this.role = Role.USER; }
}
class LoggedInUser extends User {
    username;
    password;
    drivingData;
    constructor(_userName, _password) {
        super();
        this.role = Role.LOGGEDINUSER;
        this.username = _userName;
        this.password = _password;
    }
    addUser() {
        addData(this);
        CarSharing.getCarSharingIni().updateUserList();
    }
    async register() {
        if (await this.verifyUsername()) {
            CarSharing.getCarSharingIni().setCurrentUser(this);
            this.addUser();
            return true;
        }
        else
            return false;
    }
    async verifyUsername() {
        console.log(this);
        let user = await CarSharing.getCarSharingIni().getUser();
        //RegEx for charackters
        var regExAlphanumeric = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(this.username.toLowerCase()))
            return false;
        for (let i = 0; i < user.length; i++) {
            if (user[i].username === this.username)
                return false;
            console.log(i);
        }
        console.log("I am with u");
        return true;
    }
    async checkLoginData(_userInput) {
        console.log("Checking User...");
        let user = await CarSharing.getCarSharingIni().getUser();
        for (let i = 0; i < user.length; i++) {
            if (user[i].username == _userInput.username && user[i].password == _userInput.password)
                return true;
        }
        return false;
    }
    async isAdmin(_userInput) {
        let user = await CarSharing.getCarSharingIni().getUser();
        for (let i = 0; i < user.length; i++) {
            if (user[i].username == this.username && user[i].role == Role.ADMIN)
                return true;
        }
        return false;
    }
    async showUpcommingDrive() {
        let bookings = await CarSharing.getCarSharingIni().getBooking();
        let upBooking = new Array(bookings.length);
        let e = 0;
        for (let i = 0; i < bookings.length; i++) {
            let bookingBegin = new Date(bookings[i].begin);
            if (bookingBegin.getTime() > +new Date().getTime() && this.username === bookings[i].username) {
                upBooking[e] = bookings[i];
                e++;
            }
        }
        let finalBooking = new Array(e);
        for (let a = 0; a < e; a++) {
            finalBooking[a] = upBooking[a];
        }
        Gui.showBooking(finalBooking);
    }
    async getRecentDrive() {
        let bookings = await CarSharing.getCarSharingIni().getBooking();
        let resBooking = new Array(bookings.length);
        let e = 0;
        for (let i = 0; i < bookings.length; i++) {
            let bookingBegin = new Date(bookings[i].begin);
            if (bookingBegin.getTime() < +new Date().getTime() && this.username === bookings[i].username) {
                resBooking[e] = bookings[i];
                e++;
            }
        }
        let finalBooking = new Array(e);
        for (let a = 0; a < e; a++) {
            finalBooking[a] = resBooking[a];
        }
        Gui.showBooking(finalBooking);
    }
    async numbOfBooking() {
        let bookings = await CarSharing.getCarSharingIni().getBooking();
        let count = 0;
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].username == this.username)
                count++;
        }
        return count;
    }
    async everagePrice() {
        let bookings = await CarSharing.getCarSharingIni().getBooking();
        let sum = 0;
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].username == this.username) {
                if (await CarSharing.getCarSharingIni().getCarByID(bookings[i].car)) {
                    let car = await CarSharing.getCarSharingIni().getCarByID(bookings[i].car);
                    sum += car.calculatePrice(bookings[i]);
                }
            }
        }
        return (sum / await this.numbOfBooking()).toFixed(2);
    }
}
class Admin extends LoggedInUser {
    constructor(_userName, _password) {
        super(_userName, _password);
        this.role = Role.ADMIN;
    }
}
//# sourceMappingURL=User.js.map