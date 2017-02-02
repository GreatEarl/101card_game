var stock = 
[{"name":"6","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"7","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"8","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"9","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"10","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"J","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"Q","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"K","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"A","suit":"hearts","suitcode":"&#x2661","color":"red"},
 {"name":"6","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"7","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"8","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"9","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"10","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"J","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"Q","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"K","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"A","suit":"spades","suitcode":"&#x2664","color":"black"},
 {"name":"6","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"7","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"8","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"9","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"10","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"J","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"Q","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"K","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"A","suit":"clubs","suitcode":"&#x2663","color":"black"},
 {"name":"6","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"7","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"8","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"9","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"10","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"J","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"Q","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"K","suit":"diamonds","suitcode":"&#x2666","color":"red"},
 {"name":"A","suit":"diamonds","suitcode":"&#x2666","color":"red"}];

var openedAr = [];
var closedAr = [];
var playerAr = [];
var iiAr = [];
var usedindex = [];
var gameOver = false;

var resArr = [];

var iiResult;
var playerResult;


var i=0;
$("#backs").on("click", function() {
 
// alert($("#cards").html());
if (!gameOver) {
    if (0<closedAr.length ){
        playerAr.push(closedAr.pop());
        setHand();
      } 
      else 
      { 
        refillClosed ();
        setOpened();
      }
    }
else {
  return;
 }

});

function refillClosed (){
    var lastCard = openedAr.pop();
  //   console.log(lastCard);
    for (var k=0; k<openedAr.length; k++) {
       closedAr.push(openedAr.pop());
     }
    openedAr.push(lastCard);
};

function setiiArr(){
 if (!gameOver) { 
  if (0<closedAr.length) {
    iiAr.push(closedAr.pop());
    setII();
   } 
   else 
   { 
        refillClosed ();
        setOpened();
   }
       }
else {
  return;
 }
};

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };


function initround() {
 var ri = 0;
 var cli=0;

 closedAr.length = 0;
 openedAr.length = 0;
 usedindex.length = 0;
 playerAr.length = 0;
 iiAr.length = 0;
 
 gameOver = false;

 console.log('initround');


 do { 
  ri = randomInteger(0, 35) ;
  if (usedindex.indexOf(ri) == '-1'){
      closedAr.push(stock[ri]);
      cli++;
      usedindex.push(ri);
   }
  else {
         continue;
       }
 }
 
 while (closedAr.length < 36);
 // alert( closed.length );
 console.log (closedAr.length);

var ti = 0;
ti=randomInteger(0,1);

if (ti == 0) {
  $("#move").html('me');
   console.log('ii set');
   for (var i=0; i<4;i++) {
      iiAr.push(closedAr.pop());
   }

   for (var i=0; i<5;i++) {
      playerAr.push(closedAr.pop());
   }
}
else {
  console.log('player set');
  $("#move").html('you');
  for (var i=0; i<5;i++) {
     iiAr.push(closedAr.pop());
    }
   for (var i=0; i<4;i++) {
     playerAr.push(closedAr.pop());
    }
  }
openedAr.push(closedAr.pop());

console.log('initround2');
 setHand();
 setII();
 setOpened();
 //$("#cards").html('stock');
  $("#titleM").html("Results ");
$("#next").prop('disabled', !gameOver);

}


function initgame() {



 iiResult = 0;
 playerResult = 0;
 
 resArr.length = 0;


    

$("#resBody").html('<tr><td></td><td></td> <td></td> </tr>');




//first round
 initround();
$("#next").prop('disabled', !gameOver);
}

function setOpened () {
if (!gameOver) {

opencont = '<div id ="cardc" class = "card" >'+openedAr[openedAr.length-1].name+ '</div>'+
           '<div id="num"> '+openedAr[openedAr.length-1].suitcode +' </div>';

 $("#currents").html(opencont);     

 
 $("#num").css("color",openedAr[openedAr.length-1].color);
 $("#cardc").css("color",openedAr[openedAr.length-1].color);
}

}





function setHand() {

   
    var handcont ='';
    for (var j=0;j< playerAr.length; j++) {
    handcont = handcont + 
    ' <div id="'+playerAr[j].name +'of'+playerAr[j].suit  +'" class ="cardh"  style="color:'+playerAr[j].color+'">'+playerAr[j].suitcode +
    '<div style="color:'+playerAr[j].color+'"> '+playerAr[j].name +'</div>'+
    '</div>'
    }
    $("#hand").html(handcont);
     
  //   $("#'+playerAr[j].name +'of'+playerAr[j].suit  +'").css("color",playerAr[j].color);
   // $("#sname").css("color",playerAr[j].color);
  
  if (playerAr.length == 0) {
     console.log('game over');
     gameOver = true;
      displayResult ('player');
  }
}


