require('dotenv').config();
const passport = require('passport');

const { User } = require('./models/user');

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to database'))

app.use(cors())
app.use(express.json())

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./auth/passport')(passport);


/*   AUTH   */

//Sign up
/*app.post('/users', (req,res) => {

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return {accessToken, refreshToken}
        });
    }).then((authTokens) => {
        res
        .header('x-refresh-token',authTokens.refreshToken)
        .header('x-access-token',authTokens.accessToken)
        .send(newUser);
    }).catch((err) => {
        res.status(400).send(err);
    })
})*/
/*
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

//Login
app.post('/users/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    User.findByCredentials(username,password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return {accessToken,refreshToken}
            })
        }).then((authTokens) => {
            res
            .header('x-refresh-token',authTokens.refreshToken)
            .header('x-access-token',authTokens.accessToken)
            .send(user);
        })
    }).catch((err) => {
        res.status(400).send(err);
    });
})

/*   AUTH   */


//const userRouter = require('./routes/users')
const itemsRouter = require('./routes/items');

app.use('/items', itemsRouter)
//app.use('/users', userRouter)

app.listen(3000, () => console.log('this server started'))