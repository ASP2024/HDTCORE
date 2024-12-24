
const express = require('express')
const session = require('express-session')
const mysql2 = require('mysql2')
const url = require('url')
const dbconn = require('../../controls/dbconn')
const url_List1 = require('../../controls/smis').url_List
const router = express.Router()

// const { resolve } = require('path')
// const { Console } = require('console')
// const { promises } = require('dns')
// const { localsName } = require('ejs')

// get으로 접속시(첫 접속)
router.get('/',(req,res)=>{          
    
        const myurl = url.parse(req.url,true)
        url_List1.pageIndex = myurl.query.pageIndex,
        url_List1.state = myurl.query.state,
        url_List1.departmentCode = myurl.query.departmentCode,
        url_List1.userId = myurl.query.userId,
        url_List1.fromDate = myurl.query.fromDate,
        url_List1.toDate = myurl.query.toDate 
        bind_list(res,url_List1)

    // if(!req.session.userInfo) {
    //     res.send("<script>alert('로그인 후 사용 하실 수 있습니다.');location.href='/account/login'</script>")            
    //     res.end()
    // } else {
    //     const myurl = url.parse(req.url,true)
    //     url_List1.pageIndex = myurl.query.pageIndex,
    //     url_List1.state = myurl.query.state,
    //     url_List1.departmentCode = myurl.query.departmentCode,
    //     url_List1.userId = myurl.query.userId,
    //     url_List1.fromDate = myurl.query.fromDate,
    //     url_List1.toDate = myurl.query.toDate 
    //     bind_list(res,url_List1)
    // }       
    
})


// post로 접속시(검색)
router.post('/',(req,res)=>{         
  
    // let pageIndex = req.query.txtpageIndex ? parseInt(req.query.txtpageIndex) : 1
    url_List1.pageIndex = req.body.hiddenpageIndex        
    url_List1.state = req.body.hiddenState
    url_List1.departmentCode   = req.body.sltProcessDepartmentCode
    url_List1.userId = req.body.sltProcessId    
    url_List1.fromDate = req.body.txtFromDate 
    url_List1.toDate = req.body.txtToDate   
    
    bind_list(res,url_List1)       
})



