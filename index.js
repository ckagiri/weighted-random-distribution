var readline = require('readline');
var Vose = require('./vose');
var currentType = 1;
var totalTypes = 0;
var animals = [];
var weights = [];
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var prompts = {
	again: {
		q: 'Go again? Type "y" or "n"',
		handler: function (answer) {
			if (answer === 'y') {
				reset();
				promptUser('types');
			} else if (answer === 'n') {
				exit();
			} else {
				promptUser('again', 'That\'s not "y" or "n", so I don\'t know what you mean');
			}
		}
	},
	types: {
		q: 'How many types of animal? Please enter an integer:',
		handler: function (answer) {
			var n = getInteger(answer);
			if (n !== null && n > 0) {
				console.log('OK, you want', n, 'type(s) of animal!');
				totalTypes = n;
				promptUser('animal');
			} else {
				promptUser('types', 'Whoa there! Try again with integers greater than 0...');
			}
		}
	},
	animal: {
		q: 'Please enter an animal and its weighting in this format, "dog, 5":',
		handler: function (answer) {
			var split = answer.split(/,? /, 2);
			var name = split[0];
			var weight = getInteger(split[1]);

			if (split.length !== 2 || weight === null) {
				return promptUser('animal', 'Hmm, I don\'t quite understand. Try the format again...');
			}
			if (animals.hasOwnProperty(name)) {
				return promptUser('animal', 'No repeat animals, please!');
			}

			console.log('Animal', currentType, 'of', totalTypes + ', name:', name, 'with weighting:', weight);
			animals.push([name, 0]);
			weights.push(weight);

			return (++currentType <= totalTypes) ? promptUser('animal') : makeDistribution(animals, weights);
		}
	}
};

function exit() {
	console.log('\n\nkthxbai!!!\n(Use "node index" to go again.)\n');
	rl.close();
}

function getInteger(value) {
	var i = (/\D/.exec(value) === null) ? parseInt(value) : null;
	return (i === i) ? i : null;
}

function makeDistribution(values, weights) {
	var v = new Vose(weights);

	for (var i = 0; i < 100; i++) {
		animals[v.next()][1]++;
	}

	console.log('\nHere\'s your distribution:');
	animals.forEach(function (value) {
		console.log(value[0], value[1]);
	});

	promptUser('again');
}

function promptUser(name, message) {
	var prompt = prompts[name];
	if (typeof message !== 'undefined') {
		console.log(message);
	}
	if (prompt !== undefined) {
		rl.question('\n' + prompt.q + ' ', prompt.handler);
	} else {
		rl.close();
	}
}

function reset() {
	currentType = 1;
	totalTypes = 0;
	animals.length = 0;
	weights.length = 0;
}

rl.on('SIGINT', exit);
console.log('\nWelcome to the animal distribution calculator!\nYou give me number of types of animal and the odds of drawing each,\nand I\'ll display the distribution for a population of 100 animals\nLet\'s get started! (or type "ctrl + c" to exit)');
promptUser('types');
