
enum DriveType {
    ELECTRIC, CONVENTIONAL
}
enum Role {
    USER, LOGGEDINUSER, ADMIN
}


interface IBooking {
    begin: Date;
    end: Date;
    username: string;
    car: string;

}

interface ICarDAO {

    _id: string;
    modelDescription: string;
    driveType: DriveType;
    earliestUseTime: string;
    lastUseTime: string;
    maxUseTime: string;
    flateRate: string;
    pricePerMin: string;
    image: string;


}


