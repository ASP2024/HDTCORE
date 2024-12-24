    ///////////////////// 장애구분 ////////////////////////////////////////          
    // 첫번째 SELECT    , { name: " ", value: " " }
    var Adata = [
        { name: "- 선택하세요-", value: "NULL" }
       , { name: "PC", value: "PC" }
       , { name: "프린터", value: "PRINTER" }
       , { name: "노트북", value: "NB" }
       , { name: "주변기기", value: "ETC" }
]

// 두번째 SELECT
var Bdata = [
          { name: "- 선택하세요-", value: "NULL" }
        , { name: "H/W", value: "HW" }
        , { name: "S/W", value: "SW" }
]

// PC
var PC_HW = [
          { name: "- 선택하세요-", value: "NULL" }
        , { name: "MAINBOARD", value: "MAINBOARD" }
        , { name: "HDD", value: "HDD" }
        , { name: "LCD", value: "LCD" }
        , { name: "LCD ADAPTER", value: "LCD ADAPTER" }
        , { name: "KEYBOARD", value: "KEYBOARD" }
        , { name: "MOUSE", value: "MOUSE" }
        , { name: "ODD", value: "ODD" }
        , { name: "VGA", value: "VGA" }
        , { name: "POWER", value: "POWER" }
        , { name: "LAN CARD", value: "LAN CARD" }
        , { name: "네트워크(RJ,LINE) ", value: "네트워크(RJ,LINE)" }
        , { name: "CPU", value: "CPU" }
        , { name: "FAN", value: "FAN" }
        , { name: "MEMORY", value: "MEMORY" }
        , { name: "CABLE", value: "CABLE" }
        , { name: "이전설치/회수", value: "이전설치/회수" }
        , { name: "신규설치", value: "신규설치" }
]
var PC_SW = [
          { name: "- 선택하세요-", value: "NULL" }
        , { name: "Windows", value: "Windows" }
        , { name: "OFFICE", value: "OFFICE" }
        , { name: "EXPLORER", value: "EXPLORER" }
        , { name: "보안프로그램", value: "보안프로그램" }
        , { name: "그룹웨어", value: "그룹웨어" }
        , { name: "네트워크설정 ", value: "네트워크설정" }
        , { name: "HINTU", value: "HINT" }
        , { name: "서버장애", value: "서버장애" }
        , { name: "바이러스/악성코드 ", value: "바이러스/악성코드" }
        , { name: "영상회의", value: "영상회의" }
        , { name: "드라이버 설정", value: "드라이버 설정" }
        , { name: "A.D장애 ", value: "A.D장애" }
        , { name: "윈도우 재설치", value: "윈도우 재설치" }
        , { name: "응용프로그램", value: "응용프로그램" }
        , { name: "사용자설명조치", value: "사용자설명조치" }
        , { name: "패스워드 설정 ", value: "패스워드 설정" }
]

// PRINTER
var PRINTER_HW = [
         { name: "- 선택하세요-", value: "NULL" }
       , { name: "MAINBOARD", value: "MAINBOARD" }
       , { name: "센서", value: "센서" }
       , { name: "정착기", value: "정착기" }
       , { name: "HEATING FILM", value: "HEATING FILM" }
       , { name: "SCANNER", value: "SCANNER" }
       , { name: "토너카트리지", value: "토너카트리지" }
       , { name: "DRUM", value: "DRUM" }
       , { name: "POWER", value: "POWER" }
       , { name: "MECHANISM", value: "MECHANISM" }
       , { name: "CABLE", value: "CABLE" }
       , { name: "HEAD", value: "HEAD" }
       , { name: "INK카트리지", value: "INK카트리지" }
       , { name: "용지걸림 ", value: "용지걸림" }
       , { name: "카세트", value: "카세트" }
       , { name: "롤러", value: "롤러" }
       , { name: "DIMM", value: "DIMM" }
       , { name: "이전설치/회수", value: "이전설치/회수" }
       , { name: "신규설치 ", value: "신규설치" }
]
var PRINTER_SW = [
         { name: "- 선택하세요-", value: "NULL" }
       , { name: "드라이버관련", value: "드라이버관련" }
       , { name: "네트워크 공유설정", value: "네트워크 공유설정" }
       , { name: "인쇄환경 설정 ", value: "인쇄환경 설정" }
       , { name: "사용자설명조치 ", value: "사용자설명조치" }
]

