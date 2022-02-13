let carName: string = "vw";
//testSearchCar(carName)

async function testSearchCar(_carName:string) {
    
   console.log("With this name the following cars has bin found:",await CarSharing.getCarSharingIni().searchCar(carName));

}