var express = require("express"),
	app = express(),
	serialport = require("serialport"),
	SerialPort = serialport.SerialPort;

var myPort = new SerialPort("/dev/ttyUSB0", {
	baudrate: 9600
});

myPort.on("open", function(){
});

app.get("/", function(req, res){

	myPort.write("o\n", function(){
		setTimeout(function(){
			var exec = require("child_process").execSync;
			var child1 = null, child2 = null, test = null;
			exec("fswebcam -d /dev/video0 --png 1 -F 10 test.png");
			//iterate through first four pin
			for(var i=0;i<50;i++){
				var command = "ssocr crop 112 128 53 30 test.png -d 4 -t "+i;
				child1 = snap(command);
				test = parseInt(child1);
				if(typeof(test)==="number"&&(!isNaN(test))){
					break;
				}
			}

	//iterate through second four pin
			for(var j=0;j<50;j++){
				var command = "ssocr crop 166 128 53 30 test.png -d 4 -t "+j;
				child2 = snap(command);
				test = parseInt(child2);
				if(typeof(test)==="number"&&(!isNaN(test))){
					break;
				}
			}

			console.log(child1+child2);
			var token = {
				result: (child1+child2)
			};
			// console.log(token);
			res.json(token);
		}, 10000);
	});
		
	
});

app.listen(8080, function(){
	console.log("Server started");
});

var snap = function(command){
	var exec = require("child_process").execSync;
	var child = null;
	try {
		child = exec(command).toString().substr(0,4);
		// console.log(child);
	}
	catch(err){
		// console.log(err);
	}
	return child;
};