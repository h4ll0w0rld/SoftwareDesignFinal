"use strict";
let carName = "vw";
//testSearchCar(carName)
async function testSearchCar(_carName) {
    console.log("With this name the following cars has bin found:", await CarSharing.getCarSharingIni().searchCar(carName));
}
//# sourceMappingURL=UnitTest.js.map