function bind_list(res,url_List1) {

    let b_pageIndex = url_List1.pageIndex
    let b_state = url_List1.state
    let b_processDepartmentCode = url_List1.departmentCode  
    let b_processId = url_List1.userId      
    let b_fromDate = url_List1.fromDate  
    let b_toDate = url_List1.toDate
   

    let postsPerPage = 5
    let maxPageList = 5
    let totalItemCount      
    let b_queryTotalCountDefault = "SELECT COUNT(*) AS totalCount FROM smis WHERE b_idx > 0 "
    let b_SearchQuery  = ` AND b_state = ${b_state}`
                       + ` AND b_processDepartmentCode = '${b_processDepartmentCode}' `
                       + ` AND b_processId = '${b_processId}' `    
                       + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') >= '${b_fromDate}' `
                       + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') <= '${b_toDate}' `   
    b_queryTotalCountDefault = b_queryTotalCountDefault + b_SearchQuery

    const conn = mysql2.createConnection(dbconn.getDbInfo)   
    
    conn.query(b_queryTotalCountDefault,(err,result,fields)=>{
        if(err) throw err

        totalItemCount = result[0].totalCount                
        let items = ''
        let totalPageCount = Math.ceil(totalItemCount / postsPerPage)  
        
        // 리스트 출력
        const startRow = (b_pageIndex - 1) * postsPerPage + 1
        const endRow = b_pageIndex * postsPerPage
       
        let b_queryItemsDefault = `SELECT *,CONCAT_WS('-',b_csrNo1,b_csrNo2,b_csrNo3) AS b_csrNo,DATE_FORMAT(b_receptionDate,'%Y-%m-%d') AS b_receptionDate FROM smis WHERE b_idx > 0 `
        b_queryItemsDefault = b_queryItemsDefault
                            + b_SearchQuery       
                            + ` ORDER BY ${b_state == 1 ?'b_receptionDate ':'b_processedDate'} DESC, ${b_state == 1 ?'b_receptionTime ':'b_processedTime'} `
                            + ` DESC limit ${startRow-1},${postsPerPage}` 

         

        //console.log(b_queryItemsDefault)
        
       
        

        conn.query(b_queryItemsDefault,(err,result,fields)=>{
            if(err) throw err           
            
             
             // 이전페이지, 페이지 번호 , 다음페이지
             // http://localhost:3000/smis/list?pageIndex=1&state=1&DepartmentCode=LEB1&Id=1090630&FromDate=2024-08-01&ToDate=2024-08-10
            let PageButtonsString = ''            
            let startPageIndex = 0            
            let gap = b_pageIndex % maxPageList === 0 ? maxPageList - 1 : b_pageIndex % maxPageList - 1
            let startPage = b_pageIndex - gap
            let endPage = Math.min(startPage + maxPageList -1 , totalPageCount)                                
            
            let prevPageButton = ''
            if(b_pageIndex > maxPageList) {
                prevPageButton = `<a href='/smis/list?pageIndex=${startPage-1}&state=${url_List1.state}&departmentCode=${url_List1.departmentCode}&Id=${url_List1.userId}&FromDate=${url_List1.fromDate}&ToDate=${url_List1.foDate}'>이전페이지</a>`
            } else {
                prevPageButton = `이전페이지`
            }
 
        
             
           let b_link = ''
            for(let i = startPage;i <= endPage; i++){
                if(i == b_pageIndex){
                   b_link = b_link + `&nbsp;${i}&nbsp;`   
                } else {
                    b_link = b_link + `&nbsp;<a href='/smis/list?pageIndex=${i}&state=${url_List1.state}&DepartmentCode=${url_List1.departmentCode}&Id=${url_List1.Id}&FromDate=${url_List1.fromDate}&ToDate=${url_List1.toDate}'>${i}</a> `                             
                }
            }  
            

            let nextPageButton = ''
            if(totalPageCount > endPage){
                nextPageButton = `<a href='/smis/list?pageIndex=${endPage+1}&state=${url_List1.state}&DepartmentCode=${url_List1.DepartmentCode}&Id=${url_List1.Id}&FromDate=${url_List1.FromDate}&ToDate=${url_List1.ToDate}'>다음페이지</a>`
            } else{
                nextPageButton = `다음페이지`
            }





            res.render('smis/list',{                                                                   
                                    pageIndex:b_pageIndex,
                                    state:b_state, 
                                    userDepartmentCode:b_processDepartmentCode,
                                    userId:b_processId,
                                    fromDate:b_fromDate,
                                    toDate:b_toDate,
                                    dateRange:'',

                                    postsPerPage:postsPerPage,
                                    maxPageList:maxPageList,
                                    totalPageCount:totalPageCount,    
                                    totalItemCount:totalItemCount,
                                    items:result,
                                    prevPageButton:prevPageButton,
                                    link:b_link,
                                    nextPageButton:nextPageButton                                                                                                          
                                   
                                    })
                                    //QueryItemTotalCount:b_queryCountExtened,                                    
                                    //QueryItems:b_queryExtened2,                                   
                                
        })

    }) 
}










