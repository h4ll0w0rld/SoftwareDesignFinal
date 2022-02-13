class User {
    role: Role;

    constructor() { this.role = Role.USER; }
 
}


class LoggedInUser extends User {
    username: string;
    password: string;
    drivingData: IBooking;

    constructor(_userName: string, _password: string) {
        super();
        this.role = Role.LOGGEDINUSER;
        this.username = _userName;
        this.password = _password;
    }


    addUser(): void {

        addData(this);
        CarSharing.getCarSharingIni().updateUserList();

    }

    async register():Promise <boolean> {

        if (await this.verifyUsername()) {
            CarSharing.getCarSharingIni().setCurrentUser(this)
            this.addUser();
            return true;

        } else return false;


    }

    async verifyUsername(): Promise<boolean> {
        console.log(this);
        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();
      
        //RegEx for charackters
        var regExAlphanumeric: RegExp = new RegExp("^[a-z0-9]+$");
        if (!regExAlphanumeric.test(this.username.toLowerCase())) return false;

        for (let i: number = 0; i < user.length; i++) {

            if (user[i].username === this.username) return false;
            console.log(i)
        }
        console.log("I am with u")
        return true;

    }
   


    async checkLoginData(_userInput: LoggedInUser): Promise<boolean> {

        console.log("Checking User...");
        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();
       
        for (let i: number = 0; i < user.length; i++) {
           
            if (user[i].username == _userInput.username && user[i].password == _userInput.password) return true;
        }

        return false;

    }


    async isAdmin(_userInput: LoggedInUser): Promise <boolean> {

        let user: LoggedInUser[] | Admin[] = <LoggedInUser[] | Admin[]>await CarSharing.getCarSharingIni().getUser();

        for (let i: number = 0; i < user.length; i++) {

            if (user[i].username == this.username && user[i].role == Role.ADMIN) return true;

        }

        return false;

    }

    async showUpcommingDrive(): Promise<void> {

        let bookings: IBooking[] = await CarSharing.getCarSharingIni().getBooking();
        let upBooking: IBooking[] = new Array(bookings.length);

        let e: number = 0;
        for (let i: number = 0; i < bookings.length; i++) {

            let bookingBegin: Date = new Date(bookings[i].begin);
            if (bookingBegin.getTime() > +new Date().getTime() && this.username === bookings[i].username) {
                upBooking[e] = bookings[i];
                e++

            }
        }

        let finalBooking: IBooking[] = new Array(e);
        for (let a: number = 0; a < e; a++) { finalBooking[a] = upBooking[a]; }

        Gui.showBooking(finalBooking);
      
    }

    async getRecentDrive() {

        let bookings: IBooking[] = await CarSharing.getCarSharingIni().getBooking();

        let resBooking: IBooking[] = new Array(bookings.length);

        let e: number = 0;
        for (let i: number = 0; i < bookings.length; i++) {

            let bookingBegin: Date = new Date(bookings[i].begin);
            if (bookingBegin.getTime() < +new Date().getTime() && this.username === bookings[i].username) {
                resBooking[e] = bookings[i];
                e++

            }
        }

        let finalBooking: IBooking[] = new Array(e);

        for (let a: number = 0; a < e; a++) { finalBooking[a] = resBooking[a]; }
       
        Gui.showBooking(finalBooking);

        
    }
    async numbOfBooking():Promise<number> {

        let bookings: IBooking[] = await CarSharing.getCarSharingIni().getBooking();
        let count: number = 0;

        for (let i: number = 0; i < bookings.length; i++) {
            if (bookings[i].username == this.username) count++;

        }
        return count;
    }


    async everagePrice():Promise<string> {
       
        let bookings: IBooking[] = await CarSharing.getCarSharingIni().getBooking();

        let sum: number = 0;
        for (let i: number = 0; i < bookings.length; i++) {
            if (bookings[i].username == this.username) {
                if (await CarSharing.getCarSharingIni().getCarByID(bookings[i].car)) {

                    let car: Car = await CarSharing.getCarSharingIni().getCarByID(bookings[i].car);
                    sum += car.calculatePrice(bookings[i])
                }

            }

        }
        return (sum / await this.numbOfBooking()).toFixed(2);

    }

}



class Admin extends LoggedInUser {

    constructor(_userName: string, _password: string) {
        super(_userName, _password);

        this.role = Role.ADMIN;

    }

}