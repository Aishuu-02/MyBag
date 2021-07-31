const express= require('express')
const router = express.Router();
const passport = require('passport');
const Item = require('../models/item');
const User = require('../models/user')
const { isLoggedIn } = require('../views/partials/middleware')

router.post('/additem',isLoggedIn, (req,res)=>{
    res.render('admin/item');
  })
  
router.get('/',isLoggedIn,async(req,res)=>{
    const username = req.session.currentuser;
    const items = await Item.find({});
    const user = await User.findOne({username})
    res.render('admin/home',{ items,user,username })
  })
  
router.get('/:id',isLoggedIn,async(req,res)=>{
  const username = req.session.currentuser;
  const item = await Item.findById(req.params.id);
  const user = await User.findOne({username})  
  res.render('admin/show',{ item,user});
  })
  
router.post('/',async(req,res)=>{
    const item= new Item(req.body.item);
    await item.save();
    res.redirect(`/home/${item._id}`)
  })
  
  
  
router.get('/:id/edit',isLoggedIn,async(req,res)=>{
    const item = await Item.findById(req.params.id)
    res.render('admin/edit',{item});
  })
  
router.put('/:id',isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id,{...req.body.item})
    res.redirect(`/home/${item._id}`)
  })
  
router.delete('/:id',isLoggedIn,async(req,res)=>{
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/home');
  })
module.exports = router;