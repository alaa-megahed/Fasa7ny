       
var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../app/models/RegisteredUser'),
    Business = require('../app/models/Business'),
    Admin = require('../app/models/WebAdmin'),
    configAuth = require('./auth');


module.exports = function(passport) 
{ 
   //  ========================
   //      Session setup
   //  ========================
   //  serialize and deserialize user, needed for session    
             
   passport.serializeUser(function(user, done) {
        done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
         User.findById(id, function(err, user) {
            done(err, user);
          });
   });

          
    //   ========================
    //         LOCAL SIGNUP
    //   ========================
           

    passport.use('local-signup', new LocalStrategy(
      {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) 
      {
           // find a regular user whose username matches the username entered
           // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.username' :  username }, function(err, user) 
            {
                    // if there are any errors, return the error
                    if (err)
                      return done(err);

                    // check to see if theres already a user with that username
                    if (user) 
                    {
                      return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } 
                    else 
                    {
                         //repeate the same check on business usernames
                         Business.findOne({ 'local.username' :  username }, function(err, user)
                         {  
                          if(err)
                            return done(err);
                          if(user){
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.')); 
                          }
                          else
                          {
                                // finnally check web admins usernames
                                Admin.findOne({ 'local.username' :  username }, function(err, user)
                                {
                                    if(err)
                                      return done(err);
                                    if(user){
                                      return done(null, false, req.flash('signupMessage', 'That username is already taken.')); 
                                    }
                                    else
                                    {
                                      // username entered is unique
                                      var newUser            = new User();
                                      // set the user's local credentials
                                      newUser.local.username = username;
                                      newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                                      // TODO: set other attributes
                                      // save the user
                                      newUser.save(function(err) {
                                        if (err)
                                          throw err;
                                        return done(null, newUser);
                                      });
                                    }

                                });
                           } 
                       });
                   }
             });
      })),

            
  //  ========================
  //        LOCAL LOGIN
  //  ========================
  
  passport.use('local-login', new LocalStrategy(
    {
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) 
    { 
      // find a user whose username is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.username' :  username }, function(err, user) 
      {
         // if there are any errors, return the error before anything else
         if (err)
            return done(err);
         // if no user is found, check if the username entered belongs to business
         if (!user)
         {
            Business.findOne({ 'local.username' :  username }, function(err, user)
            {
               if (err)
                 return done(err);
               if(!user)
               {
                  // if no business is found, check if the username entered belongs to an admin
                  Admin.findOne({ 'local.username' :  username }, function(err, user)
                  {
                      if(err)
                        return done(err);
                      if(!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                      // if the user is found but the password is wrong
                      if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                      // all is well, return successful user(Admin)
                      return done(null, user);
                  });
                }  
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user(Business)
                return done(null, user);
              });
         }

         // if the user is found but the password is wrong
         if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

         // all is well, return successful user(regular user)
         return done(null, user);
      });
    })),


// ==============================
//          FACEBOOK 
// ==============================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
        profileFields: ['id', 'displayName', 'photos', 'email']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

  // asynchronous
  process.nextTick(function() 
  {

    // find the user in the database based on their facebook id
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) 
    {

       // if there is an error, stop everything and return that
       // ie an error connecting to the database
       if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) 
        {
          return done(null, user); // user found, return that user
        } 
         else 
         {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.facebook.id    = profile.id; // set the users facebook id                   
            newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            // save our user to the database
            newUser.save(function(err) 
            {
              if (err)
                 throw err;

              // if successful, return the new user
              return done(null, newUser);
            });
          }

    });
  });

 }));


};