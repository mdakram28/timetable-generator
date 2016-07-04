var courses = ["ite1003-th","ite1003-lb","ite1002-th","ite3001-th","ite3001-lb","ite2002-th","ite2002-lb","ite2001-th","ite1005-th","mat2002-th","mat2002-lb","sts2001-th"];

var slotsOrig = {
"ite1003-th" : ["A1","A2"],
"ite1003-lb" : [[5,6],[13,14],[41,42],[47,48],[53,54]],
"ite1002-th" : ["D1","D2"],
"ite3001-th" : [["C1","TC1"],["C2","TC2"]],
"ite3001-lb" : [[53,54],[5,6]],
"ite2002-th" : [["E1","TE1"],["E2","TE2"]],
"ite2002-lb" : [[7,8],[19,20],[31,32],[41,42],[53,54]],
"ite2001-th" : [["F1","TF1"],["F2","TF2"]],
"ite1005-th" : ["C1","C2"],
"sts2001-th" : "E1+TE1,E2+TE2,D1+TD1,D2+TD2,F1+TF1,F2+TF2,G1+TG1,G2+TG2",
"mat2002-th" : "F2+TF2,B1+TB1,F1+TF1,C1+TC1,B2+TB2,D2+TD2,C2+TC2",
"mat2002-lb" : "L31+L32,L19+L20,L37+L38,L45+L46,L51+L52,L13+L14,L23+L24,L3+L4,L39+L40,L41+L42,L49+L50,L7+L8,L11+L12,L5+L6,L9+L10,L33+L34,L35+L36,L53+L54,L55+L56,L29+L30,L25+L26,L27+L28"
};




var slots;

function build(){
	courses.forEach(function(c){
		var sl = slotsOrig[c];
		if(typeof sl != "string")return;
		console.log(c,sl);
		sl = sl.split(",");
		var l = sl.length;
		for(var i=0;i<l;i++){
			sl[i] = sl[i].split("+");
			var len = sl[i].length;
			for(var j=0;j<len;j++){
				if(sl[i][j].charAt(0)=="L"){
					sl[i][j] = sl[i][j].substring(1);
					sl[i][j] = parseInt(sl[i][j]);
				}
			}
		}
		slotsOrig[c] = sl;
	});
	slots = JSON.parse(JSON.stringify(slotsOrig));
	console.log(slots);
}

var theoryToLab = ["A1","F1","D1","TB1","TG1","",
"B1","G1","E1","TC1","TAA1","",
"C1","A1","F1","","","",
"D1","B1","G1","TE1","TCC1","",
"E1","C1","TA1","TF1","TD1","",
"A2","F2","D2","TB2","TG2","",
"B2","G2","E2","TC2","TAA2","",
"C2","A2","F2","TD2","TBB2","",
"D2","B2","G2","TE2","TCC2","",
"E2","C2","TA2","TF2","TDD2",""];

var timeTables = [];
var ttSlots = [];

function getLabSlots(th){
	if(typeof th == "object"){
		var ret = [];
		th.forEach(function(thstr){
			ret = ret.concat(getLabSlots(thstr));
		});
		return ret;
	}
	if(typeof th == "number")return [th];
	if(typeof th != "string")return [];
	var ret = [];
	var l = theoryToLab.length;
	for(var i=0;i<l;i++){
		if(theoryToLab[i]==th){
			ret = ret.concat([i+1]);
		}
	}
	return ret;
}

function convertTheoryToLab(){
	var l = courses.length;
	for(var i=0;i<l;i++){
		var c = courses[i];
		var sl = slots[c];
		for(var j=0;j<sl.length;j++){
			sl[j] = getLabSlots(sl[j]);
		}
	}
}

function saveTimeTable(slots,tt){
	timeTables.push(JSON.parse(JSON.stringify(slots)));
	ttSlots.push(JSON.parse(JSON.stringify(tt)));
}

function checkClash(tt,sl){
	var l = sl.length;
	for(var i=0;i<l;i++){
		if(tt[sl[i]]!="")return false;
	}
	return true;
}

function selectSlot(tt,sl,c){
	sl.forEach(function(slNum){
		tt[slNum] = c;
	});
}

function deselectSlot(tt,sl){
	sl.forEach(function(slNum){
		tt[slNum] = "";
	});
}

function generateTimeTables(index,tt,selected){
	if(index == courses.length)return saveTimeTable(selected,tt);
	var c = courses[index];
	var sl = slots[c];
	var l = sl.length;
	for(var i=0;i<l;i++){
		if(checkClash(tt,sl[i])){
			selectSlot(tt,sl[i],c);
			selected[c] = slotsOrig[c][i];
			generateTimeTables(index+1,tt,selected);
			deselectSlot(tt,sl[i]);
			delete selected[c];
		}
	}
}

function getGap(tt){
	var ret = 0;
	for(var i=0;i<5;i++){
		var day = [];
		for(var j=0;j<6;j++){
			day.push(tt[i*6+j]);
		}
		for(var j=0;j<6;j++){
			day.push(tt[i*6+j+30]);
		}
		while(day.pop()==""){}
		day.push("class");
		var j=0;
		var len = day.length;
		for(j=0;j<len;j++){
			if(day[j]!=""){
				break;
			}
		}
		for(;j<len;j++){
			if(day[j]=="")ret++;
		}
		//ret += day.length - j;
	}
	return ret;
}

function calcGaps(){
	var gaps = [];
	var l = ttSlots.length;
	for(var i=0;i<l;i++){
		gaps[i] = getGap(ttSlots[i]);
	}
	module.exports.gaps = gaps;
}

module.exports.generate = function(){
	var l = 61;
	var coursesArray = [];
	for(var i=0;i<l;i++){
		coursesArray[i] = "";
	}
	build();
	convertTheoryToLab();
	generateTimeTables(0,coursesArray,{});
	calcGaps();
	console.log(timeTables.length,"time tables generated");
};

module.exports.timeTables = timeTables;
module.exports.tt = ttSlots;
