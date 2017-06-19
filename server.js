var express               = require('express'),
    bodyParser            = require('body-parser'),
    port                  = process.env.PORT || 3000,
    app                   = express(),
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

       app.post('/stuff', (req, res) => {
         io.emit("log", req.body)
         res.end();
       })


       http.listen(port, () => {
         console.log("I'm on port: "+port)
       })
