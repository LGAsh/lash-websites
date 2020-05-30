
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const bcrypt = require('bcryptjs');






// Schema representing a user. Each has a unique username and a password that will be hashed and salted

const User = new mongoose.Schema(
  {
        
        username: String,
        password: String,
        events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Events' }] // titles of all events

});


//schema representing a single created event

const Evnt = new mongoose.Schema(

{
        name: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: String,
        time: Number,
        comments: String,
});



const Events = new mongoose.Schema(
{
        name: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        events: [Evnt] //links to all events

});





// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
        // if we're in PRODUCTION mode, then read the configration from a file
        // use blocking file io to do this...
        const fs = require('fs');
        const path = require('path');
        const fn = path.join(__dirname, 'config.json');
        const data = fs.readFileSync(fn);
       
        // our configuration file will be in json, so parse it and set the
        // conenction string appropriately!
        const conf = JSON.parse(data);
        dbconf = conf.dbconf;
       } else {
        // if we're not in PRODUCTION mode, then use
        dbconf = 'mongodb://localhost/lga238';
       }



mongoose.connect(dbconf, {useMongoClient: true});
User.plugin(URLSlugs('username'));



User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



module.exports =
{
    User: mongoose.model('User', User),
    Evnt: mongoose.model('Evnt', Evnt),
    Events: mongoose.model('Events', Events)
};