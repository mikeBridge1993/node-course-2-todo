var {user} = require('./../models/user');

var authenticate = (req, res, next) => {
   var token = req.header('x-auth');
    
    user.findByToken(token).then((doc) => {
        if(!doc){
            return Promise.reject(); //This will stop the funciton execute and send error to catch
        }
        
        req.user = doc;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    }); 
};

module.exports = {authenticate};