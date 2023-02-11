const addEntity = require("../models/add-entity");

async function handleInputData(req, res) {
  const data = req.body;
  console.log(data);  

  const entity = await addEntity(data);

  res.json({ "entity" : entity });
}

module.exports = handleInputData;
