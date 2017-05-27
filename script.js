/*Hello to anyone reading this! Yes I am new at this - please point out ways to do 
  anything better. If you want to add something, feel free. I will look at pushes to github
  and if I like them, I'll add them. Vanilla for now; I'll get to learing jquery at some point? */



var Stuff = { //the production of materials of all kinds

	//add that the buildingwork ammount only gets added if there is at least one worker? or x per worker, x=5 seems good. that is each farmer can collect the passive bonus for 5 farms - can have some buildings with low passive and high worker output and some with high passive and low added worker output (like factories and hydro dams - each added worker only provides a small additional bonus compared to the 'passive' effect of the building)
	food:{ name:"Food", 	stored:100, 	maxstored:100, 	storebonus:1, unlocked:true,  color:"rgb(0,0,0)"},
	wood:{ name:"Wood",		stored:100, 	maxstored:100, 	storebonus:1, unlocked:true, },
	rock:{ name:"Rock",		stored:20, 		maxstored:100, 	storebonus:1, unlocked:false, },
	lumber:{name:"Lumber",	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, },
	stone:{	name:"Stone",	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, },
	clay:{  name:"Clay",	stored:0,		maxstored:50,	storebonus:1, unlocked:false, },
	brick:{ name:"Brick",	stored:0,		maxstored:50,	storebonus:1, unlocked:false, },
	cu_ore:{name:"Copper Ore",stored:0,		maxstored:50,	storebonus:1, unlocked:false, },//decide where to store this maybe make small storage and need to smelt quickly?
	copper:{name:"Copper",	stored:0,		maxstored:50,	storebonus:1, unlocked:false, },
	tin: {	name:"Tin",		stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	lead:{  name:"Lead"},
	fe_ore:{name:"Iron Ore"},//Iron ore and coal make steel
	steel:{ name:"Steel"},
	mercury:{name:"Mercury"},
	silver:{name:"Silver"},
	bronze:{name:"Bronze",	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },
	gold:{	name:"Gold",	stored:0,		maxstored:99999,storebonus:1, unlocked:false, },//no max on gold - don't display max and set arbitrarily high
	coal:{	name:"Coal",	stored:0,		maxstored:0,	storebonus:1, unlocked:false, },//use coal to improve smelting
	steel:{	name:"Steel"},
	zinc:{  name:"Zinc"},//unlock some metals as you make more mines - trade for others that you don't have in your area
	brass:{ name:"Brass"},

	research:{name:"Research",stored:0,		maxstored:0,	storebonus:1, unlocked:false, },//think about how this relates to the research object and maybe move it there? or make global variable?

	spear:{name:"Spears",	stored:0,		maxstored:5,	storebonus:1, unlocked:false },
};
	function addResourceLine(res){
		Stuff[res]["unlocked"]=true;
		var p = document.createElement("p");
		p.id = res+"Stuff";
		p.innerHTML = " "+ Stuff[res]["name"] + ": <span id='"+res+"'> "+ Stuff[res]["stored"] +" </span> / <span id='"+res+"Max' class='right'>"+Stuff[res]["maxstored"]+"</span></p>";
		
		document.getElementById("stuff").appendChild(p);

		document.getElementById(res).innnerHTML = Stuff[res]["stored"];
		

		if(res==="gold"||res==="research"){
			document.getElementById(res+"Max").innerHTML = "NoMax";
		} else {
			document.getElementById(res+"Max").innnerHTML = Stuff[res]["maxstored"];
		}

	};	

	function addSpecialLine(res){
		var p = document.createElement("p");
		p.id = res+"Stuff";
		p.innerHTML = " "+ res.charAt(0).toUpperCase() + res.slice(1) + ": <span id='"+res+"'> "+ Stuff[res]["stored"] +" </span> / <span id='"+res+"Max' class='right'>"+Stuff[res]["maxstored"]+"</span></p>";
		
		document.getElementById("stuffSpecial").appendChild(p);

		document.getElementById(res).innnerHTML = Stuff[res]["stored"];
		

		if(res==="gold"||res==="research"){
			document.getElementById(res+"Max").innerHTML = "NoMax";
		} else {
			document.getElementById(res+"Max").innnerHTML = Stuff[res]["maxstored"];
		}

	};
	/* Ideas for stuff to add
	cattle(special increment)
	gold:{workers:0, buildingwork:0, maxworkers:3, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	marbles:{workers:0, buildingwork:0, maxworkers:0, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	*/



var Jobs = {
	freeworker: {box: "camp", 		workers:1, maxworkers:1,					 unlocked:true,   									},//this gets skipped in incrRes()
	hunter:		{box: "fields", 	workers:0, maxworkers:100, 		workbonus:1, unlocked:true,  make:{food:1},						},
	woodcutter:	{box: "forest", 	workers:0, maxworkers:3, 		workbonus:1, unlocked:false, make:{wood:1.6},					},
	rockcutter:	{box: "hillside", 	workers:0, maxworkers:1, 		workbonus:1, unlocked:false, make:{rock:1},						},
	farmer:		{box: "fields", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{food:2},						},
	lumberworker:{box: "forest", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{lumber:1.6,wood:-.8},			},
	mason:		{box: "workshops", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{stone:1,rock:-1.5},			},
	researcher: {box: "laboratory",	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{research:1},					},//this gets skipped too
	miner:		{box: "hillside", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{cu_ore:.3},					},//will add more metals (and lower copper output) with research
	kilnworker:	{box: "workshops",	workers:0, maxworkers:0,		workbonus:1, unlocked:false, make:{copper:.1,cu_ore:-.5},		},//can treat kins specially later (dropdown menu to select which ore (or clay -> brick) and each kiln can do different thing)
	clayworker: {box: "riverbank",  workers:0, maxworkers:5,		workbonus:1, unlocked:false, make:{clay:2},						},
	brickmaker: {box: "workshops",	workers:0, maxworkers:4,		workbonus:1, unlocked:false, make:{brick:1,clay:-1,wood:-2},	},

	//change the mine building to some kind of expanding quarry
	//should there be different mines - how to organize? or one mine that makes many ores for starters - unlock more metals as you add mineshafts (rename current mineshaft)
	//one smelting factory that can handle a certain amount of several ores - new ores added by research and/or mines

	//after enough advancement, rename the jobBox and change image: camp -> settlement; workshops -> industrial zone
	
	nextCol:1,
};
	function incrRes(){ //increments resources from workers at their jobs (make another function to add passive building work - move 'buildingwork' to Buildings function and make it an object like 'make')
		for(var x in Jobs){
			if (Jobs[x]["unlocked"]){
				var make = true;
				var make2 = false;
				for(var u in Jobs[x]["make"]){		
					var incr = GlobVar.factor*Jobs[x]["make"][u]*(Jobs[x]["workers"]*Jobs[x]["workbonus"]);//add in buildingwork resource generation in another loop before this one - maybe put the passive generation in a new object in Buildings{} so that a given buildings can make more than one resource - somehow need to link back to workers
					if(Stuff[u]["stored"]+incr<0){
						make = false; //don't make if it would be less than 0
					}
					if(make){//don't make somthing if storage is full
						if(Stuff[u]["stored"]<Stuff[u]["maxstored"] && incr>0){
							make2 = true;		
						}
					}
				}
				if(make&&make2) {
					for(var incrKey in Jobs[x]["make"]){
						incr = GlobVar.factor*Jobs[x]["make"][incrKey]*(Jobs[x]["workers"]*Jobs[x]["workbonus"]);
						var max  =  Stuff[incrKey]["maxstored"]*Stuff[incrKey]["storebonus"];
						if(Stuff[incrKey]["stored"]+incr>max){
							Stuff[incrKey]["stored"] = max;
						} else {
							Stuff[incrKey]["stored"]+=incr;
						}
						document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"].toFixed(1);
					}
				}
			}
		}
	};

	function addJobBox(boxName){
		GlobVar.JobBoxes.push(boxName);

		var newDiv = document.createElement("div");
		newDiv.id = boxName;
		newDiv.className = "JobBox";


		var d2 = document.createElement("div");
		d2.className = "bkgrn"
		d2.innerHTML = "<b>&nbsp;"+ boxName.toUpperCase() +"&nbsp;</b>";

		var d3 = document.createElement("div");
		d3.className = "imgBox";
		d3.style = "background-image: linear-gradient(rgba(250,250,250,0.1),rgba(255,250,250,0.1)), url(images/"+ boxName +".jpg);"

		newDiv.appendChild(d2);
		newDiv.appendChild(d3);
		

		document.getElementById("col"+Jobs.nextCol).appendChild(newDiv);

		Jobs.nextCol = Jobs.nextCol===1 ? 2 : 1;

	};

	function addJobElement(jobName){//came move the check whether box exists up to here

		Jobs[jobName]["unlocked"] = true;
		var newBox = Jobs[jobName]["box"];

		if(document.getElementById(newBox)===null){		
			addJobBox(newBox);
		}

		var makeStr = "";
		var consumeStr ="";
		

		for (var i in Jobs[jobName]["make"]){
			if(Jobs[jobName]["make"][i]>0){
				makeStr += Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*5 + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
			} else {
				consumeStr += Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*-5 + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
			}

			//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
		}

		if(consumeStr!==""){
			consumeStr = "<br>and consumes:<br>" + consumeStr;	
		}

		makeStr = makeStr.slice(0,-4);

		indiv = document.createElement("div");
		indiv.id = jobName.toLowerCase() + "Job";
		indiv.innerHTML = "<div class='userAdd'><b>&nbsp;"+ jobName.charAt(0).toUpperCase() + jobName.slice(1) +"s: <span id='"+ jobName +"s'>0</span> / <span id='"+ jobName +"sMax'>"+ Jobs[jobName]["maxworkers"] +"</span>&nbsp;</b><div class='tooltiptext'><p>Each "+ jobName +" makes: <br><span id='"+ jobName +"sMake' >"+ makeStr + consumeStr +"</span></p></div></div><div class='userRemove'><b> X </b></div><p style='font-size:4pt;'> </p>";
		indiv.querySelector(".userAdd").addEventListener("click",moveworkerEvent);
		indiv.querySelector(".userAdd").oncontextmenu = function() {
  			moveworker(jobName,-1);
			return false;
		}
		indiv.querySelector(".userRemove").addEventListener("click",removeworkerEvent);
		indiv.querySelector(".userRemove").oncontextmenu = function() {
  			removeworker(jobName,-1);
			return false;
		}
		console.log("newbox: "+newBox);
		document.getElementById(newBox).querySelector(".imgBox").appendChild(indiv);
	};





var Buildings = {  //if addWorker property key is "freeworker", it will add free workers     can remove the buildOnce property because just make buy button invis for "true" buildings?
					//can move the unlockRes and unlockJob functionality to the unlock_conditional section of the run() function
	shack:	{name: "Shack", 		count:1, buildWorkers:1, buildTime:25, unlocked:true, 	buildingwork:{},									addworker:{freeworker:1}, 	cost:{wood:25}, 							unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	tempCount:0, 	addsText:["space for 1 new settler"],		},
	shed:	{name: "Woodshed",		count:0, buildWorkers:2, buildTime:25, unlocked:false, 	buildingwork:{},		addstorage:{wood:50}, 		addworker:{woodcutter:1}, 	cost:{wood:30},								unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 1 woodcutter", "50 wood storage"],	statement:"It looks like you could use a place to chop and store more wood,<br>so you decide to start building sheds just inside the forest."},
	expandQ:{name: "Expand Quarry",	count:0, buildWorkers:3, buildTime:25, unlocked:false,	buildingwork:{},		addstorage:{rock:50},		addworker:{rockcutter:1}, 	cost:{wood:30, rock:50},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 1 rockcutter", "50 rock storage"],	statement:"Clearing access to the quarry will allow for more rock collection and storage."},
	farm:	{name: "Farm",			count:0, buildWorkers:3, buildTime:40, unlocked:false, 	buildingwork:{},									addworker:{farmer:2},		cost:{wood:100, rock:75},					unlockRes:[],			unlockJob:["farmer"],	costratio:2.5, 		buildOnce:false,	tempCount:0,	addsText:["space for 2 farmers"],						statement:"One of the travelers brought with them fast-growing seeds, and to free up workers<br>from hunting duties you decided to try farming. Some walls and trellices seem to do the trick."},
	barn:	{name: "Barn",			count:0, buildWorkers:3, buildTime:40, unlocked:false,	buildingwork:{},		addstorage:{wood:100,rock:100,food:100}, 				cost:{wood:300,rock:100},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["100 food storage", "100 wood storage", "100 rock storage"],	statement:"You will need even more storage to stockpile resources for larger buildings. You can start by constructing simple barns."},
	lumberyard:{name: "Lumber Yard",count:0, buildWorkers:3, buildTime:50, unlocked:false,	buildingwork:{},		addstorage:{lumber:300}, 	addworker:{lumberworker:3},	cost:{wood:300, rock:50},					unlockRes:["lumber"],	unlockJob:["lumberworker"],costratio:2.5,		buildOnce:false,	tempCount:0,	addsText:["space for 3 lumber workers", "300 lumber storage"],	statement:"One of the newcomers was a carpenter. She is thankful for the simple shelter you have provided, but obviously wants to lead the<br>construction of better buildings.Though you only have fairly simple tools, many showing signs of wear, she insists on setting up a lumberyard."},
	workshop:{name:"Workshop",		count:0, buildWorkers:3, buildTime:60, unlocked:false,	buildingwork:{},		addstorage:{stone:200},		addworker:{mason:3},		cost:{lumber:200,rock:200},					unlockRes:["stone"],	unlockJob:["mason"],	costratio:2.5,		buildOnce:false,	tempCount:0,	addsText:["space for 3 masons", "200 stone storage"],	statement:"With access to rough-cut boards, several folk decide to contruct a workshop. For now the<br>space will be used to shape stone slabs for improved buildings, and perhaps later for stone tools."},
	hut:	{name: "Hut",			count:0, buildWorkers:3, buildTime:40, unlocked:false, 	buildingwork:{},									addworker:{freeworker:1},	cost:{lumber:200,stone:100},				unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	tempCount:0,	addsText:["space for 1 new settler"],					statement:"With boards from the lumberyard and cut stones, the carpenter plans to start building proper huts.<br>You plan to continue buildings shacks - you are trying to grow the town after all and still need to turn the occasional wanderer away for lack of space."},
	lab: 	{name: "Laboratory",	count:0, buildWorkers:4, buildTime:100,unlocked:false, 	buildingwork:{},									addworker:{researcher:1},	cost:{wood:100,lumber:300,stone:200},		unlockRes:["research"],	unlockJob:["researcher"],costratio:1.3,		buildOnce:false,	tempCount:0,	addsText:["space for 1 researcher"],					statement:"The Council Hall has been constructed. The first meeting will be held immediately."},
	mine:	{name: "Mineshaft",		count:0, buildWorkers:5, buildTime:60, unlocked:false,	buildingwork:{},		addstorage:{},				addworker:{},				cost:{lumber:200},							unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	tempCount:0,	addsText:["space for 2 miners"],						statement:"Adding a mineshaft will allow collection of ores."},
	warehouse:{name:"Warehouse",	count:0, buildWorkers:5, buildTime:50, unlocked:false,	buildingwork:{},		addstorage:{wood:50,rock:50,lumber:50,stone:50,cu_ore:50,brick:50,fe_ore:50,coal:50}, addworker:{},cost:{rock:100,lumber:500,stone:300},unlockRes:[],		unlockJob:[],			costratio:1.1,		buildOnce:false,	tempCount:0,	addsText:["50 wood storage","50 rock storage","50 lumber storage","50 stone storage","50 ore storage","50 brick storage"], statement:"More versitile than barns, your warehouses are designed to store many kinds of materials."},
	kiln:	{name: "Kiln",			count:0, buildWorkers:3, buildTime:30, unlocked:false,	buildingwork:{},		addstorage:{},				addworker:{kilnworker:1},	cost:{brick:200,stone:50},					unlockRes:["copper"],	unlockJob:["kilnworker"],costratio:1.1,		buildOnce:false,	tempCount:0,	addsText:["space for one kilnworker"], statement:"Kilns will let us smelt ore and perhaps do other things later."},
	//give kilns a drop-down menu for picking what to do - turn wood to charcoal, turn clay to brick, turn ore to metal - different recipe based on what is selected. keep track of number of kilns and kilnworkers but treat consumption/generation separately?
	councilhall:{name: "Town Hall", count:0, buildWorkers:10, buildTime:200,  unlocked:false, tempCount:0, 												cost:{wood:200, rock:200, lumber:400, stone:300}, 	unlockRes:[], 	unlockJob:[],			costratio:1,	buildOnce:true,	statement:"The Council Hall has been constructed. The first meeting will be held immediately."},
};
	function incrResBuildings(){//add passive resource production
		for(var x in Buildings){
			var make1 = true;
			var make2 = false;
			for(var y in Buildings[x]["buildingwork"]){
				var incr = GlobVar.factor*Buildings[x]["buildingwork"][y]*Buildings[x]["count"];
				if(Stuff[y]["stored"]+incr<0){
					make1 = false;
				}
				if(make1){
					if(Stuff[y]["stored"]<Stuff[y]["maxstored"] && incr>0){//need to account for store bonus - actually the way bonus is implemented I don't think that works...
						make2 = true;
					}
				}
			}
			if(make1 && make2){
				for(var incrKey in Buildings[x]["buildingwork"]){
					incr = GlobVar.factor*Buildings[x]["buildingwork"][y]*Buildings[x]["count"];
					var max  =  Stuff[incrKey]["maxstored"]*Stuff[incrKey]["storebonus"];
					if(Stuff[incrKey]["stored"]+incr>max){
						Stuff[incrKey]["stored"] = max;
					} else {
						Stuff[incrKey]["stored"]+=incr;
					}
					document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"].toFixed(1);
				}
			}
		}
	};

	function addBuildingButton(buildingName){ 
		var newBuild = document.createElement("div");
		newBuild.id = buildingName + "Build";
		newBuild.className = "buildingButton";
		var addsText = ""
		for (i=0;i<Buildings[buildingName]["addsText"].length;i++){
			addsText+=Buildings[buildingName]["addsText"][i];
			addsText+="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		}
		addsText = addsText.slice(0,-70);

		newBuild.innerHTML = "<div class='tooltiptext'><p>Requires ("+ Buildings[buildingName]["buildWorkers"] +") workers to build<br>Cost:&nbsp;<span id='"+ buildingName +"Costs'> </span><br><br>Adds: <span id='"+ buildingName +"Adds'>"+ addsText +"</span></p></div><div id='"+ buildingName +"progress' class='buildBar'><p class='buildText'>"+ Buildings[buildingName]["name"] +" [<span id='"+ buildingName +"'>0</span>]</p></div>";

		newBuild.addEventListener("click",addBuildingEvent);

		document.getElementById("pan2").insertBefore(newBuild, document.getElementById("buildBlank"));
	};

/* Ideas for stuff to add
	ranch:	{unlock:cattle}
	cabbin: {addworker:{free:3}} and adds children which consume less food but don't do any work
	market: {unlock:"gold"} sell food and stuff for gold in separate tab or as a rate  //tech add dock to increase commerce "You have built most of the stuctures that you and your council know how to build, but you remember many other wonderful things from you past lives in the Great City. You allow some settlers to study and draft plans for new types of buildings."
	fishery: //unlocked by dock tech
	
	market ideas - have traders come infrequently to buy certain resources, can get more to come as population grows or other things, eventually a steady trickle of certain resource for gold (no max on gold)
*/

	
//GLOBAL VARIABLES - go through and see which of these can be local variables - no need to have them all global probably
var GlobVar = {
	counter1 : 0,	//timer for removing "statement" messages
	ActiveRes : " ",	//to set active research
	buildBuild : [],	//if empty, not building, otherwise building whatever is in the array - can have multiple values of same building
	buildConstruct : [],//used to store completion of building with same index in buildBuild (0 to 100)
	buildWorkers : 0,	//number of free workers to currently used for construction
	time : 1,			//cheat time to construct a building
	knowledge : 0,		//the prestige variable
	JobBoxes : ["camp", "fields",],//keeps track of all the job boxes that have been created (or made visible)
	factor : 0.5, 		//to alter the speed of resrouces collection (and food consumption). Higher numer collects more resources per tick.
	statementLog : "",	//to store the log of the game **can make a function to update and call doc.logOut that take the new string as a parameter
	exploreCount : 1,	//number of free workers to go on an exploring trip
	exploreNum : 1,		//resources each worker will need on the trip
	exploreNumNext : 2, //next party will need
	Token : [],
	exploring : false,	//is there an active exploring party?
	exploreBar : 0,		//progress of the exploring party
	exploreStuff : {food:36}, //round stuff when deciding to use it
	cheating : false,
	degrade : ["woodcutter","lumberworker"], //which workers lose effectiveness over time (can reset to other)
	pop : 1, 			//total population to start - used with degrade
	name : "",			//name player gives to the settlement
}
//

//elements to litsen to
window.onload = function () {//add event listeners after DOM has laoded or you will get null instead of element

	document.body.addEventListener("transitionend", updateTransition);//ends the white flash when food runs out

	var closeStory = document.querySelector(".closebtn");
	closeStory.addEventListener("click", function(){closeStory.parentElement.style.display="none";populate();});

	var cheat = document.getElementById("title");
	cheat.addEventListener("click",testFunc);

	var setButtons = document.querySelectorAll(".butt");
	for (var i=0;i<setButtons.length;i++){
		setButtons[i].addEventListener("click",panelEvent);
	}


	//add listeners for moving workers' jobs
	jobIds = document.querySelectorAll(".userAdd0");

	for(let i=0;i<jobIds.length;i++){
		jobIds[i].addEventListener("click",moveworkerEvent);
		jobIds[i].parentElement.getElementsByClassName("userRemove0")[0].addEventListener("click",removeworkerEvent);
		jobIds[i].oncontextmenu = function() {
  			moveworker(jobIds[i].parentElement.id.slice(0,-3),-1);
			return false;
		}
		jobIds[i].parentElement.getElementsByClassName("userRemove0")[0].oncontextmenu = function() {
  			removeworker(jobIds[i].parentElement.id.slice(0,-3),-1);
			return false;
		}
	}


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
	document.getElementById("buildCounc").addEventListener("click", councilListen);

	var councilMessages = document.querySelectorAll(".councilMessage");
	for (i=0;i<councilMessages.lengh;i++){
		councilMessages[i].addEventListener("click",CouncilMessageEvent);
	}

	if(GlobVar.Token.length===0){
		for (i=0;i<100;i++){
			GlobVar.Token[i]=true;
		}
	}

	document.getElementById("save").addEventListener("click",saveGame);
	document.getElementById("load").addEventListener("click",loadGame);
	document.getElementById("export").addEventListener("click",exportGame);
	document.getElementById("import").addEventListener("click",openImportWindow);
	document.getElementById("closeExport").addEventListener("click",closeExport);
	document.getElementById("closeImport").addEventListener("click",closeImport);
}

function populate(){
	logStatement("You have built a shack and gathered some supplies. Now your attention turns to bigger plans.");	
	loadGame();
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

	moveworker(e.currentTarget.parentElement.id.slice(0,-3),num);

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
	if(e.button===2){
		num = -1;
	}

	removeworker(e.currentTarget.parentElement.id.slice(0,-3),num);
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
	tempNum = select.slice(-1);
	if(document.getElementById("butt"+tempNum).className === "buttAttn"){
		document.getElementById("butt"+tempNum).className = "butt";
	}
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
	var txtNotEnough = " ";


	//enough free worekers to build?    
	if(Buildings[buildkey]["buildWorkers"]>Jobs["freeworker"]["workers"]){
		canbuild = false;
		txtNotEnough+= "free workers at camp,&nbsp"
	}

	//can we build it?
	for(var key in Buildings[buildkey]["cost"]){
		//should make actualcost a method in Buildings - Buildings.actualcost("buildkey")? the tempcount stores how many are being built so that cost is updated correctly
		var actualcost = Math.round(Buildings[buildkey]["cost"][key]*Math.pow(Buildings[buildkey]["costratio"],(Buildings[buildkey]["count"]+Buildings[buildkey]["tempCount"])));

		if(actualcost>Stuff[key]["stored"]){
			canbuild = false;
			txtNotEnough+=(key+",&nbsp");
		}	
	}
	txtNotEnough = txtNotEnough.slice(0,-6);//remove the comma and space after the last entry


	//yes we can!
	if(canbuild){
		if(buildkey==="councilhall"){
			//remove event listener, hopefully named it correctly
			document.getElementById("buildCounc").removeEventListener("click",councilListen);
			
		}
		Buildings[buildkey]["tempCount"]++;
		//set everything up for construction function
		GlobVar.buildBuild.push(buildkey) ; //this will cause buildUp() to start running true in the game loop  
		GlobVar.buildConstruct.push(0);
		GlobVar.buildWorkers +=  Buildings[buildkey]["buildWorkers"];
		Jobs.freeworker.workers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;

 		costTxt = " ";
		//pay for the building
		for(var keyy in Buildings[buildkey]["cost"]){

			actualcost = Math.round(Buildings[buildkey]["cost"][keyy]*Math.pow(Buildings[buildkey]["costratio"],Buildings[buildkey]["count"]+Buildings[buildkey]["tempCount"]-1));   //consider making function actualcost(buildkey,key) which returns value calculated value

			Stuff[keyy]["stored"]-=actualcost;
			document.getElementById(keyy).innerHTML = Stuff[keyy]["stored"].toFixed(1);
		
			costTxt += Math.round(actualcost*Buildings[buildkey]["costratio"]) + "&nbsp" + keyy + "<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
		}
		costTxt = costTxt.slice(0,-56);


		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey+"Costs").innerHTML = costTxt;	 //may be better way to do this but don't want to try to update cost that doesn't exist
		}



		//no we can't :(
	}  else {

		document.getElementById("statement").innerHTML = "Not enough "+ txtNotEnough +" to build " + Buildings[buildkey]["name"]; GlobVar.counter1 = 40;
	}
	return(canbuild);
}

function buildUp(){
	for(i=0;i<GlobVar.buildBuild.length;i++){
		if (GlobVar.buildConstruct[i]<100){
			GlobVar.buildConstruct[i]+=(100/Buildings[GlobVar.buildBuild[i]]["buildTime"]*GlobVar.time); //need to loop through buildkeys in array 1
			if(GlobVar.buildConstruct[i]>=100){
				GlobVar.buildConstruct[i] = 100;//so the bar doesn't go over if there is a rounding error
			}
			document.getElementById(GlobVar.buildBuild[i] + "progress").style.width = GlobVar.buildConstruct[i].toString() + "%"; //add html + css for the progress bars
		} else {
			finishBuilding(GlobVar.buildBuild[i],i);//also send the index so that if there are more than one of a building it knows which to remove
		}
	}
}

function finishBuilding(buildkey,index){
	//re-direct to special building calls
	if(buildkey == "councilhall"){
		Buildings.councilhall.count++;
		finishCouncil(index);
	} else {


		//add storage space
		for(var keyyy in Buildings[buildkey]["addstorage"]){
			Stuff[keyyy]["maxstored"]+=Buildings[buildkey]["addstorage"][keyyy];
			if(Stuff[keyyy]["unlocked"]){
				document.getElementById(keyyy + "Max").innerHTML = Stuff[keyyy]["maxstored"];
			}
		}
		//add worker space (and free workers)
		for(var key4 in Buildings[buildkey]["addworker"]){
			if(key4 == "freeworker"){
				Jobs.freeworker.workers+=Buildings[buildkey]["addworker"]["freeworker"];
				Jobs.freeworker.maxworkers+=Buildings[buildkey]["addworker"]["freeworker"];
				document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
				document.getElementById("freeworkersMax").innerHTML = Jobs.freeworker.maxworkers;
			} else {
			Jobs[key4]["maxworkers"]+=Buildings[buildkey]["addworker"][key4];
			console.log("key4: "+key4);
			document.getElementById(key4 + "sMax").innerHTML = Jobs[key4]["maxworkers"];
			}
		}

		Buildings[buildkey]["tempCount"]--;
		Buildings[buildkey]["count"]++;
		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey).innerHTML = Buildings[buildkey]["count"];
		}

		//and reset freeworkers, construction bar, and buildBuild to "no"
		Jobs.freeworker.workers += Buildings[buildkey]["buildWorkers"];


		GlobVar.buildWorkers -= Buildings[buildkey]["buildWorkers"];
		document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
		document.getElementById(buildkey + "progress").style.width = "0%";
		GlobVar.buildBuild.splice(index,1);
		GlobVar.buildConstruct.splice(index,1);
	}
}
/////////////////////////////////////////////////////////////////////////////unlocking buildings and the resources those buildings start with////////////////////////////////////////////////////////////////////////////////// 
function unlock(unlockkey){

	if(!Buildings[unlockkey]["unlocked"]){
		
		addBuildingButton(unlockkey);
		Buildings[unlockkey]["unlocked"] = 1;
		
		//adds newly unlocked resources
		for(i=0;i<Buildings[unlockkey]["unlockRes"].length;i++){

			var tempStuff = Buildings[unlockkey]["unlockRes"][i];
			if(!Stuff[tempStuff]["unlocked"]){
				Stuff[tempStuff]["unlocked"] = true;

				addResourceLine(tempStuff);
			}
		}

		//add the new jobs that the building unlocks
		for(i=0;i<Buildings[unlockkey]["unlockJob"].length;i++){
			newJob = Buildings[unlockkey]["unlockJob"][i];
			newBox = Jobs[newJob]["box"];


			addJobElement(newJob);

			
			Jobs[newJob]["unlocked"]=true;
			document.getElementById(newJob+"s").innerHTML = Jobs[newJob]["workers"];
			document.getElementById(newJob+"sMax").innerHTML = Jobs[newJob]["maxworkers"];

		}

		var costTxt = " ";

		for(var key in Buildings[unlockkey]["cost"]){//make this output the same as the update cost output from addBuilding()
			costTxt += Buildings[unlockkey]["cost"][key] + "&nbsp" + key + ",&nbsp";
		}

		costTxt = costTxt.slice(0,-6);

		document.getElementById(unlockkey+"Costs").innerHTML = costTxt;

		logStatement(Buildings[unlockkey]["statement"]);
	}
}

