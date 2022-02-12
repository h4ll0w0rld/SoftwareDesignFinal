


let user1: User = new User();
let user2: LoggedInUser = new LoggedInUser("DerTester", "sicher:(");
let admin: Admin = new Admin("admin", "admin");
//CarSharing.getCarSharingIni().addUser(admin);
//let userArray: LoggedInUser[] = new Array(user1, user2);
let carSharingApp: CarSharing = CarSharing.getCarSharingIni();
//console.log(carSharingApp.getCurrentUSer())




//let currentUser: any = CarSharing.getCarSharingIni().getCurrentUser();
let bttn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("show_car_bttn");
bttn.addEventListener("click", filterEvent);
async function filterEvent() {

   
    let dateInput: HTMLFormElement = <HTMLFormElement>document.getElementById("filter_form");
  
    let formData:FormData = new FormData(dateInput);
   
    let dateBeginn = new Date(formData.get("date_input") + "T" + formData.get("time_input"));
    let inputTime: IDriveData = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(<string>formData.get("duration"))), username: user.userName, car: null } as IDriveData
    let driveType: DriveType = DriveType.CONVENTIONAL
  
    //console.log("starting offf filer Event");
    if (formData.get("driveType") === "Electric"){
        driveType = DriveType.ELECTRIC;
    }
   
    //console.log(await CarSharing.getCarSharingIni().getAvailableCar(inputTime, driveType));
   showCar(await CarSharing.getCarSharingIni().getAvailableCar(inputTime, driveType))
    //console.log(await CarSharing.getCarSharingIni().getCar())

    console.log("WWWWWWWWWWWWWWWWWWWWW");
    console.log(await user.showUpcommingDrive())

}

carSharingApp.startApp();

let user: LoggedInUser = new LoggedInUser("nils1", "wildeTests");


//addData(user);
//let car: Car = new Car("https://imgr1.auto-motor-und-sport.de/11-2021-2022-Ford-Mustang-Shelby-GT500-Heritage-Edition-169FullWidth-daf7318a-1850564.jpg", "Ford Mustang Shelby GT500 Heritage Edition")
//addData(car);
//console.log(carSharingApp.getUser())
let date: Date = new Date("December 17, 1995 03:24:00");




loginOption();
function loginOption() {

    let currentUser: User | LoggedInUser | Admin = CarSharing.getCarSharingIni().getCurrentUser();
    //TODO del
    console.log(currentUser);
    if (currentUser.role == Role.ADMIN) {

        let addCarBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        addCarBttn.innerHTML = "Auto Hinzufügen"
        addCarBttn.addEventListener("click", showAddCarForm);
        let div: HTMLDivElement = <HTMLDivElement>document.getElementById("menu");
        div.append(addCarBttn);
    }
    if (currentUser.role == Role.USER) {


        let logginButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
        logginButton.addEventListener("click", showLogin);
        logginButton.innerHTML = "Login";
        loginDiv.append(logginButton);

    }
    if (currentUser.role == Role.LOGGEDINUSER || currentUser.role == Role.ADMIN) {

        let user:LoggedInUser = <LoggedInUser>currentUser;
        let activeUser:LoggedInUser = new LoggedInUser(user.userName, user.password );
        let logOutBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        logOutBttn.innerHTML = "Abmelden";
        logOutBttn.addEventListener("click", CarSharing.getCarSharingIni().logOutCurrentUser);

        let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
        loginDiv.append(logOutBttn);
        console.log("User logged Out");


        
       

        let upBookingsBttn:HTMLButtonElement = <HTMLButtonElement> document.createElement("button");
        upBookingsBttn.innerHTML = "bevorstehende fahrten";
        upBookingsBttn.addEventListener("click", () => activeUser.showUpcommingDrive() );
        loginDiv.append(upBookingsBttn);

        let resBookingsBttn:HTMLButtonElement = <HTMLButtonElement> document.createElement("button");
        resBookingsBttn.innerHTML = "vergangene fahrten";
        resBookingsBttn.addEventListener("click", () => activeUser.getRecentDrive() );
        loginDiv.append(resBookingsBttn);
    }
   
}
//showLogin();
async function showLogin() {


    let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");

    while (loginDiv.firstChild) loginDiv.removeChild(loginDiv.firstChild);

    let headline: HTMLHeadingElement = <HTMLHeadingElement>document.createElement("h1");
    headline.innerHTML = "Willkommen beim Login";

    let form: HTMLFormElement = <HTMLFormElement>document.createElement("form");
    form.setAttribute("id", "loginForm");

    let labelName: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelName.innerHTML = "Username : "

    let inputName: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputName.setAttribute("name", "username");
    inputName.setAttribute("class", "login");



    let labelPasswort: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelPasswort.innerHTML = "Password"

    let inputPasswort: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputPasswort.setAttribute("type", "password")
    inputPasswort.setAttribute("name", "password");
    inputPasswort.setAttribute("class", "login")

    let submittButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    submittButton.setAttribute("id", "submittLoginBttn");
    submittButton.innerHTML = "Bestätigen";

    let registerBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    registerBttn.innerHTML = "Registrieren";
    registerBttn.setAttribute("type", "button");


    //-------------------------Events-------------------------------
    registerBttn.addEventListener("click", showRegister);


    submittButton.addEventListener("click", async function () {

        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("loginForm")
        let formData = new FormData(form);
        let loggedInUser: LoggedInUser | Admin = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"))

        if (await loggedInUser.isAdmin(loggedInUser)) loggedInUser = new Admin(loggedInUser.userName, loggedInUser.password);



        if (loggedInUser.checkLogin(loggedInUser)) {

            CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
            console.log("User is now logged in");
            window.location.reload();
        }
    });

    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
    loginDiv.append(form);

}


