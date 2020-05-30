
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const User = mongoose.model('User');


module.exports = function(passport)
{
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        username: 'username' , 
        password: 'password',
        //session: false,
        passReqToCallback : true
      },
      function(req, username, password, done) {
        
 
        process.nextTick(function() {

            User.findOne({ 'username' :  username }, function(err, user) {
                if (err)
                    return done(err);
    

                if (user) {
                    console.log ('!UN taken!');
                    return done(null, false, 
                        req.flash('signupMessage', 'That email is already taken.'));
                } 
                else {
        
                    const newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                            return done(null, newUser);
                    });
                }
        
            });    
     
        });
        
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'un',
        passwordField: 'pw',
        badRequestMessage : 'Missing username or password',
        passReqToCallback: true,
    }, function(req, un, pw, done){
        User.findOne({username: un}, function(err,user){
            if (err) {return done(err);}

            if (!user){
                console.log('un wrong');
                return done(null, false, req.flash({message:'user not found' } ))
            }

            if(!user.validPassword(pw)){
                console.log('pw wrong');
                return done(null, false, req.flash({message: 'password incorrect'}))
            }

            return done(null,user);


        });
    }))
        
};

