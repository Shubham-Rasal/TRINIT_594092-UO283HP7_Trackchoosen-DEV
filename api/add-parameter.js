const {addParams} = require("../models/add-params.js");

async function handleInputParams(req, res) {
  const data = req.body;
  console.log(data);
  await addParams(data);

  res.send("params added");
}

module.exports = handleInputParams;

// {
//    "name": "age",
//     "type": "number",
//     "value": 20,
//     "min": 0,
//     "max": 100

// }
