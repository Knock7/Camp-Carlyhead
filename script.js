/*Hello to anyone reading this! Yes I am new at this - please point out ways to do 
  anything better. If you want to add something, feel free. I will look at pushes to github
  and if I like them, I'll add them. Vanilla for now; I'll get to learing jquery at some point */



var Stuff = { //the production of materials of all kinds

	//every job has a primary resouce for which they are named in the HTML. They may produce/consume other materials too.
	//maybe split into two objects - one for resources and one for workers/jobs
	//add that the buildingwork ammount only gets added if there is at least one worker? or x per worker, x=5 seems good. that is each farmer can collect the passive bonus for 5 farms - can have some buildings with low passive and high worker output and some with high passive and low added worker output (like factories and hydro dams - each added worker only provides a small additional bonus compared to the 'passive' effect of the building)
	food:{buildingwork:0, 	stored:100, 	maxstored:100, 	storebonus:1, unlocked:true,  },
	wood:{buildingwork:0, 	stored:100, 	maxstored:100, 	storebonus:1, unlocked:false, },
	rock:{buildingwork:0,  	stored:20, 		maxstored:100, 	storebonus:1, unlocked:false, },
	lumber:{buildingwork:0,	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, },
	stone:{buildingwork:0, 	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, },
	copper:{buildingwork:0,	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	tin: {buildingwork:0,	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	bronze:{buildingwork:0,	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	gold:{buildingwork:0,	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	coal:{buildingwork:0,	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	iron:{},
	steel:{},
	zinc:{},//unlock some metals as you make more mines - trade for others that you don't have in your area
	brass:{},



	research:{workers:0,	buildingwork:0,		maxworkers:0,					workbonus:1,		   unlocked:0},
	
	/* Ideas for stuff to add
	cattle(special increment)
	gold:{workers:0, buildingwork:0, maxworkers:3, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	marbles:{workers:0, buildingwork:0, maxworkers:0, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	*/
	incrRes:function (){ //increments resources (need to fix that it trys to make crafted stuff even when full - but! all positive crafted stuff must be full)
		console.log("increase resources");
		for(var x in Jobs){
			if (Jobs[x]["unlocked"]){
				var make = true;
				for(var u in Jobs[x]["make"]){		
					incr = Jobs[x]["make"][u]*(Jobs[x]["workers"]*Jobs[x]["workbonus"]);//add in buildingwork resource generation in another loop before this one - maybe put the passive generation in a new object in Buildings{} so that a given buildings can make more than one resource - somehow need to link back to workers
					if(Stuff[u]["stored"]+incr<0){
						make = false; //don't make if it would be less than 0
					}
				}
				if(make) {
					for(var incrKey in Jobs[x]["make"]){
						incr = Jobs[x]["make"][incrKey]*(Jobs[x]["workers"]*Jobs[x]["workbonus"]);
						max  =  Stuff[incrKey]["maxstored"]*Stuff[incrKey]["storebonus"];
						if(Stuff[incrKey]["stored"]+incr>max){
							Stuff[incrKey]["stored"] = max;
						} else {
							Stuff[incrKey]["stored"]+=incr;
						}
						document.getElementById(incrKey).innerHTML = Math.round(Stuff[incrKey]["stored"]*10)/10;
					}
				}
			}
		}
	}
};


var Jobs = {
	freeworker:{workers:1, maxworkers:1,					 unlocked:true   },//this gets skipped in incrRes()
	researcher: {workers:0, maxworkers:0, 		workbonus:1, unlocked:false, },//this gets skipped too
	hunter:		{workers:0, maxworkers:100, 	workbonus:1, unlocked:true,  make:{food:1}},
	woodcutter:	{workers:0, maxworkers:3, 		workbonus:1, unlocked:true, make:{wood:1}},
	rockcutter:	{workers:0, maxworkers:1, 		workbonus:1, unlocked:true, make:{rock:1}},
	farmer:		{workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{food:3}},
	millworker:	{workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{lumber:1,wood:-.5}},
	mason:		{workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{stone:1,rock:-1.5}},
	miner:		{workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{copper:1,coal:1}},//will add more metals (and lower copper output) with research

	//change the mine building to some kind of expanding quarry
	//should there be different mines - how to organize? or one mine that makes many ores for starters
	//one smelting factory that can handle a certain amount of several ores - new ores added by research


}


var Buildings = {  //if addWorker property key is "free", it will actually add free workers and not space for them     can remove the buildOnce property because just make buy button invis for "true" buildings?
					//make 'unlock' property into an array and change relevant calls below (so that a building can unlock more than one job/resource) also need to split into a unlockRes array and an unlockJob array when I split resrouces and jobs into two objects
					//can move the unlockRes and unlockJob functionality to the unlock_conditional section of the run() function
	shack:	{count:1, buildWorkers:1, buildTime:5, unlocked:true, 								addworker:{freeworker:1}, 	cost:{wood:25}, 							unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,		},
	farm:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, 								addworker:{farmer:2},		cost:{wood:100, rock:75},					unlockRes:[],			unlockJob:["farmer"],	costratio:2.5, 		buildOnce:false,	statement:"To free up workers from hunting duties you decided to try farming"},
	shed:	{count:0, buildWorkers:2, buildTime:5, unlocked:false, addstorage:{wood:50}, 		addworker:{woodcutter:1}, 	cost:{wood:30},								unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	statement:"It looks like you could use a place to chop and store more wood"},
	mine:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, addstorage:{rock:50},		addworker:{rockcutter:1}, 	cost:{wood:30, rock:50},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	statement:"Adding a shaft to the mine allows for rock collection and storage"},
	barn:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, addstorage:{wood:100,rock:100,food:100}, 				cost:{wood:300,rock:100},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	statement:"Even more storage"},
	mill:	{count:0, buildWorkers:3, buildTime:10,unlocked:false, addstorage:{lumber:300}, 	addworker:{millworker:3},	cost:{wood:300, rock:50},					unlockRes:["lumber"],	unlockJob:["millworker"],costratio:2.5,		buildOnce:false,	statement:"Process the wood into boards at the sawmill"},
	workshop:{count:0,buildWorkers:3, buildTime:12,unlocked:false, addstorage:{stone:200},		addworker:{mason:3},		cost:{lumber:200,rock:200},					unlockRes:["stone"],	unlockJob:["mason"],	costratio:2.5,		buildOnce:false,	statement:"Workshops will allow masons to cut raw rock into stone"},
	hut:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, 								addworker:{freeworker:1},	cost:{lumber:200,stone:100},				unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	statement:"With the boards from the mill and cut stones you can build new housing structures"},
	lab: 	{count:0, buildWorkers:4, buildTime:20,unlocked:false, 								addworker:{researcher:1},	cost:{wood:100,lumber:300,stone:200},		unlockRes:["research"],	unlockJob:["researcher"],costratio:1.3,		buildOnce:false,	statement:"During the first meeting, the Council decideds to begin research and planning to recover lost technologies.<br>You can now build laboratory space at the back of the Town Hall for research."},


	councilhall:{count:0,buildWorkers:10, buildTime:50,  unlocked:false,													cost:{wood:200, rock:200, lumber:400, stone:300}, 	unlockRes:[], 	unlockJob:[],			costratio:1,	buildOnce:true,	statement:"The Council Hall has been constructed. The first meeting will be held soon."},

/* Ideas for stuff to add
	ranch:	{unlock:cattle}
	cabbin: {addworker:{free:3}}
	market: {unlock:"gold"} sell food and stuff for gold in separate tab or as a rate  //tech add dock to increase commerce "You have built most of the stuctures that you and your council know how to build, but you remember many other wonderful things from you past lives in the Great City. You allow some settlers to study and draft plans for new types of buildings."
	fishery: //unlocked by dock tech
*/

};

//go through and see which of these can be local variables - no need to have them all global probably
var wrks = 0;		//total number of workers - only updated on TotalWorkers() call	
var counter1 = 0;	//timer for removing "statement" messages
var incr = 0; 		//to add resources each step
var max = 0;  		//to find max storable
var txtNotEnough = " "; //to say which resources are missing to build a new building
var allworkers = 1;		//to count up the workers and subtract food consumption
var tempFood = 0;	//to count workers transfered to hunting in food shortage
var actualcost = 0;	//to calculate the cost of a purchase from the base cost, "cost," and the cost ratio
var nextcost = 0;	//to give how much the next building will cost (to display on the webpage)
var tempKey = 0;	//to give farm and other food production to the "food" Stuff property
var shackToken1 = 0;	//to let the shack message play once
var shackToken2 = 0;	//to the the shack2 message play once
var shackToken3 = 0;
var shackToken4 = 0;
var shackToken5 = 0;
var shackToken6 = 0;
var shackToken7 = 0;
var unlockStuff = "";	//to set new materials to unlocked when a certain building is made
var ActiveRes = " ";	//to set active research
var make = true;	//to tell whether to make a research or resource increment (no if would be < 0 )
var strg = "";
var num = 1;			//to tell how many workers to add or remove
var buildBuild = [];	//if empty, not building, otherwise building whatever is in the array - can have multiple values of same building
var buildConstruct = [];//used to store completion of building with same index in buildBuild (0 to 100)
var buildWorkers = 0;	//number of free workers to currently used for construction
var time = 1000;		//time to construct a building
var interval = 10;		//ammount of construction to do each run() cycle
var construction = 0; 	//completion from 0 to 100 of the current building
//check this object
var container = {};		//to store the elements on which we will set the eventListeners (because we can't make new variable names using variable strings) - do I even need this though?
var bodyy 				//reference to the HTML node/element <body>
var knowledge = 0;		//the prestige variable
var jobIds = {field:"hunter",farmerJob:"farmer",forest:"woodcutter",quarry:"rockcutter",millworkerJob:"millworker",masonJob:"mason",researcherJob:"researcher"}; //add new ids to this list to have click listeners populated


//variables to litsen to
window.onload = function () {//add event listeners after DOM has laoded or you will get null instead of element
	console.log("window has loaded");
	bodyy = document.getElementsByTagName('body')[0];
	bodyy.addEventListener("transitionend", updateTransition, true);

	var closeStory = document.querySelector(".closebtn");
	closeStory.addEventListener("click", function(){closeStory.parentElement.style.display="none";populate();});

	var cheat = document.getElementById("title");
	cheat.addEventListener("click",testFunc);

	var setButtons = document.querySelectorAll(".butt");
	for (var i=0;i<setButtons.length;i++){
		setButtons[i].addEventListener("click",panelEvent);
	}


	//add listeners for moving workers' jobs
	for(var jobkey in jobIds){//do I even need the container object?
		container[jobkey+"AddButton"] = document.getElementById(jobkey).getElementsByClassName("userAdd")[0];
		container[jobkey+"AddButton"].addEventListener("click",moveworkerEvent);

		container[jobkey+"RemButton"] = document.getElementById(jobkey).getElementsByClassName("userRemove")[0];
		container[jobkey+"RemButton"].addEventListener("click",removeworkerEvent);
	}
	//the variables for the job button elements are "fieldAddButton" and "fieldRemButton" etc. not hunterAdd and hunterRem


	//adds event listener for the building buttons
	var setBuildings = document.querySelectorAll(".buildingButton");
	for (i=0;i<setBuildings.length;i++){
		setBuildings[i].addEventListener("click",addBuildingEvent);
	}

	//add event listeners for the research buttons
	var setResearchs = document.querySelectorAll(".researchButton");
	for (i=0;i<setResearchs.length;i++){
		//the ids must be "research name" in the HTML file
		setResearchs[i].addEventListener("click",SwapResearchEvent);
	}

	//add event listener for council build button
	var buildCounc = document.getElementById("buildCounc");
	buildCounc.addEventListener("click",function(){addBuilding("councilhall")});

	var councilMessages = document.querySelectorAll(".councilMessage");
	for (i=0;i<councilMessages.lengh;i++){
		councilMessages[i].addEventListener("click",CouncilMessageEvent);
	}

}

function populate(){
	console.log("populated");
	document.getElementById("statement").innerHTML = "You have built a shack and gathered some supplies. Now your attention turns to bigger plans."; counter1 = 0;	
	load();
}
function panelEvent(e){
	Panel("pan" + e.currentTarget.id.charAt(e.currentTarget.id.length-1)); //pan0, pan1 strings
}
function moveworkerEvent(e){
	var num = 1;
	if (e.shiftKey) {
		num = 5;
	}
	if (e.ctrlKey) {
		num = 10;
	}
	if(e.altKey) {
		num = -1;
	}
	moveworker(jobIds[e.currentTarget.parentElement.id],num);//uses the ids as keys in jobIds object to get job names (woodcutter, hunter, etc) strings
}
function removeworkerEvent(e){
	var num = 1;
	if (e.shiftKey) {
		num = 5;
	}
	if (e.ctrlKey) {
		num = 10;
	}
	if(e.altKey) {
		num = -1;
	}
	removeworker(jobIds[e.currentTarget.parentElement.id],num);
}
function addBuildingEvent(e){
	addBuilding(e.currentTarget.id.slice(0,-5));
}
function SwapResearchEvent(e){
	SwapActiveRes(e.currentTarget.id);
}
function CouncilMessageEvent(e){
	var num = 1 + e.currentTarget.id.charAt(e.currentTarget.id.length-1);
	e.currentTarget.style.display = "none"
	document.getElementById("council"+ num).style.display = "block";
}

//for switching active panels
var mark1 = "pan1";
var mark2 = "pan2";
function Panel(select){
    if(select === mark1){
        //do nothing
    } else if(select === mark2){
        mark2 = mark1;
        mark1 = select;
        //don't need to change any display settings
    } else {
        document.getElementById(mark2).style.display = "none";
        mark2 = mark1;
        mark1 = select;
        document.getElementById(select).style.display = "block";
    }
}

//////////////////////////////////////////////////////////////////////////add and remove workers///////////////////////////////////////////////////////////////////////////////////
function moveworker(workkey,num){

	if (num === -1){
		num = Math.min(Jobs[workkey]["maxworkers"]-Jobs[workkey]["workers"],Jobs.freeworker.workers);
	}

	if (Jobs[workkey]["workers"]+num <= Jobs[workkey]["maxworkers"] && Jobs.freeworker.workers >= num){
		Jobs[workkey]["workers"]+=num;
		Jobs["freeworker"]["workers"]-=num;

		document.getElementById(workkey+"s").innerHTML = Jobs[workkey]["workers"];
		document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
	}
}

function removeworker(lessworkkey,num){
	if (num === -1){
		num = Jobs[lessworkkey]["workers"];
	}
	if (Jobs[lessworkkey]["workers"]-num>=0){
		Jobs[lessworkkey]["workers"]-=num;
		Jobs["freeworker"]["workers"]+=num;

		document.getElementById(lessworkkey+"s").innerHTML = Jobs[lessworkkey]["workers"];
		document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
	}
}


//////////////////////////////////////////////////////////////////////////add buildings////////////////////////////////////////////////////////////////////////////////
function addBuilding(buildkey){

	var canbuild = true; 
	txtNotEnough = " ";

	//enough free worekers to build?    
	if(Buildings[buildkey]["buildWorkers"]>Jobs["freeworker"]["workers"]){
		canbuild = false;
		txtNotEnough+= "free workers at camp,&nbsp"
	}

	//can we build it?
	for(var key in Buildings[buildkey]["cost"]){
		//should make actualcost a method in Buildings - Buildings.actualcost("buildkey")
		actualcost = Math.round(Buildings[buildkey]["cost"][key]*Math.pow(Buildings[buildkey]["costratio"],Buildings[buildkey]["count"]));

		if(actualcost>Stuff[key]["stored"]){
			canbuild = false;
			txtNotEnough+=(key+",&nbsp");
		}	
	}
	txtNotEnough = txtNotEnough.slice(0,-6);//remove the comma and space after the last entry

	//yes we can!
	if(canbuild){

		//set everything up for construction function
		buildBuild.push(buildkey) ; //this will cause buildUp() to start running true in the game loop - on buildBuild array 
		buildConstruct.push(0);
		buildWorkers +=  Buildings[buildkey]["buildWorkers"];
		Jobs.freeworker.workers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;

 		costTxt = " ";
		//pay for the building
		for(var keyy in Buildings[buildkey]["cost"]){

			actualcost = Math.round(Buildings[buildkey]["cost"][keyy]*Math.pow(Buildings[buildkey]["costratio"],Buildings[buildkey]["count"]));   //consider making function actualcost(buildkey,key) which returns value calculated value

			Stuff[keyy]["stored"]-=actualcost;
			document.getElementById(keyy).innerHTML = Stuff[keyy]["stored"];
		
			costTxt += Math.round(actualcost*Buildings[buildkey]["costratio"]) + "&nbsp" + keyy + "<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
		}
		costTxt = costTxt.slice(0,-56);


		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey+"Costs").innerHTML = costTxt;	 //may be better way to do this but don't want to try to update cost that doesn't exist
		}



		//no we can't :(
	}  else {

		document.getElementById("statement").innerHTML = "Not enough "+ txtNotEnough +" to build " + buildkey; counter1 = 20;
	}
	return(canbuild);
}

