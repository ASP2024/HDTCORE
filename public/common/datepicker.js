
$( function() {
          
    $.datepicker.setDefaults({
          dateFormat: 'yy-mm-dd' //출력될 날짜 Format    yy년 mm월 dd일
          ,prevText: '이전 달'
          ,showOtherMonths: false //빈 공간에 현재월의 앞뒤월의 날짜를 표시
          ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
          ,changeMonth: false //  월 변경가능             
          ,changeYear: false //  년 변경가능
          ,showOn: "both" //button:버튼을 눌러야만 달력 표시 , both:버튼을 누르거나 input을 클릭하면 달력 표시             
          ,buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
          ,buttonImageOnly: false  // true:이미지만 출력(이미지 옆에 '...'버튼 비활성화),버튼의 회색 부분을 없앰
          ,buttonText: "선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
          ,yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트            
          ,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
          ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
          ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
          ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트                    
     });





//////////////////////////////////////////////////////////////   smis/content.ejs 에서 사용하는 datepicker   
//   txtReceiptDate 
//   txtProcessedDate
    // 처음 페이지 로딩 후 txtReceiptDate에 값이 존재하면 '접수됨'이므로 
    // txtReceiptDate 값을 기준으로 txtProcessedDate값을 설정하는 setPorcessedDate()를 실행
    // 접수날짜부터 현재까지의 날짜만 출력
    if($('#txtReceiptDate').val() == '') { // 신규접수
         //$('#txtReceiptDate').datepicker("setDate",new Date());
         setReceiptDate()           
         setPorcessedDate()      
    }else if($('#txtProcessedDate').val() == '') { // 접수됨          
         setPorcessedDate()
    }else {  // 완료됨
         
    }
   

    // datePicker의 선택된 날짜(월)가 현재달이 아니고 이전달 또는 다음달이면 경고창 출력후 control('txtReceiptDate')값 비우기 
    function isPrevMonth(sltDate) {
                 var changedSltDate = new Date(sltDate)
                 var sltMonth = changedSltDate.getMonth() + 1
                 var currDate = new Date()
                 var currMonth = (currDate.getMonth()+1)
                 if(sltMonth != currMonth) {                    
                    return false                     
                 } else {
                    return true                     
                 }
    }
    
    function setReceiptDate() {
          $('#txtReceiptDate').datepicker("setDate",new Date());
          $("#txtReceiptDate").datepicker({           
                minDate: "-4D", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
                maxDate: "+0D", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
                
                onSelect: function(dateText) {  
                                                          
                            if(isPrevMonth(dateText)){   // 선택된 날짜(월)이 현재 달인지 여부 확인                            
                                  document.getElementById('txtReceiptHour').focus()   
                                  setPorcessedDate()
                            } else {
                                  alert( dateText + '일은 이전 달 입니다.\n이전 달은 접수/처리로 선택 할 수 없습니다.')
                                  document.getElementById('txtReceiptDate').value = ''  
                                  document.getElementById('txtReceiptDate').focus()
                                  $("#txtProcessedDate").datepicker('destroy')  // 'txtProcessedDate'의 datepicker 헤제
                            }
                                        
                }
                })   
    }
         


    function setPorcessedDate() {    
         document.getElementById('txtProcessedDate').value = ''      
         $("#txtProcessedDate").datepicker({                   
              
              onSelect: function(dateText) {   // 날짜 선택후 '시간'에 포커스
                      document.getElementById('txtProcessedHour').focus()                                                      
              }

              ,beforeShowDay: function(date) {  // 접수 날짜보다 이전 날짜 비활성화, 오늘 날짜 이후 비활성화                                          
                  var replaceedDate = document.getElementById('txtReceiptDate').value.replace('-','/')
                  var receiptDate = new Date(replaceedDate)      
                  var toDate = new Date()
                  if(date < receiptDate || date > toDate  )                
                        return [false]           
                  return [true]              
            }           
        });  
        
       
    }
    
})





///////////////////////////////////////////////////////////////   smis/list.ejs 에서 사용하는 datepicker

    // smis/list에서 검색에 사용되는 datepicker
    function enableSearchDate() { 
      $( "#txtFromDate, #txtToDate" ).datepicker("option", "disabled", false );
      $( "#txtFromDate, #txtToDate" ).datepicker({    
        //defaultDate: "+1w",  // 기본선택일이 1 week 이후가 선택되는 옵션
        minDate: "-1Y", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        maxDate: "+0D", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)
        changeMonth: true,      
      })
      
    }

    function disableSearchDate() {   
      $( "#txtFromDate, #txtToDate" ).datepicker("option", "disabled", true );  // datepicker 비활성화 #
      //$('input[name=dateBox]').datepicker('disable').removeAttr('disabled')  // datepicker 비활성화(텍스트박스에 입력된 값은 유지)
    }

