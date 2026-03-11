var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let result = await userModel.find({ isDeleted: false }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findById(req.params.id).populate({
            path: 'role',
            select: 'name description'
        });
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST create user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findById(req.params.id);
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

// DELETE soft delete user
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findById(req.params.id);
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

// POST /enable - enable user nếu email và username khớp
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy user với email và username đã cung cấp" });
        }
        user.status = true;
        await user.save();
        res.send({ message: "User đã được enable", user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /disable - disable user nếu email và username khớp
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy user với email và username đã cung cấp" });
        }
        user.status = false;
        await user.save();
        res.send({ message: "User đã được disable", user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;

