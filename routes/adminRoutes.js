const adminRoute = require('express').Router();
const createInterest = require('../controllers/admin/interest/createInterest');
const deleteInterest = require('../controllers/admin/interest/deleteInterest');
const getAllInterest = require('../controllers/admin/interest/getAllInterest');

// interest
adminRoute.route('/interest').get(getAllInterest).post(createInterest)
adminRoute.delete('/interest/:id', deleteInterest)

module.exports = adminRoute;