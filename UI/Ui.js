"use strict";
class Gui {
    static async showLogin() {
        let loginDiv = document.getElementById("login_register");
        while (loginDiv.firstChild)
            loginDiv.removeChild(loginDiv.firstChild);
        let headline = document.createElement("h1");
        headline.innerHTML = "Willkommen beim Login";
        let form = document.createElement("form");
        form.setAttribute("id", "login_form");
        let labelName = document.createElement("label");
        labelName.innerHTML = "Username : ";
        let inputName = document.createElement("input");
        inputName.setAttribute("name", "username");
        inputName.setAttribute("class", "login");
        let labelPasswort = document.createElement("label");
        labelPasswort.innerHTML = "Password";
        let inputPasswort = document.createElement("input");
        inputPasswort.setAttribute("type", "password");
        inputPasswort.setAttribute("name", "password");
        inputPasswort.setAttribute("class", "login");
        let submittButton = document.createElement("button");
        submittButton.setAttribute("id", "submittLoginBttn");
        submittButton.innerHTML = "Bestätigen";
        let registerBttn = document.createElement("button");
        registerBttn.innerHTML = "Registrieren";
        registerBttn.setAttribute("type", "button");
        //-------------------------Events-------------------------------
        registerBttn.addEventListener("click", Gui.showRegister);
        submittButton.addEventListener("click", async function () {
            let form = document.getElementById("login_form");
            let formData = new FormData(form);
            let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
            if (await loggedInUser.isAdmin(loggedInUser))
                loggedInUser = new Admin(loggedInUser.username, loggedInUser.password);
            if (await loggedInUser.checkLoginData(loggedInUser)) {
                CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
                window.location.reload();
            }
        });
        form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
        loginDiv.append(form);
    }
    static showRegister() {
        let loginDiv = document.getElementById("login_register");
        //Clearing loginDiv to show only register HTML
        while (loginDiv.firstChild)
            loginDiv.removeChild(loginDiv.firstChild);
        let headline = document.createElement("h1");
        headline.innerHTML = "Wilkommen bei der Registrierung";
        let form = document.createElement("form");
        form.setAttribute("id", "login_form");
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
            let form = document.getElementById("login_form");
            let formData = new FormData(form);
            let loggedInUser = new LoggedInUser(formData.get("username"), formData.get("password"));
            if (await loggedInUser.register())
                window.location.reload();
            else
                console.log("UserName is not valid");
        });
        form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
        loginDiv.append(form);
    }
    static async showButtons() {
        let currentUser = CarSharing.getCarSharingIni().getCurrentUser();
        let startDate = new Date(+new Date().toDateString());
        let currentTime = { begin: startDate, end: new Date(startDate.getTime() * 2000), username: "", car: "", };
        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(currentTime, DriveType.ELECTRIC));
        if (currentUser.role == Role.ADMIN) {
            let addCarBttn = document.createElement("button");
            addCarBttn.innerHTML = "Auto Hinzufügen";
            addCarBttn.addEventListener("click", Gui.showAddCarForm);
            let div = document.getElementById("menu");
            div.append(addCarBttn);
        }
        if (currentUser.role == Role.USER) {
            let logginButton = document.createElement("button");
            let loginDiv = document.getElementById("login_register");
            logginButton.addEventListener("click", Gui.showLogin);
            logginButton.innerHTML = "Login";
            loginDiv.append(logginButton);
        }
        if (currentUser.role == Role.LOGGEDINUSER || currentUser.role == Role.ADMIN) {
            let user = currentUser;
            let activeUser = new LoggedInUser(user.username, user.password);
            let logOutBttn = document.createElement("button");
            logOutBttn.innerHTML = "Abmelden";
            logOutBttn.addEventListener("click", CarSharing.getCarSharingIni().logOutCurrentUser);
            let loginDiv = document.getElementById("login_register");
            loginDiv.append(logOutBttn);
            let statBttnDiv = document.getElementById("statistic_buttons");
            let upBookingsBttn = document.createElement("button");
            upBookingsBttn.innerHTML = "bevorstehende fahrten";
            upBookingsBttn.addEventListener("click", () => activeUser.showUpcommingDrive());
            let resBookingsBttn = document.createElement("button");
            resBookingsBttn.innerHTML = "vergangene fahrten";
            resBookingsBttn.addEventListener("click", () => activeUser.getRecentDrive());
            let totalDriveBttn = document.createElement("button");
            totalDriveBttn.innerHTML = "Fahrten insgesammt";
            totalDriveBttn.addEventListener("click", Gui.showNumbBooking);
            let everagePriceBttn = document.createElement("button");
            everagePriceBttn.innerHTML = "Durchschnittlicher Preis";
            everagePriceBttn.addEventListener("click", Gui.showEveragePrice);
            statBttnDiv.append(upBookingsBttn, resBookingsBttn, totalDriveBttn, everagePriceBttn);
        }
    }
    static showAddCarForm() {
        let div = document.getElementById("add_car");
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
        earliestUsableTimeInput.setAttribute("type", "time");
        earliestUsableTimeLabel.innerHTML = "Frühestenutzzeit: ";
        let latestUsageTimeLabel = document.createElement("label");
        let latestUsageTimeInput = document.createElement("input");
        latestUsageTimeInput.setAttribute("name", "latestUsageTime");
        latestUsageTimeInput.setAttribute("type", "time");
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
        //--------------------Handel check auto available ------------------------------------
        submittBttn.addEventListener("click", async function () {
            let formData = new FormData(carForm);
            let driveType = DriveType.ELECTRIC;
            if (formData.get("driveType") === "Conv")
                driveType = DriveType.CONVENTIONAL;
            let newCar = new Car("", formData.get("model"), driveType, earliestUsableTimeInput.value, latestUsageTimeInput.value, parseFloat(formData.get("maxUseTime")), parseFloat(formData.get("flatRate")), parseFloat(formData.get("pricePerMinute")), formData.get("imageLink"));
            newCar.addCar();
            window.location.reload();
        });
        document.body.append(div);
        div.append(carForm);
        carForm.append(modelLabel, modelInput, driveTypeLabel, driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput, imageLabel, imageInput, submittBttn);
    }
    static async showFilterdCar() {
        let dateInput = document.getElementById("filter_form");
        let formData = new FormData(dateInput);
        let dateBeginn = new Date(formData.get("date_input") + "T" + formData.get("time_input"));
        let inputTime = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(formData.get("duration"))), username: null, car: null };
        let driveType = DriveType.CONVENTIONAL;
        if (formData.get("driveType") === "Electric") {
            driveType = DriveType.ELECTRIC;
        }
        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(inputTime, driveType));
    }
    static showBokkingForm(_carDiv, _car) {
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
        sumbittBttn.addEventListener("click", function click() {
            if (inputDate.value && timeInput.value && durationInput.value) {
                let dateBeginn = new Date(inputDate.value + "T" + timeInput.value);
                let user = CarSharing.getCarSharingIni().getCurrentUser();
                let inputTime = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(durationInput.value)), username: user.username, car: _car.uuid };
                Gui.showBookingResults(_car, inputTime, _carDiv);
            }
            else
                console.log("Invalid Input");
        });
        _carDiv.append(labelDay, inputDate, labelTime, timeInput, labelDuration, durationInput, sumbittBttn);
        return false;
    }
    static async showBookingResults(_car, _time, _carDiv) {
        let div = _carDiv;
        let responseDiv = document.createElement("div");
        responseDiv.setAttribute("id", "response_div");
        let responseHtml = document.createElement("p");
        if (document.getElementById("response_div")) {
            responseDiv = document.getElementById("response_div");
            while (responseDiv.firstChild)
                responseDiv.removeChild(responseDiv.firstChild);
        }
        div.append(responseDiv);
        let car = new Car(_car.uuid, _car.modelDescription, _car.driveType, _car.earliestUseTime, _car.lastUseTime, _car.maxUseTime, _car.flateRate, _car.pricePerMin, _car.image);
        if (!await car.isFreeAt(_time)) {
            responseHtml.innerHTML = "Das Auto ist in diesem Zeitraum schon gebucht.";
            responseDiv.append(responseHtml);
            return;
        }
        else if (!car.checkDuration(_time)) {
            responseDiv.append(responseHtml);
            responseHtml.innerHTML = "Das Auto kann nicht solange gebucht werden.";
            return;
        }
        else if (!car.checkLockTime(_time)) {
            responseHtml.innerHTML = "Das Auto kann in diesem Zeitraum nicht gebucht werden! ";
            responseDiv.append(responseHtml);
            return;
        }
        else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.LOGGEDINUSER || CarSharing.getCarSharingIni().getCurrentUser().role == Role.ADMIN) {
            let bookingBttn = document.createElement("button");
            bookingBttn.innerHTML = "Jetzt Buchen";
            bookingBttn.setAttribute("type", "button");
            responseHtml.innerHTML = "Das Auto kann für " + car.calculatePrice(_time) + "Euro gebucht werden.";
            responseDiv.append(responseHtml);
            bookingBttn.addEventListener("click", async function () {
                saveBooking(_time);
                window.location.reload();
            });
            responseDiv.append(bookingBttn);
        }
        else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.USER) {
            responseHtml.innerHTML = "Das Auto kann unangemeldet nicht gebucht werden bitte melden dich an! ";
            responseDiv.append(responseHtml);
            Gui.showLogin();
        }
    }
    static async showNumbBooking() {
        let currentUser = CarSharing.getCarSharingIni().getCurrentUser();
        let user = new LoggedInUser(currentUser.username, currentUser.password);
        let statDiv = document.getElementById("user_statistic");
        while (statDiv.firstChild)
            statDiv.removeChild(statDiv.firstChild);
        let numBookings = document.createElement("p");
        numBookings.innerHTML = "Sie haben insgesammt " + await user.numbOfBooking() + " fahrten Gebucht";
        statDiv.append(numBookings);
    }
    static async showEveragePrice() {
        let currentUser = CarSharing.getCarSharingIni().getCurrentUser();
        let user = new LoggedInUser(currentUser.username, currentUser.password);
        let statDiv = document.getElementById("user_statistic");
        while (statDiv.firstChild)
            statDiv.removeChild(statDiv.firstChild);
        let numBookings = document.createElement("p");
        numBookings.innerHTML = "Sie haben durchschnittlich " + await user.everagePrice() + " Euro gezahlt";
        statDiv.append(numBookings);
    }
    static async showBooking(_booking) {
        let statDiv = document.getElementById("user_statistic");
        while (statDiv.firstChild)
            statDiv.removeChild(statDiv.firstChild);
        for (let i = 0; i < _booking.length; i++) {
            let paragraph = document.createElement("p");
            let car = await CarSharing.getCarSharingIni().getCarByID(_booking[i].car);
            paragraph.innerHTML = "Sie haben vom: " + _booking[i].begin + " bis: " + _booking[i].end + " das Auto: " + car.modelDescription + "gebucht";
            statDiv.append(paragraph);
        }
    }
    static showCar(_car) {
        let innerDiv = document.getElementById("inner_div");
        while (innerDiv.firstChild)
            innerDiv.removeChild(innerDiv.firstChild);
        let div = document.getElementById("car_overview");
        div.append(innerDiv);
        let searchInput = document.getElementById("search_input");
        searchInput.setAttribute("name", "searchInput");
        searchInput.addEventListener("change", async function () {
            Gui.showCar(await CarSharing.getCarSharingIni().searchCar(searchInput.value));
        }, false);
        if (_car) {
            for (let i = 0; i < _car.length; i++) {
                let header = document.createElement("h2");
                let carDiv = document.createElement("div");
                let carImg = document.createElement("img");
                carDiv.setAttribute("class", "car_div");
                carImg.setAttribute("class", "car_img");
                header.setAttribute("class", "car_header");
                carImg.addEventListener("click", function clickEvent() {
                    Gui.showBokkingForm(carDiv, _car[i]);
                    this.removeEventListener("click", clickEvent);
                });
                carImg.src = _car[i].image;
                header.innerHTML = _car[i].modelDescription;
                if (_car[i].driveType == DriveType.ELECTRIC)
                    header.innerHTML += " (E)";
                carDiv.append(header, carImg);
                innerDiv.append(carDiv);
            }
        }
    }
}
let carSharingApp = CarSharing.getCarSharingIni();
carSharingApp.startApp();
//# sourceMappingURL=Ui.js.map