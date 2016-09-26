
var container = document.getElementById('spreadsheet');

var hot = new Handsontable(container, {
  startRows: 6,
  startCols: 7,
  rowHeaders: true,
  colHeaders: true,
  contextMenu: false,
  type: 'numeric',
  format: '0,0.[00000]',
});
window.hot = hot;

// for (i=0; i<3; i++){
//   for (j=0; i<3; i++){
//     hot.getCellMeta(i, j).type = 'numeric';
//   }
// }
hot.getCellMeta(4, 2).type = 'text'


var buildPayload = function(hot) {
  var m = hot.getData(2, 2);
  var v = hot.getDataAtCol(4).splice(0, 3);
  var eps = hot.getDataAtCell(4, 0);
  var b = hot.getDataAtCell(4, 2);
  var payload = {'M': m, 'V': v, 'eps': eps, 'bool': b};
  return payload;
}


$('button[name=Init]').click(function() {
  console.log('inside init button');
  var m_init = [[1, 0, 1],
                [2, 1, 0],
                [0, 3, 1],
                ];
  for (i=0; i<m_init.length; i++){
    var row = m_init[i];
    for (j=0; j<row.length; j++){
      hot.setDataAtCell(i, j, row[j]);
    }
  }
  var v_init = [1, 2, 3];
  for (i=0; i<v_init.length; i++){
    hot.setDataAtCell(i, 4, v_init[i]);
  }
  var eps_init = 0.001;
  hot.setDataAtCell(4, 0, eps_init);
  var b = true;
  hot.setDataAtCell(4, 2, b);
  hot.deselectCell();
});

$('button[name=Clear]').click(function() {
  console.log('inside clear button');
  hot.clear();
  hot.deselectCell();  
});

$('button[name=Compute]').click(function() {
  console.log('inside compute button');
  var url = 'http://localhost:3000/func_one'; 
  var payload = buildPayload(hot);
  var data = JSON.stringify(payload);
  console.log(data);

  var success = function(data, status) {
    console.log("Status: " + status);
    var result = JSON.parse(data.output);
    console.log(result);
    hot.setDataAtCell([ [0, 6, result[0]],
                        [1, 6, result[1]],
                        [2, 6, result[2]],
                        ]);
    }
  var error = function(data, status){
      console.log("Status: " + status);
  }
  
  $.ajax({
      type: 'POST',
      url: url,
      data: data,
      contentType:'application/json',
      dataType: 'json',
      success: success,
      error: error
  });
});
