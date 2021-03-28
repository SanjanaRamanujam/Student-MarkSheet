var express=require('express');
var app=express();
var bodyParser=require('body-parser');


var connection=require('./model/database');

app.set("views","./views")
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({exteded:false}));
app.use(express.static(__dirname));

app.use('/signup1',function(req,res){
    console.log('hello');
    res.render("signup1");
})

app.post('/check',function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var email=req.body.email;
    var pwd=req.body.pwd;
    var cpwd=req.body.cpwd;
    var radio=req.body.radio;
    connection.query('insert into signup values(?,?,?,?)',[fname,lname,email,pwd],(err,results)=>{
        if(err) throw err;
        if(results){
            console.log("Values Inserted");
            res.render('index1');
        }
    })
})

app.use('/index1',function(req,res){
    console.log('hi');
    res.render('index1');
})

app.post('/validate',function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var email=req.body.email;
    var pwd=req.body.pwd;
    connection.query('select email from signup where email like ?',[email],(err,results)=>{
        if (err) throw err;
        if(results){
            connection.query('select password from signup where email like ? and password like ?',[email,pwd],(err,results)=>{
                    connection.query(' select student_score_sheet.*,signup.email from student_score_sheet join signup on student_score_sheet.fname=signup.fname where signup.email like ?',[email],(err,data)=>{
                        if (err) throw err;
                        if(data.email===email)
                        {
                            res.render("user",{userdata:data});
                            console.log(data);
                        }
                        else{
                            res.render('index1');
                            console.log("Invalid Email");
                        }
                    })
            })
        }
    })
})

app.listen(2000,()=>{
    console.log("Server is running at the port 2000");
})