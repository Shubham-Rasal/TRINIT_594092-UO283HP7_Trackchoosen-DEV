const {get , ref} = require("firebase/database");

const {db} = require("../firebase/config.js");

async function getAllEntities(){
    const entities = await get(ref(db, "entities"));
    const entitiesList = entities.val();
    const response = [];
    for (const entity in entitiesList){
        response.push({
            id : entity,
            entity : entitiesList[entity]
        });
    }
    return response;
}

module.exports = getAllEntities;