// 노트북
var NB_HW = [
          { name: "- 선택하세요-", value: "NULL" }
        , { name: "MAINBOARD", value: "MAINBOARD" }
        , { name: "HDD", value: "HDD" }
        , { name: "LCD", value: "LCD" }
        , { name: "BATTERY", value: "BATTERY" }
        , { name: "Adapter", value: "Adapter" }
        , { name: "KEYBOARD", value: "KEYBOARD" }
        , { name: "MOUSE", value: "MOUSE" }
        , { name: "CPU", value: "CPU" }
        , { name: "MEMORY", value: "MEMORY" }
        , { name: "CASE", value: "CASE" }
        , { name: "FAN", value: "FAN" }
        , { name: "ODD", value: "ODD" }
        , { name: "이전설치/회수", value: "이전설치/회수" }
        , { name: "신규설치", value: "신규설치" }
]
var NB_SW = [
         { name: "- 선택하세요-", value: "NULL" }
       , { name: "Windows", value: "Windows" }
       , { name: "OFFICE", value: "OFFICE" }
       , { name: "EXPLORER", value: "EXPLORER " }
       , { name: "보안프로그램", value: "보안프로그램" }
       , { name: "그룹웨어 ", value: "그룹웨어" }
       , { name: "네트워크설정", value: "네트워크설정" }
       , { name: "바이러스/악성코드", value: "바이러스/악성코드" }
       , { name: "영상회의", value: "영상회의" }
       , { name: "드라이버 설정", value: "드라이버 설정" }
       , { name: "AD장애 ", value: "AD장애" }
       , { name: "윈도우 재설치 ", value: "윈도우 재설치" }
       , { name: "TOPS", value: "TOPS" }
       , { name: "응용프로그램", value: "응용프로그램" }
       , { name: "사용자설명조치", value: "사용자설명조치" }
       , { name: "패스워드 설정", value: "패스워드 설정 " }
]

// 주변기기
var ETC_HW = [
         { name: "- 선택하세요-", value: "NULL" }
       , { name: "디지털 카메라", value: "디지털 카메라" }
       , { name: "디지털 캠코드 ", value: "디지털 캠코드 " }
       , { name: "플로터", value: "플로터" }
       , { name: "스캐너", value: "스캐너" }
       , { name: "헤드셋", value: "헤드셋" }
       , { name: "화상 카메라", value: "화상 카메라" }
       , { name: "포인터", value: "포인터" }
       , { name: "라벨 프린트 ", value: "라벨 프린트" }
       , { name: "보안기", value: "보안기" }
       , { name: "이전설치/회수", value: "이전설치/회수" }
       , { name: "신규설치", value: "신규설치" }
]
var ETC_SW = [
        { name: "- 선택하세요-", value: "NULL" }
     , { name: "드라이버 설정", value: "드라이버 설정" }
     , { name: "네트워크 설정", value: "네트워크 설정" }
]


function htmlSltKind2_init() {
$('#htmlSltKind2 option').remove();
$('#htmlSltKind2').append("<option value='NULL'>-선택하세요-</option>");
$('#htmlSltKind2 option:eq(0)').prop('selected',true);
$('#htmlSltKind2').prop("readonly", true);
//$('#htmlSltKind2').prop("disabled", true);

$('#htmlTxtKind2').val($('#htmlSltKind2 option:selected').val());
$('#htmlHiddenKind2').val($('#htmlSltKind2 option:selected').val());

}

function htmlSltKind3_init() {
$('#htmlSltKind3 option').remove();
$('#htmlSltKind3').append("<option value='NULL'>-선택하세요-</option>");
$('#htmlSltKind3 option:eq(0)').prop('selected', true);
$('#htmlSltKind3').prop("readonly", true);
//$('#htmlSltKind3').prop("disabled", true);

$('#htmlTxtKind3').val($('#htmlSltKind3 option:selected').val());
$('#htmlHiddenKind3').val($('#htmlSltKind3 option:selected').val());
}

function htmlSltKind2_DataBind() {
$('#htmlSltKind2').prop("disabled", false);
$('#htmlSltKind2 option').remove();
$(Bdata).each(function (index, object) {
    $('#htmlSltKind2').append("<option value='" + object.value + "'>" + object.name + "</option>");
});
$('#htmlSltKind2 option:eq(0)').prop('selected',true);
}

