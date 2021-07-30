const express= require('express')
const mongoose = require('mongoose')
const path = require('path');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const helmet = require('helmet');
const session = require('express-session');
const ejsMate = require('ejs-mate')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Item = require('./models/item')

const userRoutes=require('./routes/users');


mongoose.connect('mongodb://localhost:27017/register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected')
});

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: true}));

app.use(helmet());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.alert=req.flash('alert');
   res.locals.success= req.flash('success');
   res.locals.error = req.flash('error');
   next();
})


app.listen(3000,(req,res)=>{
    console.log('connecting to port 3000!');
})

app.post('/additem',(req,res)=>{
  res.render('admin/item');
})

app.get('/home',async(req,res)=>{
  const username = req.session.currentuser;
  const items = await Item.find({});
  const user = await User.find({})
  res.render('admin/home',{ items,user,username })
})

app.get('/home/:id',async(req,res)=>{
  const item = await Item.findById(req.params.id).populate("author");
  
  res.render('admin/show',{ item});
})

app.post('/home',async(req,res)=>{
  const item= new Item(req.body.item);
  item.author = '6101c2718f0d3e1568233371';
  await item.save();
  res.redirect(`/home/${item._id}`)
})



app.get('/home/:id/edit',async(req,res)=>{
  const item = await Item.findById(req.params.id)
  res.render('admin/edit',{item});
})

app.put('/home/:id',async(req,res)=>{
  const { id } = req.params;
  const item = await Item.findByIdAndUpdate(id,{...req.body.item})
  res.redirect(`/home/${item._id}`)
})

app.delete('/home/:id',async(req,res)=>{
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.redirect('/home');
})


app.use('/',userRoutes);