function openII() {
   
    var ocont ='';
    for (var j=0;j< iiAr.length; j++) {
    ocont = ocont + 
    ' <div id="'+iiAr[j].name +'of'+iiAr[j].suit  +'" class ="cardh"  style="color:'+iiAr[j].color+'">'+iiAr[j].suitcode +
    '<div  style="color:'+iiAr[j].color+'"> '+iiAr[j].name +'</div>'+
    '</div>'
    }
    $("#ii").html(ocont);
     

}



function setII() {
var IIcont ='';
for (var j=0;j< iiAr.length; j++) {
IIcont = IIcont + 
//' <div id="'+iiAr[j].name +'of'+iiAr[j].suit  +'" class ="cardii" > &#x2169'+
//   '<div id="sname" > &#x2169 </div>'+
//   '</div>'

' <div id="'+iiAr[j].name +'of'+iiAr[j].suit  +'" class ="cardii" > <img src="back_sm.jpg"/> </div>'


}

$("#ii").html(IIcont);

if (iiAr.length == 0) {
     console.log('game over');
    gameOver = true;
    displayResult ('ii');
  }

}


function releasecard () {
   var target = $(this).attr('id')
  alert(target);
}

$('#hand').on("click", function(event) {
   // var target = $(this).html();
  var str = event.target.id;
var selectedCard = str.split("of");
console.log(selectedCard[0]);
console.log(selectedCard[1]);

for (var j=0;j< playerAr.length; j++) {
  if ((playerAr[j].name==selectedCard[0]) && (playerAr[j].suit = selectedCard[1])) {
    openedAr.push(playerAr[j]);
    playerAr.splice(j, 1);
  }

}
setOpened();
setHand();

 
});


function checkArr() {


if (!gameOver) {
openedAr.push(iiAr.pop());
};

setOpened();
setII();
}

function displayResult (lastMove) {

console.log(lastMove);

  if (lastMove === 'player') {
    playerResult = playerResult + 0;
    //iiResult
    for (var i=0; i< iiAr.length; i++) {
      switch (iiAr[i].name) {
        case "6":
          iiResult = iiResult+6;
          break;
        case "7":
          iiResult = iiResult+7;
          break;
        case "8":
          iiResult = iiResult+8;
          break;
        case "9":
          break;
        case "10":
          iiResult = iiResult+10;
          break;
        case "J":
          iiResult = iiResult+2;
          break;
        case "Q":
          iiResult = iiResult+3;
          break;
        case "K":
          iiResult = iiResult+4;
          break;
        case "A":
          iiResult = iiResult+11;
          break;
      }
    }

openII();



   }
   else {
      iiResult = iiResult + 0;

      for (var i=0; i< playerAr.length; i++) {
      switch (playerAr[i].name) {
        case "6":
          playerResult = playerResult+6;
          break;
        case "7":
          playerResult = playerResult+7;
          break;
        case "8":
          playerResult = playerResult+8;
          break;
        case "9":
          break;
        case "10":
          playerResult = playerResult+10;
          break;
        case "J":
          playerResult = playerResult+2;
          break;
        case "Q":
          playerResult = playerResult+3;
          break;
        case "K":
          playerResult = playerResult+4;
          break;
        case "A":
          playerResult = playerResult+11;
          break;
      }
    }
   }

console.log(iiResult);
console.log(playerResult);

$("#next").prop('disabled', !gameOver);
var resElem = {};
resElem.ii = iiResult;
resElem.player = playerResult;
resArr.push(resElem);

var bodyCont = '';
for (var i = 0; i < resArr.length; i++) {
var j=i+1;
console.log(resArr[i]);

  bodyCont = bodyCont+
   
        ' <tr>  <td>'+ j +'</td>'+
        '<td>'+ resArr[i].player+'</td>'+
        '<td>'+ resArr[i].ii+'</td> </tr>';

 }
   //bodyCont = bodyCont+'';

$("#resBody").html(bodyCont);

if (resArr[resArr.length-1].ii > 101) {
  $("#titleM").html("Game Over! Player won! ");
  $("#next").prop('disabled', true);
};

if (resArr[resArr.length-1].player > 101) {
  $("#titleM").html("Game Over! II won! ");
  $("#next").prop('disabled', true);
};

  $("#MyArticle2").modal("show");



}