function htmlSltKind3_DataBind() {
$('#htmlSltKind3').prop("disabled", false);
$('#htmlSltKind3 option').remove();
var Selected_Adata = $('#htmlSltKind1 option:selected').val();
var Selected_Bdata = $('#htmlSltKind2 option:selected').val();
var Selected_Cdata = Selected_Adata + "_" + Selected_Bdata;

if (Selected_Cdata == 'PC_HW') {
    $(PC_HW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'PC_SW') {
    $(PC_SW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'PRINTER_HW') {
    $(PRINTER_HW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'PRINTER_SW') {
    $(PRINTER_SW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'NB_HW') {
    $(NB_HW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'NB_SW') {
    $(NB_SW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'ETC_HW') {
    $(ETC_HW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
} else if (Selected_Cdata == 'ETC_SW') {
    $(ETC_SW).each(function (index, object) {
        $('#htmlSltKind3').append("<option value='" + object.value + "'>" + object.name + "</option>");
    });
}

$('#htmlSltKind3 option:eq(0)').prop('selected', true);


}



// htmlSltKind1,htmlSltKind2,htmlSltKind3 컨트롤 초기화                    
$(Adata).each(function (index, object) {
       $('#htmlSltKind1').append("<option value='" + object.value + "'>" + object.name + "</option>");
})

$('#htmlSltKind1 option:eq(0)').prop('selected',true);

htmlSltKind2_init();
htmlSltKind3_init();

//$('htmlSltKind1').val('NULL').prop('selected', true);
//$('#htmlTxtKind1').val($('#htmlSltKind1 option:selected').val());
//$('#htmlHiddenKind1').val($('#htmlSltKind1 option:selected').val());


// AA 컨트롤의 change이벤트에 함수 추가
$('#htmlSltKind1').on("change", function () {
//$('#htmlTxtAdata').val($('#AA option:selected').val());
if ($('#htmlSltKind1 option:selected').val() == 'NULL') {
    htmlSltKind2_init();
    htmlSltKind3_init();    
}
else {                        
    htmlSltKind2_DataBind();
    document.getElementById('htmlSltKind2').focus()
    htmlSltKind3_init();
}
$('#htmlTxtKind1').val($('#htmlSltKind1 option:selected').val());
$('#htmlHiddenKind1').val($('#htmlSltKind1 option:selected').val());

})

//BB 컨트롤의 change이벤트에 함수 추가
$('#htmlSltKind2').on("change", function () {
if ($('#htmlSltKind2 option:selected').val() == "NULL") {
    htmlSltKind3_init();
}
else {
    htmlSltKind3_DataBind();
    document.getElementById('htmlSltKind3').focus()
}
$('#htmlTxtKind2').val($('#htmlSltKind2 option:selected').val());
$('#htmlHiddenKind2').val($('#htmlSltKind2 option:selected').val());
})

$('#htmlSltKind3').on('change', function () {
$('#htmlTxtKind3').val($('#htmlSltKind3 option:selected').val());
$('#htmlHiddenKind3').val($('#htmlSltKind3 option:selected').val());
});







//     $('#sltCategory1').on('change',sltCategory1_change)
//     $('#sltCategory2').on('change',sltCategory2_change)           
   

// var hw = [
//      {value:'pc' , text:'PC'} ,
//      {value:'monitor' , text:'모니터'},            
//     ]
// var sw = [
//      {value:'os' , text:'운영체제'} ,
//      {value:'office' , text:'오피스'},            
//     ]


// var hw_pc = [
//     {value:'hdd',text:'HDD'},
//     {value:'ssd',text:'SSD'}
// ]
// var hw_monitor = [
//     {value:'lcd',text:'LCD'},
//     {value:'adapter',text:'어댑터'}
// ]
// var sw_os = [
//     {value:'boot',text:'부팅파일오류'},
//     {value:'password',text:'부팅암호틀림'}
// ]
// var sw_office = [
//     {value:'save',text:'저장안됨'},
//     {value:'run',text:'런타임에러'}
// ]

// //'-선택하세요-'를 선택하면 select박스를 초기화 시킴
// function select_init(select){
//     select.empty()
//     select.append($("<option value='init' selected>-선택하세요-</option>"))
// }

// function sltCategory1_change() {                  
//     if($('#sltCategory1').val() == 'init'){ // '-선택하세요'-'를 선택했을 경우 sub컨트롤을 초기화 시킴
//         select_init($('#sltCategory2'))
//         select_init($('#sltCategory3'))
//     } else{
//         //var selectedItem = $('#sltCategory1 option:selected').val()
//         var selectedItem = $('#sltCategory1').val()
//         var changeItem                

//         if(selectedItem == "hw") {
//             changeItem = hw
//         }
//         else if(selectedItem == "sw") {
//             changeItem = sw
//         }

//         $('#sltCategory2').empty()                
//         for(var index = 0; index < changeItem.length ; index++){
//             $('#sltCategory2').append($("<option value="+changeItem[index].value+">"+changeItem[index].text+"</option>"))             
//         }
        
//     }           
// }

// function sltCategory2_change() {
//      var selectedItem = $('#sltCategory2').val()
//      var changeItem             
    
     
//      var selectedValue = $('#sltCategory2').val()
//      if(selectedValue == 'pc') {
//          changeItem = hw_pc
//      } else if(selectedValue == 'monitor') {
//          changeItem = hw_monitor
//      } else if(selectedValue == 'os') {
//          changeItem = sw_os
//      } else if(selectedValue == 'office') {
//          changeItem = sw_office
//      }
   
//      $('#sltCategory3').empty()

//      for(var index = 0; index < changeItem.length; index++){
//         $('#sltCategory3').append($('<option>'+changeItem[index].text+'</option>'))
//      }
     
// }