function buildUp(){

	for(i=0;i<buildBuild.length;i++){
		if (buildConstruct[i]<100){
			buildConstruct[i]+=(100/Buildings[buildBuild[i]]["buildTime"]); //need to loop through buildkeys in array 1
			if(buildConstruct[i]>99){
				buildConstruct[i] = 100;//so the bar doesn't go over if there is a rounding error
			}
			document.getElementById(buildBuild[i] + "progress").style.width = buildConstruct[i].toString() + "%"; //add html + css for the progress bars
		} else {
			finishBuilding(buildBuild[i],i);//also send the index so that if there are more than one of a building it knows which to remove
		}
	}
}

function finishBuilding(buildkey,index){
	//re-direct to special building calls
	if(buildkey == "councilhall"){
		finishCouncil(index);
	} else {


		//add storage space
		for(var keyyy in Buildings[buildkey]["addstorage"]){
			Stuff[keyyy]["maxstored"]+=Buildings[buildkey]["addstorage"][keyyy];
			document.getElementById(keyyy + "Max").innerHTML = Stuff[keyyy]["maxstored"];
		}
		//add worker space (and free workers)
		for(var key4 in Buildings[buildkey]["addworker"]){
			if(key4 == "freeworker"){
				Jobs.freeworker.workers+=Buildings[buildkey]["addworker"]["freeworker"];
				allworkers+=Buildings[buildkey]["addworker"]["freeworker"];
				document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
				document.getElementById("totalWorkers").innerHTML = allworkers;
			} else {
			Jobs[key4]["maxworkers"]+=Buildings[buildkey]["addworker"][key4];
			document.getElementById(key4 + "sMax").innerHTML = Jobs[key4]["maxworkers"];
			}
		}

		//finally add the building (adding last prevent errors with calculating "actualcost")
		Buildings[buildkey]["count"]++;
		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey).innerHTML = Buildings[buildkey]["count"];
		}

		//and reset freeworkers, construction bar, and buildBuild to "no"
		Jobs.freeworker.workers += Buildings[buildkey]["buildWorkers"];


		buildWorkers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
		document.getElementById(buildkey + "progress").style.width = "0%";
		buildBuild.splice(index,1);
		buildConstruct.splice(index,1);
	}
}
/////////////////////////////////////////////////////////////////////////////unlocking buildings, resources//////////////////////////////////////////////////////////////////////////////////
//this make the buildings and any resources or jobs associated with the buildings appear on the screen 
function unlock(unlockkey){

	if(!Buildings[unlockkey]["unlocked"]){
		document.getElementById(unlockkey + "Build").style.visibility = "visible";


		for(i=0;i<Buildings[unlockkey]["unlockRes"].length;i++){
			var tempStuff = Buildings[unlockkey]["unlockRes"][i];
			Stuff[tempStuff]["unlocked"] = true;//could also change this to a method Stuff.unlock("resource"){Stuff[resource]["unlocked"] = true;}  any reason for a lock() method?
			document.getElementById(tempStuff).innnerHTML = Stuff[tempStuff]["stored"];
			document.getElementById(tempStuff+"Max").innnerHTML = Stuff[tempStuff]["maxstored"];
			document.getElementById(tempStuff+"Stuff").style.visibility = "visible";
		}
		for(i=0;i<Buildings[unlockkey]["unlockJob"].length;i++){
			var tempJob = Buildings[unlockkey]["unlockJob"][i];
			document.getElementById(tempJob+"s").innerHTML = Jobs[tempJob]["workers"];
			document.getElementById(tempJob+"sMax").innerHTML = Jobs[tempJob]["maxworkers"]
			document.getElementById(tempJob+"Job").style.display = "inline-block";
		}

		var costTxt = " ";

		for(var key in Buildings[unlockkey]["cost"]){//make this output the same as the update cost output from addBuilding()
			costTxt += Buildings[unlockkey]["cost"][key] + "&nbsp" + key + ",&nbsp";
		}

		costTxt = costTxt.slice(0,-6);

		document.getElementById(unlockkey+"Costs").innerHTML = costTxt;

		document.getElementById("statement").innerHTML = Buildings[unlockkey]["statement"]; counter1 = 0;
		Buildings[unlockkey]["unlocked"] = 1;
	}
}

