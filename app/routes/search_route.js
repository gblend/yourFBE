'use strict';

const router = require('express').Router();

const {
    search
} = require('../controllers/searchController');

router.route('/').post(search);

module.exports = router;
