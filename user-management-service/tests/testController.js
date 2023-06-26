const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const logger = require('../src/utils/logger');


bcrypt.hash("123", 10).then(async (hashedPass) => {
    const result = bcrypt.compare("123", hashedPass);
    console.log(await result);
});

//const isMatch = bcrypt.compare("123", hashedPass);
