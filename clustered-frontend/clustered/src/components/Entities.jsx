import { useState, useEffect } from "react";

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newEntity, setNewEntity] = useState({
    name: "",
    parameters: [],
  });

  const [newEntityParameters, setNewEntityParameters] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/data")
      .then((res) => res.json())
      .then((data) => {
        setEntities(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });

    fetch("http://localhost:8080/parameters")
      .then((res) => res.json())
      .then((data) => {
        setParameters(data.params);
        console.log(data.params);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  async function handleAddEntity(e) {
    e.preventDefault();

    // put the parameters in the new entity
    setNewEntity({ ...newEntity, parameters: newEntityParameters });

    console.log(newEntity);

    if(newEntity.name === "" || newEntity.parameters.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    //add the new entity to the database
    const response = await fetch("http://localhost:8080/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntity),
    });

    const data = await response.json();

    console.log(data);

    //add the new entity to the entities array
    setEntities([...entities, data.entity]);

    //clear the form
  }

  function initialiseParam(parameter, e) {
    console.log(parameter);

    //check if parameter is already in the newEntityParameters array
    if (newEntityParameters.some((p) => p.name === parameter.name)) {
      //if it is, remove it
      setNewEntityParameters(
        newEntityParameters.filter((p) => p.name !== parameter.name)
      );
    } else {
      //if it isn't, add it

      const name = parameter.name;
      const type = parameter.type;
      const value = null;

      setNewEntityParameters([...newEntityParameters, { name, type, value }]);
    }
  }

  function updateParam(e, parameter) {
    console.log(e.target.value);

    //get the parameter name
    const name = parameter.name;

    //get the parameter value
    let value = e.target.value;
    
    // if checkbox, set value to true or false
    if (parameter.type === "checkbox") {
      if (e.target.checked) {
        value = true;
      } else {
        value = false;
      }
    }


    //find the parameter in the newEntityParameters array
    let param = newEntityParameters.find((p) => p.name == name);

    //update the parameter value
    console.log("param", param);

    param.value = value;

    //update the newEntityParameters array
    setNewEntityParameters([...newEntityParameters]);

    console.log(newEntityParameters);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="entities">
      <h2 className="text-2xl">Entities</h2>

      <div className="add-entity p-2 m-3">

        <h3 className = "text-xl">Adding a new entity</h3>

        <form onSubmit={handleAddEntity}>
          <input
            className="border-2 border-gray-300 p-2 m-2"
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) =>
              setNewEntity({ ...newEntity, name: e.target.value })
            }
          />
            <h3 className="text-xl">Parameters</h3>
          <div className="parameters m-2 ">
            <div className="flex">

            {parameters.map((parameter) => (
              <div className="m-2 bg-teal-400 w-fit p-2" key={parameter.name}>
                <input
                  type="checkbox"
                  name={parameter.name}
                  value={parameter.name}
                  onClick={(e) => initialiseParam(parameter, e)}
                  />
                <label>{parameter.name}</label>
              </div>
            ))}
            </div>
            <div className="actual-params bg-gray-200  flex w-full flex-col p-2 m-2">
              <h2 className="text-xl">Actual Parameters</h2>
              {newEntityParameters.map((param) => (
                <div className="flex flex-row w-full justify-between px-12  m-3">
                  <label>{param.name}</label>
                  <input
                    type={param.type == "boolean" ? "checkbox" : param.type}
                    name="value"
                    placeholder="Value"
                    onChange={(e) => updateParam(e, param)}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add Entity
          </button>
        </form>
      </div>

      {entities.length == 0 && <p>No entities to show</p>}

      {entities.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Entity ID</th>
                <th className="px-4 py-3">Name</th>
                {parameters.map((parameter) => (
                  <th scope="col" className="px-6 py-3">
                    {parameter.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entities.map(({ entity, id }) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {id}
                  </th>
                  <td className="px-6 py-4">{entity.name}</td>
                  {parameters.map((parameter) =>
                    entity.parameters.some((p) => p.name === parameter.name) ? (
                      <td className="px-6 py-4">
                        {entity.parameters
                          .find((p) => p.name === parameter.name)
                          .value.toString()}
                      </td>
                    ) : (
                      <td className="px-6 py-4">-</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
