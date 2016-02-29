var engines = document.getElementsByClassName('engine');
var receivers = document.getElementsByClassName('receiver');
var barrels = document.getElementsByClassName('barrel');
var stocks = document.getElementsByClassName('stock');

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

function renderEngineText(){
  for(var i = 0; i < engines.length; i++){
    if(engines[i].classList.contains('selected')){
      document.getElementById('engineText').innerHTML = 'Damage type: ' + (JSON.parse(eval('engineArray' + i).innerHTML).dmgtype) + ' / Debuff: ' + (JSON.parse(eval('engineArray' + i).innerHTML).debuff);
    }
  }
};

function renderReceiverText(){
  for(var i = 0; i < receivers.length; i++){
    if(receivers[i].classList.contains('selected')){
      document.getElementById('receiverText').innerHTML = 'Damage: ' + (JSON.parse(eval('receiverArray' + i).innerHTML).dmg) + ' / Rate of Fire: ' + (JSON.parse(eval('receiverArray' + i).innerHTML).rof);
    }
  }
};

function renderBarrelText(){
  for(var i = 0; i < barrels.length; i++){
    if(barrels[i].classList.contains('selected')){
      document.getElementById('barrelText').innerHTML = 'Range: ' + (JSON.parse(eval('barrelArray' + i).innerHTML).range) + ' / Heat: ' + (JSON.parse(eval('barrelArray' + i).innerHTML).heat);
    }
  }
};

function renderStockText(){
  for(var i = 0; i < stocks.length; i++){
    if(stocks[i].classList.contains('selected')){
      document.getElementById('stockText').innerHTML = 'Accuracy: ' + (JSON.parse(eval('stockArray' + i).innerHTML).accuracy) + ' / Drawtime: ' + (JSON.parse(eval('stockArray' + i).innerHTML).drawtime);
    }
  }
};

function addSelected(){
  var likeThis = document.getElementsByClassName(this.className);
  for(var i = 0; i < likeThis.length; i++){
    likeThis[i].addEventListener('click', addSelected);
    likeThis[i].classList.remove('selected');
  }
  this.classList.add('selected');
  this.removeEventListener('click', addSelected);
  renderEngineText();
  renderReceiverText();
  renderBarrelText();
  renderStockText();
}

renderEngineText();
renderReceiverText();
renderBarrelText();
renderStockText();