router.post('/searchProcessUser',(req,res)=>{
    let b_query = `SELECT * FROM members WHERE b_departmentCode = ?`
    const conn = mysql2.createConnection(dbconn.getDbInfo)

    conn.query(b_query,[req.body.departmentCode],(err,rows,fields)=>{
              res.json(rows)       
    })    
    
})




    // const checkUrl = (req,res) => {
    //     if(req.url == '/') { // 처음 접속시
    
    //         // 세션값으로 입력
    //         // url_List1.pageIndex = '1',
    //         // url_List1.state = '1',
    //         // url_List1.departmentCode = req.session.userInfo.b_departmentCode
    //         // url_List1.userId = req.session.userInfo.b_id,
    //         // url_List1.fromDate = '2024-12-01',
    //         // url_List1.toDate = '2024-12-31' 
            
    //         // 수동으로 입력
    //         url_List1.pageIndex = '1',
    //         url_List1.state = '1',
    //         url_List1.departmentCode = 'LEB1'
    //         url_List1.userId = '1090630'
    //         url_List1.fromDate = '2024-12-01',
    //         url_List1.toDate = '2024-12-31' 
    
    //     } else {  // 검색 또는 페이징으로 접속시        
    //         const myurl = url.parse(req.url,true)
    //         url_List1.pageIndex = myurl.query.pageIndex,
    //         url_List1.state = myurl.query.state,
    //         url_List1.departmentCode = myurl.query.departmentCode,
    //         url_List1.userId = myurl.query.userId,
    //         url_List1.fromDate = myurl.query.fromDate,
    //         url_List1.toDate = myurl.query.toDate 
    //     }
    
    //     bind_list(res,url_List1)
    //     // http://localhost:3000/smis/list?pageIndex=3&b_state=3&b_processDepartmentCode=LEB1&b_processId=1090630&b_fromDate=2024-12-01&b_toDate=2024-12-31
    //     //console.log(url_List1)
    // }
        
     
    

    // b_reqQuery.pageIndex = b_url.query.pageIndex,
    //     b_reqQuery.b_state = b_url.query.b_state,
    //     b_reqQuery.b_processDepartmentCode = b_url.query.b_processDepartmentCode,
    //     b_reqQuery.b_processId = b_url.query.b_processId,
    //     b_reqQuery.b_fromDate = b_url.query.b_fromDate,
    //     b_reqQuery.b_toDate = b_url.query.b_toDate 
    // let pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1
    // let b_state = req.query.State
    // let b_processDepartmentCode = req.query.DepartmentCode
    // let b_processId = req.query.Id    
    // let b_fromDate = req.query.FromDate
    // let b_toDate = req.query.ToDate
     
    // let adr = 'http://localhost:3000/smis/list?pageIndex=1&state=1&DepartmentCode=LEB1&Id=1090630&FromDate=2024-08-01&ToDate=2024-08-10'
    // let b_url = url.parse(adr,true)    
    // let b_reqQuery = b_url.query
    // console.log(b_reqQuery.pageIndex,b_reqQuery.state,b_reqQuery.DepartmentCode,b_reqQuery.Id,b_reqQuery.FromDate,b_reqQuery.ToDate)
    // console.log(b_url.host, b_url.pathname,b_url.search,req.url)     



// // 페이징으로 접속시
// router.get('/',(req,res)=>{

//     let b_url = url.parse(req.url,true)
//     let b_reqQuery = b_url.query
//     bind_list(res,b_reqQuery)
 
//     // let pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1
//     // let b_state = req.query.State
//     // let b_processDepartmentCode = req.query.DepartmentCode
//     // let b_processId = req.query.Id    
//     // let b_fromDate = req.query.FromDate
//     // let b_toDate = req.query.ToDate
     
//     // let adr = 'http://localhost:3000/smis/list?pageIndex=1&state=1&DepartmentCode=LEB1&Id=1090630&FromDate=2024-08-01&ToDate=2024-08-10'
//     // let b_url = url.parse(adr,true)    
//     // let b_reqQuery = b_url.query
//     // console.log(b_reqQuery.pageIndex,b_reqQuery.state,b_reqQuery.DepartmentCode,b_reqQuery.Id,b_reqQuery.FromDate,b_reqQuery.ToDate)
//     // console.log(b_url.host, b_url.pathname,b_url.search,req.url)     
// })



