const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    if (!firstName || !lastName || !email) {
        // Redirect to form page with error message
        res.redirect("/?error=true");
        return;
    }

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName

                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/4876e51e9a";
    const options = {
        method: "POST",
        auth: "varun12:7d6195b63d7ccce032f17fc9f57669f1-us21"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/success.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure", function (req, res) {
    res.redirect("/signup.html");
});

app.listen(process.env.PORT, function () {
    console.log("Server is running on port " + (process.env.PORT));
});




