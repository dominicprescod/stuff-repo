var request = require("request");
var AWS = require('aws-sdk');
var http = require("https");
AWS.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var  docClient = new AWS.DynamoDB.DocumentClient(),
     table     = "n2p_call_hold";
var checkAndDelete = (docClient, table, io) => {
  docClient.scan({TableName: table}, (err, data) => {
        if(err){
          console.log('problem getting all items in the table')
          console.log(err)
        } else {
          console.log('success getting all items in the table')
          // console.log(JSON.stringify(data))
          // console.log(JSON.stringify(data.Items))
          var bearertoken = data.Items.find((i)=>{
            return i.callerId === "BearerToken"
          })
          var all = data.Items;
          var clearAll = (elem) => {
            console.log('clearAll()')
              var options = {
                "method": "GET",
                "hostname": "portal.net2phoneoffice.com",
                "port": null,
                "path": "/uapi/phoneCalls/0241/@self/"+elem.callerId,
                "headers": {
                  "authorization": bearertoken.info.token,
                  "content-type": "application/json",
                  "cache-control": "no-cache",
                  "postman-token": "d8a42170-a04a-b28e-49dd-b37d0531425d"
                }
              };

            if(elem.callerId !== "BearerToken"){
                  var req = http.request(options, function (res) {
                  var chunks = [];

                  res.on("data", function (chunk) {
                    chunks.push(chunk);
                  });

                  res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                    if(!JSON.parse(body).entry.length){
                      docClient.delete({TableName:table,Key:{"callerId":elem.callerId}},(dErr,dData)=>{
                        if(dErr){
                          console.log('problem deleting item')
                          console.log(dErr)
                        } else {
                          console.log('success deleting item')
                          io.emit("remove_caller", JSON.parse(body))
                          console.log(dData)
                        }
                      })
                    }
                  });
                });
                req.end();
              }
              if(all.length) clearAll(all.shift())
          }
          clearAll(all.shift())
        }
  })

}
// checkAndDelete(docClient, table)
module.exports = checkAndDelete;
