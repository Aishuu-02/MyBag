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
if (password !== repassword){
    try{
    throw 'passwords must be same';
    }catch(e){
        req.flash('error',e);
      return res.redirect('register');
    }
} 
const user = new User({username});
const registeredUser = await User.register(user,password);
req.login(registeredUser,err=>{
    if(err)return next(err);
    res.redirect('/shop'); 
})
}
catch(e){
 req.flash('error','username not available')
 res.redirect('register');
    }
})

router.get('/login',(req,res)=>{
   res.render('users/login');
})
router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}),(req,res)=>{
 try{
      const redirectUrl = req.session.returnTo || '/shop'
    delete req.session.returnTo;
     return res.redirect(redirectUrl);
 }catch(e){
 req.flash('error','incorrect username or password') 
 }
  
})
 router.get('/logout',(req,res)=>{
     req.logout();
     req.flash('alert',"Logged out!");
     res.redirect('/login');
 })

module.exports = router;