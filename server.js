var express               = require('express'),
    bodyParser            = require('body-parser'),
    port                  = process.env.PORT || 80,
    app                   = express(),
    // AWS                   = require('aws-sdk'),
    isEmpty               = require('./isEmpty.js'),
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
      //  AWS.config.update({
      //    region: "us-east-1",
      //    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
      //  });

       var docClient = new AWS.DynamoDB.DocumentClient();

       app.post('/stuff', (req, res) => {
        //  docClient.get({TableName: "n2p_call_hold", Key: {"callerId": req.body.CallAPIID}},(err, data) => {
        //    if(err){
        //      console.log('problem finding the item')
        //      console.log(err)
        //    } else {
        //      console.log('Success finding the item')
        //      if(isEmpty(data)){}
        //      console.log(data)
        //    }
        //  })
          console.log(req)
         io.emit("log", req.body)
         res.end();
       })


      // Checking the list of items in the DB
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
      //  I need to get the stupid Bearer token every?

      // Check the N2P to see if the

       http.listen(port, () => {
         console.log("I'm on port: "+port)
       })
