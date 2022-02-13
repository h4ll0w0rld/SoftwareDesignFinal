
class Gui {

    static async showLogin(): Promise<void> {


        let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");

        while (loginDiv.firstChild) loginDiv.removeChild(loginDiv.firstChild);

        let headline: HTMLHeadingElement = <HTMLHeadingElement>document.createElement("h1");
        headline.innerHTML = "Willkommen beim Login";

        let form: HTMLFormElement = <HTMLFormElement>document.createElement("form");
        form.setAttribute("id", "login_form");

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
        registerBttn.addEventListener("click", Gui.showRegister);


        submittButton.addEventListener("click", async function () {

            let form: HTMLFormElement = <HTMLFormElement>document.getElementById("login_form")
            let formData = new FormData(form);
            let loggedInUser: LoggedInUser | Admin = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"))

            if (await loggedInUser.isAdmin(loggedInUser)) loggedInUser = new Admin(loggedInUser.username, loggedInUser.password);



            if (await loggedInUser.checkLoginData(loggedInUser)) {

                CarSharing.getCarSharingIni().setCurrentUser(loggedInUser);
                window.location.reload();
            }
        });

        form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton, registerBttn);
        loginDiv.append(form);

    }

    static showRegister(): void {

        let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");

        //Clearing loginDiv to show only register HTML
        while (loginDiv.firstChild) loginDiv.removeChild(loginDiv.firstChild);


        let headline: HTMLHeadingElement = <HTMLHeadingElement>document.createElement("h1");
        headline.innerHTML = "Wilkommen bei der Registrierung";

        let form: HTMLFormElement = <HTMLFormElement>document.createElement("form");
        form.setAttribute("id", "login_form");

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

            let form: HTMLFormElement = <HTMLFormElement>document.getElementById("login_form")
            let formData = new FormData(form);
            let loggedInUser: LoggedInUser = new LoggedInUser(<string>formData.get("username"), <string>formData.get("password"));

            if (await loggedInUser.register()) window.location.reload();
            else console.log("UserName is not valid");

        })


        form.append(headline, labelName, inputName, labelPasswort, inputPasswort, submittButton);
        loginDiv.append(form);



    }

    static async showButtons(): Promise<void> {

        let currentUser: User | LoggedInUser | Admin = CarSharing.getCarSharingIni().getCurrentUser();
        let startDate: Date = new Date(+new Date().toDateString());
        let currentTime: IBooking = { begin: startDate, end: new Date(startDate.getTime() * 2000), username: "", car: "", }

        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(currentTime, DriveType.ELECTRIC));

        if (currentUser.role == Role.ADMIN) {

            let addCarBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            addCarBttn.innerHTML = "Auto Hinzufügen"
            addCarBttn.addEventListener("click", Gui.showAddCarForm);
            let div: HTMLDivElement = <HTMLDivElement>document.getElementById("menu");
            div.append(addCarBttn);
        }
        if (currentUser.role == Role.USER) {


            let logginButton: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
            logginButton.addEventListener("click", Gui.showLogin);
            logginButton.innerHTML = "Login";
            loginDiv.append(logginButton);

        }
        if (currentUser.role == Role.LOGGEDINUSER || currentUser.role == Role.ADMIN) {

            let user: LoggedInUser = <LoggedInUser>currentUser;
            let activeUser: LoggedInUser = new LoggedInUser(user.username, user.password);
            let logOutBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            logOutBttn.innerHTML = "Abmelden";
            logOutBttn.addEventListener("click", CarSharing.getCarSharingIni().logOutCurrentUser);

            let loginDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("login_register");
            loginDiv.append(logOutBttn);

            let statBttnDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("statistic_buttons");
            let upBookingsBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            upBookingsBttn.innerHTML = "bevorstehende fahrten";
            upBookingsBttn.addEventListener("click", () => activeUser.showUpcommingDrive());


            let resBookingsBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            resBookingsBttn.innerHTML = "vergangene fahrten";
            resBookingsBttn.addEventListener("click", () => activeUser.getRecentDrive());

            let totalDriveBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            totalDriveBttn.innerHTML = "Fahrten insgesammt";
            totalDriveBttn.addEventListener("click", Gui.showNumbBooking);

            let everagePriceBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            everagePriceBttn.innerHTML = "Durchschnittlicher Preis";
            everagePriceBttn.addEventListener("click", Gui.showEveragePrice);

            statBttnDiv.append(upBookingsBttn, resBookingsBttn, totalDriveBttn, everagePriceBttn);
        }

    }


    static showAddCarForm(): void {

        let div: HTMLDivElement = <HTMLDivElement>document.getElementById("add_car");
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
            window.location.reload();

        })


        document.body.append(div);
        div.append(carForm);

        carForm.append(modelLabel, modelInput, driveTypeLabel, driveTypeInput, earliestUsableTimeLabel, earliestUsableTimeInput, latestUsageTimeLabel, latestUsageTimeInput, maxUseTimeLabel, maxUseTimeInput, flatRateLabel, flatRateInput, pricePerMinuteLabel, pricePerMinuteInput, imageLabel, imageInput, submittBttn);
    }

    static async showFilterdCar(): Promise<void> {

        let dateInput: HTMLFormElement = <HTMLFormElement>document.getElementById("filter_form");
        let formData: FormData = new FormData(dateInput);
        let dateBeginn = new Date(formData.get("date_input") + "T" + formData.get("time_input"));
        let inputTime: IBooking = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(<string>formData.get("duration"))), username: null, car: null } as IBooking
        let driveType: DriveType = DriveType.CONVENTIONAL

        if (formData.get("driveType") === "Electric") {
            driveType = DriveType.ELECTRIC;
        }
        Gui.showCar(await CarSharing.getCarSharingIni().getAvailableCar(inputTime, driveType))

    }


    static showBokkingForm(_carDiv: HTMLDivElement, _car: Car) {

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


        sumbittBttn.addEventListener("click", function click() {

            if (inputDate.value && timeInput.value && durationInput.value) {

                let dateBeginn = new Date(inputDate.value + "T" + timeInput.value);

                let user: LoggedInUser | Admin = <LoggedInUser | Admin>CarSharing.getCarSharingIni().getCurrentUser();
                let inputTime: IBooking = { begin: dateBeginn, end: new Date(dateBeginn.getTime() + 60000 * parseFloat(durationInput.value)), username: user.username, car: _car.uuid } as IBooking;

                Gui.showBookingResults(_car, inputTime, _carDiv);

            } else console.log("Invalid Input");

        })

        _carDiv.append(labelDay, inputDate, labelTime, timeInput, labelDuration, durationInput, sumbittBttn);
        return false;
    }

    static async showBookingResults(_car: Car, _time: IBooking, _carDiv: HTMLDivElement) {
        let div: HTMLDivElement = _carDiv;
        let responseDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        responseDiv.setAttribute("id", "response_div");
        let responseHtml: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");

        if (document.getElementById("response_div")) {

            responseDiv = <HTMLDivElement>document.getElementById("response_div");
            while (responseDiv.firstChild) responseDiv.removeChild(responseDiv.firstChild);
        }

        div.append(responseDiv);

        let car: Car = new Car(_car.uuid, _car.modelDescription, _car.driveType, _car.earliestUseTime, _car.lastUseTime, _car.maxUseTime, _car.flateRate, _car.pricePerMin, _car.image);

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


            let bookingBttn: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");

            bookingBttn.innerHTML = "Jetzt Buchen";
            bookingBttn.setAttribute("type", "button");
            responseHtml.innerHTML = "Das Auto kann für " + car.calculatePrice(_time) + "Euro gebucht werden.";
            responseDiv.append(responseHtml);
            bookingBttn.addEventListener("click", async function () {

                saveBooking(_time);
                window.location.reload()

            });

            responseDiv.append(bookingBttn);

        } else if (CarSharing.getCarSharingIni().getCurrentUser().role == Role.USER) {
            responseHtml.innerHTML = "Das Auto kann unangemeldet nicht gebucht werden bitte melden dich an! ";
            responseDiv.append(responseHtml);
            Gui.showLogin();
        }


    }

    static async showNumbBooking(): Promise<void> {

        let currentUser: LoggedInUser = <LoggedInUser>CarSharing.getCarSharingIni().getCurrentUser();
        let user: LoggedInUser = new LoggedInUser(currentUser.username, currentUser.password);
        let statDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("user_statistic");

        while (statDiv.firstChild) statDiv.removeChild(statDiv.firstChild);
        let numBookings: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");

        numBookings.innerHTML = "Sie haben insgesammt " + await user.numbOfBooking() + " fahrten Gebucht";

        statDiv.append(numBookings);

    }

    static async showEveragePrice() {

        let currentUser: LoggedInUser = <LoggedInUser>CarSharing.getCarSharingIni().getCurrentUser();
        let user: LoggedInUser = new LoggedInUser(currentUser.username, currentUser.password);
        let statDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("user_statistic");

        while (statDiv.firstChild) statDiv.removeChild(statDiv.firstChild);

        let numBookings: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");

        numBookings.innerHTML = "Sie haben durchschnittlich " + await user.everagePrice() + " Euro gezahlt";

        statDiv.append(numBookings);

    }

    static async showBooking(_booking: IBooking[]) {
        let statDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("user_statistic");
        while (statDiv.firstChild) statDiv.removeChild(statDiv.firstChild);

        for (let i: number = 0; i < _booking.length; i++) {
            let paragraph: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");
            let car: Car = await CarSharing.getCarSharingIni().getCarByID(_booking[i].car);
            paragraph.innerHTML = "Sie haben vom: " + _booking[i].begin + " bis: " + _booking[i].end + " das Auto: " + car.modelDescription + "gebucht";
            statDiv.append(paragraph);

        }

    }

    static showCar(_car: Car[]): void {

        let innerDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("inner_div");
        while (innerDiv.firstChild) innerDiv.removeChild(innerDiv.firstChild);

        let div: HTMLDivElement = <HTMLDivElement>document.getElementById("car_overview");
        div.append(innerDiv);

        let searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById("search_input");
        searchInput.setAttribute("name", "searchInput");


        searchInput.addEventListener("change", async function () {

            Gui.showCar(await CarSharing.getCarSharingIni().searchCar(searchInput.value));

        }, false);

        if (_car) {
            for (let i: number = 0; i < _car.length; i++) {

                let header: HTMLHeadElement = <HTMLHeadElement>document.createElement("h2");
                let carDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
                let carImg: HTMLImageElement = <HTMLImageElement>document.createElement("img");
                carDiv.setAttribute("class", "car_div");
                carImg.setAttribute("class", "car_img");
                header.setAttribute("class", "car_header");

                carImg.addEventListener("click", function clickEvent() {
                    Gui.showBokkingForm(carDiv, _car[i]);
                    this.removeEventListener("click", clickEvent);

                })
                carImg.src = _car[i].image;
                header.innerHTML = _car[i].modelDescription;
                if (_car[i].driveType == DriveType.ELECTRIC) header.innerHTML += " (E)";
                carDiv.append(header, carImg);
                innerDiv.append(carDiv);
            }
        }

    }



}

let carSharingApp: CarSharing = CarSharing.getCarSharingIni();
carSharingApp.startApp();

