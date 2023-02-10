const { app, db } = require("../firebase/config.js");
const { set, ref } = require("firebase/database");
const { v4: uuidv4 } = require("uuid");
async function addEntity(entity) {
  //add entity to database
  const entity_id = uuidv4();
  set(ref(db, "entities/" + entity_id), entity);



}

module.exports = addEntity;

//make a fake entity
// {
//     "name": "test",
//     "parameters": [
//         {
//             "name": "temperature",
//             "type": "float",
//             "min": 0,
//             "max": 100
//         },
//         {
//             "name" : "date of birth",
//             "type": "date",
//             "min": "01/01/1900",
//             "max": "01/01/2021"

//         },
//     ]
// }
