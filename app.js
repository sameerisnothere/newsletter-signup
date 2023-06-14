import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import https from 'https';

//a8cf335d7afa9ed1507e8f0e629dadec-us21    appid
//198a3639e5       audienceid

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));   //references the static folder "public" that stores all of our static files

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function (req, res) {
    const firstName = req.body.fName;
    const lastname = req.body.lName;
    const emailid = req.body.email;

    const data = {     //the data object
        members: [
            {
                email_address: emailid,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: firstName,
                    LNAME: lastname
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data);   //stores the data in a single string in JSON format

    const url = "https://us21.api.mailchimp.com/3.0/lists/198a3639e5";    //the mailchimp url
    const options = {
        method: "POST",
        auth: "sameer1:1a8cf335d7afa9ed1507e8f0e629dadec-us21"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));    //prints in JSON format
        })
    })
    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000, function () {     //this is a dynamic port that heroku chooses
    console.log("server running on port 3000");
})