// router.post('/searchItem',(req,res)=>{      
      
    // let pageIndex = req.body.hiddenpageIndex
    // // let b_pageIndex = req.query.txtpageIndex ? parseInt(req.query.txtpageIndex) : 1
    // let b_state = req.body.hiddenState
    // let b_processDepartmentCode = req.body.hiddenUserDepartmentCode
    // let b_processId = req.body.hiddenUserId    
    // let b_fromDate = req.body.hiddenFromDate
    // let b_toDate = req.body.hiddenToDate
              
        
    // let postsPerPage = 5
    // let maxPageList = 5
    // let totalItemCount      
    // let b_queryTotalCountDefault = "SELECT COUNT(*) AS totalCount FROM smis WHERE b_idx > 0 "
    // let b_SearchQuery  = ` AND b_state = ${b_state}`
    //                    + ` AND b_processDepartmentCode = '${b_processDepartmentCode}' `
    //                    + ` AND b_processId = '${b_processId}' `    
    //                    + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') >= '${b_fromDate}' `
    //                    + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') <= '${b_toDate}' `   
    // b_queryTotalCountDefault = b_queryTotalCountDefault + b_SearchQuery
   
    
    
    //  // mysql 초기화
    // const conn = mysql2.createConnection(require('../../config/appConfig').getDbInfo)  

    // conn.query(b_queryTotalCountDefault,(err,result,fields)=>{
    //     totalItemCount = result[0].totalCount                
    //     let items = ''
    //     let totalPageCount = Math.ceil(totalItemCount / postsPerPage)  
        
    //     // 리스트 출력
    //     const startRow = (b_pageIndex - 1) * postsPerPage + 1
    //     const endRow = b_pageIndex * postsPerPage
       
    //     let b_queryItemsDefault = `SELECT *,CONCAT_WS('-',b_csrNo1,b_csrNo2,b_csrNo3) AS b_csrNo,DATE_FORMAT(b_receptionDate,'%Y-%m-%d') AS b_receptionDate FROM smis WHERE b_idx > 0 `
    //     b_queryItemsDefault = b_queryItemsDefault
    //                         + b_SearchQuery       
    //                         + ` ORDER BY ${b_state == 1 ?'b_receptionDate ':'b_processedDate'} DESC, ${b_state == 1 ?'b_receptionTime ':'b_processedTime'} `
    //                         + ` DESC limit ${startRow-1},${postsPerPage}` 

         
    //     conn.query(b_queryItemsDefault,(err,result,fields)=>{
    //         if(err) throw err
    //         const items = result

    //          // 이전페이지, 페이지 번호 , 다음페이지
    //         let PageButtonsString = ''            
    //         let startPageIndex = 0            
    //         let gap = b_pageIndex % maxPageList === 0 ? maxPageList - 1 : b_pageIndex % maxPageList - 1
    //         let startPage = b_pageIndex - gap
    //         let endPage = Math.min(startPage + maxPageList -1 , totalPageCount)                   
    
    //         let prevPageButton = ''
    //         if(b_pageIndex > maxPageList) {
    //             prevPageButton = `<a onclick='sendpageIndex(${startPage-1})'>이전페이지</a>`
    //         } else {
    //             prevPageButton = `이전페이지`
    //         }

      
            
    //         let b_link = ''
    //         for(let i = startPage;i <= endPage; i++){
    //             if(i === b_pageIndex){
    //             b_link = b_link + `&nbsp;${i}&nbsp;`   
    //             } else {
    //                 b_link = b_link + `&nbsp;<a onclick='sendpageIndex(${i})'>[${i}]</a>`                               
    //             }
    //         }  



    //         let nextPageButton = ''
    //         if(totalPageCount > endPage){
    //             nextPageButton = `<a onclick='sendpageIndex(${endPage+1})'>다음페이지</a>`
    //         } else{
    //             nextPageButton = `다음페이지`
    //         }

    //         res.render('smis/list',{                                    
    //                                 b_state:b_state,
    //                                 //QueryItemTotalCount:b_queryCountExtened,                                    
    //                                 //QueryItems:b_queryExtened2,
    //                                 pageIndex:pageIndex,
    //                                 postsPerPage:postsPerPage,
    //                                 maxPageList:maxPageList,
    //                                 totalPageCount:totalPageCount,    
    //                                 totalItemCount:totalItemCount,
    //                                 items:items,
    //                                 prevPageButton:prevPageButton,
    //                                 b_link:b_link,
    //                                 nextPageButton:nextPageButton,
    //                                 userDepartmentCode:req.body.hiddenUserDepartmentCode,
    //                                 userId:req.body.hiddenUserId,
    //                                 fromDate:req.body.hiddenFromDate,
    //                                 toDate:req.body.hiddenToDate,
    //                                 pageIndex:b_pageIndex
    //                                 })
                                   

    //     })

    // }) 
    
    
//  })





















