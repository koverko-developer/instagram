var Client = require('instagram-private-api').V1;
var device = new Client.Device('koverko_dev');
var storage = new Client.CookieFileStorage(__dirname + '/client/v1/cookies/koverko_dev.json');
var _ = require('lodash');
var Promise = require('bluebird');
var session = new Client.Session(device, storage)
var accountId = '1769917485'
var feed = new Client.Feed.UserMedia(session, accountId,20);

console.log('start');
//And go for login
//maximgrishan
//10031997max
//1769917485
console.log(feed.get());
// Client.Session.login(session, 'koverko_dev', '3057686Kowerko1')
// 	.then(function(session) {
//     console.log('login');
//     var media = new Client.Feed.UserMedia(session,'1769917485',10);
//     var b = media.get();
//    		// Now you have a session, we can follow / unfollow, anything...
// 		// And we want to follow Instagram official profile
// 		return [session, Client.Account.searchForUser(session, 'instagram')]
// 	})
// 	.spread(function(session, account) {
// 		return Client.Relationship.create(session, account.id);
// 	})
// 	.then(function(relationship) {
// 		console.log(relationship.params)
//
// 		// {followedBy: ... , following: ... }
// 		// Yey, you just followed @instagram
// 	})
// session.getAccount()
//   .then(function(account) {
// 	console.log(account.params)
// 	// {username: "...", ...}
//   })
// Client.Account.getById(session, '5972326347')
// 	.then(function(account) {
// 		console.log(account.params);
// 		// {username: "...", ...}
// 		console.log(account.id);
// 		// only property which is exported as top level
// 		// property
// 	})
// Client.Relationship.destroy(session,'1769917485')
//   .then(function(data){
//     console.log(data);
//   })

//console.log(account);
console.log('finish');
