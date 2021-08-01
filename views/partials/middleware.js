module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        res.locals.currentUser = req.user;
        req.session.returnTo = req.originalUrl;
        req.flash('alert','you must be signed in!');
       return res.redirect('/login');
        
    }
    next();
}
//const{isLoggedIn}= require('../campgrounds');