module.exports = router

    





 // let b_state = req.body.hiddenState
    // let b_processDepartmentCode = req.body.sltProcessDepartmentCode
    // let b_processId = req.body.sltProcessId    
    // let b_fromDate = req.body.txtFromDate
    // let b_toDate = req.body.txtToDate
        
    // let b_SearchQuery = ` AND b_idx > 0 `
    // if(b_processDepartmentCode && b_processId) {      

    //     b_SearchQuery = b_SearchQuery + ` AND b_processDepartmentCode = '${b_processDepartmentCode}' `
    //                                   + ` AND b_processId = '${b_processId}' `
    // }

    // if(b_fromDate && b_toDate){
    //     b_SearchQuery= b_SearchQuery + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') >= '${b_fromDate}' `
    //                                  + ` AND DATE_FORMAT(b_receptionDate, '%Y-%m-%d') <= '${b_toDate}' `
    // }  
   // + ` ORDER BY ${b_state >= 1 && b_state <= 3 ?'b_receptionDate ':'b_processedDate'} DESC, ${b_state >= 1 && b_state <= 3 ?'b_receptionTime ':'b_processedTime'} DESC limit ${startRow-1},${postsPerPage}` 
        // if(b_state >= 1 && b_state <= 3 ) {
        //     b_queryExtened2 
        // }

        //b_queryExtened2 = b_queryExtened2 + ` ORDER BY b_idx DESC limit ${startRow-1},${postsPerPage}` 


        // if(req.session.smisSearchQuery){
        //     b_query2 = b_query2 + req.session.smisSearchQuery   
        // } 
      
