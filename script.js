var Stuff = { //the production of materials of all kinds

	free:{workers:1, 	unlocked:1},
	food:{workers:0, 	buildingwork:0, 	maxworkers:100, stored:100, 	maxstored:100, 	workbonus:1, storebonus:1, unlocked:1, make:{food:1}		},
	wood:{workers:0, 	buildingwork:0, 	maxworkers:3, 	stored:100, 	maxstored:100, 	workbonus:1, storebonus:1, unlocked:0, make:{wood:1}		},
	rock:{workers:0, 	buildingwork:0, 	maxworkers:1, 	stored:20, 		maxstored:100, 	workbonus:1, storebonus:1, unlocked:0, make:{rock:1}		},
	farm:{workers:0,	buildingwork:0.1,	maxworkers:0,									workbonus:1,			   unlocked:0, make:{food:3}		},
	lumber:{workers:0, 	buildingwork:0, 	maxworkers:0, 	stored:0, 		maxstored:0, 	workbonus:1, storebonus:1, unlocked:0, make:{lumber:1,wood:-.5}	},
	stone:{workers:0, 	buildingwork:0, 	maxworkers:0, 	stored:0, 		maxstored:0, 	workbonus:1, storebonus:1, unlocked:0, make:{stone:1,rock:-1}	},
	copper:{workers:0,	buildingwork:0,		maxworkers:0,	stored:0,		maxstored:0,	workbonus:1, storebonus:1, unlocked:0, make:{copper:.1, rock:-2}},
	tin:{workers:0,		buildingwork:0,		maxworkers:0,	stored:0,		maxstored:0,	workbonus:1, storebonus:1, unlocked:0, make:{}},
	bronze:{workers:0,	buildingwork:0,		maxworkers:0,	stored:0,		maxstored:0,	workbonus:1, storebonus:1, unlocked:0, make:{}},
	gold:{workers:0,	buildingwork:0,		maxworkers:0,	stored:0,		maxstored:0,	workbonus:1, storebonus:1, unlocked:0, make:{}},
	coal:{workers:0,		buildingwork:0,		maxworkers:0,	stored:0,		maxstored:0,	workbonus:1, storebonus:1, unlocked:0, make:{}},
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

};

var Buildings = {  //if addWorker property key is "free", it will actually add free workers and not space for them     can remove the buildOnce property because just make buy button invis for "true" buildings
	shack:	{count:1, buildWorkers:1, buildTime:5, unlocked:true, 								addworker:{free:1}, 	cost:{wood:25}, 			unlock:"free",	costratio:1.2,	needsStuffJobs:false,	buildOnce:false,		},
	farm:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, 								addworker:{farm:2},		cost:{wood:100, rock:75},	unlock:"farm",	costratio:2.5, 	needsStuffJobs:true,	buildOnce:false,	statement:"To free up workers from hunting duties you decided to try farming"},
	shed:	{count:0, buildWorkers:2, buildTime:5, unlocked:false, addstorage:{wood:50}, 		addworker:{wood:1}, 	cost:{wood:30},				unlock:"free",	costratio:1.5,	needsStuffJobs:false,	buildOnce:false,	statement:"It looks like you could use a place to chop and store more wood"},
	mine:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, addstorage:{rock:50},		addworker:{rock:1}, 	cost:{wood:30, rock:50},	unlock:"free",	costratio:1.5,	needsStuffJobs:false,	buildOnce:false,	statement:"Adding a shaft to the mine allows for rock collection and storage"},
	barn:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, addstorage:{wood:100,rock:100,food:100}, 			cost:{wood:300,rock:100},	unlock:"free",	costratio:1.5,	needsStuffJobs:false,	buildOnce:false,	statement:"Even more storage"},
	mill:	{count:0, buildWorkers:3, buildTime:10,unlocked:false, addstorage:{lumber:300}, 	addworker:{lumber:3},	cost:{wood:300, rock:50},	unlock:"lumber",costratio:2.5,	needsStuffJobs:true,	buildOnce:false,	statement:"Process the wood into boards at the sawmill"},
	workshop:{count:0,buildWorkers:3, buildTime:12,unlocked:false, addstorage:{stone:200},		addworker:{stone:3},	cost:{lumber:200,rock:200},	unlock:"stone",	costratio:2.5,	needsStuffJobs:true,	buildOnce:false,	statement:"Workshops will allow masons to cut raw rock into stone"},
	hut:	{count:0, buildWorkers:3, buildTime:8, unlocked:false, 								addworker:{free:1},		cost:{lumber:200,stone:100},unlock:"free",	costratio:1.2,	needsStuffJobs:false,	buildOnce:false,	statement:"With the boards from the mill and cut stones you can build new housing structures"},
	lab: 	{count:0, buildWorkers:4, buildTime:20,unlocked:false, 			addworker:{research:1},		 cost:{wood:100,lumber:300,stone:200},		unlock:"research",costratio:1.3,needsStuffJobs:true,	buildOnce:false,	statement:"During the first meeting, the Council decideds to begin research and planning to recover lost technologies.<br>You can now build laboratory space at the back of the Town Hall for research."},


	councilhall:{count:0,buildWorkers:10, buildTime:50,  unlocked:false,						cost:{wood:200, rock:200, lumber:400, stone:300}, 	unlock:"free", 	costratio:1,	needsStuffJobs:false,	buildOnce:true,	statement:"The Council Hall has been constructed. The first meeting will be held soon."},

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
var jobIds = {field:"food",farmJob:"farm",forest:"wood",quarry:"rock",millJob:"lumber",workshopJob:"stone",labJob:"research"}; //add new ids to this list to have click listeners populated
var container = {};//to store the elements on which we will set the eventListeners (because we can't make new variable names using variable strings)


