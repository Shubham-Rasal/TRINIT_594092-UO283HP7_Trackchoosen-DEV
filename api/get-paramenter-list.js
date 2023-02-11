const getAllParams = require("../models/get-params");

function getAllParameters(req , res) {
   
    getAllParams().then((params) => {
        res.json({ "params" : params });
    }
    ).catch((err) => {
        res.send(err);
    });

}

module.exports = getAllParameters;
