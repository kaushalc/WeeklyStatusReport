var express = require('express');
var connect = require('connect');
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost/timesheet');
console.log("CONNECTED TO MONGO");
var port = 8080;

var UserSchema = mongoose.Schema({name:String,email:String,timesheets:[{id:Number,start_date:Date,end_date:Date,tasks:String}]});
var UserModel = mongoose.model('User',UserSchema);
console.log("SCHEMAS CREATED");
var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));


var router = express.Router();
router.post('/employee', function(req,res){
        //Add a new employee.
        var employeeName = req.body['name'];
				var email = req.body['email'];
        console.log("ADDING EMPLOEE NAME "+employeeName);
				//first check if employee already exists

					UserModel.findOne({ 'email': email },function(err,emp){
					if(emp){
						//employee already exists. So dont add.
						res.send("EMPLOYEE ALREADY EXISTS "+employeeName);
						res.end();
					}else{
						//employee doesnt exist. So add new employee
						var employee = new UserModel();
		        employee.name= employeeName;
						employee.email = email;
            employee.timesheets=[];
		        employee.save(function(err){
		                if(err) {
                      console.log("ERROR WHILE ADDING NEW EMPLOYEE");
                      throw err;

                    }
		        				else {
                          console.log("ADDED NEW EMPLOYEE "+employeeName);
                          res.send("EMPLOYEE DOESNT EXIST. SO ADDING NEW EMPLOYEE")
													//res.send();
													//res.end();
										}
		        });
					}
				})
})
router.get('/employee', function(req,res){
  console.log(req.query.email);
	var email = req.query.email;
  console.log("EMAIL TO SEARCH IS "+email)
	UserModel.findOne({ 'email': email },function(err,emp){
		if(emp){
      var responseStr = JSON.stringify(emp)
			console.log("FOUND EMPLOYEE "+responseStr)
			res.send(responseStr);
			res.end();
		}else{
      console.log("ERROR: EMPLOYEE NOT FOUND "+email);
      var err ={"err":"Employee not found"};
      var responseStr = JSON.stringify(err);
			res.send(responseStr)
			res.end();
		}
	})
})
router.get('/employees',function(req,res){
	console.log("GETTING ALL EMPLOYEES")
	var email = req.body['email'];
	UserModel.find({'email':email},function(err,users){
				var responseStr = JSON.stringify(users)
				res.send(responseStr);
				res.end();
		})
})
router.post('/timeSheet', function(req,res){
	console.log("ADDING TIME SHEET. NEW");
	var email = req.body['email'];
	var weekstart = req.body['week_start'];
	var weekend  = req.body['week_end'];
	var taskDetails= req.body['tasks'];
  console.log("PARAMS ARE "+email+"::"+weekstart+"::"+weekend+"::"+taskDetails)
	var tsId = Math.floor(Math.random()*9000) + 1000;
	UserModel.update({'email':email},{'$push':{'timesheets':{'id':tsId,'start_date':weekstart,'end_date':weekend,'tasks':taskDetails}}},
			function(err,count,raw){
				if(err) {console.log(err); throw(err);}
	      console.log("ADDED TIME SHEET");
        console.log(raw)
        UserModel.findOne({'email':email},function(err,user){
            if(user){
              var responseStr = JSON.stringify(user)
              res.send(responseStr);
            }
        })
				//res.send("ADDED TIME SHEET");
      });
})
router.get('/timeSheets', function(req,res){
	var email = req.body['email'];
	console.log("GETTING TIME SHEETS FORi "+email);
		UserModel.findOne({'email':email},function(err,user){
				if(user){
				var responseStr = JSON.stringify(user)
				res.send(responseStr);
			}else{
				res.send("ERROR: NO USER FOUND")
			}
		})
})
app.use('/rest', router);
app.listen(port);
console.log('Magic happens on port ' + port);
