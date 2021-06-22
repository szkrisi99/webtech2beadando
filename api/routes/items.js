const express = require('express')
const router = express.Router()
const Item = require('../models/item')
const User = require('../models/user')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../auth/config');

//Gettin all items
router.get('/', async (req, res) => {
    try{
        const items = await Item.find()
        res.json(items)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Gettin one item
router.get('/:id', getItem, (req, res) => {
    res.json(res.item)
})
//Create one item
router.post('/', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        category: req.body.category
    })
    try{
        const newItem = await item.save()
        res.status(201).json(newItem)
    } catch(err) { 
        res.status(400).json({ message: err.message })
    }
})
//Updating one item
router.patch('/:id', getItem, async (req, res) => {
    if (req.body.name != null){
        res.item.name = req.body.name
    }
    if (req.body.quantity != null){
        res.item.quantity = req.body.quantity
    }
    if (req.body.price != null){
        res.item.price = req.body.price
    }
    if (req.body.category != null){
        res.item.category = req.body.category
    }
    try{
        const updatedItem = await res.item.save()
        res.json(updatedItem)
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})
//Deleteing one item
router.delete('/:id', getItem, async (req, res) => {
    try{
        await res.item.remove()
        res.json({ message: "Deleted Item"})
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

//Register
router.post('/register',(req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User registered'});
        }
    })
})

//Authenticate
router.post('/authenticate',(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) =>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg:'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' +token,
                    user: {
                        id: user._id,
                        username: user.username
                    }
                })
            } else {
                return res.json({success: false, msg:'Wrong Password'});
            }
        });
    });

})

//Profile
router.get('/profile',passport.authenticate('jwt', {session:false}),(req, res, next) => {
        res.send('PROFILE');    
    //res.json({user: req.user.body.username});
})

async function getItem(req, res, next) {
    let item
    try{
        item = await Item.findById(req.params.id)
        if (item == null){
            return res.status(404).json({ message: "Cannot find Item" })
        }
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }

    res.item = item
    next()
}

module.exports = router