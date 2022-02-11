

class CarSharing {


    private user: LoggedInUser[];
    private car: Car[];
    currentUser: User | LoggedInUser | Admin;


    private static carSharingInstance: CarSharing = new CarSharing;

    private constructor() {



    }

    public static getCarSharingIni(): CarSharing { return this.carSharingInstance; }

    public getUser(): User[] { return this.user; }

    public getCar(): Car[] { return this.car; }

    public setUser(_user: LoggedInUser[]) {
        this.user = _user;
    }

    public setCurrentUser(_user: User | LoggedInUser | Admin) {
        this.currentUser = _user;
        console.log(_user);
        sessionStorage.setItem("user", JSON.stringify(_user));
        console.log(sessionStorage.getItem("user"));

    }
    public getCurrentUser(): User | LoggedInUser | Admin {


        if (!this.currentUser) {
            if (sessionStorage.getItem("user")) this.currentUser = JSON.parse(sessionStorage.getItem("user"));
            else this.currentUser = new User();

        }

        return this.currentUser;

    }


    public logOutCurrentUser() {

        this.currentUser = new User();
        sessionStorage.setItem("user", JSON.stringify(new User()));
        window.location.reload();
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
        this.updateUserList();

    }

    addCar(_car: Car): void {

        console.log("adding Car" + _car);
        addData(_car);
        this.updateCarList();

    }

    async updateUserList(): Promise<void> {

        this.user = <LoggedInUser[]>await getData("User");
        console.log("User Update");


    }



    async updateCarList(): Promise<void> {

        this.car = <Car[]>await getData("Car");
        console.log("Car Update");

    }

