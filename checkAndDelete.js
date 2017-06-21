var request = require("request");
var checkAndDelete = (auth, docClient, table) => {
  var allItems;
  docClient.scan({TableName: table}, (err, data) => {
        if(err){
          console.log('problem getting all items in the table')
          console.log(err)
        } else {
          console.log('success getting all items in the table')
          console.log(data)
          allItems  = data
        }
  })
  allItems.map((i)=>{
    var options = {
      method: 'GET',
      url: 'https://portal.net2phoneoffice.com/uapi/phoneCalls/0241/@self/'+i.callerId,
      headers: {
        'postman-token': '63bdb11d-c329-5914-30c1-8d5a004261c5',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'authorization': auth
      }
    };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        if(!body.entry){
          docClient.delete({TableName:table, Key:{"callerId":i.callerId}}, (e,d)=>{
            if(e){
              console.log('problem deleting caller object')
              console.log(e)
            } else {
              console.log('success deleting caller object')
              console.log(d)
            }
          })
        }
      });
  })

}

module.exports = checkAndDelete;
