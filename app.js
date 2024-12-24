const express =  require('express')
require('dotenv').config()
const host = process.env.host
const username = process.env.username
const password = process.env.password
const ejs = require('ejs')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const app = express()

app.use('/public',express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(session(require('./config/sessionInfo').getSessionConfig))

app.use((req,res,next)=>{
    res.locals.locals_userId = ''
    res.locals.locals_userName = '' 
    res.locals.locals_departmentName = ''
    res.locals.locals_departmentCode = ''
   
   if(req.session.userInfo){
       res.locals.locals_userId = req.session.userInfo.b_id
       res.locals.locals_userName = req.session.userInfo.b_userName
       res.locals.locals_departmentName = req.session.userInfo.b_departmentName
       res.locals.locals_departmentCode = req.session.userInfo.b_departmentCode
   }
   next()
})

//app.use(cookieParser(require('./config/cookieInfo').getCookieConfig))
app.use(cookieParser())
app.get('/setCookie',(req,res)=>{
    res.cookie('myCookie','myValue',{})
    res.send('쿠키 설정하기')
})
app.get('/getCookie',(req,res)=>{
    res.send(req.cookies.myCookie)
})
app.get('/clearCookie',(req,res)=>{
    res.clearCookie('myCookie')
    res.send('쿠키 삭제')
})


// ejs 설정  
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

// layout 설정
app.use(expressLayouts)
app.set("layout extractScripts", false); // layout내의 include파일의 script실행 
app.set('layout','layouts/layout')

// const mainLayout = '../views/layouts/mainLayout.ejs' 
// res.render('Index',{layout:mainLayout})   // layout 개별 파일 사용
// res.render('Index',{layout:false})   // layout 사용 안함



// route 설정
app.use('/',require('./routes/index')) // 첫 화면

app.use('/account/createMember',require('./routes/account/createMember'))  // 사용자 계정 관련(회원가입/회원관리)
app.use('/account/login',require('./routes/account/login'))  // 로그인 관련(로그인/로그아웃)

// 상단 메뉴  
app.use('/index',require('./routes/index')) // 메인화면
app.use('/smis/main',require('./routes/smis/main'))  // SMIS Main
app.use('/smis/content',require('./routes/smis/content'))  // SMIS content
app.use('/smis/list',require('./routes/smis/list'))  // SMIS Main -> list
app.use('/smis/chart',require('./routes/smis/chart'))  // SMIS Chart

//app.use('/boards/notice',require('./routes/boards/notice'))  // 공지사항
//app.use('/boards/tipntech',require('./routes/boards/tipntech'))  // tipntech
//app.use('/real_estate',require('./routes/real_estate'))  // 공공DB






app.get('/',(req,res)=>{
    res.send('welcome to node.js')
})

const httpPort = 3000
app.listen(httpPort,()=>{
    console.log(`This server is listening on ${httpPort} port, Click this link http://localhost:3000`)
})






// const filestore = require('session-file-store')(session)








