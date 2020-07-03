const CustomMail = require("../utils/CustomMail");
const response = require("../utils/response");

class ServiceController{
    async mail(req, res){
        await  CustomMail.send(req.body);
        res.status(201).send(response("Email Sent Successfully"));
    }
}

module.exports = new ServiceController();