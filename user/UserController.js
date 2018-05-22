var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Client = require('instagram-private-api').V1;
const DR = '/root/instagram/client/v1/cookies/'

var fs = require('fs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/get/', function (req, res) {
  let login = req.body.login;
  var device = new Client.Device(login);
  var storage = new Client.CookieFileStorage(DR+login+'.json');
  var session = new Client.Session(device, storage)
  var d;
  var b;

  var readStream = fs.createReadStream(DR+login+'.json');
  readStream
    .on('data', function (chunk) {
        //res.send(chunk);
        d = chunk;
        getAcc(session, d,res, login)
    })
    .on('end', function () {
        // This may not been called since we are destroying the stream
        // the first time 'data' event is received
        console.log('All the data in the file has been read');
        readStream.destroy();
    })
    .on('close', function (err) {
        console.log('Stream has been destroyed and file has been closed');
    });

});

function getAcc(session, data, res, login) {
  console.log('get acc');
  session.getAccount()
    .then(function(account) {
      console.log(account.params)
      b = account.params;
      fs.writeFile(DR+login+'.json', data , function(err) {
        if(err) {
            res.send(err);
        }else {
            res.send(account.params)
        }
      });
    })
}

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
