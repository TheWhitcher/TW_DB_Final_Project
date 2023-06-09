const jwt = require('jsonwebtoken');

// Standard Authorization
async function standardAuth(req,res,next){
    if (req.path.startsWith('/graphs')){
        return next();
    }
    const authorization = req.headers.authorization;

    if(!authorization){
        res.status(401).send({
            message: "Unauthorized"
        })
        return;
    }

    try{
       jwt.verify(authorization, process.env.SECRET);
       next();
    }
    catch(err){
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

// Admin Authorization
async function adminAuth(req,res,next){
    const authorization = req.headers.authorization;

    if(!authorization){
        res.status(401).send({
            message: "Unauthorized"
        })
        return;
    }

    try{
       const payload = jwt.verify(authorization, process.env.SECRET);

       if(payload.isAdmin){
           next();
       }
       else{
        res.status(401).send({
            message: "User is not an admin"
        })
       }
    }
    catch(err){
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

module.exports = {
    standardAuth,
    adminAuth
}