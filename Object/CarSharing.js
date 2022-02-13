"use strict";
class CarSharing {
    static carSharingInstance = new CarSharing;
    user;
    car;
    booking;
    currentUser;
    constructor() { }
    static getCarSharingIni() { return this.carSharingInstance; }
    async startApp() {
        this.updateCarList();
        this.updateUserList();
        Gui.showButtons();
    }
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
    async getCarByID(_id) {
        if (!this.car)
            this.car = await getData("car");
        for (let i = 0; i < this.car.length; i++) {
            if (this.car[i].uuid == _id)
                return this.car[i];
        }
        return null;
    }
    async getBooking() {
        if (!this.booking)
            this.booking = await getBookingDB();
        return this.booking;
    }
    setCurrentUser(_user) {
        this.currentUser = _user;
        sessionStorage.setItem("user", JSON.stringify(_user));
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
    async updateUserList() { this.user = await getData("User"); }
    async updateCarList() { this.car = await getData("Car"); }
    async getAvailableCar(_date, _driveType) {
        if (!this.car)
            await this.updateCarList();
        let availableCar = new Array(this.car.length);
        let a = 0;
        for (let i = 0; i < this.car.length; i++) {
            if (await this.car[i].isFreeAt(_date) && this.car[i].driveType == _driveType.valueOf()) {
                availableCar[a] = this.car[i];
                a++;
            }
        }
        let finalCar = new Array(a);
        for (let i = 0; i < a; i++)
            finalCar[i] = availableCar[i];
        return finalCar;
    }
    async showFilterRes(_date, _driveType) {
        let driveType = DriveType.CONVENTIONAL;
        if (_driveType === DriveType.ELECTRIC)
            driveType = DriveType.ELECTRIC;
        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(_date, driveType));
    }
    async searchCar(_searchInput) {
        if (!this.car) {
            await this.updateCarList();
        }
        var reg = new RegExp(_searchInput, "gi");
        let foundCars = new Array(this.car.length);
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
//# sourceMappingURL=CarSharing.js.map