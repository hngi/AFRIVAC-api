const router = require("express").Router();
const ServiceController = require("./../controllers/ServiceController")

module.exports = ()=> {
    router.post("/mail",ServiceController.mail);

    return router;
};


