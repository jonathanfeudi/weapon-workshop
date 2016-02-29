var engines = document.getElementsByClassName('engine');
var receivers = document.getElementsByClassName('receiver');
var barrels = document.getElementsByClassName('barrels');
var stocks = document.getElementsByClassName('stocks');

for(var i = 0; i < engines.length; i++){
  engines[i].addEventListener('click', addSelected);
};

for(var i = 0; i < receivers.length; i++){
  receivers[i].addEventListener('click', addSelected);
};

for(var i = 0; i < barrels.length; i++){
  barrels[i].addEventListener('click', addSelected);
};

for(var i = 0; i < stocks.length; i++){
  stocks[i].addEventListener('click', addSelected);
};

function addSelected(){
  var likeThis = document.getElementsByClassName(this.className);
  for(var i = 0; i < likeThis.length; i++){
    likeThis[i].addEventListener('click', addSelected);
    likeThis[i].classList.remove('selected');
  }
  this.classList.add('selected');
  this.removeEventListener('click', addSelected);
}
