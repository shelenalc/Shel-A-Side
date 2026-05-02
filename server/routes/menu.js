const express = require('express');
const router = express.Router();
const menu = require('../data/menu.json');

router.get('/', (req, res) => {
    const { category } = req.query;
    if (category) {
        return res.json(menu.filter(item => item.category === category));
    }
    res.json(menu);
});

module.exports = router;
