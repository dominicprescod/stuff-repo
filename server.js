var express               = require('express'),
    bodyParser            = require('body-parser'),
    port                  = process.env.PORT || 3000,
    app                   = express(),
    AWS                   = require('aws-sdk'),
    isEmpty               = require('./isEmpty.js'),
    // repeat                = require('repeat'),
    // bearertoken           = require('./bearertoken.js'),
    checkAndDelete        = require('./checkAndDelete.js'),
    request               = require('request'),
    url                   = require('url'),
    moment                = require('moment'),
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

      app.get('/apiGateway',(req, res)=>{
        console.log('apiGateway call')
        console.log({success:"got apiGateway"})
        res.send({success:"got apiGateway"})
      })

      app.get("/all",(req,res) => {
        docClient.scan({TableName: table}, (err, data)=>{
            if(err) {
              console.log('problem getting all items')
              res.send(err)
            } else {
              console.log("success getting all items")
              res.send(data)
            }
        })
      })


      app.post('/newCaller', (req, res) => {
          console.log('newCaller')
          console.log(req.body)
          io.emit("new_caller", req.body)
          res.send({success: "Posted to website"});
      });

      app.post("/deleteCaller", (req,res) => {
        console.log('deleteCaller')
        console.log(req.body)
        io.emit('remove_caller', req.body);
        res.send({success:"Posted to website"})
      })
      app.get("/checkAndDelete", (req,res) => {
        checkAndDelete(docClient, table, io)
        res.send({success:"got checkAndDelete"})
      })
      var threeSecondInterval = setInterval(()=>{
        console.log('threeSecondInterval')
        var options = { method: 'GET',
          url: 'http://localhost:3000/checkAndDelete',
          headers:
           { 'postman-token': '00deb35e-b547-6033-104e-adf91f08ffb4',
             'cache-control': 'no-cache' } };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
        });
      }, 3000);
      // console.log(url.Url())
       http.listen(port, () => {
         console.log("I'm on port: "+port)
       })