////////////////////////////////////////////////////////////////////////////research////////////////////////////////////////////////////////////////////////////////////
function SwapActiveRes(x){
	if(GlobVar.ActiveRes!==" "){
		document.getElementById(GlobVar.ActiveRes).className = "researchButton";
	}
	GlobVar.ActiveRes = x;
	document.getElementById(x).className = "researchButtonSelected";
	document.getElementById("research").innerHTML = Research[x]["completion"];
	document.getElementById("researchMax").innerHTML = Research[x]["totalRes"];

	//change the tooltip for researchers
	consumeStr = "";
	for(var i in Research[x]["resCost"]){
		consumeStr += Research[x]["resCost"][i]*5*GlobVar.factor + " " + i + " / sec<br>";
	}
	document.getElementById("researchersMake").innerHTML = Jobs.researcher.make.research*Jobs.researcher.workbonus*5*GlobVar.factor+" research / sec<br>and consumes:<br>"+consumeStr;
}

var Research = {
	FarmEquip:	{name:"Farm Equipment",		resCost:{wood:2,lumber:1}, 		totalRes:1000, 	completion:0, unlocked:true,  done:false, reward:"Improves farmers' food output by 50%", statement:"The farmers want to design a wooden plow which should improve crop output significantly."},
	StoneAxe:	{name:"Stone Axes",			resCost:{lumber:1,stone:2}, 	totalRes:1500, 	completion:0, unlocked:true,  done:false, reward:"Resets woodcutter and lumberworker output to 2.5/sec", statement:"You notice that the axes that most of your comrads have brought with them, and the few saws and other metal tools, have been dulling and deteriorating<br>to the point of uselessness. It seems that the best course of action is to develope stone axes for felling trees and shaping them into boards"},
	StoneChisel:{name:"Stone Chisels",		resCost:{lumber:.5,rock:.5,stone:1},totalRes:1000,completion:0,unlocked:false,done:false,reward:"Increases output of both masons and rockcutters by 30%", statement:"The most proficient mason, though he was new to cutting rock when he began,<br>thinks he can improve stone chisel design to increase output of both rock and stone."},
	FindOre:	{name:"Ore Finding",		resCost:{food:1,lumber:1},		totalRes:500, 	completion:0, unlocked:false, done:false, reward:"Some workers learn how to look for potential mining sites"},
	Metalwork:	{name:"Metalworking",		resCost:{metal:1},				totalRes:3500, 	completion:0, unlocked:false, done:false},
	Roads:		{name:"Roadbuilding",		resCost:{wood:1,stone:3},		totalRes:5000,	completion:0, unlocked:false, done:false},
	Barns1:		{name:"Improve Barns",		resCost:{wood:1,lumber:1,rock:1},totalRes:2000,	completion:0, unlocked:false, done:false, reward:"Update plans for barns to increase storage by 20%. Improves current barns and future barns will now require lumber."},
	Smelting:	{name:"Smelting",			resCost:{brick:1,lumber:1,stone:1,wood:1},totalRes:2700,completion:0, unlocked:false, done:false, reward:"Figure out a way to smelt metal ore into usable metal."},
	Brickmaking:{name:"Brickmaking",		resCost:{wood:1,clay:1},		totalRes:1000,	completion:0, unlocked:false, done:false, reward:"Learn how to fire the clay into bricks over wood fires."},
};
	function addResearchButton(research){
		Research[research]["unlocked"] = true;
		var div = document.createElement("div");
		div.className = "researchButton"
		div.id = research;
		div.addEventListener("click",SwapResearchEvent);

		var uses = "";
		for(var i in Research[research]["resCost"]){
			uses += Research[research]["resCost"][i] + " " + i;
			uses += " and ";
		}
		uses = uses.slice(0,-5);
		div.innerHTML = "<div id ='"+ research + "resBar' class='resBar'> <p class='resText'>"+Research[research]["name"]+"</p></div><div class='tooltiptext'><br>Takes "+Research[research]["totalRes"]+" research<br>Uses "+uses+" per research<br><br>"+Research[research]["reward"]+"<br><br></div>";
		document.getElementById("pan3").appendChild(div);
	}