function showRegister() {

    let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");

    //Clearing loginDiv to show only register HTML
    while (loginDiv.firstChild) loginDiv.removeChild(loginDiv.firstChild);


    let headline: HTMLHeadingElement = <HTMLHeadingElement>document.createElement("h1");
    headline.innerHTML = "Wilkommen bei der Registrierung";

    let form: HTMLFormElement = <HTMLFormElement>document.createElement("form");
    form.setAttribute("id", "loginForm");

    let labelName: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelName.innerHTML = "Username : "

    let inputName: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputName.setAttribute("name", "username");


    let labelPasswort: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelPasswort.innerHTML = "Password"

    let inputPasswort: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputPasswort.setAttribute("type", "password")
    inputPasswort.setAttribute("name", "password");

    let submittButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    submittButton.setAttribute("type", "button");
    submittButton.setAttribute("id", "submittLoginBttn");
    submittButton.innerHTML = "Registrieren";


    submittButton.addEventListener("click", async function () {

        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("loginForm")
        let formData = new FormData(form);
        let loggedInUser: LoggedInUser = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"));

        //-----------------Prove Username------------------------
        if (await loggedInUser.verifyUsername()) {

            CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
            loggedInUser.register();
            window.location.reload();

        }
        else console.log("UserName is not valid");

    })


    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
    loginDiv.append(form);



}


function showAddCarForm() {

    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("add_Car");
    while (div.firstChild) div.removeChild(div.firstChild);

    let carForm: HTMLFormElement = <HTMLFormElement>document.createElement("form");

    let modelLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let modelInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    modelInput.setAttribute("name", "model");
    modelLabel.innerHTML = "Modellbezeichnung: ";

    let driveTypeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let driveTypeInput: HTMLSelectElement = <HTMLSelectElement>document.createElement("select");
    driveTypeInput.setAttribute("name", "driveType");

    let optionElectric: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
    let optionConv: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
    optionConv.setAttribute("value", "Conv");
    optionConv.appendChild(document.createTextNode("Conventional"))
    driveTypeInput.appendChild(optionConv);

    optionElectric.setAttribute("value", "Electric");
    optionElectric.appendChild(document.createTextNode("Electric"))
    driveTypeInput.appendChild(optionElectric);
    driveTypeLabel.innerHTML = "Antriebsart: ";


    let earliestUsableTimeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let earliestUsableTimeInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    earliestUsableTimeInput.setAttribute("name", "earliestUsableTime");
    earliestUsableTimeInput.setAttribute("type", "time");
    earliestUsableTimeLabel.innerHTML = "Frühestenutzzeit: ";

    let latestUsageTimeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let latestUsageTimeInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    latestUsageTimeInput.setAttribute("name", "latestUsageTime");
    latestUsageTimeInput.setAttribute("type", "time");
    latestUsageTimeLabel.innerHTML = "Spätestenutzzeit:";

    let maxUseTimeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let maxUseTimeInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    maxUseTimeLabel.innerHTML = "Maximalenutzdauer:";
    maxUseTimeInput.setAttribute("name", "maxUseTime");

    let flatRateLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let flatRateInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    flatRateLabel.innerHTML = "Pauschalpreis: ";
    flatRateInput.setAttribute("name", "flatRate");

    let pricePerMinuteLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let pricePerMinuteInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    pricePerMinuteLabel.innerHTML = "Preis pro Minute: ";
    pricePerMinuteInput.setAttribute("name", "pricePerMinute");

    let imageLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let imageInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    imageInput.setAttribute("name", "imageLink");
    imageLabel.innerHTML = "Bildlink: ";


    let submittBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    submittBttn.innerHTML = "Bestätigen";
    submittBttn.setAttribute("type", "button");

    //--------------------Handel check auto available ------------------------------------

    submittBttn.addEventListener("click", async function () {

        let formData: FormData = new FormData(carForm);

        let driveType: DriveType = DriveType.ELECTRIC;
        if (formData.get("driveType") === "Conv") driveType = DriveType.CONVENTIONAL;

        let newCar: Car = new Car("", <string>formData.get("model"), driveType, earliestUsableTimeInput.value, latestUsageTimeInput.value, parseFloat(<string>formData.get("maxUseTime")), parseFloat(<string>formData.get("flatRate")), parseFloat(<string>formData.get("pricePerMinute")), <string>formData.get("imageLink"));

        newCar.addCar();

    })


    document.body.append(div);
    div.append(carForm);

    carForm.append(modelLabel, modelInput, driveTypeLabel, driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput, imageLabel, imageInput, submittBttn);
}


