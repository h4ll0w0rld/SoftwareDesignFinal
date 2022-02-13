"use strict";
class Car {
    uuid;
    modelDescription;
    driveType;
    earliestUseTime;
    lastUseTime;
    maxUseTime;
    flateRate;
    pricePerMin;
    image;
    planedDrive;
    constructor(_uuid, _modelDescription, _driveType, _earliestUsableTime, _latestUsageTime, _maxUseTime, _flateRate, _pricePerMinute, _image) {
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
    addCar() {
        console.log("adding Car" + this);
        addData(this);
        CarSharing.getCarSharingIni().updateCarList();
    }
    async getBookings() {
        if (!this.planedDrive) {
            this.planedDrive = await CarSharing.getCarSharingIni().getBooking();
        }
        let bookings = new Array(this.planedDrive.length);
        let e = 0;
        for (let i = 0; i < bookings.length; i++) {
            if (this.uuid == this.planedDrive[i].car) {
                bookings[e] = this.planedDrive[i];
                e++;
            }
        }
        let finalBookings = new Array();
        for (let a = 0; a < e; a++) {
            finalBookings[a] = bookings[a];
        }
        return finalBookings;
    }
    async isFreeAt(_time) {
        let bookings = await this.getBookings();
        for (let i = 0; i < bookings.length; i++) {
            let beginDate = new Date(bookings[i].begin);
            let endDate = new Date(bookings[i].end);
            //If given Time is inbetween or arround an already exisiting Time: return = false 
            if (_time.begin.getTime() >= beginDate.getTime() && _time.begin.getTime() <= endDate.getTime())
                return false;
            else if (_time.end.getTime() >= beginDate.getTime() && _time.end.getTime() <= endDate.getTime())
                return false;
            else if (_time.begin <= beginDate && _time.end >= endDate)
                return false;
        }
        return true;
    }
    checkDuration(_time) {
        let durationInMillis = _time.end.getTime() - _time.begin.getTime();
        let durationInMin = (durationInMillis / 1000) / 60;
        if (durationInMin >= this.maxUseTime)
            return false;
        return true;
    }
    checkLockTime(_time) {
        let begin = (_time.begin.getHours() * 60) + _time.begin.getMinutes();
        let end = (_time.end.getHours() * 60) + _time.end.getMinutes();
        let earliestPosib = this.earliestUseTime.split(":", 2);
        let latestPosib = this.lastUseTime.split(":", 2);
        let earliestPosibNumb = parseInt(earliestPosib[0]) * 60 + parseInt(earliestPosib[1]);
        let latestPosibNumb = parseFloat(latestPosib[0]) * 60 + parseFloat(latestPosib[1]);
        if (begin <= latestPosibNumb && end >= earliestPosibNumb)
            return true;
        return false;
    }
    calculatePrice(_time) {
        let dateBegin = new Date(_time.begin);
        let dateEnd = new Date(_time.end);
        let durationInMillis = dateEnd.getTime() - dateBegin.getTime();
        let durationInMin = (durationInMillis / 1000) / 60;
        let priceTime = this.pricePerMin * durationInMin;
        return priceTime + this.flateRate / 1;
    }
}
//# sourceMappingURL=Car.js.map