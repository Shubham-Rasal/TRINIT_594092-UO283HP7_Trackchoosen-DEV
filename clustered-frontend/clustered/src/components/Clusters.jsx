import { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
export default function Clusters() {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(1);
  const [neighbours, setNeighbours] = useState(2);
  const [clusters, setClusters] = useState([]);
  const [chartData, setChartData] = useState({});
  const url = "https://thankful-ant-helmet.cyclic.app"

  const [query, setQuery] = useState({});

  useEffect(() => {
    // fetch("http://localhost:8080/parameters")
    fetch(url + "/parameters")
      .then((res) => res.json())
      .then((data) => {
        setParameters(data.params);
        setQuery({
          name: data.params[0].name,
          type: data.params[0].type,
          neighbours: 2,
          radius: 1,
        });
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // use effect when query changes
  useEffect(() => {
    if (loading) return;

    console.log("query changed", query);

    // fetch("http://localhost:8080/cluster", {
    fetch(url + "/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        setClusters(data);

        //find the cneter of the a cluster and draw a circle
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });

    // get the data from the database
  }, [query]);

  // use effect when radius or neighbours changes
  useEffect(() => {
    setQuery({
      name: query.name,
      type: query.type,
      radius: radius,
      neighbours: neighbours,
    });
  }, [radius, neighbours]);

  //use effect when cluster changes
  useEffect(() => {
    const datasets = clusters.map((cluster, index) => {
      console.log(cluster);
      return {
        label: `Cluster ${index} `,
        data: cluster.map(({ entity }) => {
          const param = entity.parameters.find((p) => p.name === query.name);

          let x = null;

          if (param.type == "date") x = new Date(param.value);
          else if (param.type == "string") x = index + Math.random();
          else if (param.type == "boolean") x = param.value == 1 ? 1 : 0;
          else x = param.value;

          return {
            x: x,
            y: 5,
            r: 50,
          };
        }),

        backgroundColor: `rgba(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255}, 0.5)`,
      };
    });

    console.log(datasets);

    setChartData({ datasets });
  }, [clusters]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: footer,
        }
      }
    }
  };

  // add the entity name to the tooltip
  function footer(tooltipItems) {
    // console.log(tooltipItems);
    return tooltipItems[0].dataset.data[tooltipItems[0].dataIndex].x
  } 

  return (
    <>
      <div className="clusters bg-red-100">
        <h2>Clusters</h2>
        <div className="tablet container w-full mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
          {parameters.map((parameter) => (
            <div className="w-fit  flex flex-col">
              <div className="bg-white border rounded shadow">
                <div className="border-b p-3">
                  <h5 className="font-bold uppercase text-gray-600">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        setQuery({
                          ...query,
                          name: parameter.name,
                          type: parameter.type,
                        })
                      }
                    >
                      {parameter.name}
                    </button>
                  </h5>
                </div>
              </div>
            </div>
          ))}
          <div className="w-fit  flex flex-col">
            <div className="bg-white border rounded shadow">
              <div className="border-b p-3">
                <h5 className="font-bold uppercase text-gray-600">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Radius
                  </label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  />
                </h5>

                <h5 className="font-bold uppercase text-gray-600">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    No of neighbours
                  </label>

                  <input
                    type="number"
                    value={neighbours}
                    onChange={(e) => setNeighbours(Number(e.target.value))}
                  />
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Bubble data={chartData} options={options} />
        </div>
      </div>
    </>
  );
}
