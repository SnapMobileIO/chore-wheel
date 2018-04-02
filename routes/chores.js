var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var choreString = distributeChores(shuffleNames());
	res.send(choreString);
});

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
