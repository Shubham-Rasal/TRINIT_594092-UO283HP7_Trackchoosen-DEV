const { set, ref, get } = require("firebase/database");
const { db } = require("../firebase/config.js");

async function addParams(params) {
  //get all parameters
  const paramsRef = ref(db, "parameters");
  const snapshot = await get(paramsRef);

  if (!snapshot.exists()) {
     const paramsList = [];
     paramsList.push(params);
     set(paramsRef, paramsList);
     return;
  }

     const paramsList = snapshot.val();
     console.log(paramsList);
     paramsList.push(params);
     set(paramsRef, paramsList);
 
}

module.exports = { addParams };
