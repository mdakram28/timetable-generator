fs = require('fs')

function uniqueSlots(data){
  data = data.split(",");
  data = data.filter(function(elem, pos) {
    return data.indexOf(elem) == pos;
  });
  return data.join(",");
}

fs.readFile('slots.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var slots = {};
  var types = {};
  data = data.split("\r").join("").split("\n");
  data.forEach(function(line){
    line = line.split("\t");
    var course = line[0];
    var type = line[1];
    var courseSlots = line[2];

    if(!types[type])types[type] = 1;
    else types[type]++;

    if(courseSlots=='NIL')return;
    if(type=='PJT' || type=='EPJ')return;
    else if(type=='ETH' || type=='TH' || type=='SS')course+='-TH';
    else if(type=='ELA' || type=='LO')course+='-LB';

    if(slots[course]){
      if(slots[course].indexOf(courseSlots)==-1)slots[course] += ","+courseSlots;
    }else{
      slots[course] = courseSlots;
    }
  });
  fs.writeFile('public/js/slots.js',"var slotsOrig="+JSON.stringify(slots)+";");
});