function showBokkingForm(_carDiv: HTMLDivElement, _car: Car) {

    let form: HTMLFormElement = <HTMLFormElement>document.createElement("form");

    form.setAttribute("id", "booking_form");

    let labelDay: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelDay.innerHTML = "Tag: "

    let inputDate: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputDate.setAttribute("type", "date");

    let labelTime: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelTime.innerHTML = "Time: ";

    let timeInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("id", "time_input");


    let labelDuration: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelDuration.innerHTML = "Dauer:"

    let durationInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    durationInput.setAttribute("type", "number");

    let sumbittBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    sumbittBttn.innerHTML = "Verfügbarkeit prüfen";
    _carDiv.append(form);


    sumbittBttn.addEventListener("click", function () {

        if (inputDate.value && timeInput.value && durationInput.value) {

            let dateBeginn = new Date(inputDate.value + "T" + timeInput.value);

            let user: LoggedInUser | Admin = <LoggedInUser | Admin>CarSharing.getCarSharingIni().getCurrentUser();
            let inputTime: IDriveData = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(durationInput.value)), username: user.userName, car: _car.uuid } as IDriveData;

            showSearchResults(_car, inputTime);

        } else console.log("Invalid Input");

    })

    _carDiv.append(labelDay, inputDate, labelTime, timeInput, labelDuration, durationInput, sumbittBttn);
    return false;
}



async function showSearchResults(_car: Car, _time: IDriveData) {

    let car: Car = new Car(_car.uuid, _car.modelDescription, _car.driveType, _car.earliestUsableTime, _car.latestUsageTime, _car.maxUseTime, _car.flateRate, _car.pricePerMinute, _car.image);
    console.log("called")
    if (!await car.isFreeAt(_time)) {
        console.log("Das Auto ist in diesem Zeitraum schon gebucht.");
        return;
    }
    else if (!car.checkDuration(_time)) {
        console.log("Das Auto kann nicht solange gebucht werden");
        return;
    }
    else if (!car.checkUseTime(_time)) {
        console.log("Das Auto kann in diesem Zeitraum nicht gebucht werden! ");
        return;
    }
    else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.LOGGEDINUSER || CarSharing.getCarSharingIni().getCurrentUser().role == Role.ADMIN) {


        let bookingBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");

        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("booking_form");
        bookingBttn.innerHTML = "Jetzt Buchen";
        bookingBttn.setAttribute("type", "button");

        bookingBttn.addEventListener("click", async function () {

            saveBooking(_time);
            console.log("Car has been booked");

            while (form.firstChild) form.removeChild(form.firstChild);


        });

        form.append(bookingBttn);



    } else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.USER) {
        showLogin();
    }

}

function showCar(_car: Car[]) {
  
    console.log(_car)
    let innerDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("innerDiv");
    while (innerDiv.firstChild) innerDiv.removeChild(innerDiv.firstChild);

    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("CarOverview");
    div.append(innerDiv);

    let searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("searchInput");
    searchInput.setAttribute("name", "searchInput");


    searchInput.addEventListener("change", async function () {



        showCar(await CarSharing.getCarSharingIni().searchCar(searchInput.value));

    }, false);

    if (_car) {
        for (let i: number = 0; i < _car.length; i++) {

            let header: HTMLHeadElement = <HTMLHeadElement>document.createElement("h2");
            let carDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            let carImg: HTMLImageElement = <HTMLImageElement>document.createElement("img");
            carDiv.setAttribute("class", "carDiv");
            carImg.setAttribute("class", "carImg");
            header.setAttribute("class", "carHeader");

            carImg.addEventListener("click", function clickEvent() {
                showBokkingForm(carDiv, _car[i]);
                console.log(_car);
                this.removeEventListener("click", clickEvent);

            })
            carImg.src = _car[i].image;
            header.innerHTML = _car[i].modelDescription;
            carDiv.append(header, carImg);
            innerDiv.append(carDiv);
        }
    }

}






