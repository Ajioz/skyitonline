const express = require('express');
const knex = require('knex');
const sendMail = require('./mail');
const app = express(); 

//Extra security
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const log = console.log;

app.use(express.json());
app.use(express.urlencoded({ extended: false}))

// extra packages
app.set('trust proxy', 1);
app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, //15 minutes
      max: 500, //limit each IP to 500 requests per windowMs
  })
);

app.use(xss());

const db = knex({
    client: 'pg',
    connection:{
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
          }
    }   
});

//Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

//Set views
app.set('views', './views')
app.set('view engine', 'ejs')


//Catch all instance
// app.get('*', (req, res)=>{
//     res.render('expired')
// })


//Get Home Page
app.get('/', (req, res)=>{
    res.render('index')
})

//Get About Page
app.get('/about', (req, res) => {
    res.render('about')
})


//Get service page
app.get('/services', (req, res) => {
    res.render('services')
})

//Make a post


app.post('/', (req, res) => {
    
    const {first_name, last_name, email, message} = req.body;
    
    res.render('contact-success', {data: req.body});
    
    log('data:', req.body);
    
    db('clients').returning('*').insert({
        first_name, last_name, email, message,
        set_date: new Date()
    }).then(response => { 
        // return res.send(response[0]); 
    }).catch(err => {
            return res.status(400).send('err');
    })
    
    sendMail(first_name, last_name, email, message, function(err, data){
        if(err){
           //res.status(500).send({text: 'Internal Error'});
        }else{
            res.send({text: 'Email Sent!!!'});
        }
    });

 });



let port = process.env.PORT || 2001;

app.listen(port, () =>  log(`Server listening on http://127.0.0.1:${port}`));
