function handleInputData(req , res){
    
    //get data from request
    const data = req.body;
    console.log(data);

    var dataset = [
        [1,0],[0,0],[1,0],
        [10,0],[10,0],[13,0],
        [54,0],[55,0],[89,0],[57,0]
    ];
    
    var clustering = require('density-clustering');
    var dbscan = new clustering.DBSCAN();
    // parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
    var clusters = dbscan.run(dataset, 5, 2);
    console.log(clusters, dbscan.noise);
    
    /*
    RESULT:
    [
        [0,1,2],
        [3,4,5],
        [6,7,9],
        [8]
    ]
    
    NOISE: [ 8 ]
    */
    
    //send response
    res.send("Data received");
    

}

module.exports = handleInputData;