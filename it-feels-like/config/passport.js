// config/passport.js

// load all the things we need
const express = require('express');
const authRoutes = express.Router();
const expressValidator = require('express-validator');
authRoutes.use(expressValidator());
const User = require('../models/user');
const Preferences = require('../models/preferences');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FbStrategy = require('passport-facebook').Strategy;


// expose this function to our app using module.exports
module.exports = (passport) => {

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });


    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, email, password, next, done) { 
        // check in mongo if a user with username exists or not
        User.findOne({ 'email' :  email }, 
        function(err, user) {
            // In case of any error, return using the done method
            if (err)
            return next(err);
            // Username does not exist, log error & redirect back
            if (!user){
            console.log('User Not Found with email '+ email);
            return next(null, false, { message: 'User Not found.' });                 
            }
            // User exists but wrong password, log the error 
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false, { message: 'Incorrect password' });
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            return done(null, user);
            }
        );
    }));


    passport.use('local-signup', new LocalStrategy({
            userNameField: 'email',    
            passReqToCallback: true 
        },
        (req, name, email, password, password2, next) => {
            
            console.log('hell');
            // User.findOne({'email': email}, (err, user) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     if (user) {
            //         return next(null, false);
            //     }
            //     // Validation

            //     const salt      = bcrypt.genSaltSync(bcryptSalt);
            //     const hashPass  = bcrypt.hashSync(password, salt);
            //     const newUser   = new User({
            //         name: req.body.name,
            //         email: req.body.email,
            //         password: hashPass
            //     });

            //     newUser.save(function(error) {
            //         if (error) {
            //             res.render("signup", { message: "Something went wrong" });
            //         } else {
            //             res.redirect("preferences")
            //         }
            //     });
        })
        
    );
        //     User.findOne({'email': email}, (err, user) => {
        //         if (err) {
        //             return next(err);
        //         }
        //         if (!user) {
        //             return next(null, false, { message: "Incorrect username" });
        //         }
        //         else {
        //             const { name, email, password, password2 } = req.body;
        //             // Validation
        //             // req.checkBody('name', { message:'Name is required'}).notEmpty(),
        //             // req.checkBody('email', { message:'Email is required'}).notEmpty(),
        //             // req.checkBody('email', { message:'Email is not valid'}).isEmail(),
        //             // req.checkBody('password', { message:'Password is required'}).notEmpty(),
        //             // req.checkBody('password2', { message:'Passwords do not match'}).equals(req.body.password),

        //             // errors = req.validationErrors();

        //             // if (errors){
        //             //     res.render ('signup',{
        //             //         errors: errors
        //             //     });
        //             // }else {
        //             //     console.log('Passed')
        //             // }
        //             const salt = bcrypt.genSaltSync(bcryptSalt);
        //             const hashPass = bcrypt.hashSync(password, salt);
                
        //             const newUser = new User({
        //                 name,
        //                 email,
        //                 password: hashPass
        //             });
            
        //             newUser.save(function(error) {
        //                 if (error) {
        //                     res.render("signup", { message: "Something went wrong" });
        //                 } else {
        //                     res.redirect("preferences")
        //                 }
        //             });
                    
        //     } 
        // });
    // }));

    passport.use(new FbStrategy({
    clientID: '502415123447256',
    clientSecret: 'c79591bdbc553739f926d9c2037b591e',
    callbackURL: "/facebook/callback",
    profileFields:['id','displayName','emails']
        }, function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            var me = new User({
                email:profile.emails[0].value,
                name:profile.displayName
            });

            /* save if new */
            User.findOne({email:me.email}, function(err, u) {
                if(!u) {
                    me.save(function(err, me) {
                        if(err) return done(err);
                        done(null,me);
                    });
                } else {
                    console.log(u);
                    done(null, u);
                }
            });
            }
    ));
};