    async verifyUsername(_user: LoggedInUser): Promise<boolean> {
        console.log("verifiing");

        if (!this.user) {
            await this.updateUserList();
        }
        var regExAlphanumeric: RegExp = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(_user.userName)) return false;
        //RegEx for charackters

        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _user.userName) {
                console.log("USSSSER ALLREADY THERE")
                return false;
            }

        }

        return true;


    }



    async checkLogin(_userInput: LoggedInUser): Promise<boolean> {

        console.log("Checking User...");

        if (!this.user) {
            await this.updateUserList();
        }


        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _userInput.userName && this.user[i].password === _userInput.password) {
                console.log("User name und passwort stimmen")

                return true;


            }
        }

        return false;

    }
    async isAdmin(_userInput: LoggedInUser) {

        if (!this.user) {
            await this.updateUserList();
        }


        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName && this.user[i].role == Role.ADMIN) {


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


        for (let i: number = 0; i < this.user.length; i++) {
            if (this.user[i].userName === _userInput.userName) {

                return false;
            }
        }

        return true;


    }
    getCarWithDriveType() {
        console.log("HEy i get called");

    }

    async getAvailableCar(_date: Date): Promise<Car[]> {

        if (!this.car) await this.updateCarList();

        let availableCar: Car[] = new Array();

        for (let i: number = 0; i < this.car.length; i++) {
            for (let e: number = 0; e < this.car[i].planedDrive.length; e++) {

                if (_date >= this.car[i].planedDrive[e].begin && _date <= this.car[i].planedDrive[e].end) break;
                else availableCar[i] = this.car[i];

            }

        }
        return availableCar;

    }



    async searchCar(_car: string): Promise<Car[]> {

        var reg = new RegExp(_car, "gi");
        let foundCars: Car[] = new Array(this.car.length);

        if (!this.car) {
            await this.updateCarList();
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
class BookingDate {

    date: string;
    time: String;
    duration: number;

}




class Car {

    uuid: string;
    modelDescription: string;
    driveType: DriveType;
    earliestUsableTime: string;
    latestUsageTime: string;
    maxUseTime: number;
    flateRate: number;
    pricePerMinute: number;
    image: string;

    planedDrive: IDriveData[];



    constructor(_uuid: string, _modelDescription: string, _driveType: DriveType, _earliestUsableTime: string, _latestUsageTime: string, _maxUseTime: number, _flateRate: number, _pricePerMinute: number, _image: string) {
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






    async getBookings(): Promise<IDriveData[]> {

        if (!this.planedDrive) {

            this.planedDrive = await getBooking();
        }

        let bookings: IDriveData[] = new Array(this.planedDrive.length);
        let e: number = 0;
        for (let i: number = 0; i < bookings.length; i++) {

            if (this.uuid == this.planedDrive[i].car) {
                bookings[e] = this.planedDrive[i];
                e++;
            }

        }
        let finalBookings: IDriveData[] = new Array()
        for (let a: number = 0; a < e; a++) {
            finalBookings[a] = bookings[a];
        }


        return finalBookings;
    }


    async isFreeAt(_time: IDriveData): Promise <boolean>{

        let bookings: IDriveData[] = await this.getBookings()
        console.log("***********************")
        console.log("is to long: "+ this.checkUseTime(_time))
       
       
       // console.log(bookings);
        for (let i: number = 0; i < bookings.length; i++) {
            let beginDate:Date = new Date(bookings[i].begin);
            let endDate:Date = new Date(bookings[i].end);

           // let currentBooking:IDriveData =  {begin: bookings[i].begin, end:bookings[i].end, username:bookings[i].username, car:bookings[i].car} as IDriveData;            //If given Time is inbetween or arround an already exisiting Time: return = false 
            if (_time.begin.getTime() >= beginDate.getTime() && _time.begin.getTime() <= endDate.getTime()) return false;


            else if (_time.end.getTime() >= beginDate.getTime() && _time.end.getTime() <= endDate.getTime()) return false;


            else if (_time.begin <= beginDate && _time.end >= endDate) return false;
        }

        return true;

    }



    checkDuration(_time: IDriveData): boolean {

        let durationInMillis: number = _time.end.getTime() - _time.begin.getTime();
        let durationInMin: number = (durationInMillis / 1000) / 60;

        if (durationInMin >= this.maxUseTime) return false;
        return true;

    }
    checkUseTime(_time: IDriveData):boolean {
       
        let begin:number = (_time.begin.getHours()*60)+_time.begin.getMinutes();
        let end:number = (_time.end.getHours()*60)+_time.end.getMinutes();
    
        let earliestPosib:string[] = this.earliestUsableTime.split(":",2);
        let latestPosib:string[] = this.latestUsageTime.split(":",2);
        
    
        let earlyNumb:number = parseInt(earliestPosib[0])*60 + parseInt(earliestPosib[1]) ;
        let lateNumb:number = parseFloat(latestPosib[0])*60 + parseFloat(latestPosib[1]);
   
        if (begin <= lateNumb && end >= earlyNumb) return true;

        return false;

    }




}

interface IDriveData {
    begin: Date;
    end: Date;
    username: string;
    car: string;

}

interface IBooking {
    driveData: IDriveData;

}


class Drive {
    dateOfBooking: IDriveData;
    duration: number;
    // car: Car;
}

interface ICarDAO {

    _id: string;
    modelDescription: string;
    driveType: DriveType;
    earliestUsableTime: string;
    latestUsageTime: string;
    maxUseTime: number;
    flateRate: number;
    pricePerMinute: number;
    image: string;


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
            window.location.reload();
            //showLogin();
        }




    }
    static async register(_user: LoggedInUser) {
        let carShare: CarSharing = CarSharing.getCarSharingIni();
        if (await carShare.addAcc(_user)) {
            carShare.addUser(_user);
            console.log("Login succsesful ! ")
        } else console.log("User allready exists");


    }



}


class LoggedInUser extends User {
    userName: string;
    password: string;
    drivingData: IDriveData;

    constructor(_userName: string, _password: string) {
        super();
        this.role = Role.LOGGEDINUSER;
        this.userName = _userName;
        this.password = _password;
    }

    bookCar() {


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