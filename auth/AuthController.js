var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var dir = __dirname + './client/v1/cookies/';
var Client = require('instagram-private-api').V1;

const DR = '/root/instagram/client/v1/cookies/'
var fs = require('fs');
//require('constants.js')
//console.log(cs);
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/session/create/', function(req, res) {
      let login = req.body.login;
      console.log(req.body);
      fs.appendFile(DR+login+'.json', '', function (err) {
        if (err) res.send('err');
        else res.send('Succes');
      });

  });
router.post('/login/', function(req, res) {
      let login = req.body.login;
      let pass = req.body.pass;
      console.log(req.body);
      var device = new Client.Device(login);
      var storage = new Client.CookieFileStorage(DR+login+'.json');
      var session = new Client.Session(device, storage)

      Client.Session.create(device, storage, login, pass)
      	.then(function(session) {
          console.log('login');
          res.send('login succes')
      		return [session, Client.Account.searchForUser(session, 'instagram')]
      	})
      	.spread(function(session, account) {
      		return Client.Relationship.create(session, account.id);
      	})
      	.then(function(relationship) {
      		console.log(relationship.params)
      	})

    });
router.get('/me', function(req, res) {


  });
router.get('/login', function(req, res) {

  res.send('login')

});
router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

  module.exports = router;
