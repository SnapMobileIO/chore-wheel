var express = require('express');
var router = express.Router();
const request = require('request');
const slackToken = process.env.SLACK_TOKEN;

/* GET users listing. */
router.post('/', function(req, res, next) {
	let users;
	getUsers().then(response => {
		users = response;
		console.log('users', users);
	});
	var choreString = distributeChores(shuffleNames());
	var responseObject = {
		response_type: 'in_channel',
		text: choreString
	};
	res.send(responseObject);
});

function getUsers() {
	const requestURL = `https://slack.com/api/users.list?token=${slackToken}&pretty=1`;
	return new Promise((resolve, reject) => {
		request.get(queryURL, (error, response, body) => {
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

function shuffleNames() {
	var people = [
		'Alaina',
		'Andrea',
		'Avner',
		'Andy',
		'Brandon',
		'Duke',
		'Joe',
		'Drew',
		'Paul',
		'Melissa',
		'Zofia',
		'Kelly',
		'Liz',
		'Dave',
		'Gina',
		'Ryan',
		'Gabe',
		'Catie'
	];
	var currentIndex = people.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = people[currentIndex];
		people[currentIndex] = people[randomIndex];
		people[randomIndex] = temporaryValue;
	}

	return people;
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
