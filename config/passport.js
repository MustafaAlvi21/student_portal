const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserDataModule = require('../models/users');
// const MemberDataModule = require('../modules/Member_signUp');
 

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      console.log(email)
      UserDataModule.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        
        console.log('password =>> '+ password)
        console.log('user.encryptedPassword  =>> '+ user.encryptedPassword)
        
        // Match password
        
        if (password === user.encryptedPassword){
          return done(null, user);

        } else { 
        bcrypt.compare(password, user.encryptedPassword, (err, isMatch) => {
          
          
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {

            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    UserDataModule.findById(id, function(err, user) {
      done(err, user);
    });
  });
};





//     $2b$10$Up7R.34TA1LdA6tMTXPe/.idI0dQ5C4WRnD6C0OoxbITcSBj77df6