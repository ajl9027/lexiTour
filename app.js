/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fse = require('fs-extra');
const readdir = require("recursive-readdir");
const csv = require('csvtojson');
var chunk = require('lodash.chunk');

let fileName;
let port = 3000;


var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  console.log('get route requested');
  res.render('index',
  { title : 'Home' }
  )
})

app.post('/filelist',function(req,res, next){
	console.log('FileList requested: ' + req.name);
	readdir("public/savedgames/").then(
		function(files) {
		  console.log("files are", files);
		  res.send(files);
		  //next();
		},
		function(error) {
		  console.error("something exploded", error);
		  //next();
		}
	  );
  });

app.post('/file',function(req,res, next){
	console.log(req.body.name);
	let file = './public/savedgames/' + req.body.name + '.json';
	let fileName = req.body.name;

	fse.readJson(fileName, { throws: false }, (err, obj) => {
		if (err) res.status(404).json('File not found ' + file); console.error(err)
	  
		console.log(obj) // => null
		//res.send(obj);
		res.send(obj);
		//next();
	  });

	});
	
app.post('/customList',function (req,res) { 
	const csvFilePath=('./public/customlists/'+ req.body.name + '.csv');
	console.log(csvFilePath);
csv({
    noheader:true
})
.fromFile(csvFilePath)
.on('csv',(csvRow)=>{ //this func will be called twice. Header row will not be populated
    //let teams = [];
    let matches = csvRow.length;
		let difference = 0;
		let data = {};
		let mathesEmpty = [];
    switch (true) {
        case (matches < 4):
            difference = 4 - matches;
            for (var i = 0; i < difference; i++) {
                csvRow.push(null);
                             
            }
            console.log("less than four");
            break;
        case (matches > 4 && matches < 8):
            difference = 8 - matches;
            for (var i = 0; i < difference; i++) {
                csvRow.push(null);
                              
            }
            console.log("between 4 and 8");
            break;
        case (matches > 8 && matches < 16):
            difference = 16 - matches;
            for (var i = 0; i < difference; i++) {
                csvRow.push(null);
                               
            }
            console.log("between 8 and 16");
            break;
        case (matches > 16 && matches < 32):
            console.log("between 16 and 32");
            break;
            difference = 32 - matches;
            for (var i = 0; i < difference; i++) {
                csvRow.push(null);
                             
            }
        case (matches > 32 && matches < 64):
            difference = 64 - matches;
            for (var i = 0; i < difference; i++) {
                csvRow.push(null);
                              
            }
            console.log("between 32 and 64");
            break;
        default:
            console.log("none");
            break;
    }

    function shuffle(array) {
        var m = array.length, t, i;
      
        // While there remain elements to shuffle…
        while (m) {
      
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);
      
          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
      
        return array;
      }

var shuffledRows = shuffle(csvRow);
//console.log(shuffle(shuffledRows));
csvRow = chunk(shuffledRows, 2);
console.log(csvRow);
data.teams = csvRow;
data.results = mathesEmpty;
res.send(data);

})
.on('done',(error)=>{
    console.log('end: ' + error)
})
.on('error',(err)=>{
    res.status(404).json(csvFilePath);
})
});

app.post('/json', function(req, res, next){
	var body = req.body.data;
	console.log('Json tournoment data: ' + JSON.stringify(req.body.data));
	console.log('Filename: ' + JSON.stringify(req.body.filename));

	fse.writeJson('./public/savedgames/'+req.body.filename+'.json', body, err => {
		if (err) return console.error(err);
		fileName = './public/'+req.body.filename+'.json';
		res.send(body);
		console.log('savepoint created');
	  });
	
	//res.status(200, 'uploaded!');
});

app.listen(port, function () { console.log('Server running on port: ' + port);});