var express               = require('express'),
    bodyParser            = require('body-parser'),
    port                  = process.env.PORT || 80,
    app                   = express(),
    AWS                   = require('aws-sdk'),
    isEmpty               = require('./isEmpty.js'),
    repeat                = require('repeat'),
    bearertoken           = require('./bearertoken.js'),
    checkAndDelete        = require('./checkAndDelete.js'),
    request               = require('request'),
    http                  = require('http').Server(app),
    io                    = require('socket.io')(http);


    //CORS middleware
       var allowCrossDomain = function(req, res, next) {
           res.header('Access-Control-Allow-Origin', '*');
           res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
           res.header('Access-Control-Allow-Headers', 'Content-Type');
           next();
       }

       app.use(allowCrossDomain);
       app.use(express.static('public'));
       app.use(bodyParser.json({limit: '50mb'}));
       app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

       // DynamoDB configuration
       AWS.config.update({
         region: "us-east-1",
         endpoint: "http://dynamodb.us-east-1.amazonaws.com"
       });

       var  docClient = new AWS.DynamoDB.DocumentClient(),
            table     = "n2p_call_hold";

      //  app.post('/stuff', (req, res) => {
      //    docClient.get({TableName: table, Key: {"callerId": req.body.CallAPIID}},(err, data) => {
      //      if(err){
      //        console.log('problem finding the item')
      //        console.log(err)
      //      } else {
      //        console.log('Success finding the item')
      //        if(isEmpty(data)){
      //          var info = req.body;
      //          req.body = {};
      //          req.body["callerId"] = info.CallAPIID;
      //          req.body["info"] = info;
      //          docClient.put({TableName: table, Item: req.body }, (pErr, pData) => {
      //            if(pErr) {
      //              console.log('problem saving new item')
      //              console.log(pErr)
      //            } else {
      //              console.log('success saving new item')
      //              console.log(pData)
      //            }
      //          })
      //        }
      //        console.log(data)
      //      }
      //    })
      //    io.emit("log", req.body)
      //    res.end();
      //  })

      //  Get the Bearer token every hour
      var bt = "Bearer "+(repeat(bearertoken).every(3540,"s").start.now()).access_token
      // Check the status of the list of items every second
      repeat(checkAndDelete(bt, docClient, table)).every(1,'s').start.in(5, 's');

      // // Checking the list of items in the DB
      // app.get('/dynamo', (req, res) => {
      //   docClient.scan({TableName:"n2p_call_hold"}, (err, data) => {
      //     if(err){
      //       console.log('problem finding all the items');
      //       res.send(err)
      //     } else {
      //       console.log('success finding all the items')
      //       res.send(data)
      //     }
      //   })
      // })
      // //  I need to get the stupid Bearer token every?
      //
      // // Check the N2P to see if the
      //
       http.listen(port, () => {
         console.log("I'm on port: "+port)
       })
