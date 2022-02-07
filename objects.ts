class CarSharing {


    private user: LoggedInUser[];
    private car: Car[];


    private static carSharingInstance: CarSharing = new CarSharing;

    private constructor() {


    }

    public static getCarSharingIni(): CarSharing { return this.carSharingInstance; }

    public getUser(): User[] { return this.user; }

    public getCar(): Car[] { return this.car; }

    public setUser(_user: LoggedInUser[]) {
        this.user = _user;
    }


    public startApp(): void {


        this.updateCarList()
        this.updateUserList();

        //Load Cars
        //Erzeugen von Standart Benutzer ? 


    }

    addUser(_user: LoggedInUser): void {

        console.log("user" + _user.userName);
        addData(_user);

    }
    async updateUserList(): Promise<void> {

        this.user = <LoggedInUser[]>await getData("User");
        console.log("User Update");


    }
    async updateCarList(): Promise<void> {

        this.car = <Car[]>await getData("Car");
        console.log("Car Update");


    }



    async checkLogin(_userInput: LoggedInUser): Promise<boolean> {

        console.log("Checking User...");

        if (!this.user) {
            await this.updateUserList();
        }


        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName && this.user[i].password == _userInput.password) {

                return true;
            }
        }

        return false;

    }


    //-------------- returns true for valid input ---------------------------------
    async addAcc(_userInput: LoggedInUser) {

        if (!this.user) {
            await this.updateUserList();
        }

        //Check with RegEx
        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName) {

                return false;
            }
        }

        return true;


    }


    async searchCar(_car: string): Promise<Car[]> {

        var reg = new RegExp(_car, "gi");
        let foundCars: Car[] = new Array(this.car.length);

        if (!this.user) {
            await this.updateUserList();
        }
        let e: number = 0;
        for (let i: number = 0; i < this.car.length; i++) {
            if (!(this.car[i].modelDescription.search(reg) == -1)) {
                foundCars[e] = this.car[i];
                e++;

            }


        }
        let finalCar: Car[] = new Array(e);
        for (let i: number = 0; i < e; i++) {
            finalCar[i] = foundCars[i];

        }
        return finalCar;





    }
}





enum DriveType {
    ELECTRIC, CONVENTIONAL
}
enum Role {
    USER, LOGGEDINUSER, ADMIN
}




class Car {
    uuid: string;
    modelDescription: string;
    driveType: DriveType;
    earliestUsableTime: number;
    latestUsageTime: number;
    maxUseTime: number;
    flateRate: number;
    pricePerMinute: number;

    bookings: Date[];
    image: string;
    
    //TODO add image string
    constructor(_modelDescription: string, _driveType:DriveType,_earliestUsableTime:number,_latestUsageTime:number,_maxUseTime:number,_flateRate:number, _pricePerMinute:number) {
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUsableTime = _earliestUsableTime;
        this.latestUsageTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMinute = _pricePerMinute;
       // this.image = _image;

    }
    constructorWithUUID(_uuid:string,_modelDescription: string, _driveType:DriveType,_earliestUsableTime:number,_latestUsageTime:number,_maxUseTime:number,_flateRate:number, _pricePerMinute:number) {
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUsableTime = _earliestUsableTime;
        this.latestUsageTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMinute = _pricePerMinute;
       // this.image = _image;

    }
    isFree(_date: Date): boolean {

        if (this.bookings) {
            let newBooking: Date[] = new Array(this.bookings.length)
            for (let i: number = 0; i < newBooking.length; i++) {
                if (i < newBooking.length) newBooking[i] = this.bookings[i];
                else newBooking[i] = _date;

            }
            this.bookings = newBooking;
            return false;

        } else {
            this.bookings = new Array(_date);
        }
        return true


    }
    bookCar(_date: Date) {
        if (this.bookings) {
            let newBooking: Date[] = new Array(this.bookings.length)
            for (let i: number = 0; i < newBooking.length; i++) {
                if (i < newBooking.length) newBooking[i] = this.bookings[i];
                else newBooking[i] = _date;

            }
            this.bookings = newBooking;


        } else this.bookings = new Array(_date);

        CarSharing.getCarSharingIni().updateCarList;



    }

}



class Drive {
    dateOfBooking: Date;
    duration: number;
    car: Car;
}



class DrivingData {
    planedDrive: Drive[];
    pastDrive: Drive[];


}




class User {

    role: Role;

    constructor() {
        this.role = Role.USER;


    }
    static async login(_user: LoggedInUser) {
        let carShare: CarSharing = CarSharing.getCarSharingIni();
        if (await carShare.checkLogin(_user)) {
            sessionStorage.setItem("user", JSON.stringify(_user));
            console.log("Login succesful");
            showLogin();
        }




    }
    static async register(_user: LoggedInUser) {
        let carShare: CarSharing = CarSharing.getCarSharingIni();
        if (await carShare.addAcc(_user)) {
            carShare.addUser(_user);
            console.log("Login succsesful ! ")
        } else console.log("User allready exists");

        //
    }



}


class LoggedInUser extends User {
    userName: string;
    password: string;
    drivingData: DrivingData;

    constructor(_userName: string, _password: string) {
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
    constructor(_userName: string, _password: string) {
        super(_userName, _password);
        this.role = Role.ADMIN;


    }

    addCar() {

    }


}