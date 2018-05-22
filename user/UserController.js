var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Client = require('instagram-private-api').V1;
const DR = '/root/instagram/client/v1/cookies/'

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/get/', function (req, res) {
  let login = req.body.login;
  var device = new Client.Device(login);
  var storage = new Client.CookieFileStorage(DR+login+'.json');
  var session = new Client.Session(device, storage)

  fs.readFile("DR+login+'.json',", "utf8", function(err, data) {
        
        if(err) res.send(err);
        else {
          console.log(data)
          res.send(data)  
        }
      
      });
});


router.get('/', function (req, res) {
    res.send("get user");
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {

});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {

});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {

});


module.exports = router;
