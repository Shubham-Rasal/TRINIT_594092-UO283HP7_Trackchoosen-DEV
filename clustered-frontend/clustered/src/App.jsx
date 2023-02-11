import { useState } from "react";
import Entities from "./components/Entities";
import Clusters from "./components/Clusters";
import Parameters from "./components/Parameters";
function App() {
  const [page, setPage] = useState("entities");

  return (
    <>
      <div className="app">
        <div className="app__header">
          <div className="app__header__title">
            <h1 className="text-4xl font-bold w-screen text-center">Clustered</h1>
          </div>
          <div className="app__header__nav ">
            <ul className="flex  text-white">
              <li className=" bg-teal-700 p-2 m-2">
                <button onClick={() => setPage("entities")}>Entities</button>
              </li>
              <li className=" bg-teal-700 p-2 m-2">
                <button onClick={() => setPage("parameters")}>
                  Parameters
                </button>
              </li>
              <li className=" bg-teal-700 p-2 m-2">
                <button onClick={() => setPage("clusters")}>Clusters</button>
              </li>
            </ul>
          </div>

          <div className="app_content">
            {page === "entities" && <Entities />}
            {page === "parameters" && <Parameters />}
            {page === "clusters" && <Clusters />}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
