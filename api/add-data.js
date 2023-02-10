const addEntity = require("../models/add-entity");

async function handleInputData(req, res) {
  const data = req.body;
  console.log(data);
  await addEntity(data);

  res.send("entity added");
}

module.exports = handleInputData;
