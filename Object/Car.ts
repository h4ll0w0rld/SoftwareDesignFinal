class Car {

    uuid: string;
    modelDescription: string;
    driveType: DriveType;
    earliestUseTime: string;
    lastUseTime: string;
    maxUseTime: number;
    flateRate: number;
    pricePerMin: number;
    image: string;

    planedDrive: IBooking[];



    constructor(_uuid: string, _modelDescription: string, _driveType: DriveType, _earliestUsableTime: string, _latestUsageTime: string, _maxUseTime: number, _flateRate: number, _pricePerMinute: number, _image: string) {
        this.uuid = _uuid;
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUseTime = _earliestUsableTime;
        this.lastUseTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMin = _pricePerMinute;
        this.image = _image;

    }



    addCar(): void {

        console.log("adding Car" + this);
        addData(this);
        CarSharing.getCarSharingIni().updateCarList();

    }


    async getBookings(): Promise<IBooking[]> {

        if (!this.planedDrive) {

            this.planedDrive = await CarSharing.getCarSharingIni().getBooking();
        }

        let bookings: IBooking[] = new Array(this.planedDrive.length);
        let e: number = 0;
        for (let i: number = 0; i < bookings.length; i++) {

            if (this.uuid == this.planedDrive[i].car) {
                bookings[e] = this.planedDrive[i];
                e++;

            }

        }
        let finalBookings: IBooking[] = new Array()
        for (let a: number = 0; a < e; a++) {
            finalBookings[a] = bookings[a];
        }


        return finalBookings;
    }


    async isFreeAt(_time: IBooking): Promise<boolean> {

        let bookings: IBooking[] = await this.getBookings()

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

    checkDuration(_time: IBooking): boolean {

        let durationInMillis: number = _time.end.getTime() - _time.begin.getTime();
        let durationInMin: number = (durationInMillis / 1000) / 60;

        if (durationInMin >= this.maxUseTime) return false;
        return true;

    }
    
    checkLockTime(_time: IBooking): boolean {

        
        let begin: number = (_time.begin.getHours() * 60) + _time.begin.getMinutes();
        let end: number = (_time.end.getHours() * 60) + _time.end.getMinutes();

        let earliestPosib: string[] = this.earliestUseTime.split(":", 2);
        let latestPosib: string[] = this.lastUseTime.split(":", 2);
        let earliestPosibNumb: number = parseInt(earliestPosib[0]) * 60 + parseInt(earliestPosib[1]);
        let latestPosibNumb: number = parseFloat(latestPosib[0]) * 60 + parseFloat(latestPosib[1]);

        if (begin <= latestPosibNumb && end >= earliestPosibNumb) return true;

        return false;

    }

    calculatePrice(_time: IBooking): number {

        let dateBegin:Date = new Date(_time.begin);
        let dateEnd:Date = new Date(_time.end);

        let durationInMillis: number = dateEnd.getTime() - dateBegin.getTime();
        let durationInMin: number = (durationInMillis / 1000) / 60;

        let priceTime: number = this.pricePerMin * durationInMin;

        return priceTime + this.flateRate / 1;
    }

}