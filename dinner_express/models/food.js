var mongoose = require('mongoose');

var FoodSchema = require('../schemas/food');
var Food = mongoose.model('Food', FoodSchema);





module.exports = Food;
