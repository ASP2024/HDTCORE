const express = require('express')
const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')
const dbconn = require('../../controls/dbconn')
const router = express.Router()

router.use(express.urlencoded({extended:false}))
router.use(express.json())

router.get('/',(req,res)=>{
    if(!req.session.userInfo){  // 최초 접속

        let b_id = '' 
        if(req.cookies.b_id) {
              b_id = req.cookies.b_id         
        }            
        res.render('account/login',{b_id:b_id,layout:false})

    } else { // 로그인이 되어있을 경우
        res.replace('/')
    }    
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.send( "<script>alert('로그아웃 되었습니다.');location.replace('/account/login');</script>" )
    
})


router.post('/signUp',(req,res)=>{

    const conn = mysql2.createConnection(dbconn.getDbInfo)

    let b_query = 'SELECT * FROM members WHERE b_id=?'          
    let b_params = [ req.body.txtId]    
    
    conn.query(b_query,b_params,(err,result,fields)=>{
        if(!err && result.length == 1) {            
            if(bcrypt.compareSync(req.body.txtPassword,result[0].b_password)) {                
                
                const userInfo = {
                                b_id: result[0].b_id,     
                                b_userName: result[0].b_userName,
                                b_departmentCode: result[0].b_departmentCode,
                                b_departmentName: result[0].b_departmentName,
                                b_hp: result[0].b_b_hp,
                                b_email: result[0].b_email,
                                b_region: result[0].b_region,
                                b_content: result[0].b_content                
                               }               
                               
                req.session.userInfo = userInfo

                if(req.body.chkIdSave != undefined) {                    
                    res.cookie('b_id',userInfo.b_id,{maxAge:1000 * 60 * 60 * 24 * 7})
                } else{                                        
                    res.clearCookie('b_id')
                }
                            

                res.send(`<script>alert('${userInfo.b_userName}(${userInfo.b_id})님 반갑습니다.');
                location.replace('/');</script>`)

            } else {
                res.send(`<script>alert('비번이 틀립나다.');
                           location.href='/account/login';
                          </script>` )   
            }
            
        } else {            
            res.send(`<script>alert('없는 id입니다.');
                           location.href='/account/login';
                       </script>`)
        }
      
         
    })
    

    // conn.query(b_query,b_params,(err,result)=>{        
    //     if(result.length == 1) {            
    //            const userInfo = {
    //                  b_id:'',     
    //                  b_userName:'',
    //                  b_departmentCode:'',
    //                  b_departmentName:'',
    //                  b_hp:'',
    //                  b_email:'',
    //                  b_region:'',
    //                  b_content:''                
    //            }
    //            userInfo.b_id = result[0].b_id
    //            userInfo.b_userName = result[0].b_userName
    //            userInfo.b_departmentCode = result[0].b_departmentCode
    //            userInfo.b_departmentName = result[0].b_departmentName
    //            userInfo.b_hp = result[0].b_b_hp
    //            userInfo.b_email = result[0].b_email
    //            userInfo.b_region = result[0].b_region
    //            userInfo.b_content = result[0].b_content
               
    //            req.session.userInfo = userInfo
              
    //            res.send(`<script>alert('${userInfo.b_userName}(${userInfo.b_id})님 반갑습니다.');
    //            location.href='/';</script>`)

    //     } else {
    //         res.send(`<script>alert('없는 id이거나 비번이 틀립나다.');
    //                    location.href='/login/login';</script>`)
    //     }
    // })

    
})


module.exports = router




// const session = require('express-session')
// const appConfig = require('../config/appConfig')
// const cookieParser = require('cookie-parser')
// // 세션을 메모리 저장 
// // const MemoryStore = require("memorystore")(session)
// const conn = appConfig.getConnect()
// router.use(cookieParser())


// router.get('/login',(req,res)=>{
   
//    let b_id = undefined
//    if(req.cookies.b_id)      
//          b_id = req.cookies.b_id   
    
//    res.render('login.ejs',{b_id:b_id})  
// })

// router.post('/signUp',(req,res)=>{ 
    
//     let b_query = 'SELECT COUNT(*) FROM members WHERE b_id=? and b_password=?'
//     let b_params = [ req.body.txtId , req.body.txtPassword ]
                     
//     conn.query(b_query,b_params,(err,result)=>{        
//        if(result.length == 1) {            
//             b_query = 'SELECT * FROM members WHERE b_id=? AND b_password=?'
//             conn.query(b_query,b_params,(err,result)=>{
//                 const userInfo = {
//                     b_id:'',     
//                     b_userName:'',
//                     b_departmentCode:'',
//                     b_departmentName:''                
//                 }
//                 userInfo.b_id = result[0].b_id
//                 userInfo.b_userName = result[0].b_userName
//                 userInfo.b_departmentCode = result[0].b_departmentCode
//                 userInfo.b_departmentName = result[0].b_departmentName  
                
//                 if(req.body.chkIdSave) {
//                     res.cookie('b_id',result[0].b_id,appConfig.getCookieConfig)
//                 } else {
//                     res.clearCookie('b_id')
//                 }
                                
//                 req.session.userInfo = userInfo     
//                 res.send(`<script>alert('${req.session.userInfo.b_id}님 반갑습니다.');
//                       location.href='/';</script>`)
//             })                    
//        } else {
//             res.send(`<script>alert('없는 id이거나 비번이 틀립나다.');
//             location.href='/';</script>`)
//        }
//     })

   
// })

// router.get('/logout',(req,res)=>{
//     req.session.userInfo = null
//     res.send(`<script>alert('로그아웃 되었습니다.');
//               location.href='/';</script>`)
// })

 


// router.post('/signUp', function (req, res) {
//     //기존 session clear
//     req.session.input_id = "";
//     req.session.email = "";
//     req.session.key = "";

//     //입력된 id,pw 정보를 가져온다. (body-parser 모듈 사용.)
//     let uId = req.body.uId;
//     let uPw = req.body.uPw;

//     //인증이 되지 않은 아이디의 경우 아이디를 이용해 이메일 재전송 기능 제공.
//     req.session.input_id = uId;
//     req.session.save();

//     // start login logic
//     if (uId && uPw) {
//         dbcon.query('select * from member where aId = ? AND aPw = ?', [uId, uPw], function (error, results, fields) {
//             if (error) throw error;
//             if (results.length > 0) {
//                 dbcon.query('select certifi from member where aId=?', [uId], function (er, certifi, fields) {
//                     if (er) throw er;
//                     if (certifi[0].certifi == 'ok') { //로그인 인증이 완료된 계정이라면 로그인.
//                         req.session.uid = results[0].aName;
//                         req.session.isLogined = true;
//                         req.session.save(function () {
//                             res.redirect('/');
//                         });
//                     }
//                     else { //그렇지 않을경우 이메일 인증사이트로 이동.
//                         res.write("<script type='text/javascript'>location.href='/emailCheck'</script>");
//                     }
//                 });
//                 //session store -> redirect

//             } else { //아이디와 비밀번호가 틀렸다면?
//                 res.send('<script type="text/javascript">' +
//                     'alert("로그인정보가 존재하지 않습니다.");' +
//                     'document.location.href="/login";</script>');
//             }
//         });
//     } else { //아디디 또는 비밀번호가 입력되지 않았다면?
//         res.send('<script type="text/javascript">' +
//             'alert("아이디와 비밀번호 모두 입력해주세요.")' +
//             'document.location.href="/login";</script>');
//         res.end();
//     }
// });