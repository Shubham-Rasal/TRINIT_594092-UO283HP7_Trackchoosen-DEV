import { useState, useEffect } from "react";

export default function Parameters() {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/parameters")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setParameters(data.params);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  async function handleAddParameter(e) {
    e.preventDefault();

    //get the form data
    const data = new FormData(e.target);

    //create a new parameter object
    const newParameter = {
      name: data.get("name"),
      type: data.get("type"),
      min: data.get("min"),
      max: data.get("max"),
    };

    console.log(newParameter);

    //check if empty
    if (newParameter.name === "" || newParameter.type === "") {
      alert("Please fill in all fields");
      return;
    }

    // if min max empty set to 0 and 100
    if (newParameter.min === "") {
      newParameter.min = 0;
    }

    if (newParameter.max === "") {
      newParameter.max = 100;
    }

    //add the new parameter to the parameters array
    setParameters([...parameters, newParameter]);

    //clear the form
    e.target.reset();

    //update the database
    const res = await fetch("http://localhost:8080/parameters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParameter),
    });

    const response = await res.json();
    console.log(response);

  }

  return (
    <div className="parameters">
      <h2 className="bg-black text-white text-xl">Parameters</h2>
      <div className="add w-100 m-2 flex ">
        <form className="w-full" onSubmit={handleAddParameter}>
          <input className="w-1/2" type="text" name="name" placeholder="Name" />
          <input className="w-1/2" type="text" name="type" placeholder="Type" />
          <input
            className="w-1/2"
            type="text"
            name="min"
            placeholder="Minimum"
          />
          <input
            className="w-1/2"
            type="text"
            name="max"
            placeholder="Maximum"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
      <ul>
        {parameters.map((parameter) => (
          <li
            key={parameter.id}
            className=" w-100 flex justify-between p-2 m-2 bg-teal-300"
          >
            <p>{parameter.name}</p>
            <p>{parameter.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
