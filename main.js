"use strict";
let user1 = new User();
let user2 = new LoggedInUser("DerTester", "sicher:(");
let admin = new Admin("nilsderAdmin", "12345");
//CarSharing.getCarSharingIni().addUser(admin);
//let userArray: LoggedInUser[] = new Array(user1, user2);
let carSharingApp = CarSharing.getCarSharingIni();
let testCar;
if (!sessionStorage.getItem("user")) {
    sessionStorage.setItem("user", JSON.stringify(user1));
}
let currentUser = JSON.parse(sessionStorage.getItem("user"));
if (currentUser.role == Role.ADMIN) {
    console.log("ein admiiiin");
    let addCarBttn = document.createElement("button");
    addCarBttn.innerHTML = "Auto Hinzufügen";
    addCarBttn.addEventListener("click", showAddCarForm);
    document.body.append(addCarBttn);
}
carSharingApp.startApp();
let user = new LoggedInUser("nilssss", "wildeTests");
//addData(user);
//let car: Car = new Car("https://imgr1.auto-motor-und-sport.de/11-2021-2022-Ford-Mustang-Shelby-GT500-Heritage-Edition-169FullWidth-daf7318a-1850564.jpg", "Ford Mustang Shelby GT500 Heritage Edition")
//addData(car);
//console.log(carSharingApp.getUser())
let date = new Date("December 17, 1995 03:24:00");
new Date();
//let loginButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Log_In_Button");
//loginButton.addEventListener("klick", showLogin);
loginOption();
function loginOption() {
    console.log("starting ");
    let currentUser = JSON.parse(sessionStorage.getItem("user"));
    console.log(currentUser);
    if (!currentUser.userName) {
        console.log("user is currently not logged in");
        let logginButton = document.createElement("button");
        let loginDiv = document.getElementById("login_register");
        logginButton.addEventListener("click", showLogin);
        logginButton.innerHTML = "Login";
        loginDiv.append(logginButton);
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
    submittButton.setAttribute("type", "button");
    submittButton.setAttribute("id", "submittLoginBttn");
    let registerBttn = document.createElement("button");
    registerBttn.addEventListener("click", showRegister);
    submittButton.addEventListener("click", async function () {
        let form = document.getElementById("loginForm");
        let formData = new FormData(form);
        let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
        console.log("Username : " + loggedInUser.userName + " Password : " + loggedInUser.password);
        let currentUser = JSON.parse(localStorage.getItem("user"));
        User.login(loggedInUser);
    });
    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
    loginDiv.append(form);
}
function showRegister() {
    let loginDiv = document.getElementById("login_register");
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
    submittButton.addEventListener("click", async function () {
        let form = document.getElementById("loginForm");
        let formData = new FormData(form);
        let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
        console.log("Username : " + loggedInUser.userName + " Password : " + loggedInUser.password);
        // let currentUser: User = JSON.parse(localStorage.getItem("user"));
        User.register(loggedInUser);
    });
    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
    loginDiv.append(form);
}
//showAddCarForm()
function showAddCarForm() {
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
    let submittBttn = document.createElement("button");
    submittBttn.addEventListener("klick", function () {
        //TODO TESTEN !!!!!!
        let newCar = new Car(carForm.get("model"), carForm.get("driveType"), carForm.get("earliestUsableTime"), carForm.get("latestUsageTime"), carForm.get("maxUseTime"), carForm.get("flatRate"), carForm.get("pricePerMinute"));
    });
    document.body.append(carForm);
    carForm.append(modelLabel, modelInput, driveTypeLabel, driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput);
}
function showBokkingForm(_carDiv, _car) {
    console.log("allllllooooo");
    let form = document.createElement("form");
    let labelYear = document.createElement("label");
    let labelMonth = document.createElement("label");
    let labelDay = document.createElement("label");
    labelYear.innerHTML = "Jahr: ";
    labelMonth.innerHTML = "Monat: ";
    labelDay.innerHTML = "Tag: ";
    let inputYear = document.createElement("input");
    let inputMonth = document.createElement("input");
    let inputDay = document.createElement("input");
    let labelTime = document.createElement("label");
    labelTime.innerHTML = "Time: ";
    let timeInput = document.createElement("input");
    let labelDuration = document.createElement("label");
    labelDuration.innerHTML = "Dauer:";
    let durationInput = document.createElement("input");
    durationInput.setAttribute("type", "number");
    let sumbittBttn = document.createElement("button");
    sumbittBttn.innerHTML = "Verfügbarkeit prüfen";
    _carDiv.append(form);
    sumbittBttn.addEventListener("click", function () {
        let dateBeginn = new Date(inputYear.value + "-" + inputMonth.value + "-" + inputDay.value + "T" + timeInput.value);
        console.log("Es begggginnnnt :" + dateBeginn);
        let inputTime = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(durationInput.value)) };
        let car = new Car(_car.modelDescription, _car.driveType, _car.earliestUsableTime, _car.latestUsageTime, _car.maxUseTime, _car.flateRate, _car.pricePerMinute);
        if (car.isFreeAt(inputTime)) {
            console.log("Das Auto ist im Zeitraum von " + inputTime.begin + "bis" + inputTime.end + "Verfügbar! ");
        }
    });
    _carDiv.append(labelYear, inputYear, labelMonth, inputMonth, labelDay, inputDay, labelTime, timeInput, labelDuration, durationInput, sumbittBttn);
    return false;
}
function showCar(_car) {
    let div = document.getElementById("CarOverview");
    let innerDiv = document.getElementById("innerDiv");
    div.append(innerDiv);
    let searchInput = document.getElementById("searchInput");
    searchInput.setAttribute("name", "searchInput");
    searchInput.addEventListener("change", async function () {
        while (innerDiv.firstChild)
            innerDiv.removeChild(innerDiv.firstChild);
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