function researchIncr(resUp){

	if(!Research[resUp]["done"]){

		var make = true;
		
		for(var resKey in Research[resUp]["resCost"]){

			var incr = Research[resUp]["resCost"][resKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"];

			if(Stuff[resKey]["stored"]-incr<0 || !Stuff[resKey]["unlocked"]){//need to check all the required resources before consuming any
				make = false;
			}
		}

		if(make) {
			for(var incrKey in Research[resUp]["resCost"]){

				Stuff[incrKey]["stored"]-= Research[resUp]["resCost"][incrKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"];//dont need to look up Jobs[]*Jobs[] every time this loops
				document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"];
			}
			Research[resUp]["completion"]+= GlobVar.time*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]; //can add research to efficiency which increase researcher output% but doesn't increase materials cost - need to add a new resEfficiency variable

			document.getElementById(resUp + "resBar").style.width = Research[resUp]["completion"]/Research[resUp]["totalRes"]*100 + "%";
			if(Research[resUp]["completion"]>=Research[resUp]["totalRes"]){
				Research[resUp]["completion"]=Research[resUp]["totalRes"];
				Research[resUp]["done"] = true;

				logStatement("Research complete: " + Research[resUp]["reward"]);

				document.getElementById(resUp).style.display = "none";

				doBonus(resUp);
				GlobVar.ActiveRes = " ";
			}
			document.getElementById("research").innerHTML = Research[resUp]["completion"];
		}
	}
}

//what to do when research is completed
//the 'finished' statements get handled in the researchIncr() function so don't have new statements here
function doBonus(resUp){
	switch (resUp) {
	    case "FarmEquip":			
	        Jobs.farmer.workbonus = Jobs.farmer.workbonus*1.5;

			makeStr = "";
			consumeStr = "";
		
			for (var i in Jobs.farmer.make){
				if(Jobs["farmer"]["make"][i]>0){
					makeStr += Jobs["farmer"]["make"][i]*Jobs.farmer.workbonus*GlobVar.factor*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["farmer"]["make"][i]*Jobs.farmer.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);

			document.getElementById("farmersMake").innerHTML = makeStr+consumeStr;
			//some action to close the button but this below isn't doing anything
	        break;
	    case "StoneAxe":
	        Jobs.woodcutter.workbonus = 1;
			Jobs.lumberworker.workbonus = 1;
			Jobs.woodcutter.make = {wood:1};
			Jobs.lumberworker.make = {lumber:1,wood:-.5};

			//update the tooltips to show new production values
			makeStr = "";
			consumeStr = "";
		
			for (var i in Jobs.woodcutter.make){
				if(Jobs["woodcutter"]["make"][i]>0){
					makeStr += Jobs["woodcutter"]["make"][i]*Jobs.woodcutter.workbonus*GlobVar.factor*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["woodcutter"]["make"][i]*Jobs.woodcutter.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);

			document.getElementById("woodcuttersMake").innerHTML = makeStr+consumeStr;

			//make this show up in town hall instaed of as it does here? need to add a 'add town hall message' sort of function
			stoneStr = "One of the newest wanderers to join your camp used to supervise mining operations for the Great City. He offers to teach the group how to find ore and smelt it."
			GlobVar.statementLog = stoneStr + "<br><br>" + GlobVar.statementLog;
			document.getElementById("logOut").innerHTML = GlobVar.statementLog;//some statements are logged and displayed in the town hall annoucement instead of the normal statement line
			//sets the council message
			document.getElementById("council1").textContent = stoneStr;//need the <i>s?
			//give the town hall button a red color
			alertPanel("pan4");
			addResearchButton("FindOre");
			addResearchButton("Smelting");

	        break;
		case "StoneChisel":
			Jobs.rockcutter.workbonus*=1.3;
			Jobs.mason.workbonus*=1.3;

			var makeStr = "";
			var consumeStr = "";
		
			for (var i in Jobs.rockcutter.make){
				if(Jobs["rockcutter"]["make"][i]>0){
					makeStr += Jobs["rockcutter"]["make"][i]*Jobs.rockcutter.workbonus*GlobVar.factor*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["rockcutter"]["make"][i]*Jobs.rockcutter.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);

			document.getElementById("rockcuttersMake").innerHTML = makeStr+consumeStr;

			makeStr = "";
			consumeStr = "";
		
			for (var i in Jobs.mason.make){
				if(Jobs["mason"]["make"][i]>0){
					makeStr += Jobs["mason"]["make"][i]*GlobVar.factor*Jobs.mason.workbonus*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["mason"]["make"][i]*Jobs.mason.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);

			document.getElementById("masonsMake").innerHTML = makeStr+consumeStr;

			break;
		case "FindOre":
			//add an explore button to (mostly unsuccessfully) look for mining sites
			var div = document.createElement("div");
			div.id = "exploreButton";
			div.className = "exploreButton";
			div.innerHTML = "<div class='tooltiptext' id='exploreTip'><p>Requires (<span id ='exploreWorkers'>1</span>) workers for the exploration party<br>The trip will need <span id='exploreCosts'>30 food</span></p></div><div id='exploreBar' class='buildBar'><p class='buildText' style='padding-top:15px'>Send a party to explore and<br> map the surrounding area</p></div>";
			div.addEventListener("click",exploreGo);
			document.getElementById("pan4").appendChild(div);

			alertPanel("pan4");
			break;
	    case "Smelting":
			unlock("kiln");
			//need to add a newResearchButton() function;
	        break;
	    case "Metalwork":
	       	break;
	    case "Barns1":
			Buildings.barn.cost.lumber = 50;

			addsStr = "";
			for(var i in Buildings.barn.addstorage){
				Stuff[i]["maxstored"] += Buildings["barn"]["addstorage"][i]*.2*Buildings.barn.count;
				Buildings["barn"]["addstorage"][i] *=1.2;
				document.getElementById(i+"Max").innerHTML = Stuff[i]["maxstored"];
				addsStr += Buildings["barn"]["addstorage"][i]+ " " + i+ " storage";
				addsStr +="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
			}
			addsStr = addsText.slice(0,-70);
			document.getElementById("barnAdds").innerHTML = addsStr;

			costStr = "";
			for(var i in Buildings.barn.cost){
				costStr += Buildings["barn"]["cost"][i] + " " + i + "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			//update tooltip for barn
			costStr = costStr.slice(0,-70);
			document.getElementById("barnCosts").innerHTML = costStr;
			
	        break;
	    case "Brickmaking":
			addJobElement("brickmaker");
			addResourceLine("brick");
			Buildings.workshop.addworker.brickmaker = 2;
	        break;
	    case 6:
	        break;
	}
}


////////////////////////////////////////////////////////////////////////////miscilanious functions working on////////////////////////////////////////////////////////////////////////////////////
//makes the panel select button turn red if it is not active
function alertPanel(pan){
	if(mark1!==pan&&mark2!==pan){
		document.getElementById("butt"+pan.slice(-1)).className = "buttAttn";
	}
}

function councilListen(){
	addBuilding("councilhall")
}
function finishCouncil(index){//some of this can be run in finishBuilding() and then break out right after calling finishCouncil() for parts that are different
	Buildings.councilhall.unlocked = true;
	document.getElementById("buildCounc").style.display = "none";
	decreeStr = "Council decree at Town Hall";
	document.getElementById("statement").innerHTML = decreeStr; GlobVar.counter1 = 0;

	document.getElementById("butt3").style.display = "inline";	
	alertPanel("pan3");
	unlock("lab");
	document.getElementById("council1").style.visibility = "visible";
	Jobs.freeworker.workers += Buildings.councilhall.buildWorkers;
	GlobVar.buildWorkers -= Buildings.councilhall.buildWorkers;
	document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
	GlobVar.buildBuild.splice(index,1);
	GlobVar.buildConstruct.splice(index,1);
}
function isEmpty(object) {
	for(var i in object) {
		return true;
	}
	return false;
}
function updateTransition(){

	document.body.className = "normal";
}
//go through and put this in or just use from now on
function logStatement(string){
	GlobVar.statementLog = string + "<br><br>" + GlobVar.statementLog;
	document.getElementById("logOut").innerHTML = GlobVar.statementLog;
	document.getElementById("statement").className = "orange";
	document.getElementById("statement").innerHTML = string; GlobVar.counter1 = 0;
}

///////////////////////////////////////////////////////////////////////////exploring the land////////////////////////////////////////////////////////////////////////////////////
function exploreGo(){
	if(GlobVar.exploring){
		document.getElementById("statement").innerHTML = "We should wait until the last scouting party returns";
	} else {
		var explorers = Math.floor(Math.log(GlobVar.exploreCount)*2)+1;//how many people will go out exploring
		var explorersNext = Math.floor(Math.log(GlobVar.exploreCount+1)*2)+1
		GlobVar.exploreNum = (explorers)*Math.pow(1.05,GlobVar.exploreCount-1);//the cost for this expedition (larger with distance and #of people)
		GlobVar.exploreNumNext = (explorers+1)*Math.pow(1.05,GlobVar.exploreCount);//cost for next expedition

		//need certain number of free workers and food for them to carry
		var go = true;	
		noGoStr = "Not enough ";
		if(Jobs.freeworker.workers<explorers){
			noGoStr += "free workers, "
			go = false;
		}
		for(var i in GlobVar.exploreStuff){
			if(Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNum) > Stuff[i]["stored"]){
				go = false;
				noGoStr += i+", ";
			}
		}
		noGoStr = noGoStr.slice(0,-2);
		noGoStr += " for expedition"
 
		if(go){
			tooltipStr = "";
			for (var i in GlobVar.exploreStuff){
				Stuff[i]["stored"]-=Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNum);
				tooltipStr += Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNumNext) + " " + Stuff[i]["name"] + ",&nbsp;";
				//need to add in an update for the tooltip on sending an explore party - don't feel like it right now
			}
			tooltipStr = tooltipStr.slice(0,-7);
			document.getElementById("exploreWorkers").innerHTML = explorersNext;
			document.getElementById("exploreCosts").innerHTML = tooltipStr;
			Jobs.freeworker.workers -= explorers;
			document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
			GlobVar.exploreBar = 0;
				
			GlobVar.exploring = true;
		} else {
			document.getElementById("statement").innerHTML = noGoStr;
		}
	}
}
function exploreUp(){
	GlobVar.exploreBar += GlobVar.time*20/(GlobVar.exploreNum);
	if(GlobVar.exploreBar>=100){
		GlobVar.exploreBar = 0;
		exploreEnd();
	}
	document.getElementById("exploreBar").style.width = GlobVar.exploreBar+"%";
}
function exploreEnd(){
	Jobs.freeworker.workers += Math.floor(Math.log(GlobVar.exploreCount)*2)+1;
	document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
	GlobVar.exploreCount++;
	if(GlobVar.exploreCount===4){
		logStatement("The exploring party discovered a potential mining site. You can build a shaft to extract ore");
		addBuildingButton("mine");
		addJobElement("miner");
	} else if(GlobVar.exploreCount===7) {
		GlobVar.Token[10]=false;
		document.getElementById("mineBuild").className = "buildingButton";
		document.getElementById("mineBuild").addEventListener("click",addBuildingEvent);
		document.getElementById("statement").innerHTML = "The exploring party discovered another potential mining site. You can build a shaft to extract ore"; GlobVar.counter1=0;
		Buildings.mine.addworker.miner = 1;
	} else if(GlobVar.exploreCount===10){
		logStatement("The exploring party found a site by the river to extract clay.");
		addResourceLine("clay");
		addJobElement("clayworker");
		addResearchButton("Brickmaking");
		
	} else if(GlobVar.exploreCount===13){
		logStatement("All the the immediate area around the base camp has been mapped.<br>The next expeditions will need to venture futher along the valley or up the foothills.");
	} else if(GlobVar.exploreCount===15) {
		logStatement("The last group of explorers barely scared off a wild bearling.<br>They advise that all future exploring missions be armed.");
		//need to add a place and mechanic for making and storing weapons (need a few expensive items - should have a making... bar in the armory and only whole numbered items)
		//spears should be in the Stuff object by the resource line should appear somewhere else (different tab or below a line break in resource pannel)
		//also need a way to return some of the special items (and lose some of them each trip). for now just lose all of them
		GlobVar.exploreStuff.spear = 1;
		tooltipStr = "";
		for (var i in GlobVar.exploreStuff){
			tooltipStr += Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNumNext) + " " + Stuff[i]["name"] + ",&nbsp;";
			//need to add in an update for the tooltip on sending an explore party - don't feel like it right now
		}
		tooltipStr = tooltipStr.slice(0,-7);
		document.getElementById("exploreCosts").innerHTML = tooltipStr;
	} else {
		document.getElementById("statement").innerHTML = "Your explorers map some areas but find nothing of use"; GlobVar.counter1=40;
	}
	//add in an ungrade or building with a small penalty to auto-explore if you have enough stuff?
	GlobVar.exploring = false;
}

function Cheat(){
	GlobVar.cheating = true;
	GlobVar.time = 100;
}
function UnCheat(){
	GlobVar.cheating = false;
	GlobVar.time = 1;
}
////////////////////////////////////////////////////////////////game loop////////////////////////////////////////////////////////////////////////////////////////

function run(){ 

	//clear the message to player after ~some seconds
	if(document.getElementById("statement").innerHTML!=="&nbsp;"){
		GlobVar.counter1++;
		if( GlobVar.counter1<65 && (document.getElementById("statement").className === "statementOff"||document.getElementById("statement").className === "orange")){
			document.getElementById("statement").className = "statementOn";
		}
		if(GlobVar.counter1===65){
			document.getElementById("statement").className = "statementOff";
		}
		if(GlobVar.counter1>80) {
			document.getElementById("statement").innerHTML = "&nbsp;";
			GlobVar.counter1 = 0;
		}
	}



//check for events met to unlock new content

	//win the game for now
	if(Stuff.copper.stored>5&&GlobVar.Token[99]&&Buildings.kiln.count>1){
		GlobVar.Token[99]=false;
		alert("That's it for now - check back later for more content. Thanks for playing!");
	}

	if(Buildings.shack.count==2&& GlobVar.Token[1]){
		logStatement("Eventually another refugee wanders nearby, interested in what you are doing, and you convince<br>him to join you in your work. More will surely come and stay if you have space to house them.");
		GlobVar.Token[1] = false;
	}
	//add forest box and woodcutter job
	if(Buildings.shack.count==3&& GlobVar.Token[2]){
		
		Stuff.wood.unlocked=true;

		addJobBox("forest");
		addJobElement("woodcutter");
		logStatement("Your new companions also carry axes, sharp for the time being. You suggest <br>that you head back into the forest and cut more wood to continue building.");
		GlobVar.Token[2] = false;
	}
	//statement - buildings cost more as you build them
	if(Buildings.shack.count==4&& GlobVar.Token[3]){
		logStatement("As you build more buildings they will require more resources. <br>Why? Because that's what happens in this genre.");
		GlobVar.Token[3] = false;
	}
	//change name
	if(Buildings.shack.count===5&& GlobVar.Token[0]){
		GlobVar.Token[0]=false;
		logStatement("The wilderness is beginning to feel less lonely.");
		GlobVar.name = prompt("What would you like to name your settlement?");
		document.getElementById("title").innerHTML = "Camp " + GlobVar.name;
	}

	//adds hillside box and rockcutter job
	if(Buildings.shack.count===6&& GlobVar.Token[4]){

		addJobBox("hillside");
		addJobElement("rockcutter");

		//change to addResourceLine() call
		addResourceLine("rock");
		Stuff.rock.unlocked=true;
		/////
		logStatement("While wandering into the hills looking for the nightly firewood, one of the workers finds a<br>small rocky clearing that can be turned into a quarry. The rock may be useful for new structures.");
		GlobVar.Token[4] = false;
	}
	//unlocks shed (Woodshed)
	if(Buildings.shack.count===7){
		unlock("shed");
	}
	if(Buildings.shack.count===12&&GlobVar.Token[11]){
		GlobVar.Token[11]=false;
		logStatement("As the camp grows and residents becomes more familiar with eachother, some of them begin to discuss their past lives in the Great City.<br>Most of the refugees did specialized work and are still learning the basic struggle for survival, but they long to rebuild at least part of the society they once knew.");
	}
	//unlocks expandQ (Expand Quarry)
	if(Buildings.shed.count>0 && Stuff.rock.stored>30) {
		unlock("expandQ");
	}
	//unlocks farm
	if(Buildings.expandQ.count>0){
		unlock("farm");
	}
	//unlocks barn
	if(Buildings.shed.count>2 && Buildings.expandQ.count>1){
		unlock("barn");
	}
	//unlocks lumberyard
	if(Buildings.shack.count>8 && Buildings.shed.count>3 && Buildings.barn.count>0){
		unlock("lumberyard");
	}
	//unlocks workshop
	if(Buildings.shack.count>8 && Buildings.expandQ.count>2 && Buildings.lumberyard.count>0){
		unlock("workshop");
	}
	//unlocks hut
	if(!Buildings.hut.unlocked && Buildings.lumberyard.count>0 && Buildings.workshop.count>0){
		unlock("hut");
	}
	//makes panel/tabs buttons visible (inline)
	if(Buildings.shack.count + Buildings.hut.count>=20 && GlobVar.Token[5]){
		logStatement("Though it may be premature, you have high hopes for the future growth of your little shanty town and decide to give<br>the settlement a proper name. You also decide it is time to more formally organize, and form a council to govern and make decisions.");
		document.getElementById("title").innerHTML = "Hamlet of " + GlobVar.name;
		GlobVar.Token[5] = false;

		//give the town hall button a red color
		alertPanel("pan4");

		document.getElementById("butt1").style.display = "inline";
		document.getElementById("butt2").style.display = "inline";
		document.getElementById("butt4").style.display = "inline";
	}
	//increase rock and stone production 
	if(Research.StoneAxe.completion>350&&GlobVar.Token[6]){
		GlobVar.Token[6]=false;
		logStatement("Stone production is low. Maybe better mason tools would help.");
		addResearchButton("StoneChisel");
		alertPanel("pan3");
	}
	//remove the first mine as useless
	if(Buildings.mine.tempCount===1&&GlobVar.Token[7]){
		GlobVar.Token[7] = false;
		if(GlobVar.Token[10]){
			document.getElementById("mineBuild").removeEventListener("click",addBuildingEvent);
		}
	}
	if(Buildings.mine.count===1&&GlobVar.Token[8]){
		GlobVar.Token[8]=false;
		if(GlobVar.Token[10]){
			logStatement("The first mine yielded no usable resources. Another site must be located.")
			document.getElementById("mineBuild").className = "deadBuilding";
		} else {
			logStatement("The first mine yielded no usable resources. You can try building a mineshaft at the second location.")
		}
	}
	if(Buildings.mine.count===2&&GlobVar.Token[9]){
		GlobVar.Token[9]=false;
		logStatement("This mine produces copper ore which can be smelted into copper.")
		addResourceLine("cu_ore");
	}
	//unlocks warehouse
	if(Stuff.clay.unlocked&&Stuff.cu_ore.stored>10&&Stuff.clay.stored>10){
		unlock("warehouse");
	}

	//adjusts the woodworker and lumberworker output as population grows to account for deteriorating axes
	if(GlobVar.pop!==Jobs.freeworker.maxworkers&&document.getElementById("forest")){
		GlobVar.pop = Jobs.freeworker.maxworkers;
		var bonus = 0;

		for(var i=1;i<=GlobVar.pop;i++){
			bonus+= Math.pow(0.92,GlobVar.pop-i)/GlobVar.pop;
		}

		for(var i=0; i<GlobVar.degrade.length; i++){
			Jobs[GlobVar.degrade[i]]["workbonus"] = bonus;
		
			var jobName = GlobVar.degrade[i];
			var makeStr = "";
			var consumeStr ="";

			for (var i in Jobs[jobName]["make"]){
				if(Jobs[jobName]["make"][i]>0){
					makeStr += (Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += (Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*-5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);
			document.getElementById(jobName + "sMake").innerHTML = makeStr + consumeStr;
		}
	}

//phase 1 done? - phase 2 unlocks from research - more phase 3 unlocks below?//
//******************************************


	/////////continue the construction of new buildings
	if (GlobVar.buildBuild.length>0){
		buildUp()
	}

	//////increment research///////////////////
	if(GlobVar.ActiveRes != " " && !Research[GlobVar.ActiveRes]["done"]){
		researchIncr(GlobVar.ActiveRes);
	}

	//continue exploring
	if(GlobVar.exploring){
		exploreUp();
	}

	//////increment resources///////////////////
	incrRes();
	incrResBuildings();
	if(GlobVar.cheating){
		for(var i in Stuff){
			if(Stuff[i]["unlocked"]){
				Stuff[i]["stored"]=Stuff[i]["maxstored"];
			}
		}
	}

	///////consume food/////////////////////////
	document.getElementById("food").innerHTML = Stuff["food"]["stored"].toFixed(1);
	Stuff.food.stored=(Stuff.food.stored*10-(Jobs.freeworker.maxworkers*6*GlobVar.factor))/10;
	
	//panic if there is not enough food
	if(Stuff.food.stored<1){

		document.body.className = "alert2"; //gets set back to class="normal" by a transition listener to make the flash effect

		document.getElementById("statement").innerHTML = "In a food-shortage panic all available workers take to hunting";
		GlobVar.counter1=40;
	
		var tempFood = 0; 

		for(var i in Jobs){
			
			if(Jobs[i]["unlocked"] && i!=="farmer"){

				tempFood+=Jobs[i]["workers"];
				Jobs[i]["workers"] = 0;
				console.log("trying to set element #"+i+"s to "+ Jobs[i]["workers"]);
				document.getElementById(i + "s").innerHTML = Jobs[i]["workers"];
			}
		}
		Jobs.hunter.workers = tempFood;
		Stuff.food.stored = Stuff.food.maxstored/3;
		document.getElementById("hunters").innerHTML = Jobs.hunter.workers;

	} 





} setInterval(run,200);


//////////////////////////////////////////////////////////end of game loop//////////////////////////////////////////////////////





//button to test a function
function testFunc(){
	for(var x in Stuff){
    
		Stuff[x]["stored"] = Stuff[x]["maxstored"];
	
	}

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
		data.set("Jobs", Jobs);
		data.set("Research", Research);
		data.set("GlobVar", GlobVar);
	}
	else {
		alert('Too bad, no localStorage for us');
	}
}

function exportGame(){
	document.getElementById("exportWindow").className = "exportWindowOn";
	var exportStorage = {X_Stuff:Stuff,X_Buildings:Buildings,X_Jobs:Jobs,X_Research:Research,X_GlobVar:GlobVar};
	document.getElementById("exportStr").innerHTML = JSON.stringify(exportStorage);
	document.getElementById("exportStr").select();
}
function closeExport(){
	document.getElementById("exportWindow").className = "exportWindowOff";
}
function openImportWindow(){
	document.getElementById("importWindow").className = "exportWindowOn";
}
function importGame(){
	var importStorage = document.getElementById("importStr").value;
	Stuff = importStorage.X_Stuff;
	Buildings = importStorage.X_Buildings;
	Jobs = importStorage.X_Jobs;
	Research = importStorage.X_Research;
	GlobVar = importStorage.X_GlobVar;
	loadGame();
}
function closeImport(){
	importGame();
	document.getElementById("importWindow").className = "exportWindowOff";
}

function loadGame(){//oh this is going to be fun 
	console.log("trying tp load...");
	if (storageAvailable("localStorage") && localStorage.getItem("GlobVar") !== null && localStorage.getItem("GlobVar")[0]==="{"){
		//need to check whether these things exist?
		Stuff = data.get("Stuff");
		Buildings = data.get("Buildings");
		Jobs = data.get("Jobs");
		GlobVar = data.get("GlobVar");
		Research = data.get("Research");
		console.log("got the objects");

		//and oh gee, how do I even start this
		//update to the stored values of all resources, maxes, buildings, costs; and delete anything that isn't unlocked
		for (var i in Stuff){
			if (Stuff[i]["unlocked"]){
				console.log("unlocked: "+i);
				if(document.getElementById(i+"Stuff")===null){
					addResourceLine(i);
				}
				document.getElementById(i).innerHTML = Stuff[i]["stored"];
				document.getElementById(i+"Max").innerHTML = Stuff[i]["maxstored"];
			} else if(document.getElementById(i+"Stuff")) {
				console.log("removing "+i);
				document.getElementById("stuff").removeChild(document.getElementById(i+"Stuff"));
			}
		}

		for (var i in Buildings){
			if (Buildings[i]["unlocked"] && i!=="councilhall"){
				console.log("unlocked: "+i);
				if(document.getElementById(i+"Build")===null){					
					addBuildingButton(i);
				}
				
				document.getElementById(i).innerHTML = Buildings[i]["count"];
				document.getElementById(i+"Costs").innerHTML = "need to refresh?";			
			} else if(document.getElementById(i+"Build")) {
				console.log("removing "+i);
				document.getElementById("pan2").removeChild(document.getElementById(i+"Build"));
			}
		}

		for(var i in Jobs){
			if(Jobs[i]["unlocked"]){
				console.log("unlocked: "+i);
				if(document.getElementById(i+"Job")===null&&i!=="freeworker"){
					addJobElement(i);
				}
				document.getElementById(i+"s").innerHTML = Jobs[i]["workers"];
				document.getElementById(i+"sMax").innerHTML = Jobs[i]["maxworkers"];
			}
			 else if(document.getElementById(i+"Job")) {
				console.log("removing "+i);
				document.getElementById(i+"Job").parentElement.removeChild(document.getElementById(i+"Job"));
			}
		}

		var jobBoxElem = document.querySelectorAll(".JobBox");
		console.log("jobBoxes NodeList: "+jobBoxElem+ " with length: "+jobBoxElem.length);
		for(var i=0; i<jobBoxElem.length; i++){
			console.log("JobBox: "+jobBoxElem[i]+ " and id: "+jobBoxElem[i].id);
			var box = jobBoxElem[i].id;
			var keep = false;

			for(var j=0; j<GlobVar.JobBoxes.length; j++){
				console.log("Does the box ("+box+") show up in GlobVar.jobBoxes."+j+" value: " + GlobVar["JobBoxes"][j]);
				if(box === GlobVar["JobBoxes"][j]){
					console.log("adding "+ box);
					keep = true;
				}
			}
			if(!keep){
				document.getElementById(box).parentElement.removeChild(document.getElementById(box));
			}
		}

		for (var i in Research){
			if (Research[i]["unlocked"]&& !Research[i]["done"]){
				console.log("unlocked: "+i);
				if(i!=="FarmEquip" && i!=="StoneAxe"){					
					addResearchButton(i);
				}			
			} else if(document.getElementById(i)) {
				console.log("removing "+i);
				document.getElementById("pan3").removeChild(document.getElementById(i));
			}
		}

		//show the values that have been unlocked
		//if there are more than X people show buttons up to butt3
		//if there is a councilhall then show butt4
		//go through tokens in {if else} to see what else needs to be displayed
		if(Buildings.councilhall.unlocked){
			document.getElementById("butt1").style.display = "inline";
			document.getElementById("butt2").style.display = "inline";
			document.getElementById("butt4").style.display = "inline";
		}
		if(Buildings.councilhall.count>0){
			document.getElementById("butt3").style.display = "inline";
			document.getElementById("council1").style.visibility = "visible";
			document.getElementById("buildCounc").style.display = "none";
		}
		if(Research.FindOre.done){
			var div = document.createElement("div");
			div.id = "exploreButton";
			div.className = "exploreButton";
			div.innerHTML = "<div class='tooltiptext' id='exploreTip'><p>Requires (<span id ='exploreWorkers'>1</span>) workers for the exploration party<br>The trip will need <span id='exploreCosts'>30 food</span></p></div><div id='exploreBar' class='buildBar'><p class='buildText' style='padding-top:15px'>Send a party to explore and<br> map the surrounding area</p></div>";
			div.addEventListener("click",exploreGo);
			document.getElementById("pan4").appendChild(div);

			var tooltipStr = "";
			for (var i in GlobVar.exploreStuff){
				tooltipStr += Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNumNext) + " " + Stuff[i]["name"] + ",&nbsp;";
			}
			tooltipStr = tooltipStr.slice(0,-7);
			document.getElementById("exploreWorkers").innerHTML = Math.floor(Math.log(GlobVar.exploreCount+1)*2)+1;
			document.getElementById("exploreCosts").innerHTML = tooltipStr;
		}
	
	} else {
		console.log("storage not available or no save to localStorage");
	}
}

function prestige(){
	GlobVar.knowledge += Jobs.freeworker.maxworkers;
	localStorage.setItem("Knowledge",GlobVar.knowledge);
	//do I save knowledge and reload the page or reset the stored amounts of everything to 0 and refreshAmounts()?
	window.location.reload(false);//seems easiest
	GlobVar.knowledge = localStorage.getItem("Knowledge");
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