//variables to litsen to
window.onload = function () {//add event listeners after DOM has laoded or you will get null instead of element
	console.log("window has loaded");

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

}

function populate(){
	console.log("populated");
	document.getElementById("statement").innerHTML = "You have built a shack and gathered some supplies. Now your attention turns to bigger plans."; counter1 = 0;	
}
function panelEvent(e){
	Panel("pan" + e.currentTarget.id.charAt(e.currentTarget.id.length-1)); //pan0, pan1 strings
}
function moveworkerEvent(e){
	moveworker(jobIds[e.currentTarget.parentElement.id],1);//uses the ids as keys in jobIds object to get wood, food, etc strings
}
function removeworkerEvent(e){
	removeworker(jobIds[e.currentTarget.parentElement.id],1);
}
function addBuildingEvent(e){
	addBuilding(e.currentTarget.id.slice(0,-5));
}
function SwapResearchEvent(e){
	SwapActiveRes(e.currentTarget.id);
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


	if (Stuff[workkey]["workers"]+num <= Stuff[workkey]["maxworkers"] && Stuff.free.workers >= num){
		Stuff[workkey]["workers"]+=num;
		Stuff["free"]["workers"]-=num;

		document.getElementById(workkey+"workers").innerHTML = Stuff[workkey]["workers"];
		document.getElementById("freeworkers").innerHTML = Stuff["free"]["workers"];
	}
}

function removeworker(lessworkkey,num){
	if (Stuff[lessworkkey]["workers"]-num>=0){
		Stuff[lessworkkey]["workers"]-=num;
		Stuff["free"]["workers"]+=num;

		document.getElementById(lessworkkey+"workers").innerHTML = Stuff[lessworkkey]["workers"];
		document.getElementById("freeworkers").innerHTML = Stuff["free"]["workers"];
	}
}


//////////////////////////////////////////////////////////////////////////add buildings////////////////////////////////////////////////////////////////////////////////
function addBuilding(buildkey){
console.log("building " + buildkey);
	var canbuild = true; 
	txtNotEnough = " ";

	//enough free worekers to build?    
	if(Buildings[buildkey]["buildWorkers"]>Stuff["free"]["workers"]){
		canbuild = false;
		txtNotEnough+= "free workers at camp,&nbsp"
	}

	//can we build it?
	for(var key in Buildings[buildkey]["cost"]){

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
		Stuff.free.workers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Stuff.free.workers;

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
console.log("buildup() " + buildBuild[i]);
console.log("buildContruct: " + buildConstruct[i]);
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
console.log("finish building " + buildkey);
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
			if(key4 == "free"){
				Stuff.free.workers+=Buildings[buildkey]["addworker"]["free"];
				allworkers+=Buildings[buildkey]["addworker"]["free"];
				document.getElementById("freeworkers").innerHTML = Stuff["free"]["workers"];
				document.getElementById("totalWorkers").innerHTML = allworkers;
			} else {
			Stuff[key4]["maxworkers"]+=Buildings[buildkey]["addworker"][key4];
			document.getElementById(key4 + "workersMax").innerHTML = Stuff[key4]["maxworkers"];
			}
		}

		//finally add the building (adding last prevent errors with calculating "actualcost")
		Buildings[buildkey]["count"]++;
		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey).innerHTML = Buildings[buildkey]["count"];
		}

		//and reset freeworkers, construction bar, and buildBuild to "no"
		Stuff.free.workers += Buildings[buildkey]["buildWorkers"];