////////////////////////////////////////////////////////////////////////////research////////////////////////////////////////////////////////////////////////////////////
function SwapActiveRes(x){
	ActiveRes = x;
	document.getElementById("research").innerHTML = Research[x]["completion"];
	document.getElementById("researchMax").innerHTML = Research[x]["totalRes"];
}//this probably is not needed? need to make buttons and stuff

var Research = {
	FarmEquip:	{prize:0, resCost:{wood:2,lumber:1}, 	totalRes:1000, completion:0, done:false},
	StoneAxe:	{prize:1, resCost:{lumber:1,stone:3}, 	totalRes:1500, completion:0, done:false},
	Smelting:	{prize:2, resCost:{wood:5,rock:3},		totalRes:2000, completion:0, done:false},
	Metalwork:	{prize:3, resCost:{metal:1},			totalRes:3500, completion:0, done:false},

}

function researchIncr(resUp){ //somewhy research progresses even though no researcher workers

	if(!Research[resUp]["done"]){

		make = true;
		
		for(var resKey in Research[resUp]["resCost"]){

			incr = Research[resUp]["resCost"][resKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"];

			if(Stuff[resKey]["stored"]-incr<0){//need to check all the required resources before consuming any
				make = false;
				console.log("not enough of some resource for research");
			}
		}

		if(make) {
			for(var incrKey in Research[resUp]["resCost"]){

				Stuff[incrKey]["stored"]-= Research[resUp]["resCost"][incrKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"];//dont need to look up Jobs[]*Jobs[] every time this loops
				document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"];
			}
			Research[resUp]["completion"]+= Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]; //can add research to efficiency which increase researcher output% but doesn't increase materials cost - need to add a new resEfficiency variable
			document.getElementById("research").innerHTML = Research[resUp]["completion"];
			document.getElementById(resUp + "resBar").style.width = Research[resUp]["completion"]/Research[resUp]["totalRes"]*100 + "%";
			if(Research[resUp]["completion"]>=Research[resUp]["totalRes"]){
				console.log("research done!");
				Research[resUp]["done"] = true;
				doBonus(resUp);
				ActiveRes = " ";
			}
		}
	}
}

function doBonus(resUp){
	switch (Research[resUp]["prize"]) {
	    case 0:
			document.getElementById("statement"),innerHTML = "Research complete: Farm equipment improves farmer output by 50%";
			alert("case0");
	        Stuff.farm.workbonus = Stuff.farm.workbonus*1.5;
	        break;
	    case 1:
	        Stuff.wood.workbonus = Stuff.wood.workbonus*1.5;
	        break;
	    case 2:
	        console.log("case 2");
	        break;
	    case 3:
	        console.log("case 3");
	       	break;
	    case 4:
	        console.log("case 4");
	        break;
	    case 5:
	        console.log("case 5");
	        break;
	    case 6:
	        console.log("case 6");
	}
}


////////////////////////////////////////////////////////////////////////////miscilanious functions working on////////////////////////////////////////////////////////////////////////////////////

function finishCouncil(index){//some of this can be run in finishBuilding() and then break out right after calling finishCouncil() for parts that are different
	Buildings.councilhall.unlocked = true;
	document.getElementById("buildCounc").style.display = "none";
	document.getElementById("statement").innerHTML = "Council decree at Town Hall"; counter1 = 0;
	document.getElementById("butt3").style.display = "inline";
	unlock("lab");
	document.getElementById("council1").style.visibility = "visible";
	Jobs.freeworker.workers += Buildings.councilhall.buildWorkers;
	buildWorkers -= Buildings.councilhall.buildWorkers;
	document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
	buildBuild.splice(index,1);
	buildConstruct.splice(index,1);
}
function isEmpty(object) {
	for(var i in object) {
		return true;
	}
	return false;
}
function updateTransition(){
	console.log("transition done");
	bodyy.className = "normal";
}
////////////////////////////////////////////////////////////////////////////increment resources////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////game loop////////////////////////////////////////////////////////////////////////////////////////


function run(){ 

	//clear the message to player after ~some seconds
	if(document.getElementById("statement").innerHTML!="&nbsp"){
		counter1++;
		if(counter1>35) {
			document.getElementById("statement").innerHTML = "&nbsp";
			counter1 = 0;
		}
	}

	//*******************************************
//check for events met to unlock new content
	

	if(Buildings.shack.count==2&&shackToken1==0){
		document.getElementById("statement").innerHTML = "Soon another wanderer joins you in your work. More will surely come and stay if you have space to house them."; counter1 = 0;
		shackToken1 = 1;
	}

	if(Buildings.shack.count==3&&shackToken3==0){
		document.getElementById("forest").style.display = "inline-block";
		document.getElementById("woodStuff").style.visibility = "visible";
		Stuff.wood.unlocked=true;
		document.getElementById("statement").innerHTML = "You should cut more wood to continue building"; counter1 = 0;
		shackToken3 = 1;
	}

	if(Buildings.shack.count==4&&shackToken2==0){
		document.getElementById("statement").innerHTML = "As you build more buildings they will require more resources. Why? Because that's what we do in this genre."; counter1 = 0;
		shackToken2 = 1;
	}

	if(Buildings.shack.count>5&& shackToken4==0){
		document.getElementById("quarry").style.display = "inline-block";
		document.getElementById("rockStuff").style.visibility = "visible";
		Stuff.rock.unlocked=true;
		document.getElementById("statement").innerHTML = "One of the workers finds a small rocky area that can be turned into a quarry"; counter1 = 0;
		shackToken4 = 1;
	}

	if(Buildings.shack.count>7){
		unlock("shed");
	}

	if(Buildings.shed.count>0 && Stuff.rock.stored>30) {
		unlock("mine");
	}

	if(Buildings.mine.count>0){
		unlock("farm");
	}

	if(Buildings.shed.count>2 && Buildings.mine.count>1){
		unlock("barn");
	}

	if(Buildings.shack.count>8 && Buildings.shed.count>3 && Buildings.barn.count>0){
		unlock("mill");
	}

	if(Buildings.shack.count>8 && Buildings.mine.count>2){
		unlock("workshop");
	}

	if(!Buildings.hut.unlocked && Buildings.mill.count>0 && Buildings.workshop.count>0){
		unlock("hut");
	}

	if(Buildings.shack.count + Buildings.hut.count>15 && shackToken5==0){
		document.getElementById("statement").innerHTML = "Your little camp has grown into a shanty town. You decide to form a council to govern and make decisions."; counter1 = 0;
		document.getElementById("title").innerHTML = "Camp Carlyhead";
		shackToken5 = 1;

		document.getElementById("butt1").style.display = "inline";
		document.getElementById("butt2").style.display = "inline";
		document.getElementById("butt4").style.display = "inline";
	}

//phase 1 done? - phase 2 unlocks from research - more phase 3 unlocks below?//
	//*******************************************


	/////////continue the construction of new building
	if (buildBuild.length>0){
		buildUp()
	}


	//////increment research///////////////////

	if(ActiveRes != " " && !Research[ActiveRes]["done"]){
		console.log("trying to research" + ActiveRes);
		researchIncr(ActiveRes);
	}




	//////increment resources///////////////////
	Stuff.incrRes();






	//consume food
	Stuff.food.stored=(Stuff.food.stored*10-(allworkers*6))/10;//should put allworkers as freeworkersMax/maxfreeworkers and clean up "allworkers" variable
	if(Stuff.food.stored<1){
		
		bodyy.className = "alert2"; //gets set back to class="normal" by a transition listener to make the flash effect
		document.getElementById("statement").innerHTML = "In a food-shortage panic all available workers take to hunting";
		counter1=0;
	
		tempFood = 0; 

	

		for(var i in Jobs){
			if(Jobs[i]["unlocked"] == 1 && i!=="farmer"){
				tempFood+=Jobs[i]["workers"];
				Jobs[i]["workers"] = 0;
				document.getElementById(i + "s").innerHTML = Jobs[i]["workers"];
			}
		}
		Jobs.hunter.workers = tempFood;

		document.getElementById("hunters").innerHTML = Jobs.hunter.workers;

	} 



//document.getElementById('demo').innerHTML = Date();

} setInterval(run,300);


////////////////////////////////end of game loop//////////////////////////////





//button to test a function
function testFunc(){
	for(var x in Stuff){
    
		Stuff[x]["stored"] = Stuff[x]["maxstored"];
	
	}
	console.log("cheated");
}


/////////////////////////////////////////local storage to save the game?///////////////

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

//taken from MDN tutorial on Storage
function saveGame(){//add in the Jobs object for storage
	if (storageAvailable('localStorage')) {
		console.log('Yippee! We can use localStorage awesomeness');

		data.set("Stuff", Stuff);
		data.set("Buildings", Buildings);
		data.set("Global variables", GlobVar);
	}
	else {
		alert('Too bad, no localStorage for us');
	}
}

function load(){//oh this is going to be fun 
	if (storageAvailable()){
	//need to check whether these things exist?
	Stuff = data.get("Stuff");
	Buildings = data.get("Buildings");
	GlobVar = data.get("Global variables");

	//and oh gee, how do I even start this
	//update to the stored values of all resources, maxes, buildings, costs  add refreshAmounts() function
	for (var i in Stuff){
		if (Stuff[i]["unlocked"]){
			document.getElementById(i+"Stuff").style.visibility = "visible";
			document.getElementById(i) = Stuff[i]["stored"];
			document.getElementById(i+"Max") = Stuff[i]["maxstored"];
		}
	}
	for (var i in Buildings){
		if (Buildings[i]["unlocked"]){
			document.getElementById("")
		}
	}
	//show the values that have been unlocked
	//if there are more than X people show buttons up to butt3
	//if there is a councilhall then show butt4
	
	}
}

function prestige(){
	knowledge += Jobs.freeworker.maxworkers;
	localStorage.setItem("Knowledge",knowledge);
	//do I save knowledge and reload the page or reset the stored amounts of everything to 0 and refreshAmounts()?
	window.location.reload(false);//seems easiest
	knowledge = localStorage.getItem("Knowledge");
}

//taken from Alex Grande on stackoverflow, thanks
var data = {
  set: function(key, value) {
    if (!key || !value) {return;}

    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },
  get: function(key) {
    var value = localStorage.getItem(key);

    if (!value) {return;}

    // assume it is an object that has been stringified
    if (value[0] === "{") {
      value = JSON.parse(value);
    }

    return value;
  }
}


//more ideas for methods - or make these into constructors?
function addResource(resName, parameters){
	Stuff[resName]={parameters};
}
function addJob(jobName, parameters){
	Jobs[jobName] = {parameters};
}
function addBuildings(buildName, parameters){
	Buildings[buildName] = {cost:costPara, count:0,}
}







/* another way to create the new buildings and jobs - maybe try later
function createMansions() {
	var p1 = document.createElement("p");
	var t1 = document.createTextNode("Mansion: ");
	var s1 = document.createElement("span");
	s1.id="mansion";
	s1.appendChild(document.createTextNode("0"));
	var b1 = document.createElement("button")
	b1.appendChild(document.createTextNode("Build"));
	
	p1.appendChild(t1);
	p1.appendChild(s1);
	p1.appendChild(document.createTextNode(" "));
	p1.appendChild(b1);
	p1.appendChild(document.createTextNode(" Cost: 150 wood, 50 rock"))
	
	document.getElementById("test").appendChild(p1);
}
*/

/* Story ideas

Once you build up enough, barbarians attack you (must maintain troops and improve their armor/weapons - later can build walls or other fortifications to reduce number of soldiers needed for protection)
Once the city is very large whoever started the Great War comes for you
Say that you grow old and you pick a new leader after some time - could be related to prestige 
Some sort of exploring/making contact with the Great City or other civilizations (kittens?)
Electrical power
Add a hint button? - this can be handled in a subreddit thread (need to indicate shift-click and control-click)
Mkae it take random time for new workers to join up?

"As the town grows in size and reputation, more skilled workers are attracted. They offer insight and specialty on increasingly complex opperations"
*/