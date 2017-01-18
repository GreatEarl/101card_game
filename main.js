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

var i=0;
$("#backs").on("click", function() {
 
// alert($("#cards").html());
  
if (i<stock.length) {
 $("#num").html(stock[i].name);
 $("#cardc").html(stock[i].suitcode);
 
 $("#num").css("color",stock[i].color);
 $("#cardc").css("color",stock[i].color);
  i++;
 } 
  else { 
    i=0;
     $("#num").html(stock[i].name);
    $("#cardc").html(stock[i].suitcode);
     $("#num").css("color",stock[i].color);
 $("#cardc").css("color",stock[i].color);
  }
  
  
  
  
})
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };

function initgame() {
 var ri = 0;
 var cli=0;
 closedAr.length = 0;
 usedindex.length = 0;

 playerAr.length = 0;
 iiAr.length = 0;
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

for (var i=0; i<4;i++) {
  iiAr.push(closedAr.pop());
}
for (var i=0; i<5;i++) {
  playerAr.push(closedAr.pop());
}

}
else {
  $("#move").html('you');
  for (var i=0; i<5;i++) {
     iiAr.push(closedAr.pop());
    }
   for (var i=0; i<4;i++) {
     playerAr.push(closedAr.pop());
    }
  }
openedAr.push(closedAr.pop());



setHand();

setOpened();

}

function setOpened () {


opencont = '<div id ="cardc" class = "card" >'+openedAr[openedAr.length-1].name+ '</div>'+
           '<div id="num"> '+openedAr[openedAr.length-1].suitcode +' </div>';

 $("#currents").html(opencont);          
}
function setHand() {
var handcont ='';
for (var j=0;j< playerAr.length; j++) {
handcont = handcont + 
' <div id="'+playerAr[j].name +'of'+playerAr[j].suit  +'" class ="cardh" >'+playerAr[j].suitcode +
   '<div id="sname" > '+playerAr[j].name +'</div>'+
   '</div>'

}
$("#hand").html(handcont);
}

function releasecard () {
   var target = $(this).attr('id')
  alert(target);
}

$("#hand").on("click", function(event) {
   // var target = $(this).html();
  var str = event.target.id;
var selectedCard = str.split("of");
console.log(selectedCard[0]);
console.log(selectedCard[1]);

for (var j=0;j< playerAr.length; j++) {
  if ((playerAr[j].name==selectedCard[0]) && (playerAr[j].suit = selectedCard[1])) {
    openedAr.push(playerAr[j]);
  }

}
setOpened();

 
});


function checkArr() {
   console.log(closedAr.length);
 // for (var i=0; i< closedAr.length; i++) {
//    console.log(closedAr[i]);
//  }
for (var i=0; i< playerAr.length; i++) {
    console.log(playerAr[i]);
  }
    console.log('-----');
  for (var i=0; i< iiAr.length; i++) {
    console.log(iiAr[i]);
  }

}


