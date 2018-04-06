var express = require('express');
var router = express.Router();
const request = require('request');
const slackToken = process.env.SLACK_TOKEN;

/* GET users listing. */
router.post('/', function(req, res, next) {
	let users = [];
	getUsers().then(response => {
		let userResponse = JSON.parse(response);
		console.log(userResponse);
		for (var key in userResponse) {
			if (userResponse.hasOwnProperty(key)) {
				if (key === 'members') {
					userResponse[key].forEach(user => {
						if (user.is_bot === false && user.name !== 'slackbot') {
							users.push(user.name);
							console.log(user);
						}
					});
				}
			}
		}
		console.log(users);
		var shuffledUsers = shuffleNames(users);
		var choreString = distributeChores(shuffledUsers);
		var responseObject = {
			response_type: 'in_channel',
			text: choreString
		};
		res.send(responseObject);
	});
});

function getUsers() {
	const requestURL = `https://slack.com/api/users.list?token=${slackToken}&pretty=1`;
	return new Promise((resolve, reject) => {
		request.get(requestURL, (error, response, body) => {
			if (error) {
				reject(error);
			}

			if (!error && response.statusCode === 200) {
				resolve(body);
			} else {
				reject(new Error(body));
			}
		});
	});
}

function shuffleNames(users) {
	let shuffledUsers = users;
	var currentIndex = shuffledUsers.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = shuffledUsers[currentIndex];
		shuffledUsers[currentIndex] = shuffledUsers[randomIndex];
		shuffledUsers[randomIndex] = temporaryValue;
	}

	return shuffledUsers;
}

function distributeChores(nameArray) {
	var str = '';
	var chores = ['Kitchen Counters', 'Refrigerator', 'Dishes'];
	var peoplePerChore = Math.ceil(nameArray.length / chores.length);

	var startIndex = 0;
	var endIndex = peoplePerChore;

	for (i = 0; i < chores.length; i++) {
		str += chores[i];
		str += '\n';
		str += nameArray.slice(startIndex, endIndex).join(', ');
		str += '\n';
		startIndex = endIndex;
		endIndex = endIndex + peoplePerChore;
	}

	return str;
}

module.exports = router;
