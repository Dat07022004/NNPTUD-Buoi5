var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let result = await roleModel.find({ isDeleted: false });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findById(req.params.id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST create role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findById(req.params.id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        let keys = Object.keys(req.body);
        for (const key of keys) {
            result[key] = req.body[key];
        }
        await result.save();
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE soft delete role
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findById(req.params.id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        result.isDeleted = true;
        await result.save();
        res.send({ message: "Deleted successfully" });
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

module.exports = router;
