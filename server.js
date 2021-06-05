require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html")
});

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.emailId;
    //new member details
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
            }
        }
    ]
    };
    //converting member details to json format 
    const jsonData = JSON.stringify(data);

    //Mailchimp-API setup 
    const url = "https://us6.api.mailchimp.com/3.0/lists/fae1d7c632";
    const options = {
        method: "POST",
        auth : "atul:"+process.env.mail_chimp_api
    }
    //API call using https 
    const request = https.request(url,options,function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            memberData = JSON.parse(data);
            statusCode = response.statusCode;
            console.log(statusCode);
            if(statusCode == 200){
                res.sendFile(__dirname+"/success.html"); 
            }
            else{
                res.sendFile(__dirname+"/failure.html");
                
            }
        })
    });
    request.write(jsonData);
    request.end();

    console.log(firstName+" "+lastName+" "+email);
});

//redirecting from failurePage to home page
app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("port:3000")
})
