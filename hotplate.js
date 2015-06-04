(function(hp, d){

  hp.cells = new Array();
  hp.lastCell=0;
  hp.gridSize = 0;
  hp.doNotTouch = new Array();
  hp.iterations = 0;
  var addProtected = function(cell, value){
    hp.cells[cell] = value;
    hp.doNotTouch.push(cell);
  };
  var copyProtected = function(temp){
    for (var i = 0; i < hp.doNotTouch.length; i++) {
      temp[hp.doNotTouch[i]] = hp.cells[hp.doNotTouch[i]];
    }
  };
  hp.getValueAndRun = function(){
    var input = d.getElementById('userInput');
    var gridSize = input.value;

    if(!isNaN(parseInt(gridSize)) && isFinite(gridSize)){
      hp.init(parseInt(gridSize));
      hp.run();
      hotplate.draw();

    }
  };
  hp.init = function(gridSize){
    hp.gridSize = gridSize;
    hp.lastCell = hp.gridSize * hp.gridSize - 1;
    hp.doNotTouch = new Array();
    console.log(hp.lastCell);
    for(var i = 0; i <= hp.lastCell; i++){
      hp.cells[i] = 50;
    }

    addProtected(0,0);
    addProtected(hp.lastCell,0);
    var topRight = hp.gridSize -1;
    var bottomLeft = hp.lastCell - hp.gridSize + 1;
    addProtected(topRight,0);
    addProtected(bottomLeft,0);

    //Center Values
    var midTopLeft = (hp.gridSize * hp.gridSize/2) - (hp.gridSize/2 + 1) ;
    var midTopRight = (hp.gridSize * hp.gridSize/2) - (hp.gridSize/2);
    var midBottomLeft = (hp.gridSize * hp.gridSize/2 + hp.gridSize) - (hp.gridSize/2 + 1);
    var midBottomRight = (hp.gridSize * hp.gridSize/2 + hp.gridSize) - (hp.gridSize/2);
    addProtected(midTopLeft,100);
    addProtected(midTopRight,100);
    addProtected(midBottomLeft,100);
    addProtected(midBottomRight,100);
  }
  var getColor = function(temp){
    if(temp - 100 >= 0){
      return "veryHot";
    }
    if(temp - 80 >= 0){
      return "hot";
    }
    if(temp - 60 >= 0){
      return "warm";
    }
    if(temp - 40 >= 0){
      return "average";
    }
    if(temp - 20 >= 0){
      return "cold";
    }
    return "veryCold";
  }
  hp.draw = function(){
    var mainDiv = d.getElementById('hotplate');
    while(mainDiv.firstChild){
      mainDiv.removeChild(mainDiv.firstChild);
    }
    var row = document.createElement("div");
    for(var i = 0; i <= hp.lastCell; i++){

      var currentCell = document.createElement("div");
      currentCell.innerText = hp.cells[i].toFixed(2);
      var tempCell = document.createAttribute("class");
      tempCell.value = "tempCell " + getColor(hp.cells[i]);
      currentCell.setAttributeNode(tempCell);
      row.appendChild(currentCell);
      if(i % (hp.gridSize)=== hp.gridSize-1){
        var rowClass = document.createAttribute("class");
        rowClass.value = "row";
        row.setAttributeNode(rowClass);
        mainDiv.appendChild(row);
        row = document.createElement("div");
      }
    }
  };
  var canChangeCell = function(cell){
    var canChange = true;
    for(var i=0; i < hp.doNotTouch.length; i++)
    {
      if(hp.doNotTouch[i] === cell){
        canChange = false;
        continue;
      }
    }
    return canChange;
  }
  hp.run = function(){
    hp.iterations = 0;
    var tempArray = new Array();
    var maxDiff = 0.001;
    var currentMaxDiff = 1;
    while(maxDiff < currentMaxDiff){
      tempArray = new Array();
      copyProtected(tempArray);
      currentMaxDiff = 0;
      for(var i=0;i<=hp.lastCell; i++){
        if(canChangeCell(i)){
          var sum =0;
          var count = 0;
          if(i - hp.gridSize >= 0)          {
            sum += hp.cells[i-hp.gridSize];
            count++;
          }
          if(i + hp.gridSize <= hp.lastCell)          {
            sum += hp.cells[i+hp.gridSize];
            count++;
          }
          if(i % hp.gridSize > 0)          {
            sum += hp.cells[i-1];
            count++;
          }
          if(i % hp.gridSize < hp.gridSize-1)          {
            sum += hp.cells[i + 1];
            count++;
          }

          tempArray[i] = sum / (count * 1.0);
          var currentDiff = Math.abs(hp.cells[i] - tempArray[i]);
          if(currentDiff > currentMaxDiff)
          {
            currentMaxDiff = currentDiff;
          }
        }
      }

                hp.cells = tempArray;
                hp.iterations++;
    }

    console.log('Iterations for equilibrium: ' + hp.iterations);
  };
})(window.hotplate = window.hotplate || [], document);
