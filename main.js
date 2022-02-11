"use strict";
let user1 = new User();
let user2 = new LoggedInUser("DerTester", "sicher:(");
let admin = new Admin("admin", "admin");
//CarSharing.getCarSharingIni().addUser(admin);
//let userArray: LoggedInUser[] = new Array(user1, user2);
let carSharingApp = CarSharing.getCarSharingIni();
//console.log(carSharingApp.getCurrentUSer())
let currentUser = CarSharing.getCarSharingIni().getCurrentUser();
async function testCar() {
    console.log(await CarSharing.getCarSharingIni().getCar());
}
carSharingApp.startApp();
let user = new LoggedInUser("nilssss", "wildeTests");
//addData(user);
//let car: Car = new Car("https://imgr1.auto-motor-und-sport.de/11-2021-2022-Ford-Mustang-Shelby-GT500-Heritage-Edition-169FullWidth-daf7318a-1850564.jpg", "Ford Mustang Shelby GT500 Heritage Edition")
//addData(car);
//console.log(carSharingApp.getUser())
let date = new Date("December 17, 1995 03:24:00");
loginOption();
function loginOption() {
    let currentUser = CarSharing.getCarSharingIni().getCurrentUser();
    //TODO del
    console.log(currentUser);
    if (currentUser.role == Role.ADMIN) {
        let addCarBttn = document.createElement("button");
        addCarBttn.innerHTML = "Auto Hinzufügen";
        addCarBttn.addEventListener("click", showAddCarForm);
        let div = document.getElementById("menu");
        div.append(addCarBttn);
    }
    if (currentUser.role == Role.USER) {
        let logginButton = document.createElement("button");
        let loginDiv = document.getElementById("login_register");
        logginButton.addEventListener("click", showLogin);
        logginButton.innerHTML = "Login";
        loginDiv.append(logginButton);
    }
    if (currentUser.role == Role.LOGGEDINUSER || currentUser.role == Role.ADMIN) {
        let logOutBttn = document.createElement("button");
        logOutBttn.innerHTML = "Abmelden";
        logOutBttn.addEventListener("click", CarSharing.getCarSharingIni().logOutCurrentUser);
        let loginDiv = document.getElementById("login_register");
        loginDiv.append(logOutBttn);
        console.log("User logged Out");
    }
}
//showLogin();
async function showLogin() {
    let loginDiv = document.getElementById("login_register");
    while (loginDiv.firstChild)
        loginDiv.removeChild(loginDiv.firstChild);
    let headline = document.createElement("h1");
    headline.innerHTML = "Willkommen beim Login";
    let form = document.createElement("form");
    form.setAttribute("id", "loginForm");
    let labelName = document.createElement("label");
    labelName.innerHTML = "Username : ";
    let inputName = document.createElement("input");
    inputName.setAttribute("name", "username");
    let labelPasswort = document.createElement("label");
    labelPasswort.innerHTML = "Password";
    let inputPasswort = document.createElement("input");
    inputPasswort.setAttribute("type", "password");
    inputPasswort.setAttribute("name", "password");
    let submittButton = document.createElement("button");
    submittButton.setAttribute("id", "submittLoginBttn");
    submittButton.innerHTML = "Bestätigen";
    let registerBttn = document.createElement("button");
    registerBttn.innerHTML = "Registrieren";
    registerBttn.setAttribute("type", "button");
    //-------------------------Events-------------------------------
    registerBttn.addEventListener("click", showRegister);
    submittButton.addEventListener("click", async function () {
        let form = document.getElementById("loginForm");
        let formData = new FormData(form);
        let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
        console.log("Username : " + loggedInUser.userName + " Password : " + loggedInUser.password);
        if (await CarSharing.getCarSharingIni().isAdmin(loggedInUser))
            loggedInUser = new Admin(loggedInUser.userName, loggedInUser.password);
        if (await CarSharing.getCarSharingIni().checkLogin(loggedInUser)) {
            CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
            console.log("User is now logged in");
            window.location.reload();
        }
    });
    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
    loginDiv.append(form);
}
function showRegister() {
    let loginDiv = document.getElementById("login_register");
    //Clearing loginDiv to show only register HTML
    while (loginDiv.firstChild)
        loginDiv.removeChild(loginDiv.firstChild);
    let headline = document.createElement("h1");
    headline.innerHTML = "Wilkommen bei der Registrierung";
    let form = document.createElement("form");
    form.setAttribute("id", "loginForm");
    let labelName = document.createElement("label");
    labelName.innerHTML = "Username : ";
    let inputName = document.createElement("input");
    inputName.setAttribute("name", "username");
    let labelPasswort = document.createElement("label");
    labelPasswort.innerHTML = "Password";
    let inputPasswort = document.createElement("input");
    inputPasswort.setAttribute("type", "password");
    inputPasswort.setAttribute("name", "password");
    let submittButton = document.createElement("button");
    submittButton.setAttribute("type", "button");
    submittButton.setAttribute("id", "submittLoginBttn");
    submittButton.innerHTML = "Registrieren";
    submittButton.addEventListener("click", async function () {
        let form = document.getElementById("loginForm");
        let formData = new FormData(form);
        let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
        //-----------------Prove Username------------------------
        if (await CarSharing.getCarSharingIni().verifyUsername(loggedInUser)) {
            CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
            User.register(loggedInUser);
            window.location.reload();
        }
        else
            console.log("UserName is not valid");
    });
    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
    loginDiv.append(form);
}
function showAddCarForm() {
    let div = document.getElementById("add_Car");
    while (div.firstChild)
        div.removeChild(div.firstChild);
    let carForm = document.createElement("form");
    let modelLabel = document.createElement("label");
    let modelInput = document.createElement("input");
    modelInput.setAttribute("name", "model");
    modelLabel.innerHTML = "Modellbezeichnung: ";
    let driveTypeLabel = document.createElement("label");
    let driveTypeInput = document.createElement("select");
    driveTypeInput.setAttribute("name", "driveType");
    let optionElectric = document.createElement("option");
    let optionConv = document.createElement("option");
    optionConv.setAttribute("value", "Conv");
    optionConv.appendChild(document.createTextNode("Conventional"));
    driveTypeInput.appendChild(optionConv);
    optionElectric.setAttribute("value", "Electric");
    optionElectric.appendChild(document.createTextNode("Electric"));
    driveTypeInput.appendChild(optionElectric);
    driveTypeLabel.innerHTML = "Antriebsart: ";
    let earliestUsableTimeLabel = document.createElement("label");
    let earliestUsableTimeInput = document.createElement("input");
    earliestUsableTimeInput.setAttribute("name", "earliestUsableTime");
    earliestUsableTimeLabel.innerHTML = "Frühestenutzzeit: ";
    let latestUsageTimeLabel = document.createElement("label");
    let latestUsageTimeInput = document.createElement("input");
    latestUsageTimeInput.setAttribute("name", "latestUsageTime");
    latestUsageTimeLabel.innerHTML = "Spätestenutzzeit:";
    let maxUseTimeLabel = document.createElement("label");
    let maxUseTimeInput = document.createElement("input");
    maxUseTimeLabel.innerHTML = "Maximalenutzdauer:";
    maxUseTimeInput.setAttribute("name", "maxUseTime");
    let flatRateLabel = document.createElement("label");
    let flatRateInput = document.createElement("input");
    flatRateLabel.innerHTML = "Pauschalpreis: ";
    flatRateInput.setAttribute("name", "flatRate");
    let pricePerMinuteLabel = document.createElement("label");
    let pricePerMinuteInput = document.createElement("input");
    pricePerMinuteLabel.innerHTML = "Preis pro Minute: ";
    pricePerMinuteInput.setAttribute("name", "pricePerMinute");
    let imageLabel = document.createElement("label");
    let imageInput = document.createElement("input");
    imageInput.setAttribute("name", "imageLink");
    imageLabel.innerHTML = "Bildlink: ";
    let submittBttn = document.createElement("button");
    submittBttn.innerHTML = "Bestätigen";
    submittBttn.setAttribute("type", "button");
    //--------------------Event------------------------------------
    submittBttn.addEventListener("click", async function () {
        let formData = new FormData(carForm);
        let driveType = DriveType.ELECTRIC;
        if (formData.get("driveType") === "Conv")
            driveType = DriveType.CONVENTIONAL;
        let newCar = new Car("", formData.get("model"), driveType, parseFloat(formData.get("earliestUsableTime")), parseFloat(formData.get("latestUsageTime")), parseFloat(formData.get("maxUseTime")), parseFloat(formData.get("flatRate")), parseFloat(formData.get("pricePerMinute")), formData.get("imageLink"));
        CarSharing.getCarSharingIni().addCar(newCar);
    });
    document.body.append(div);
    div.append(carForm);
    carForm.append(modelLabel, modelInput, driveTypeLabel, driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput, imageLabel, imageInput, submittBttn);
}
function showBokkingForm(_carDiv, _car) {
    let form = document.createElement("form");
    form.setAttribute("id", "booking_form");
    let labelDay = document.createElement("label");
    labelDay.innerHTML = "Tag: ";
    let inputDate = document.createElement("input");
    inputDate.setAttribute("type", "date");
    let labelTime = document.createElement("label");
    labelTime.innerHTML = "Time: ";
    let timeInput = document.createElement("input");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("id", "time_input");
    let labelDuration = document.createElement("label");
    labelDuration.innerHTML = "Dauer:";
    let durationInput = document.createElement("input");
    durationInput.setAttribute("type", "number");
    let sumbittBttn = document.createElement("button");
    sumbittBttn.innerHTML = "Verfügbarkeit prüfen";
    _carDiv.append(form);
    sumbittBttn.addEventListener("click", function () {
        if (inputDate.value && timeInput.value && durationInput.value) {
            let dateBeginn = new Date(inputDate.value + "T" + timeInput.value);
            let inputTime = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(durationInput.value)) };
            showSearchResults(_car, inputTime);
        }
        else
            console.log("Invalid Input");
    });
    _carDiv.append(labelDay, inputDate, labelTime, timeInput, labelDuration, durationInput, sumbittBttn);
    return false;
}
async function showSearchResults(_car, _time) {
    console.log("hihihihhiööö");
    let car = new Car(_car.uuid, _car.modelDescription, _car.driveType, _car.earliestUsableTime, _car.latestUsageTime, _car.maxUseTime, _car.flateRate, _car.pricePerMinute, _car.image);
    if (!car.isFreeAt(_time)) {
        console.log("Das Auto ist in diesem Zeitraum schon gebucht.");
        return;
    }
    console.log;
    if (!car.checkDuration(_time)) {
        console.log("Das Auto kann nicht solange gebucht werden");
        return;
    }
    if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.LOGGEDINUSER || CarSharing.getCarSharingIni().getCurrentUser().role == Role.ADMIN) {
        console.log(_car.planedDrive);
        let bookingBttn = document.createElement("button");
        let form = document.getElementById("booking_form");
        bookingBttn.innerHTML = "Jetzt Buchen";
        bookingBttn.setAttribute("type", "button");
        bookingBttn.addEventListener("click", function () {
            console.log(car);
            let bookinData = { driveData: _time, user: CarSharing.getCarSharingIni().getCurrentUser(), car: _car };
            saveBooking(bookinData);
            while (form.firstChild)
                form.removeChild(form.firstChild);
        });
        form.append(bookingBttn);
    }
    else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.USER) {
        showLogin();
    }
}
function showCar(_car) {
    let innerDiv = document.getElementById("innerDiv");
    while (innerDiv.firstChild)
        innerDiv.removeChild(innerDiv.firstChild);
    let div = document.getElementById("CarOverview");
    div.append(innerDiv);
    let searchInput = document.getElementById("searchInput");
    searchInput.setAttribute("name", "searchInput");
    searchInput.addEventListener("change", async function () {
        showCar(await CarSharing.getCarSharingIni().searchCar(searchInput.value));
    }, false);
    if (_car) {
        for (let i = 0; i < _car.length; i++) {
            let header = document.createElement("h2");
            let carDiv = document.createElement("div");
            let carImg = document.createElement("img");
            carDiv.setAttribute("class", "carDiv");
            carImg.setAttribute("class", "carImg");
            header.setAttribute("class", "carHeader");
            carImg.addEventListener("click", function clickEvent() {
                showBokkingForm(carDiv, _car[i]);
                console.log(_car);
                this.removeEventListener("click", clickEvent);
            });
            carImg.src = _car[i].image;
            header.innerHTML = _car[i].modelDescription;
            carDiv.append(header, carImg);
            innerDiv.append(carDiv);
        }
    }
}
//# sourceMappingURL=main.js.map