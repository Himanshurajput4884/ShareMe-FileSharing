const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env'});




function connectdb() {
    mongoose.connect(
        process.env.DB_URL, 
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        } 
      );
    
    const db = mongoose.connection;
    db.once('open', ()=>{
        console.log('Database Connected...');
    });

}

// Now in cloud create the database.

module.exports = connectdb;