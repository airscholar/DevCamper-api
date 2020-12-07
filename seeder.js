const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/Bootcamp');
const { nextTick } = require('process');

//connect to dB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// import into dB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log(`Data imported`.green.inverse)
    } catch (err) {
        // next(err)
    }
}

// delete data from dB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()

        console.log(`Data destroyed`.red.inverse)
        process.exit(1 )
    } catch (err) {
        // next(err)
    }
}

if(process.argv[2] === '-i'){
    importData()
} else if(process.argv[2] === '-d'){
    deleteData()
}

 