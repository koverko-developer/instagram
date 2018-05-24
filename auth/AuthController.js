var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var dir = __dirname + './client/v1/cookies/';
var Client = require('instagram-private-api').V1;

var firebase = require('firebase');

var config = {
   apiKey: "AIzaSyCaufAWZ2LcRY2Ew2dGnjXcetcMA_TvaoM",
   authDomain: "insta-6f167.firebaseapp.com",
   databaseURL: "https://insta-6f167.firebaseio.com/",
   storageBucket: "insta-6f167.appspot.com"
 };
firebase.initializeApp(config);
var database = firebase.database();


const DR = '/root/instagram/client/v1/cookies/'
var fs = require('fs');

const err_no_key = '{\"type\" : \"err_dev_key\" , \"message\" : \"key is not valid\"}';
const err_no_user = '{\"type\" : \"err_dev_uname\" , \"message\" : \"developer with such a login does not exist\"}'
const err_create_file = '{\"type\" : \"err_create_session\" , \"message\" : \"error creating session file\"}'
const create_file_succes = '{\"type\" : \"successfully\" , \"message\" : \"successfully create session\"}'
const err_login = '{\"type\" : \"err_auth\" , \"message\" : \"Authorisation Error\"}'

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/session/create/', function(req, res) {
    checkKeyAndDev(req, 'create', res);
});
router.post('/login/', function(req, res) {
    checkKeyAndDev(req, 'login', res);
});

function checkKeyAndDev(req, type, res) {

  //let login = req.body.login;
  console.log(req.body);
  let key = req.body.key;
  let dev_uname = req.body.dev_uname;
  // проверяем есть ли ключ у разработчика
  if(dev_uname){
    firebase.database().ref('/developers/' + dev_uname).once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().key) || 'Anonymous';

        if(username === 'Anonymous'){
            errNoDev(res)
        }
        else{
            if(snapshot.val().key === key) {
              console.log('key valid');
              // создаем файл для хранения сессий
              if(type === 'create') {
                let login = req.body.login;
                fs.appendFile(DR+login+'.json', '', function (err) {
                  if (err) errCreate(res)
                  sentLogin(res, req);
                });
              }else {
                sentLogin(res, req);
              }

            }
            else {
              errNoKey(res);
            }
        }
      });
  }
  else {
    errNoDev(res);
  }

}
function errNoDev(res) {
  var str = JSON.stringify(err_no_user);
  console.log(JSON.parse(str));
  res.send(JSON.parse(str))
}
function errCreate(res) {
  var str = JSON.stringify(err_create_file);
  console.log(JSON.parse(str));
  res.send(JSON.parse(str))
}
function createSucces(res) {
  var str = JSON.stringify(create_file_succes);
  console.log(JSON.parse(str));
  res.send(JSON.parse(str))
}
function errNoKey(res) {
  var str = JSON.stringify(err_no_key);
  console.log(JSON.parse(str));
  res.send(JSON.parse(str))
}
function errAuth(res) {
  var str = JSON.stringify(err_login);
  console.log(JSON.parse(str));
  res.send(JSON.parse(str))
}
function sentLogin(res, req) {

  let login = req.body.login;
  let pass = req.body.pass;
  let key = req.body.key;
  let dev_uname = req.body.dev_uname;
  console.log(req.body);

  var device = new Client.Device(login);
  var storage = new Client.CookieFileStorage(DR+login+'.json');
  var session = new Client.Session(device, storage)

  Client.Session.create(device, storage, login, pass)
    .then(function(session) {
      console.log('login');
      sendResInfoAcc(res, req)
      return [session, Client.Account.searchForUser(session, 'instagram')]
    })
    .spread(function(session, account) {
      return Client.Relationship.create(session, account.id);
    })
    .then(function(relationship) {
      console.log(relationship.params)
    })

}
function sendResInfoAcc(res, req) {
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

}
function getAcc(session, d,res, login) {

  session.getAccount()
   .then(function(account) {
     console.log(account.params)
     b = account.params;
     fs.writeFile(DR+login+'.json', d , function(err) {
       if(err) {
           errAuth(res)
       }else {
           chekoutInF(b, res)
       }
     });
   })

}
function chekoutInF(acc, res){
    //res.send(acc)
    let userId = acc.id;
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().token) || 'Anonymous';
      if(username === 'Anonymous'){
        require('crypto').randomBytes(48, function(err, buffer) {
        var token = buffer.toString('hex');
        firebase.database().ref('/users/' + userId).set({
            id: userId,
            balls: 20,
            token : token
          });
          let succes_login = '{\"type\" : \"auth\" , \"message\" : \"Authorisation success\", \"user\" : { \"id\": '+userId+', \"token\":\"'+token+'\",\"info_acc\":'+JSON.stringify(acc)+'}}'
          var str = JSON.stringify(succes_login);
          res.send(JSON.parse(str))
        });
      }else{
          let succes_login = '{\"type\" : \"auth\" , \"message\" : \"Authorisation success\", \"user\" : { \"id\": '+userId+', \"token\":\"'+snapshot.val().token+'\",\"info_acc\":'+JSON.stringify(acc)+'}}'
          var str = JSON.stringify(succes_login);
          res.send(JSON.parse(str))
      }

    });
}

  module.exports = router;

