import express from 'express'
import session  from 'express-session'
import bcrypt, { hash } from 'bcrypt'


const app = express()
app.use(session({
    secret:'piki pon ki',
    saveUnitialized:false,
    resave:false
}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use((req,res,next)=>{
    if (req.session.userID === undefined) {
        res.locals.isLoggedIn = false
       
    } else {
        res.locals.isLoggedIn = true
       
    }
    next()

})

const users =[
    {
        fullname:'Aurelius',
        email:'ak@gmail.com',
        password:'12345'
    },
    {
        fullname: 'spartan',
        email: 'spartan@gmail.com',
        password: '$2b$10$O19MUTH.KHo2f41qrQjJN.e77biuiiPsWAAAu2BS9W8HFdueTj7z.'
    }
]
    
   

//routes
app.get ('/', (req,res) => {
    res.render('index', {title: 'home page'})

})

app.get('/login', (req,res)=>{
    const user ={
        email:'',
        password:''
    }
    res.render('login', {error:false, user:user })
})
app.post('/login',(req,res)=> {
    const user ={
        email:req.body.email,
        password:req.body.password
    }
    let account = users.find(account => account.email === user.email)

    if (account) {
        bcrypt.compare(user.password, account.password, (error, passwordMatches)=>{
            if (passwordMatches) {
                req.session.userID = Math.random()
                res.redirect('/dashboard')
            } else {
                let message = 'Incorrect password'
                res.render('login', {error:true, message:message, user:user})
            }
        })
       
    } else {
        let message = 'Account does not exit'
        res.render('login', {error:true, message:message, user:user})
    }

})
 app.get ('/signup',(req,res)=> {
    const user ={
        fullname:'',
        email:'',
        password:'',
        confirmPassword:''
    }
    res.render('signup', {error:false, user:user })
 })
 app.post('/signup',(req,res)=> {
    const user ={
        fullname:req.body.fullname,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.cPassword
    }
    if (user.password === user.confirmPassword) {

        let account = users.find(account => account.email === user.email)
        if (account) {
            let message = 'account exists with email provided.'
            res.render('signup', {error:true, message:message, user:user}) 
            
        } else {
            bcrypt.hash(user.password,10,(error,hash)=>{
                 users.push({fullname: user.fullname, email: user.email, password: hash})
                 console.log(users)
                 res.redirect('/login')
            })          
        }
        
    } else {
       let message = 'Passwords dont match'
       res.render('signup', {error:true, message:message, user:user}) 
    }
    
})
 app.get ('/dashboard',(req,res)=> {
    if (res.locals.isLoggedIn) {
        res.render('dashboard', {title: 'Dashboard page'})
    } else {
        res.redirect('/login')   
    }
 })
 app.get('/logout', (req,res)=>{
   
    req.session.destroy(()=>{
        res.redirect('/')
    })
 })

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
     console.log('app is running')
})