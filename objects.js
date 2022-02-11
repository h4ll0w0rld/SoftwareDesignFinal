"use strict";
class CarSharing {
    user;
    car;
    currentUser;
    static carSharingInstance = new CarSharing;
    constructor() {
    }
    static getCarSharingIni() { return this.carSharingInstance; }
    getUser() { return this.user; }
    getCar() { return this.car; }
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
        //Load Cars
        //Erzeugen von Standart Benutzer ? 
    }
    addUser(_user) {
        console.log("user" + _user.userName);
        addData(_user);
        this.updateUserList();
    }
    addCar(_car) {
        console.log("adding Car" + _car);
        addData(_car);
        this.updateCarList();
    }
    async updateUserList() {
        this.user = await getData("User");
        console.log("User Update");
    }
    async updateCarList() {
        this.car = await getData("Car");
        console.log("Car Update");
    }
    async verifyUsername(_user) {
        console.log("verifiing");
        if (!this.user) {
            await this.updateUserList();
        }
        var regExAlphanumeric = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(_user.userName))
            return false;
        //RegEx for charackters
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _user.userName) {
                console.log("USSSSER ALLREADY THERE");
                return false;
            }
        }
        return true;
    }
    async checkLogin(_userInput) {
        console.log("Checking User...");
        if (!this.user) {
            await this.updateUserList();
        }
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _userInput.userName && this.user[i].password === _userInput.password) {
                console.log("User name und passwort stimmen");
                return true;
            }
        }
        return false;
    }
    async isAdmin(_userInput) {
        if (!this.user) {
            await this.updateUserList();
        }
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName && this.user[i].role == Role.ADMIN) {
                return true;
            }
        }
        return false;
    }
    //-------------- returns true for valid input ---------------------------------
    async addAcc(_userInput) {
        if (!this.user) {
            await this.updateUserList();
        }
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _userInput.userName) {
                return false;
            }
        }
        return true;
    }
    getCarWithDriveType() {
        console.log("HEy i get called");
    }
    async getAvailableCar(_date) {
        if (!this.car)
            await this.updateCarList();
        let availableCar = new Array();
        for (let i = 0; i < this.car.length; i++) {
            for (let e = 0; e < this.car[i].planedDrive.length; e++) {
                if (_date >= this.car[i].planedDrive[e].begin && _date <= this.car[i].planedDrive[e].end)
                    break;
                else
                    availableCar[i] = this.car[i];
            }
        }
        return availableCar;
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
class BookingDate {
    date;
    time;
    duration;
}
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
    async updateCar() {
        console.log("updating a car");
        await updateCarDB(this);
        await CarSharing.getCarSharingIni().updateCarList();
    }
    // async addDrive(_drive: IDriveData): Promise<void> {
    //     if (!this.planedDrive) {
    //         this.planedDrive = new Array(_drive);
    //     }
    //     let newDrivingData: IDriveData[] = new Array(this.planedDrive.length+1);
    //     for (let i: number = 0; i < newDrivingData.length; i++) {
    //         console.log(i)
    //         if (i < newDrivingData.length){
    //             newDrivingData[i] = this.planedDrive[i];
    //         } 
    //         else newDrivingData[i] = _drive;
    //     }
    //     console.log("----------__-----")
    //     console.log(newDrivingData);
    //     this.planedDrive = newDrivingData;
    //     updateCarDB(this);
    //    // 
    // }
    isFreeAt(_time) {
        if (this.planedDrive) {
            for (let i = 0; i < this.planedDrive.length; i++) {
                //If given Time is inbetween or arround an already exisiting Time return = false 
                if (_time.begin.getTime() >= this.planedDrive[i].begin.getTime() && _time.begin.getTime() <= this.planedDrive[i].end.getTime())
                    return false;
                else if (_time.end.getTime() >= this.planedDrive[i].begin.getTime() && _time.end.getTime() <= this.planedDrive[i].end.getTime())
                    return false;
                else if (_time.begin <= this.planedDrive[i].begin && _time.end >= this.planedDrive[i].end)
                    return false;
            }
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
        if (_time.begin.getTime() <= this.latestUsageTime && this.latestUsageTime >= this.earliestUsableTime)
            return true;
        return false;
    }
}
class Drive {
    dateOfBooking;
    duration;
}
class User {
    role;
    constructor() {
        this.role = Role.USER;
    }
    static async login(_user) {
        let carShare = CarSharing.getCarSharingIni();
        if (await carShare.checkLogin(_user)) {
            sessionStorage.setItem("user", JSON.stringify(_user));
            console.log("Login succesful");
            window.location.reload();
            //showLogin();
        }
    }
    static async register(_user) {
        let carShare = CarSharing.getCarSharingIni();
        if (await carShare.addAcc(_user)) {
            carShare.addUser(_user);
            console.log("Login succsesful ! ");
        }
        else
            console.log("User allready exists");
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
    checkLoginData() {
    }
    bookCar() {
    }
    showPastDrive() {
    }
    showPlanedDrives() {
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