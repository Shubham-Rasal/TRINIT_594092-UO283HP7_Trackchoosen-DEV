const clustering = require("density-clustering");
const dbscan = new clustering.DBSCAN();
const getAllEntities = require("../models/get-entities");
const getAllParams = require("../models/get-params");

function clusterBySingleParam(req, res) {
  const { name, type, radius, no_of_neighbours } = req.body;

  switch (type) {
    case "number":
      clusterByNumber(name, radius, no_of_neighbours)
        .then((clusters) => {
          console.log(clusters);
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "string":
      clusterByString(name, radius, no_of_neighbours)
        .then((clusters) => {})
        .catch((err) => {
          console.log(err);
        });
      break;
    case "boolean":
      clusterByBoolean(name, radius, no_of_neighbours)
        .then((clusters) => {})
        .catch((err) => {
          console.log(err);
        });
      break;
    case "date":
      clusterByDate(name, radius, no_of_neighbours)
        .then((clusters) => {})
        .catch((err) => {
          console.log(err);
        });
      break;
    default:
      console.log("Invalid type");
  }

  res.send("Data received");
}

async function clusterByNumber(name, radius, no_of_neighbours) {
  const entities = await getAllEntities();
  const params = await getAllParams();
  //   console.log(params);
  //   console.log(entities);

  const param = params.find((param) => param.name === name);

  const min = param.min;
  const max = param.max;

  // filter entities to get only the required parameter
  const filteredEntities = entities.map(({ entity, id }) => {
    // console.log(entity);
    // check if the entity has the required parameter
    const param = entity.parameters.find((param) => param.name === name);
    if (!param) {
      return null;
    }
    console.log("param", param);

    const value = param.value;
    const normalizedValue = (value - min) / (max - min);
    // return the entity with the normalized value of the required parameter
    return {
      id: id,
      normalizedValue: Math.round(normalizedValue * 100),
    };
  });

  // filter out the null values
  const filteredEntities2 = filteredEntities.filter(
    (entity) => entity !== null
  );

  // create a dataset
  const dataset = filteredEntities2.map((entity) => {
    return [entity.normalizedValue, 0];
  });

  console.log("dataset", dataset);

  // cluster the dataset
  const clusters = dbscan.run(dataset, radius, no_of_neighbours);

  console.log("clusters", clusters);

  // create a map of clusters
  const clustersMap = new Map();
  clusters.forEach((cluster, index) => {
    clustersMap.set(cluster, []);
  });

  // add entities to clustermap
  clusters.forEach((cluster, index) => {
    const ids = cluster.map((index) => filteredEntities2[index].id);
    clustersMap.get(cluster).push(ids);
  });

  console.log("clustersMap", clustersMap);

  return clustersMap;
}

async function clusterByString(name, radius, no_of_neighbours) {

    // get all entities
    const entities = await getAllEntities();
    // get all params
    const params = await getAllParams();
    // get the required param
    const param = params.find((param) => param.name === name);

    // filter entities to get only the required parameter
    const filteredEntities = entities.map(({ entity, id }) => {
        // check if the entity has the required parameter
        const param = entity.parameters.find((param) => param.name === name);
        if (!param) {
            return null;
        }
        // return the entity with the value of the required parameter
        return {
            id: id,
            value: param.value,
        };
    });

    // filter out the null values
    const filteredEntities2 = filteredEntities.filter((entity) => entity !== null);

    //sort in lexicographical order
    filteredEntities2.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    });

    console.log("filteredEntities2", filteredEntities2);

    // create a dataset based on levenstein distance
    const dataset = filteredEntities2.map((entity, index) => {
        const dis = index === 0 ? 0 : levenshtein(entity.value, filteredEntities2[index - 1].value);
        return [dis, 0];
    });

    console.log("dataset", dataset);
}

async function clusterByBoolean(name, radius, no_of_neighbours) {
    // get all entities
    const entities = await getAllEntities();
    // get all params
    const params = await getAllParams();
    // get the required param
    const param = params.find((param) => param.name === name);

    // filter entities to get only the required parameter
    const filteredEntities = entities.map(({ entity, id }) => {
        // check if the entity has the required parameter
        if(!entity.parameters){
            return null;
        }

        const param = entity.parameters.find((param) => param.name === name);

        if (!param) {
            return null;
        }

        // return the entity with the value of the required parameter
        return {
            id: id,
            value: param.value,
        };
    });

    // filter out the null values
    const filteredEntities2 = filteredEntities.filter((entity) => entity !== null);

    //sort in two clusters based on true or false
    filteredEntities2.sort((a, b) => {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }

        return 0;
    });

    console.log("filteredEntities2", filteredEntities2);

    //create a map of clusters
    const clustersMap = new Map();
    clustersMap.set("true", []);
    clustersMap.set("false", []);

    // add entities to clustermap
    filteredEntities2.forEach((entity) => {
        if (entity.value) {
            clustersMap.get("true").push(entity.id);
        } else {
            clustersMap.get("false").push(entity.id);
        }
    });

    console.log("clustersMap", clustersMap);

    return clustersMap;
}

function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}


module.exports = clusterBySingleParam;
