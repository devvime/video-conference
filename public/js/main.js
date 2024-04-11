document.addEventListener('contextmenu', event => event.preventDefault());

function fullscreen() {
  var mainVideo = document.getElementById("main-video");  
  if (mainVideo.requestFullscreen) {
     mainVideo.requestFullscreen();
 }
}

var symbol, color;
symbol = "0123456789ABCDEF";
color = "#";
for(var i=0; i<6; i++){
color = color+symbol[Math.floor(Math.random()*16)];
}
const RANDOM_COLOR = color;