/**
 * Vose alias method for efficient sampling of weighted distribution
 * Borrowed almost entirely from https://github.com/jdiscar/vose-alias-method.js
 * Fantastic explanation here: http://www.keithschwarz.com/darts-dice-coins/
 */
 module.exports = Vose;

function Vose(weights) {
  this.alias = [];
  this.probability = [];

  this.init(weights);
  return this;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function normalizeScale(weights) {
  var total = weights.reduce(function (a, b) {
    return a + b;
  });

  if (total > 1) {
    weights = weights.map(function (value) {
      return value / total;
    });
  } else if (total < 1) {
    weights.push(1 - total);
  }

  return weights;
}

Vose.prototype.init = function(weights) {
  var large = [];
  var small = [];
  var average, less, more;

  if (!(weights instanceof Array) || weights.length < 1) {
    throw new Error('Vose: weights must be a non-empty array');
  }

  this.totalDistinctValues = weights.length;
  this.probability = [];
  this.alias = [];
  average = 1.0 / this.totalDistinctValues;
  weights = normalizeScale(weights.slice(0));

  for (var i = 0; i < this.totalDistinctValues; i++) {
    ((weights[i] >= average) ? large : small).push(i);
  }

  while (small.length > 0 && large.length > 0) {
    less = small.shift();
    more = large.shift();

    this.probability[less] = weights[less] * this.totalDistinctValues;
    this.alias[less] = more;

    weights[more] = (weights[more] + weights[less]) - average;
    ((weights[more] >= average) ? large : small).push(more);
  }

  while (large.length !== 0) {
    this.probability[large.shift()] = 1;
  }

  while (small.length !== 0) {
    this.probability[small.shift()] = 1;
  }
};

Vose.prototype.next = function() {
  var column = getRandomInt(0, this.totalDistinctValues - 1);
  var coinToss = Math.random() < this.probability[column];

  return coinToss ? column : this.alias[column];
};
