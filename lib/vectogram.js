//
//  Server
//
var http = require('http')
  , Converter = require('./converter')

//regex for extracting params from request
var rgx = /\/(\w+)\/(\w+)\/(.+)/;

var Server = function () {
  var self = this;

  this.server = http.createServer(function (req, res) {
    var match = rgx.exec(req.url)

    if(!match) {
      var reason = 'mal-formatted request. Request should be of the form /api_key/auth_hash/url_to_image';
      res.writeHead(400, reason); //bad request format
      return;
    }

    var apiKey = match[1]
      , authHash = match[2]
      , imgUrl = match[3];

    if(!self.auth(apiKey, authHash)) {
      var reason = 'API key and/or Authentication hash are invalid.';
      res.writeHead(401, reason); //unauthorized
      return;
    }

    var params = {
        apiKey: apiKey
      , authHash: authHash
      , imgUrl: imgUrl
    };

    var converter = new Converter();
    
    converter.svg(params, function (err, data) {
      if(err) throw err;

      //send back data to client
      res.end(data)
    });
  });
  this.server.listen(8000);
}

module.exports = Server;

Server.prototype.auth = function (apiKey, authHash) {
  return true;
}