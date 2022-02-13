class CarSharing {

    private static carSharingInstance: CarSharing = new CarSharing;
    private user: LoggedInUser[];
    private car: Car[];
    private booking: IBooking[];
    private currentUser: User | LoggedInUser | Admin;


    private constructor() {}

    public static getCarSharingIni(): CarSharing { return this.carSharingInstance; }

     public async startApp(): Promise<void> {

        this.updateCarList()
        this.updateUserList();
        Gui.showButtons();
        
    }

    public async getUser(): Promise<User[]> {

        if (!this.user) this.user = <LoggedInUser[]>await getData("user");
        return this.user;

    }

    public async getCar(): Promise<Car[]> {

        if (!this.car) this.car = <Car[]>await getData("car");
        return this.car;
    }

    async getCarByID(_id: string): Promise<Car> {

        if (!this.car) this.car = <Car[]>await getData("car");

        for (let i: number = 0; i < this.car.length; i++) {
            if (this.car[i].uuid == _id ) return this.car[i];
        }

        return null;
    }

    public async getBooking(): Promise<IBooking[]> {
        if (!this.booking) this.booking = await getBookingDB();

        return this.booking;
    }



    public setCurrentUser(_user: User | LoggedInUser | Admin) {

        this.currentUser = _user;
        sessionStorage.setItem("user", JSON.stringify(_user));

    }

    public getCurrentUser(): User | LoggedInUser | Admin {


        if (!this.currentUser) {
            if (sessionStorage.getItem("user")) this.currentUser = JSON.parse(sessionStorage.getItem("user"));
            else this.currentUser = new User();

        }

        return this.currentUser;

    }


    public logOutCurrentUser():void {

        this.currentUser = new User();
        sessionStorage.setItem("user", JSON.stringify(new User()));
        window.location.reload();
    }



    async updateUserList(): Promise<void> { this.user = <LoggedInUser[]>await getData("User");}



    async updateCarList(): Promise<void> { this.car = <Car[]>await getData("Car"); }


    async getAvailableCar(_date: IBooking, _driveType: DriveType): Promise<Car[]> {


        if (!this.car) await this.updateCarList();

        let availableCar: Car[] = new Array(this.car.length);

        let a: number = 0;
        for (let i: number = 0; i < this.car.length; i++) {
        
            if (await this.car[i].isFreeAt(_date) && this.car[i].driveType == _driveType.valueOf()) {
               
                availableCar[a] = this.car[i];
                a++;
            }
 
        }

        let finalCar: Car[] = new Array(a);

        for (let i: number = 0; i < a; i++) finalCar[i] = availableCar[i];
        
        return finalCar;

    }


    async showFilterRes(_date: IBooking, _driveType: DriveType):Promise <void> {

        let driveType: DriveType = DriveType.CONVENTIONAL
        if (_driveType === DriveType.ELECTRIC) driveType = DriveType.ELECTRIC;
        
        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(_date, driveType))

    }


    async searchCar(_searchInput: string): Promise<Car[]> {

        if (!this.car) {
            await this.updateCarList();
        }
        var reg = new RegExp(_searchInput, "gi");
        let foundCars: Car[] = new Array(this.car.length);


        let e: number = 0;
        for (let i: number = 0; i < this.car.length; i++) {
            if (!(this.car[i].modelDescription.search(reg) == -1)) {
                foundCars[e] = this.car[i];
                e++;

            }
        }

        let finalCar: Car[] = new Array(e);
        for (let i: number = 0; i < e; i++) { finalCar[i] = foundCars[i]; }
        return finalCar;

    }

}