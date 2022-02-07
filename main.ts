
let user1: User = new User();
let user2: LoggedInUser = new LoggedInUser("DerTester", "sicher:(");
let admin:Admin = new Admin("nilsderAdmin","12345");
//CarSharing.getCarSharingIni().addUser(admin);
//let userArray: LoggedInUser[] = new Array(user1, user2);
let carSharingApp: CarSharing = CarSharing.getCarSharingIni();
//sessionStorage.setItem("user", JSON.stringify(user1));
if (!sessionStorage.getItem("user")) {
    sessionStorage.setItem("user", JSON.stringify(user1));

}
let currentUser:any = JSON.parse(sessionStorage.getItem("user"));
if(currentUser.role == Role.ADMIN){
    console.log("ein admiiiin");
    let addCarBttn:HTMLButtonElement = <HTMLButtonElement> document.createElement("button");
    addCarBttn.innerHTML = "Auto Hinzufügen"
    addCarBttn.addEventListener("click", showAddCarForm);
    document.body.append(addCarBttn);
}

carSharingApp.startApp();

let user: LoggedInUser = new LoggedInUser("nilssss", "wildeTests");
//addData(user);
//let car: Car = new Car("https://imgr1.auto-motor-und-sport.de/11-2021-2022-Ford-Mustang-Shelby-GT500-Heritage-Edition-169FullWidth-daf7318a-1850564.jpg", "Ford Mustang Shelby GT500 Heritage Edition")
//addData(car);
//console.log(carSharingApp.getUser())
let date: Date = new Date("December 17, 1995 03:24:00");
new Date();


//let loginButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Log_In_Button");
//loginButton.addEventListener("klick", showLogin);
loginOption();
function loginOption() {
    console.log("starting ")
    let currentUser = JSON.parse(sessionStorage.getItem("user"));
    console.log(currentUser);
    if (!currentUser.userName) {
        console.log("user is currently not logged in");
        let logginButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
        logginButton.addEventListener("click", showLogin);
        logginButton.innerHTML = "Login";
        loginDiv.append(logginButton);

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


    let labelPasswort: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    labelPasswort.innerHTML = "Password"
    let inputPasswort: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    inputPasswort.setAttribute("type", "password")
    inputPasswort.setAttribute("name", "password");
    let submittButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    submittButton.setAttribute("type", "button");
    submittButton.setAttribute("id", "submittLoginBttn");

    let registerBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    registerBttn.addEventListener("click", showRegister);


    submittButton.addEventListener("click", async function () {

        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("loginForm")
        let formData = new FormData(form);
        let loggedInUser: LoggedInUser = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"))
        console.log("Username : " + loggedInUser.userName + " Password : " + loggedInUser.password);
        let currentUser: User = JSON.parse(localStorage.getItem("user"));
        User.login(loggedInUser);
    });

    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
    loginDiv.append(form);

}


function showRegister() {
   
    let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
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
    submittButton.addEventListener("click", async function () {
        let form: HTMLFormElement = <HTMLFormElement>document.getElementById("loginForm")
        let formData = new FormData(form);
        let loggedInUser: LoggedInUser = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"))
        console.log("Username : " + loggedInUser.userName + " Password : " + loggedInUser.password);
        // let currentUser: User = JSON.parse(localStorage.getItem("user"));
        User.register(loggedInUser);
    })
    form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
    loginDiv.append(form);



}
//showAddCarForm()
function showAddCarForm() {
    let carForm: HTMLFormElement = <HTMLFormElement>document.createElement("form");

    let modelLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let modelInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    modelInput.setAttribute("name", "model");
    modelLabel.innerHTML = "Modellbezeichnung: ";


    let driveTypeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let driveTypeInput: HTMLSelectElement = <HTMLSelectElement>document.createElement("select");
    driveTypeInput.setAttribute("name", "driveType");
    
    
    let optionElectric:HTMLOptionElement = <HTMLOptionElement> document.createElement("option");

    let optionConv:HTMLOptionElement = <HTMLOptionElement> document.createElement("option");
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
    earliestUsableTimeLabel.innerHTML = "Frühestenutzzeit: ";

    let latestUsageTimeLabel: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
    let latestUsageTimeInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    latestUsageTimeInput.setAttribute("name", "latestUsageTime");
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

    let submittBttn:HTMLButtonElement = <HTMLButtonElement> document.createElement("button");
    submittBttn.addEventListener("klick", function(){
        //TODO TESTEN !!!!!!
        let newCar:Car = new Car(<string>carForm.get("model"),carForm.get("driveType"),carForm.get("earliestUsableTime"),carForm.get("latestUsageTime"),carForm.get("maxUseTime"),carForm.get("flatRate"),carForm.get("pricePerMinute"));
    })
    document.body.append(carForm);
    carForm.append(modelLabel, modelInput, driveTypeLabel,driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput);
}   


function showCar(_car: Car[]) {


    let div: HTMLDivElement = <HTMLDivElement>document.getElementById("CarOverview");
    let innerDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("innerDiv");

    div.append(innerDiv);
    let searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("searchInput");
    searchInput.setAttribute("name", "searchInput");
    searchInput.addEventListener("change", async function () {

        while (innerDiv.firstChild) innerDiv.removeChild(innerDiv.firstChild);

        showCar(await CarSharing.getCarSharingIni().searchCar(searchInput.value));
    }, false);


    for (let i: number = 0; i < _car.length; i++) {

        let header: HTMLHeadElement = <HTMLHeadElement>document.createElement("h2");
        let carDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        let carImg: HTMLImageElement = <HTMLImageElement>document.createElement("img");
        carDiv.setAttribute("class", "carDiv");
        carImg.setAttribute("class", "carImg");
        header.setAttribute("class", "carHeader");
        carImg.src = _car[i].image;
        header.innerHTML = _car[i].modelDescription;
        carDiv.append(header, carImg);
        innerDiv.append(carDiv);
    }

}






