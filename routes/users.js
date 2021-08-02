const express= require('express')
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');



router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',async(req,res)=>{
    try{
const {username,password,repassword}=req.body;
req.session.currentuser = username;
if (password !== repassword){
    try{
    throw 'passwords must be same';
    }catch(e){
    req.flash('error',e);
    return res.redirect('register');
    }
} 
const user = new User({username,role:"User"});
const registeredUser = await User.register(user,password);
req.login(registeredUser,err=>{
    if(err)return next(err);
    res.redirect('/home'); 
})
}
catch(e){
 req.flash('error','username not available')
 res.redirect('register');
    }
})

router.get('/login',(req,res)=>{
    res.locals.currentUser = req.user;
    res.render('users/login');
})
router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}),(req,res)=>{
 try{
    const  username = req.body.username; 
    req.session.currentuser=username;
    const redirectUrl = req.session.returnTo || '/home'
    delete req.session.returnTo;
    if(redirectUrl === '/home'){
    return res.redirect('/home')
    }
     return res.redirect(redirectUrl);
 }catch(e){
 req.flash('error','incorrect username or password') 
 }
  
})
 router.get('/logout',(req,res)=>{
     req.logout();
     res.redirect('/login');
 })

module.exports = router;