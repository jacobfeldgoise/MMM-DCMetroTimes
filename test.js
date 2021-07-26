function callBusAPI(id, params, busStopList) {
  return new Promise((resolve, reject) => {
  var newParams = JSON.parse(JSON.stringify(params));
  newParams.path = params.path + id
  console.log()
  https.get(newParams, (res) => {
    var body = [];
    var all = {};
    res.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      all[id] = body
      resolve(all);
    }).on('error', reject);
  });
});
}

function combineBusData(ids, params) {
  var busStopList = {}
  for (var cIndex = 0; cIndex < ids.length; cIndex++){
    busStopList[ids[cIndex]] = {}
  }
  Promise.all(ids.map(id => callBusAPI(id, params, busStopList))).then((combined) => {
    combinedFormatted = Object.assign({}, ...combined)
    for (var key in combinedFormatted){
      busStopList[key] = combinedFormatted[key]
    }
    console.log(busStopList);
  }).catch((error) => {
    console.log(error);
  });
}

const https = require('https');
var params = {
  hostname: "api.wmata.com",
  port: 443,
  path: "/NextBusService.svc/json/jPredictions" + "?StopID=",
  method: "GET",
  headers: {
    api_key: "1464d8f7193a4a9c929676dcbf402f8c"
  }

};

var ids = ["1003760", "1001724"]

combineBusData(ids, params)
