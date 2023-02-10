const {app , db} = require('../firebase/config.js');
const {set , ref} = require('firebase/database');
const { v4: uuidv4 } = require('uuid');
async function addEntity (entity) {

    //add entity to database
    const entity_id = uuidv4();

     set(ref(db, 'entities/' +entity_id), entity);
    
    

}

module.exports = addEntity;