// <div style="width:1200px; margin:0 auto; background-color: lightgrey; font-size:11pt;">
//  <ul>
//    <li>QueryItemTotalCount : <%= QueryItemTotalCount %></li>
//  </ul>
//  <ul>
//      <li>QueryItems : <%= QueryItems %></li>
//  </ul>
//   <ul>
//       <li>pageIndex : <%= pageIndex %></li>
//   </ul>
//   <ul>
//       <li>postsPerPage : <%= postsPerPage %></li>
//   </ul>
//   <ul>
//        <li> maxPageList : <%= maxPageList %> </li>
//   </ul>
//   <ul>
//        <li>totalPageCount : <%= totalPageCount %></li>
//   </ul>
//   <ul>
//      <li>totalItemCount : <%= totalItemCount %> </li>
//    </ul>
// </div>



   // const b_only1Month = req.body.txtOnly1Mon    
    // let b_regionDate
    // if(b_only1Month === '1') {
    //     b_regionDate = ''
    // } else {
    //     b_fromDate = req.body.txtFromDate
    //     b_toDate = req.body.txtToDate
    //     b_regionDate = b_fromDate + b_toDate
    // }

    // const b_query = "SELECT * FROM smis WHERE b_modelName='6ZB1' AND b_state = 1"
    // const b_params = [
    //     b_state = b_state,
    //     b_txtReceptionistName = b_txtReceptionistName,
    //     b_txtReceptionistId = b_txtReceptionistId
    // ]

    // const conn = mysql2.createConnection({host : 'localhost',
    //                                     user : 'root',
    //                                     password : '1234',
    //                                     database : 'hdtcore'})  

    // conn.query(b_query,b_params,(err,result,fields)=>{
           
    // })
    



 // const b_query2 = `
        //                 SELECT b_idx, b_receptionistName,b_processedDate 
        //                 FROM (
        //                     SELECT b_idx, b_receptionistName,b_processedDate,ROW_NUMBER() OVER (ORDER BY b_idx DESC) AS rn 
        //                     FROM smis
        //                     ) A 
        //                 WHERE rn BETWEEN ${startRow} AND ${endRow}     
        //                 `
        // let b_query2=`SELECT row_number() OVER(ORDER BY b_idx DESC) AS rn
        //                 ,b_idx
        //                 ,b_state
        //                 ,b_receptionistName
        //                 ,b_receptionistId
        //                 ,b_receptionDate
        //                 ,b_receptionTime
        //                 ,b_requestCompany
        //                 ,b_requestDepartment
        //                 ,b_requesterName
        //                 ,b_requesterTel
        //                 ,b_modelCode
        //                 ,b_modelName
        //                 ,b_receiptContent
        //                 ,b_processName
        //                 ,b_processId
        //                 ,b_processedDate
        //                 ,b_processedTime
        //                 ,b_category
        //                 ,b_processedContent 
        //                  FROM smis ` 



    // let query = (callback) => {
        //    return conn.query("select * from smis",(err,result)=>{
        //      if(err) {
        //         callback(err)
        //      }
        //      callback(null, result)
        //    })
        // }
    
        // let items = ()=>{
        //     query((err,result)=>{
        //         console.log(result)
        //     })
        // }
    

        //     let sql1 = `SELECT COUNT(*) AS totalCount FROM smis`
    
    //     const conn1 = mysql2.createConnection({host : 'localhost',
    //                                        user : 'root',
    //                                        password : '1234',
    //                                        database : 'hdtcore'})
    
    //   conn1.query(sql1,(error,result)=>{
    //           let totalCount = result[0].totalCount
    //           let postsPerPage = 5;
    //           let currentPage = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1               
    //           let startRow = (currentPage - 1) * postsPerPage + 1
    //           let endRow = currentPage * postsPerPage
    //           let totalPages = Math.ceil(totalCount / postsPerPage)
    
    //           const MAX_PAGE_LIMIT = 5   
    //           const startPage = (totalPages-currentPage) < MAX_PAGE_LIMIT ? totalPages-MAX_PAGE_LIMIT+1 : currentPage
    //           const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages ) 
    
    //           let pageButtons = ''
    //           for(let i = startPage ; i <= endPage ; ++i){
    //                 pageButtons = pageButtons + `<a href="/${i}">[${i}]</a>`
    //           }
              
              
    
    //           let sql=`SELECT row_number() OVER(ORDER BY b_idx DESC) AS rn
    //                     ,b_idx
    //                     ,b_state
    //                     ,b_receptionistName
    //                     ,b_receptionistId
    //                     ,b_receptionDate
    //                     ,b_receptionTime
    //                     ,b_requestCompany
    //                     ,b_requestDepartment
    //                     ,b_requesterName
    //                     ,b_requesterTel
    //                     ,b_modelCode
    //                     ,b_modelName
    //                     ,b_receiptContent
    //                     ,b_processName
    //                     ,b_processId
    //                     ,b_processedDate
    //                     ,b_processedTime
    //                     ,b_category
    //                     ,b_processedContent 
    //                   FROM smis ORDER BY b_idx DESC limit ${startRow},${postsPerPage}`          
           
    //           const b_query2 = conn1.query(sql,(err,result)=>{                     
    //             console.log(b_query2.sql)
    
    //                    if(err) throw err              
    //                         res.render('smis/list',{
    //                                             items:result,
    //                                             totalCount:totalCount,
    //                                             pageIndex:currentPage,
    //                                             startPage:startPage,
    //                                             endPage:endPage,
    //                                             pageButtons:pageButtons     
    //                                             })
                       
                         
    //            })
               
    //    })
    



            // let endPageIndex = 0
            // if((totalPageCount + 1) > (startPageIndex + maxPageList)) {
            //       endPageIndex = startPageIndex + maxPageList
            // } else {
            //       endPageIndex = startPageIndex + (totalPageCount % maxPageList === 0 ? maxPageList : totalPageCount % maxPageList)
            // }
    
            // const startPage = (totalPages-currentPage) < MAX_PAGE_LIMIT ? totalPages-MAX_PAGE_LIMIT+1 : currentPage
            // const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages ) 
            
            
    
            
            // console.log(`------------------------------------`)
            // console.log(`totalItemCount:${totalItemCount}`)
            // console.log(`pageIndex:${pageIndex}`)
            // console.log(`startPageIndex:${startPageIndex}`)
            // console.log(`endPageIndex:${endPageIndex}`)
            // console.log(`------------------------------------`)
            
            //res.render('list')





// app.get('/',(req,res)=>{
    
//     const b_query = `SELECT COUNT(*) AS total FROM smis`
//     const conn = mysql2.createConnection({host : 'localhost',
//                                             user : 'root',
//                                             password : '1234',
//                                             database : 'hdtcore'})

