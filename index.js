const bodyParser = require("body-parser");
const { response } = require("express");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let DB = {
    users: 
    [
    {
        id: 1,
        name: "sergio",
        email: "sergio@gmail.com",
        password: "123456"
    },
    {
        id: 2,
        name: "thiago",
        email: "thiago@gmail.com",
        password: "303030"
    }
    ]
    
}

const JWTSecret = "keymaster";

function auth(req, res, next) {
    const authToken = req.headers['authorization'];

    if(authToken != undefined) {
        
        const bearer = authToken.split(' ');
        const token = bearer[1];
        
        jwt.verify(token, JWTSecret, (err, data) => {
            if(err) {
                res.status(401).json({err: "token invalido!"});
            } 
            else {

                req.token = token;
                req.userLogged = {id: data.id, user: data.email};
                next();
            }
        });

    } else {
        res.status(401).json({err: "nao autorizado"});
    }

}

app.get("/", auth , (req, res) => {
    res.send(DB.users)
});

app.post("/login/", (req, res) => {

    let {email, password} = req.body;

    if(email != undefined) {

        let userEmail = DB.users.find(user => user.email == email);

        if(userEmail != undefined) {

            if(userEmail.password == password) {
                
                jwt.sign({id: userEmail.id, email: userEmail.email},JWTSecret,{expiresIn: "48h"}, (err, token) => {
                    if(err) {
                        res.status(500).json({err: err})
                    } if(token) {
                        res.status(200).json({token: token})
                    }
                })

                
                
            } else {
                res.status(401).json("senha incorreta!")
            }

        } else {
            res.status(404).json("nao existe email")
        }
        

    } else {
       res.status(400).json("Envie um email valido!");
    }

});


app.listen(9180, () => {
    console.log("servidor rodando porta 9180");
});