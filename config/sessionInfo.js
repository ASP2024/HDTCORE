
const getSessionConfig = {
    secret:'keyboard cat',    
    cookie:{maxAge:1000 * 60 * 60 },
    resave:true,
    saveUninitialized:true,
    //store: user_session
    //store:new filestore()

    // 세션을 메모리 저장 checkPeriod(세션 유지 시간)
    // store: new MemoryStore({ checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms) })
    // cookie: { maxAge: 86400000 }
}




module.exports = {    
    getSessionConfig    
    
}