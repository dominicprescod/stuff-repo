var request = require("request");

var getToken = () => {
  var options = { method: 'POST',
    url: 'https://portal.net2phoneoffice.com/oauth/token.php',
    headers:
     { 'postman-token': '899011c7-4fde-9d20-f934-070192d86552',
       'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body:
     { grant_type: 'client_credentials',
       client_id: 'f-YpXqxWAN~F6qQOOWI.0x5EO13R~f5t',
       client_secret: 'Q_pcRJ90Ss_IyDWknKn~DFmvtVUE~vG2' },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body)
    return body;
  });
}
getToken()
module.exports = getToken;