console.log(Buildings[buildkey]["buildWorkers"]);
console.log(Stuff.free.workers + " free workers");
		buildWorkers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Stuff.free.workers;
		document.getElementById(buildkey + "progress").style.width = "0%";
		buildBuild.splice(index,1);
		buildConstruct.splice(index,1);
	}
}
/////////////////////////////////////////////////////////////////////////////unlocking buildings, resources//////////////////////////////////////////////////////////////////////////////////
function unlock(unlockkey){

	if(!Buildings[unlockkey]["unlocked"]){
		document.getElementById(unlockkey + "Build").style.visibility = "visible";

		if(Buildings[unlockkey]["needsStuffJobs"]){
			document.getElementById(unlockkey + "Job").style.display = "inline-block";
			document.getElementById(unlockkey + "Stuff").style.visibility = "visible";

			unlockStuff = Buildings[unlockkey]["unlock"];

			if(unlockStuff != "free"){

				Stuff[unlockStuff]["unlocked"] = true;
				document.getElementById(unlockStuff + "workers").innerHTML = Stuff[unlockStuff]["workers"];
				document.getElementById(unlockStuff + "workersMax").innerHTML = Stuff[unlockStuff]["maxworkers"];
			}

		}

		var costTxt = " ";

		for(var key in Buildings[unlockkey]["cost"]){
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

			incr = Research[resUp]["resCost"][resKey]*Stuff["research"]["workers"]*Stuff["research"]["workbonus"];

			if(Stuff[resKey]["stored"]-incr<0){
				make = false;
				console.log("not enough of some resource for research");
			}
		}

		if(make) {
			for(var incrKey in Research[resUp]["resCost"]){

				Stuff[incrKey]["stored"]-= Research[resUp]["resCost"][incrKey]*Stuff["research"]["workers"]*Stuff["research"]["workbonus"];
				document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"];
			}
			Research[resUp]["completion"]+= Stuff["research"]["workers"]; 
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

function finishCouncil(index){
	Buildings.councilhall.unlocked = true;
	document.getElementById("buildCounc").style.display = "none";
	document.getElementById("statement").innerHTML = "During the first meeting, the Council decideds to begin research and planning to recover lost technologies./nYou can now build additional space at the back for the Town Hall for research.";
	document.getElementById("butt3").style.display = "inline";
	unlock("lab");
	document.getElementById("council1").style.visibility = "visible";
	Stuff.free.workers += Buildings.councilhall.buildWorkers;
	buildWorkers -= Buildings.councilhall.buildWorkers;
	document.getElementById("freeworkers").innerHTML = Stuff.free.workers;
	buildBuild.splice(index,1);
	buildConstruct.splice(index,1);
}
function isEmpty(object) {
	for(var i in object) {
		return true;
	}
	return false;
}

////////////////////////////////////////////////////////////////////////////increment resources////////////////////////////////////////////////////////////////////////////////////
function incrRes(){ //increments resources (need to fix that it trys to make crafted stuff even when full - but! all positive crafted stuff must be full)
	for(var x in Stuff){
		if (Stuff[x]["unlocked"] && x!="free"){ //don't add anthing for free workers

			var make = true;

			for(var u in Stuff[x]["make"]){		

				incr = Stuff[x]["make"][u]*(Stuff[x]["workers"]*Stuff[x]["workbonus"] + Stuff[x]["buildingwork"]);

				if(Stuff[u]["stored"]+incr<0){
					make = false; //don't make if it would be less than 0
				}
			}

			if(make) {

				for(var incrKey in Stuff[x]["make"]){

			
					incr = Stuff[x]["make"][incrKey]*(Stuff[x]["workers"]*Stuff[x]["workbonus"] + Stuff[x]["buildingwork"]);
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
		document.getElementById("statement").innerHTML = "One of the workers finds a rocky area that can be turned into a quarry"; counter1 = 0;
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




	//////increment resources///////////////////  (could be it's own funtion but whatever) /////NEED TO ADD IN CHECK if lumber is full, don't use wood to make it

	incrRes();






	//consume food
	Stuff.food.stored=(Stuff.food.stored*10-(allworkers*6))/10;
	if(Stuff.food.stored<1){

		document.getElementById("statement").innerHTML = "In a food-shortage panic all workers take to hunting";
		counter1=0;
	
		tempFood = 0; 
	

		for(var i in Stuff){
			if(Stuff[i]["unlocked"] == 1){
				tempFood+=Stuff[i]["workers"];
				Stuff[i]["workers"] = 0;
				document.getElementById(i + "workers").innerHTML = Stuff[i]["workers"];
			}
		}
		Stuff.food.workers = tempFood;

		document.getElementById("foodworkers").innerHTML = Stuff.food.workers;

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
Some sort of exploring/making contact with the Great City or other civilizations
Electrical power
Add a hint button? - na, this can be handled in a subreddit thread
Mkae it take random time for new workers to join up?

"As the town grows in size and reputation, more skilled workers are attracted. They offer insight and specialty on increasingly complex opperations"
*/