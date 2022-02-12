class CarSharing {


    private user: LoggedInUser[];
    private car: Car[];
    private booking:IDriveData[];
    currentUser: User | LoggedInUser | Admin;


    private static carSharingInstance: CarSharing = new CarSharing;

    private constructor() { }

    public static getCarSharingIni(): CarSharing { return this.carSharingInstance; }

    public async getUser(): Promise<User[]> {

        if (!this.user)this.user= <LoggedInUser[]> await getData("user");
        return this.user;

    }

    public async getCar():Promise<Car[]> {
        if(!this.car) this.car = <Car[]> await getData("car");
        return this.car;
    }

    public async getBooking():Promise<IDriveData[]> {
        if(!this.booking) this.booking= await getBookingDB();
    
        return this.booking;
    }



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

    }




    async updateUserList(): Promise<void> {

        this.user = <LoggedInUser[]>await getData("User");
        console.log("User Update");


    }



    async updateCarList(): Promise<void> {

        this.car = <Car[]>await getData("Car");
        console.log("Car Update");

    }




    //-------------- returns true for valid input ---------------------------------

    getCarWithDriveType() {
        console.log("HEy i get called");

    }



    async getAvailableCar(_date: IDriveData, _driveType:DriveType): Promise<Car[]> {

        if (!this.car){

            await this.updateCarList();
        } 

        let availableCar: Car[] = new Array();
      
       
        for (let i: number = 0; i < this.car.length; i++) {
            console.log("IIIIIIIIIII");
            let planedDrive:IDriveData[] = await this.car[i].getBookings();
            for (let e: number = 0; e < planedDrive.length; e++) {

                if (!await this.car[i].isFreeAt(_date)){
                    console.log("IST SCHON GEBUCHT")
                    break;
                }else if(this.car[i].driveType != _driveType.valueOf()){
                    console.log("IST DER FALSCHE DRIVETYPE")
                    break;
                }else availableCar[i] = this.car[i];
              

            }

        }
        return availableCar;

    }


    async searchFilter(_date:IDriveData,_driveType:DriveType ){
        let driveType: DriveType = DriveType.CONVENTIONAL
       
        
        if (_driveType === DriveType.ELECTRIC) driveType = DriveType.ELECTRIC;
           
        showCar(await CarSharing.getCarSharingIni().getAvailableCar(_date, driveType))

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



    addCar(): void {

        console.log("adding Car" + this);
        addData(this);
        CarSharing.getCarSharingIni().updateCarList();

    }


    async getBookings(): Promise<IDriveData[]> {

        if (!this.planedDrive) {
         
            this.planedDrive = await CarSharing.getCarSharingIni().getBooking();
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


    async isFreeAt(_time: IDriveData): Promise<boolean> {

        let bookings: IDriveData[] = await this.getBookings()

        for (let i: number = 0; i < bookings.length; i++) {
            let beginDate: Date = new Date(bookings[i].begin);
            let endDate: Date = new Date(bookings[i].end);

            //If given Time is inbetween or arround an already exisiting Time: return = false 
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
    checkUseTime(_time: IDriveData): boolean {

        let begin: number = (_time.begin.getHours() * 60) + _time.begin.getMinutes();
        let end: number = (_time.end.getHours() * 60) + _time.end.getMinutes();

        let earliestPosib: string[] = this.earliestUsableTime.split(":", 2);
        let latestPosib: string[] = this.latestUsageTime.split(":", 2);
        let earlyNumb: number = parseInt(earliestPosib[0]) * 60 + parseInt(earliestPosib[1]);
        let lateNumb: number = parseFloat(latestPosib[0]) * 60 + parseFloat(latestPosib[1]);
        
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
    // static async login(_user: LoggedInUser) {
    //     let carShare: CarSharing = CarSharing.getCarSharingIni();
    //     if (await carShare.checkLogin(_user)) {
    //         sessionStorage.setItem("user", JSON.stringify(_user));
    //         console.log("Login succesful");
    //         window.location.reload();
    //         //showLogin();
    //     }




    // }



    // async verifyUsername(_userInput: LoggedInUser) {
    //     let user:LoggedInUser[] | Admin [] = CarSharing.getCarSharingIni().getUser();

    //     for (let i: number = 0; i < user.length; i++) {
    //         if (user[i].userName === this.userName) {

    //             return false;
    //         }
    //     }

    //     return true;


    // }







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


    addUser(): void {

        addData(this);
        CarSharing.getCarSharingIni().updateUserList();

    }

    async verifyUsername(): Promise<boolean> {
       
        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();

        //RegEx for charackters
        var regExAlphanumeric: RegExp = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(this.userName.toLowerCase())) return false;


        for (let i: number = 0; i < user.length; i++) {

            if (user[i].userName === this.userName)  return false;
    
        }

        return true;


    }
    async register() {

        if (this.verifyUsername()) {
            this.addUser();
            console.log("Login succsesful ! ");

        } else console.log("User allready exists");


    }


    async checkLogin(_userInput: LoggedInUser): Promise<boolean> {

        console.log("Checking User...");
        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();

        for (let i: number = 0; i < user.length; i++) {
            if (user[i].userName === _userInput.userName && user[i].password === _userInput.password) {

                console.log("User name und passwort stimmen");

                return true;

            }
        }

        return false;

    }


    async isAdmin(_userInput: LoggedInUser) {

        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();

        for (let i: number = 0; i < user.length; i++) {

            if (user[i].userName == this.userName && user[i].role == Role.ADMIN) return true;

        }

        return false;


    }

    async showUpcommingDrive ():Promise<IDriveData[]>{
    
        let bookings:IDriveData[] = await CarSharing.getCarSharingIni().getBooking();

        let upBooking:IDriveData[] = new Array(bookings.length);

        let e:number = 0;
        for(let i:number = 0; i < bookings.length; i++){
         
            let bookingBegin:Date = new Date(bookings[i].begin);
            if(bookingBegin.getTime() > +new Date().getTime() && this.userName === bookings[i].username){
                upBooking[e] = bookings[i];
                e++
                
            } 
        }
        let finalBooking:IDriveData[] = new Array(e);
        for(let a:number = 0; a<e; a++){
            finalBooking[a] = upBooking[a];

        }
         console.log(finalBooking)
        return finalBooking;
    }

    async getRecentDrive(){
     
        let bookings:IDriveData[] = await CarSharing.getCarSharingIni().getBooking();

        let resBooking:IDriveData[] = new Array();

        
        let e:number = 0;
        for(let i:number = 0; i < bookings.length; i++){
         
            let bookingBegin:Date = new Date(bookings[i].begin);
            if(bookingBegin.getTime() < +new Date().getTime() && this.userName === bookings[i].username){
                resBooking[e] = bookings[i];
                e++
                
            } 
        }
        let finalBooking:IDriveData[] = new Array(e);
        for(let a:number = 0; a<e; a++){
            finalBooking[a] = resBooking[a];

        }

       console.log(finalBooking)
        return finalBooking;


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