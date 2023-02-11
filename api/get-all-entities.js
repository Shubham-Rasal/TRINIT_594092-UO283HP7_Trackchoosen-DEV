const getAllEntities = require("../models/get-entities");

async function getAllData(req , res){
    const data = await getAllEntities();
    res.send(data);
}

module.exports = getAllData;