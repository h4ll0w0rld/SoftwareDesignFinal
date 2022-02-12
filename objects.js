"use strict";
class CarSharing {
    user;
    car;
    booking;
    currentUser;
    static carSharingInstance = new CarSharing;
    constructor() { }
    static getCarSharingIni() { return this.carSharingInstance; }
    async getUser() {
        if (!this.user)
            this.user = await getData("user");
        return this.user;
    }
    async getCar() {
        if (!this.car)
            this.car = await getData("car");
        return this.car;
    }
    async getBooking() {
        if (!this.booking)
            this.booking = await getBookingDB();
        return this.booking;
    }
    setUser(_user) {
        this.user = _user;
    }
    setCurrentUser(_user) {
        this.currentUser = _user;
        console.log(_user);
        sessionStorage.setItem("user", JSON.stringify(_user));
        console.log(sessionStorage.getItem("user"));
    }
    getCurrentUser() {
        if (!this.currentUser) {
            if (sessionStorage.getItem("user"))
                this.currentUser = JSON.parse(sessionStorage.getItem("user"));
            else
                this.currentUser = new User();
        }
        return this.currentUser;
    }
    logOutCurrentUser() {
        this.currentUser = new User();
        sessionStorage.setItem("user", JSON.stringify(new User()));
        window.location.reload();
    }
    startApp() {
        this.updateCarList();
        this.updateUserList();
    }
    async updateUserList() {
        this.user = await getData("User");
        console.log("User Update");
    }
    async updateCarList() {
        this.car = await getData("Car");
        console.log("Car Update");
    }
    //-------------- returns true for valid input ---------------------------------
    getCarWithDriveType() {
        console.log("HEy i get called");
    }
    async getAvailableCar(_date, _driveType) {
        if (!this.car) {
            await this.updateCarList();
        }
        let availableCar = new Array();
        for (let i = 0; i < this.car.length; i++) {
            console.log("IIIIIIIIIII");
            let planedDrive = await this.car[i].getBookings();
            for (let e = 0; e < planedDrive.length; e++) {
                if (!await this.car[i].isFreeAt(_date)) {
                    console.log("IST SCHON GEBUCHT");
                    break;
                }
                else if (this.car[i].driveType != _driveType.valueOf()) {
                    console.log("IST DER FALSCHE DRIVETYPE");
                    break;
                }
                else
                    availableCar[i] = this.car[i];
            }
        }
        return availableCar;
    }
    async searchFilter(_date, _driveType) {
        let driveType = DriveType.CONVENTIONAL;
        if (_driveType === DriveType.ELECTRIC)
            driveType = DriveType.ELECTRIC;
        showCar(await CarSharing.getCarSharingIni().getAvailableCar(_date, driveType));
    }
    async searchCar(_car) {
        var reg = new RegExp(_car, "gi");
        let foundCars = new Array(this.car.length);
        if (!this.car) {
            await this.updateCarList();
        }
        let e = 0;
        for (let i = 0; i < this.car.length; i++) {
            if (!(this.car[i].modelDescription.search(reg) == -1)) {
                foundCars[e] = this.car[i];
                e++;
            }
        }
        let finalCar = new Array(e);
        for (let i = 0; i < e; i++) {
            finalCar[i] = foundCars[i];
        }
        return finalCar;
    }
}
var DriveType;
(function (DriveType) {
    DriveType[DriveType["ELECTRIC"] = 0] = "ELECTRIC";
    DriveType[DriveType["CONVENTIONAL"] = 1] = "CONVENTIONAL";
})(DriveType || (DriveType = {}));
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["LOGGEDINUSER"] = 1] = "LOGGEDINUSER";
    Role[Role["ADMIN"] = 2] = "ADMIN";
})(Role || (Role = {}));
class Car {
    uuid;
    modelDescription;
    driveType;
    earliestUsableTime;
    latestUsageTime;
    maxUseTime;
    flateRate;
    pricePerMinute;
    image;
    planedDrive;
    constructor(_uuid, _modelDescription, _driveType, _earliestUsableTime, _latestUsageTime, _maxUseTime, _flateRate, _pricePerMinute, _image) {
        this.uuid = _uuid;
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUsableTime = _earliestUsableTime;
        this.latestUsageTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMinute = _pricePerMinute;
        this.image = _image;
    }
    addCar() {
        console.log("adding Car" + this);
        addData(this);
        CarSharing.getCarSharingIni().updateCarList();
    }
    async getBookings() {
        if (!this.planedDrive) {
            this.planedDrive = await CarSharing.getCarSharingIni().getBooking();
        }
        let bookings = new Array(this.planedDrive.length);
        let e = 0;
        for (let i = 0; i < bookings.length; i++) {
            if (this.uuid == this.planedDrive[i].car) {
                bookings[e] = this.planedDrive[i];
                e++;
            }
        }
        let finalBookings = new Array();
        for (let a = 0; a < e; a++) {
            finalBookings[a] = bookings[a];
        }
        return finalBookings;
    }
    async isFreeAt(_time) {
        let bookings = await this.getBookings();
        for (let i = 0; i < bookings.length; i++) {
            let beginDate = new Date(bookings[i].begin);
            let endDate = new Date(bookings[i].end);
            //If given Time is inbetween or arround an already exisiting Time: return = false 
            if (_time.begin.getTime() >= beginDate.getTime() && _time.begin.getTime() <= endDate.getTime())
                return false;
            else if (_time.end.getTime() >= beginDate.getTime() && _time.end.getTime() <= endDate.getTime())
                return false;
            else if (_time.begin <= beginDate && _time.end >= endDate)
                return false;
        }
        return true;
    }
    checkDuration(_time) {
        let durationInMillis = _time.end.getTime() - _time.begin.getTime();
        let durationInMin = (durationInMillis / 1000) / 60;
        if (durationInMin >= this.maxUseTime)
            return false;
        return true;
    }
    checkUseTime(_time) {
        let begin = (_time.begin.getHours() * 60) + _time.begin.getMinutes();
        let end = (_time.end.getHours() * 60) + _time.end.getMinutes();
        let earliestPosib = this.earliestUsableTime.split(":", 2);
        let latestPosib = this.latestUsageTime.split(":", 2);
        let earlyNumb = parseInt(earliestPosib[0]) * 60 + parseInt(earliestPosib[1]);
        let lateNumb = parseFloat(latestPosib[0]) * 60 + parseFloat(latestPosib[1]);
        if (begin <= lateNumb && end >= earlyNumb)
            return true;
        return false;
    }
}
class User {
    role;
    constructor() {
        this.role = Role.USER;
    }
}
class LoggedInUser extends User {
    userName;
    password;
    drivingData;
    constructor(_userName, _password) {
        super();
        this.role = Role.LOGGEDINUSER;
        this.userName = _userName;
        this.password = _password;
    }
    addUser() {
        addData(this);
        CarSharing.getCarSharingIni().updateUserList();
    }
    async verifyUsername() {
        let user = await CarSharing.getCarSharingIni().getUser();
        //RegEx for charackters
        var regExAlphanumeric = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(this.userName.toLowerCase()))
            return false;
        for (let i = 0; i < user.length; i++) {
            if (user[i].userName === this.userName)
                return false;
        }
        return true;
    }
    async register() {
        if (this.verifyUsername()) {
            this.addUser();
            console.log("Login succsesful ! ");
        }
        else
            console.log("User allready exists");
    }
    async checkLogin(_userInput) {
        console.log("Checking User...");
        let user = await CarSharing.getCarSharingIni().getUser();
        for (let i = 0; i < user.length; i++) {
            if (user[i].userName === _userInput.userName && user[i].password === _userInput.password) {
                console.log("User name und passwort stimmen");
                return true;
            }
        }
        return false;
    }
    async isAdmin(_userInput) {
        let user = await CarSharing.getCarSharingIni().getUser();
        for (let i = 0; i < user.length; i++) {
            if (user[i].userName == this.userName && user[i].role == Role.ADMIN)
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
            if (bookingBegin.getTime() > +new Date().getTime() && this.userName === bookings[i].username) {
                upBooking[e] = bookings[i];
                e++;
            }
        }
        let finalBooking = new Array(e);
        for (let a = 0; a < e; a++) {
            finalBooking[a] = upBooking[a];
        }
        console.log(finalBooking);
        return finalBooking;
    }
    async getRecentDrive() {
        let bookings = await CarSharing.getCarSharingIni().getBooking();
        let resBooking = new Array();
        let e = 0;
        for (let i = 0; i < bookings.length; i++) {
            let bookingBegin = new Date(bookings[i].begin);
            if (bookingBegin.getTime() < +new Date().getTime() && this.userName === bookings[i].username) {
                resBooking[e] = bookings[i];
                e++;
            }
        }
        let finalBooking = new Array(e);
        for (let a = 0; a < e; a++) {
            finalBooking[a] = resBooking[a];
        }
        console.log(finalBooking);
        return finalBooking;
    }
}
class Admin extends LoggedInUser {
    constructor(_userName, _password) {
        super(_userName, _password);
        this.role = Role.ADMIN;
    }
    addCar() {
    }
}
//# sourceMappingURL=objects.js.map