//     conn.query(b_query,(err,result,fields)=>{      
//                 const totalPosts = result[0].total
//                 const postsPerPage = 5
//                 totalPages = Math.ceil( totalPosts / postsPerPage)  // 총 페이지 수 계산
                
//                 let currentPage = req.query.page ? parseInt(req.query.page) : 1  // 페이지 번호 초기화
//                 const startRow = (currentPage - 1) * postsPerPage + 1
//                 const endRow = currentPage * postsPerPage
//                 const b_query1 = `
//                                 SELECT b_idx, b_receipterName,b_processedDate 
//                                 FROM (
//                                     SELECT b_idx, b_receipterName,b_processedDate,ROW_NUMBER() OVER (ORDER BY b_idx DESC) AS rn 
//                                     FROM smis
//                                     ) A 
//                                 WHERE rn BETWEEN ${startRow} AND ${endRow} 
//                                 `
//                 conn.query(b_query1,(err,result,fields)=>{
//                     const MAX_PAGE_LIMIT = 5
//                     const startPage = (totalPages - currentPage) < MAX_PAGE_LIMIT ? totalPages - MAX_PAGE_LIMIT + 1  : currentPage
//                     const endPage = Math.min(startPage + MAX_PAGE_LIMIT - 1, totalPages)

//                     res.render('index',{
//                                         posts:result,  // posts: 템플릿에서 사용될 게시물 목록입니다. 이는 데이터베이스로부터 가져온 게시물의 행을 나타냄.
//                                         startPage: startPage,  // startPage: 렌더링할 페이지 링크의 시작 페이지 번호.
//                                         currentPage: currentPage,  // currentPage: 현재 페이지 번호.
//                                         endPage: endPage, // endPage: 렌더링할 페이지 링크의 끝 페이지 번호.
//                                         totalPages: totalPages, // totalPages: 전체 페이지 수입.
//                                         maxpageIndex: MAX_PAGE_LIMIT // maxpageIndex: 최대 페이지 번호 제한
//                                     })
                

//                 })      
//     })
// })






//       let sql1 = `SELECT COUNT(*) AS totalCount FROM tipntech`
//       conn1.query(sql1,(error,result)=>{
           
//             let postsPerPage = 10
//             let totalItemCount = result[0].totalCount            
//             let maxPageList = 10            
//             let totalPageCount = Math.ceil(totalItemCount / postsPerPage)
//             // let pageIndex = req.params.pageIndex ? parseInt(req.params.pageIndex) : 1
//             let pageIndex = req.params.pageIndex            
//             let PageButtonsString = ''

//             let startPageIndex = 0
//             if(0 === pageIndex % maxPageList) {
//                   startPageIndex = (pageIndex / maxPageList) * (maxPageList) - maxPageList + 1
//             } else {
//                   startPageIndex = (pageIndex / maxPageList) * maxPageList + 1
//             }

//             let endPageIndex = 0
//             if((totalPageCount + 1) > (startPageIndex + maxPageList)) {
//                   endPageIndex = startPageIndex + maxPageList
//             } else {
//                   endPageIndex = startPageIndex + (totalPageCount % maxPageList === 0 ? maxPageList : totalPageCount % maxPageList)
//             }
            
//             for(let i = startPageIndex;i < endPageIndex; i++){
//                   if(i=== pageIndex) {
//                         console.log(`<b>${i}</b> `)
//                   } else {
//                         console.log(`<a href='/tipntech/list/${i}'>${i}</a>`)
//                   }
//             }

//             console.log(`------------------------------------`)
//             console.log(`pageIndex:${pageIndex}`)
//             console.log(`startPageIndex:${startPageIndex}`)
//             console.log(`------------------------------------`)
            
//             //res.render('list')
          
//       }) 
  
// })










// router.get('/index',(req,res)=>{

//     const b_query = `SELECT * FROM smis`
//     const b_params = []
//     const conn = mysql2.createConnection(require('../../config/appConfig').getDbInfo)        
//     conn.query(b_query,b_params,(err,result,fields)=>{
        
//         res.render('smis/list',{result:result})
//         console.log(result)
//     })


    
// })


