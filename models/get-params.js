const {ref , get, set} = require("firebase/database");

const {db} = require("../firebase/config.js");

async function getAllParams(){
    const params = await get(ref(db, "parameters"));
    const paramsList = params.val();
    return paramsList;
}

module.exports = getAllParams;