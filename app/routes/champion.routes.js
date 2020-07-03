const {authJwt} = require("../middleware");
const artilce = require("../controllers/champion.controller.js");
const router =  require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token,Origin,Content-Type,Accept"
        ) ;
 
        next(); 
    });
   

    //create
    app.post("/api/champion", [authJwt.verifyToken],artilce.create);

    //retrieve all
    app.get("/api/champion", [authJwt.verifyToken],artilce.findAll);

    //retrieve all published 
    app.get("/api/champion/published", artilce.findAllPublished);

     //retrieve all champion user
     app.get("/api/champion/usercount", artilce.findChampionUser);
    
    //retrieve all user 
    app.get("/api/champion/user/:id",[authJwt.verifyToken], artilce.findAllUser);

    //retrieve a single champion
    app.get("/api/champion/:id",[authJwt.verifyToken], artilce.findOne);

    //update
    app.put("/api/champion/:id",[authJwt.verifyToken], artilce.update);

    //delete by id 
    app.delete("/api/champion/:id", [authJwt.verifyToken],artilce.delete);

    //delete by id 
    app.delete("/api/champion/user/:id", [authJwt.verifyToken],artilce.deleteUser);

    //delete all
    app.delete("/api/champion/",[authJwt.verifyToken], artilce.deleteAll);

    // app.use('/api/champion', router);
};