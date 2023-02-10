
const ConfigureSystem  = (req, res) => {

    const no_of_parameters = req.body.no_of_parameters;
    const parameters = req.body.parameters;

    console.log(parameters);

    res.send("Data received");
}

module.exports = ConfigureSystem;

//create a test json objext
// {
//     "no_of_parameters": 2,
//     "parameters": [
//         {
//             "name": "temperature",
//             "type": "float",
//             "min": 0,
//             "max": 100
//         },
//         {
//             "name": "humidity",
//             "type": "float",
//             "min": 0,
//             "max": 100
//         }
//     ]
// }