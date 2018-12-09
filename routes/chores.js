var express = require('express');
var router = express.Router();
const request = require('request');
const slackToken = process.env.SLACK_TOKEN;
const inactiveUsers = process.env.INACTIVE_USERS
const choreList = process.env.CHORES

/* POST chores distribution to slack channel */
router.post('/', function(req, res, next) {
	if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
		let users = [];
		getUsers().then(response => {
			const inactiveUsersArray = inactiveUsers.split(',');
			let userResponse = JSON.parse(response);
			for (var key in userResponse) {
				if (userResponse.hasOwnProperty(key)) {
					if (key === 'members') {
						userResponse[key].forEach(user => {
              // Check that user is human and active
							if (!user.deleted &&
                  !user.is_bot &&
                  inactiveUsersArray.indexOf(user.name) < 0) {
                users.push(`@${user.name}`);
							}
						});
					}
				}
			}
			var shuffledUsers = shuffleNames(users);
			var choreString = distributeChores(shuffledUsers);
			var responseObject = {
				response_type: 'in_channel',
				text: choreString
			};
			res.send(responseObject);
		});
	} else {
		var responseObject = {
			text: 'Invalid verifcation token'
		};
	}
});

/* GET users listing. */
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

/* Shuffle array of users */
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

/* Assign users to chores */
function distributeChores(nameArray) {
	var str = '';
	var chores = choreList.split(',');
	var peoplePerChore = Math.ceil(nameArray.length / chores.length);

	var startIndex = 0;
	var endIndex = peoplePerChore;

  // Format string to be displayed on channel
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
