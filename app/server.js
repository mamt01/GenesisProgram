
const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var path = require('path');


app.use(bodyParser.urlencoded({
  extended: false
  }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

  next();
 });

 const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

// respond data calculated for residential sector ----------------------------------------------
app.post('/resi/', function(req, res){
    let inputContent = req.body;

    let residential = calculResi(inputContent.app, inputContent.floor);
    let finalP = calculPrix(residential, inputContent.choice);
    let standardFee = radiobutton(inputContent.choice);

    res.json({ascensor: residential, prix: finalP, price: standardFee});
});

// respond data calculated for corpo sector ------------------------------------------------
app.post('/corpo', function(req, res){
  let inputContent = req.body;

  let corpo = calculCorpo(inputContent.floor, inputContent.base, inputContent.occu);
  let finalC = calculPrix(corpo, inputContent.choice);
  let standardF = radiobutton(inputContent.choice);

  res.json({ascensor: corpo, prix: finalC, price: standardF});
  
})

// respond data calculated for hybride sector ----------------------------------------------
app.post('/hyb', function(req, res){
  let inputContent = req.body;

  let corpo = calculCorpo(inputContent.floor, inputContent.base, inputContent.occu);
  let finalC = calculPrix(corpo, inputContent.choice);
  let standardF = radiobutton(inputContent.choice);

  res.json({ascensor: corpo, prix: finalC, price: standardF});
  
})

// respond data calculated for commercial sector ----------------------------------------------
app.post('/com', function(req, res){
  let inputContent = req.body;

  let commerce = calculCommerce(inputContent.base);
  let finalComm = calculPrix(commerce, inputContent.choice);
  let standardF = radiobutton(inputContent.choice);

  res.json({ascensor: commerce, prix: finalComm, price: standardF});
  
})


/* Calcul for Residential ------------------------------------------------------------
  parameters : number of appartements / number of floors
	return number of elevators needed for residential
*/
var calculResi = function(appar, floors){

  var appa = parseInt(appar);
  var floor = parseInt(floors);	

  var nbr_ascen = appa / floor;
  nbr_ascen = (nbr_ascen / 6);
  var nbr_cages = (floor / 20);

  if( nbr_ascen < 1 ) {
    nbr_ascen = 1;
  }
  nbr_cages = Math.ceil(nbr_cages);
  nbr_ascen = Math.ceil(nbr_ascen);

  var total = (nbr_ascen * nbr_cages);

  num = total.toString();

  return num;
}

/* Function calcul Commerce -------------------------------------------------------------
  parameters : number of ascensors
  return and number of elevator needed 
  
*/
var calculCommerce = function(ascensor){

	var nbr_ascen = parseInt(ascensor);

	return nbr_ascen;
}

/* Calcul for final price ------------------------------------------------------------
  parameters : number of ascensors calculated / choice au service level (radio-button)
	return finale price calculated 
*/
var calculPrix = function(totalAscensor, radio_val){

	var radio = parseInt(radio_val);
	
	var finalPrice;
	if (radio === 1){
		finalPrice = (totalAscensor * 7565) * 1.1;
  }
  
	else if (radio === 2){
		finalPrice = (totalAscensor * 12345) * 1.13;
	}

	else if (radio === 3){
		finalPrice = (totalAscensor * 15400) * 1.16;
  }
  finalPrice = finalPrice.toFixed(2);

  var final = finalPrice.toString();
  return final;
}

/*Function calcul Corporatif/Hybride-----------------------------------------------------
  return number of elevator needed for corpo/hybride
  parameters : number of floors / number of basements / occupancy per floor
*/
var calculCorpo = function(floo, base, occ){

    var floor = parseInt(floo);
    var quar = parseInt(base);
    var occu = parseInt(occ);
  
    var floor_quar = floor + quar;
    
    var nbr_ascen = Math.ceil((occu * floor_quar) / 1000);
    
		var colonnes = Math.ceil(floor_quar / 20);

    var total = Math.ceil(nbr_ascen / colonnes);
    
		var total = total * colonnes;
  
    num = total.toString();
		return num;
	
}

/*Radion-button --------------------------------------------------------------------
  return price unit 
  parameters : button radio value 
*/
var radiobutton = function(radio_val){

	if (radio_val === "1"){

    var priceUnit = {fee: "10%", unit: "7565 $"};
    return priceUnit;
	}
	else if (radio_val === "2"){

		var priceUnit = {fee: "13%", unit: "12 345 $"};
    return priceUnit;
	}
	else if (radio_val === "3"){

		var priceUnit = {fee: "16%", unit: "15 400 $"};
    return priceUnit;
	}
}

// Console will print the message
//console.log('Server running at http://127.0.0.1:' + port + '/');