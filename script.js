/*Hello to anyone reading this! Yes, I am new at coding - please feel free to point out ways to do 
  anything better. If you want to add something, go ahead - message me on reddit.
  If I like your code, I'll add it. All vanilla JS for now. */
"use strict"

var Stuff = { //the production of materials of all kinds

	//add that the buildingwork ammount only gets added if there is at least one worker? or x per worker, x=5 seems good. that is each farmer can collect the passive bonus for 5 farms - can have some buildings with low passive and high worker output and some with high passive and low added worker output (like factories and hydro dams - each added worker only provides a small additional bonus compared to the 'passive' effect of the building)
	food:{ name:"Food", 	rateArray:[],	stored:100, 	maxstored:100, 	storebonus:1, unlocked:true,  rate:0,  color:"rgb(0,0,0)"},
	wood:{ name:"Wood",		rateArray:[],	stored:100, 	maxstored:100, 	storebonus:1, unlocked:true,  rate:0,},
	rock:{ name:"Rock",		rateArray:[],	stored:20, 		maxstored:100, 	storebonus:1, unlocked:false, rate:0,},
	lumber:{name:"Lumber",	rateArray:[],	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, rate:0,},
	stone:{	name:"Stone",	rateArray:[],	stored:0, 		maxstored:0, 	storebonus:1, unlocked:false, rate:0,},
	clay:{  name:"Clay",	rateArray:[],	stored:0,		maxstored:50,	storebonus:1, unlocked:false, rate:0,},
	brick:{ name:"Brick",	rateArray:[],	stored:0,		maxstored:50,	storebonus:1, unlocked:false, rate:0,},
	cu_ore:{name:"Cu Ore",	rateArray:[],	stored:0,	maxstored:50,	storebonus:1, unlocked:false, rate:0,},
	copper:{name:"Copper",	rateArray:[],	stored:0,		maxstored:5,	storebonus:1, unlocked:false, rate:0,},
	tin: {	name:"Tin",		rateArray:[],	stored:0,		maxstored:0,	storebonus:1, unlocked:false, rate:0,},
	lead:{  name:"Lead",	rateArray:[],	},
	fe_ore:{name:"Iron Ore",rateArray:[],	},//Iron ore and coal make steel
	steel:{ name:"Steel",	rateArray:[],	},
	mercury:{name:"Mercury",rateArray:[],	},
	silver:{name:"Silver",	rateArray:[],	},
	bronze:{name:"Bronze",	rateArray:[],	stored:0,		maxstored:0,	storebonus:1, unlocked:false, rate:0,},
	gold:{	name:"Gold",	rateArray:[],	stored:0,		maxstored:99999,storebonus:1, unlocked:false, rate:0,},//no max on gold - don't display max and set arbitrarily high
	coal:{	name:"Coal",	rateArray:[],	stored:0,		maxstored:0,	storebonus:1, unlocked:false, rate:0,},//use coal to improve smelting
	zinc:{  name:"Zinc",	rateArray:[],	},//unlock some metals as you make more mines - trade for others that you don't have in your area
	brass:{ name:"Brass",	rateArray:[],	},

	research:{name:"Research",rateArray:[],	stored:0,		maxstored:0,	storebonus:1, unlocked:false, rate:0,},//think about how this relates to the research object and maybe move it there? or make global variable?

	spear:{name:"Spears",	rateArray:[],	stored:0,		maxstored:5,	storebonus:1, unlocked:false, rate:0,},
};
function addResourceLine(res){
	Stuff[res]["unlocked"]=true;
	var div = document.createElement("div");
	div.id = res+"Stuff";
	//now do it all!
	div.innerHTML = "<div class='resourceName'> "+ Stuff[res]["name"] + ": </div> <div class='resNumsOn'> <div class='resource' id='"+res+"'> "+ Stuff[res]["stored"] +" </div> / <div class='resourceMax' id='"+res+"Max'>"+Stuff[res]["maxstored"]+"</div> </div> <div class='resourceBarBoxOff'> <div class='resourceBarBar'> </div> <div class='resourceBarMax'> </div> </div> <div class='ratePos' id='"+res+"Rate'>1</div> /sec";
	document.getElementById("stuff").appendChild(div);

	//need to determine how to show gold and other 'stuff' on the resource bars setting - for now just all black b/c max is really high
	if(res==="gold"||res==="research"){//any other special case resources
		document.getElementById(res+"Max").innerHTML = "X";
	} else {
		document.getElementById(res+"Max").innnerHTML = Stuff[res]["maxstored"];
		document.getElementById(res+"Stuff").querySelector(".resourceBarMax").innerHTML = Stuff[res]["maxstored"];
	}
	if(document.getElementById("foodStuff").querySelector(".resourceBarBoxOn")){//check food b/c always food line, will make errors for all the other resources unlocked
		document.getElementById(res+"Stuff").querySelector(".resourceBarBoxOff").className = "resourceBarBoxOn";
		document.getElementById(res+"Stuff").querySelector(".resNumsOn").className = "resNumsOff";
	}

}	
function addSpecialLine(res){//This isn't used right now - consider later. need to just copy above and re-write whole thing
	console.log("this function does nothing");
}
{	/* Ideas for stuff to add
	cattle(special increment)
	gold:{workers:0, buildingwork:0, maxworkers:3, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	marbles:{workers:0, buildingwork:0, maxworkers:0, stored:0, maxstored:100, workbonus:1, storebonus:1, unlocked:0},
	*/
}

var Jobs = {//need to add a name property...
	freeworker: {box: "camp", 		workers:1, maxworkers:1,					 unlocked:true,   									},//this gets skipped in incrRes()
	hunter:		{box: "fields", 	workers:0, maxworkers:100, 		workbonus:1, unlocked:true,  make:{food:1},						},
	woodcutter:	{box: "forest", 	workers:0, maxworkers:3, 		workbonus:1, unlocked:false, make:{wood:1.6},					},
	rockcutter:	{box: "hillside", 	workers:0, maxworkers:1, 		workbonus:1, unlocked:false, make:{rock:1},						},
	farmer:		{box: "fields", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{food:2},						},
	lumberworker:{box: "forest", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{lumber:1.6,wood:-.8},		},
	mason:		{box: "workshops", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{stone:1,rock:-1.5},			},
	researcher: {box: "laboratory",	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{research:1},					},//this gets skipped too
	copperminer:{box: "hillside", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{cu_ore:.3},					name:"Copper Miners",},
	ironminer:{box: "hillside", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{fe_ore:.3},					name:"Iron Miners",},
	coalminer:{box: "hillside", 	workers:0, maxworkers:0, 		workbonus:1, unlocked:false, make:{coal:.5},					name:"Coal Miners",},
	
	
	kilnworker:	{box: "workshops",	workers:0, maxworkers:0,		workbonus:1, unlocked:false, make:{copper:.1,cu_ore:-.5,wood:-1},		},//can treat kins specially later (dropdown menu to select which ore (or clay -> brick) and each kiln can do different thing)
	clayworker: {box: "riverbank",  workers:0, maxworkers:5,		workbonus:1, unlocked:false, make:{clay:2},						},
	brickmaker: {box: "workshops",	workers:0, maxworkers:0,		workbonus:1, unlocked:false, make:{brick:1,clay:-1,wood:-2},	},
	smith: 		{box: "workshops",  workers:0, maxworkers:0,		workbonus:1, unlocked:false, make:{spear:0.05,wood:-1,copper:-1},	},//the weapon/armor/building_materials toggle will change this 'make' property. or could have a 'iron swords' upgrade make this use iron and produce swords instead for a genaric 'weapons' catagory of stuff? not sure how to organize different weapons or whether there is a use. just make then iron spears and keep calling them spears - they just do more damage.
	child:		{box: "camp",		workers:0, maxworkers:0,		workbonus:1, unlocked:false, make:{wood:.3},					name:"Children",},//children can help collect some wood

	//should there be different mines - how to organize? or one mine that makes many ores for starters - unlock more metals as you add mineshafts (rename current mineshaft)
	//one smelting factory that can handle a certain amount of several ores - new ores added by research and/or mines

	//after enough advancement, rename the jobBox and change image: camp -> settlement; workshops -> industrial zone
	
}
function incrRes(){ //increments resources from workers at their jobs (make another function to add passive building work - move 'buildingwork' to Buildings function and make it an object like 'make'). Does not handle consuming food - that is in run()
	var now = Date.now();
	var deltaTime = (now - GlobVar.previousTime)/1000;//time in seconds since last resource update

	var numJobs = 0; //to keep track of jobs that may need to be run in a later loop
	var lastJobs = 0;

	for(var q in Jobs){
		if(Jobs[q]["unlocked"] && q!=="freeworker" && q!=="researcher"){//research gets special treatment in its own function
			Jobs[q]["makeTag"] = false;//tag gets set to true if the job is used to make resources this loop
			numJobs++;
		}
	}

	while(numJobs!==lastJobs){
		lastJobs = numJobs;
		numJobs = 0;

		for(var x in Jobs){
			if (Jobs[x]["unlocked"] && x!=="freeworker" && x!=="researcher" && !Jobs[x]["makeTag"]){//don't run for freeworkers or researchers, and jobs that have already gone
				var make1 = true;
				var make2 = false;
				for(var u in Jobs[x]["make"]){		
					var incr = GlobVar.factor*Jobs[x]["make"][u]*(Jobs[x]["workers"]*Jobs[x]["workbonus"])*deltaTime*5;//add in buildingwork resource generation in another loop before this one - maybe put the passive generation in a new object in Buildings{} so that a given buildings can make more than one resource - somehow need to link back to workers
					if(Stuff[u]["stored"]+incr<=0){
						make1 = false; //don't make if it would be less than 0
					}
					if(make1){//don't make somthing if storage is full
						if(Stuff[u]["stored"]<Stuff[u]["maxstored"]*Stuff[u]["storebonus"] && incr>0){
							make2 = true;		
						}
					}
				}
				//also the building progress is unaffected by elapsed time right now?
				//now after reloading a previous game-state the resources won't be split properly
				if(make1&&make2) {//need to make it only use the wood to cap lumber, and then make wood from the rest if it's over the cap.
					for(var incrKey in Jobs[x]["make"]){
						incr = GlobVar.factor*Jobs[x]["make"][incrKey]*(Jobs[x]["workers"]*Jobs[x]["workbonus"]);
						Stuff[incrKey]["rate"]+=incr;//am I actually using this?
						Stuff[incrKey]["stored"]+=incr*deltaTime*5;										
					}
					Jobs[x]["makeTag"] = true;//tag that it won't try again
				} else {					
					numJobs++;
				}
			}
		}
	}

	for(var i in Stuff){
		if(Stuff[i]["unlocked"] && i!=="research"){//why not for research too?
			var max  =  Stuff[i]["maxstored"]*Stuff[i]["storebonus"];
			let barMax = document.getElementById(i+"Stuff").querySelector(".resourceBarMax");
			if(Stuff[i]["stored"]>=max){
				Stuff[i]["stored"] = max;
				if(barMax.style.color!="red"){//turns red when try to build and not enough storage space
					barMax.style.color="gold";
				}
			} else {
				if (barMax.style.color==="gold"){
					barMax.style.color="white";
				}
			}
		}
	}
	var numJobsMaking = 0;	
	for(var q in Jobs){
		if(Jobs[q]["unlocked"] && q!=="freeworker" && q!=="researcher"){
			if(Jobs[q]["makeTag"] === true){
				numJobsMaking++;//to return the number of jobs that made things this round (used in finishLoading to break while loop)
			}
		}
	}
	return(numJobsMaking);	
}
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
	

	document.getElementById("col"+nextCol).appendChild(newDiv);

	nextCol = nextCol===1 ? 2 : 1;

}
function addJobElement(jobName){//came move the check whether box exists up to here
	console.log("adding job: "+jobName);
	Jobs[jobName]["unlocked"] = true;
	var newBox = Jobs[jobName]["box"];

	if(document.getElementById(newBox)===null){		
		addJobBox(newBox);
	}

	var makeStr = "";
	var consumeStr ="";

	for (var i in Jobs[jobName]["make"]){
		if(Jobs[jobName]["make"][i]>0){
			makeStr += (Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
			console.log("Set makeStr of "+jobName+" for "+i+" to "+ (Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*5).toFixed(1));
		} else {
			consumeStr += (Jobs[jobName]["make"][i]*Jobs[jobName]["workbonus"]*GlobVar.factor*-5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
		}
		//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
	}

	if(consumeStr!==""){
		consumeStr = "<br>and consumes:<br>" + consumeStr;	
	}

	makeStr = makeStr.slice(0,-4);

	var indiv = document.createElement("div");
	indiv.id = jobName.toLowerCase() + "Job";
	var changeName;
	if(Jobs[jobName]["name"]){//only need to give job a name if it's something other than the property name (+'s')
		changeName = Jobs[jobName]["name"];
		console.log("adding "+ Jobs[jobName]["name"]);
	} else {
		changeName=jobName+"s";
	}
	indiv.innerHTML = "<div class='userAdd'><b>&nbsp;"+ changeName.charAt(0).toUpperCase() + changeName.slice(1) +": <span id='"+ jobName +"s'>0</span> / <span id='"+ jobName +"sMax'>"+ Jobs[jobName]["maxworkers"] +"</span>&nbsp;</b><div class='tooltiptext'><p>Each "+ jobName +" makes: <br><span id='"+ jobName +"sMake' >"+ makeStr + consumeStr +"</span></p></div></div><div class='userRemove'><b> X </b></div>";
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
	document.getElementById(newBox).querySelector(".imgBox").appendChild(indiv);

	if(jobName==="child"){//need to remove the stuff that workers get
		document.getElementById("childJob").removeChild(document.getElementById("childJob").querySelector(".userRemove"));
		document.getElementById("childJob").querySelector(".userAdd").removeEventListener("click",moveworkerEvent);
		document.getElementById("childJob").querySelector(".userAdd").style="cursor:default; background-color:rgba(255, 255, 255, .75);width:220px;";
		console.log(document.getElementById("childJob").querySelector(".userAdd").style);
		document.getElementById("childJob").querySelector(".tooltiptext").innerHTML = "<p>Every child consumes <br>0.8 food / sec<br><br> Children help the woodcutters<br>with simple tasks and<br>each child makes 0.75 wood / sec";
	}
	alertPanel("pan1");
}

var Buildings = {  //if addWorker property key is "freeworker", it will add free workers     can remove the buildOnce property because just make buy button invis for "true" buildings?
					//can move the unlockRes and unlockJob functionality to the unlock_conditional section of the run() function
	shack:	{name: "Shack", 		count:1, buildWorkers:1, buildTime:35, unlocked:true, 	buildingwork:{},									addworker:{freeworker:1}, 	cost:{wood:25}, 							unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	tempCount:0, 	addsText:["space for 1 new settler"],		},
	shed:	{name: "Woodshed",		count:0, buildWorkers:2, buildTime:25, unlocked:false, 	buildingwork:{},		addstorage:{wood:50}, 		addworker:{woodcutter:1}, 	cost:{wood:30},								unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 1 woodcutter", "50 wood storage"],	statement:"It looks like you could use a place to chop and store more wood, so you decide to start building sheds just inside the forest."},
	expandQ:{name: "Expand Quarry",	count:0, buildWorkers:3, buildTime:25, unlocked:false,	buildingwork:{},		addstorage:{rock:50},		addworker:{rockcutter:1}, 	cost:{wood:30, rock:50},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 1 rockcutter", "50 rock storage"],	statement:"Clearing access to the quarry will allow for more rock collection and storage."},
	farm:	{name: "Farm",			count:0, buildWorkers:5, buildTime:40, unlocked:false, 	buildingwork:{},									addworker:{farmer:2},		cost:{wood:100, rock:75},					unlockRes:[],			unlockJob:["farmer"],	costratio:2.5, 		buildOnce:false,	tempCount:0,	addsText:["space for 2 farmers"],						statement:"One of the travelers brought with them fast-growing seeds, and to free up workers from hunting duties you decided to try farming. Some walls and trellices seem to do the trick."},
	barn:	{name: "Barn",			count:0, buildWorkers:3, buildTime:40, unlocked:false,	buildingwork:{},		addstorage:{wood:100,rock:100,food:100}, 				cost:{wood:300,rock:100},					unlockRes:[],			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["100 food storage", "100 wood storage", "100 rock storage"],	statement:"You will need even more storage to stockpile resources for larger buildings. You can start by constructing simple barns."},
	lumberyard:{name: "Lumber Yard",count:0, buildWorkers:3, buildTime:50, unlocked:false,	buildingwork:{},		addstorage:{lumber:300}, 	addworker:{lumberworker:3},	cost:{wood:300, rock:50},					unlockRes:["lumber"],	unlockJob:["lumberworker"],costratio:2.5,	buildOnce:false,	tempCount:0,	addsText:["space for 3 lumber workers", "300 lumber storage"],	statement:"One of the newcomers was a carpenter in her old life. She is thankful for the simple shelter you have provided, but obviously wants to lead the construction of better buildings."},
	workshop:{name:"Stone Yard",	count:0, buildWorkers:3, buildTime:60, unlocked:false,	buildingwork:{},		addstorage:{stone:200},		addworker:{mason:3},		cost:{lumber:200,rock:200},					unlockRes:["stone"],	unlockJob:["mason"],	costratio:2.5,		buildOnce:false,	tempCount:0,	addsText:["space for 3 masons", "200 stone storage"],	statement:"With access to rough-cut boards, several folk decide to contruct an area to shape and store materials. For now the space will be used to cut rock from the quarry into stone slabs for improved buildings, and perhaps later for stone tools."},
	hut:	{name: "Hut",			count:0, buildWorkers:4, buildTime:40, unlocked:false, 	buildingwork:{},									addworker:{freeworker:1},	cost:{lumber:200,stone:100},				unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:false,	tempCount:0,	addsText:["space for 1 new settler"],					statement:"With boards from the lumberyard and cut stones from the stoneyard, the carpenter plans to start building proper huts. You still want to continue buildings shacks - you are trying to grow the town after all and still need to turn the occasional wanderer away for lack of space."},
	lab: 	{name: "Laboratory",	count:0, buildWorkers:4, buildTime:80, unlocked:false, 	buildingwork:{},									addworker:{researcher:1},	cost:{wood:100,lumber:300,stone:200},		unlockRes:["research"],	unlockJob:["researcher"],costratio:1.3,		buildOnce:false,	tempCount:0,	addsText:["space for 1 researcher"],					statement:"The Town Hall has been constructed. The first meeting will be held immediately."},
	//mineshafts will add certain mine type which can be expanded with shafts, or will reduced the cost of adding shafts in the case of discovering a mine of previous type by lowering cost and/or ratio. sometimes doesn't add anything though, like at the start
	warehouse:{name:"Warehouse",	count:0, buildWorkers:5, buildTime:50, unlocked:false,	buildingwork:{},		addstorage:{wood:50,rock:50,lumber:50,stone:50,cu_ore:50,brick:50,fe_ore:50,coal:50}, addworker:{},cost:{rock:100,lumber:500,stone:300,brick:150},unlockRes:[],	unlockJob:[],			costratio:1.1,		buildOnce:false,	tempCount:0,	addsText:["50 wood storage","50 rock storage","50 lumber storage","50 stone storage","50 ore storage","50 brick storage"], statement:"More versitile than barns, your warehouses are designed to store many kinds of materials."},
	kiln:	{name: "Kiln",			count:0, buildWorkers:3, buildTime:30, unlocked:false,	buildingwork:{},		addstorage:{},				addworker:{kilnworker:1},	cost:{brick:200,stone:50},					unlockRes:["copper"],	unlockJob:["kilnworker"],costratio:1.1,		buildOnce:false,	tempCount:0,	addsText:["space for one kilnworker"], statement:"Kilns will let us smelt ore and perhaps do other things later."},
	silo:	{name: "Silo",			count:0, buildWorkers:3, buildTime:35, unlocked:false,  buildingwork:{},		addstorage:{food:150},		addworker:{},				cost:{wood:100, lumber:100},				unlockRes:{},			unlockJob:[],			costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["150 food storage"],							statement:"The settlement can buffer fluctuations in food demand and stockpile food for exploring parties by constructing silos."},
	cabin:	{name: "Cabin",			count:0, buildWorkers:5, buildTime:55, unlocked:false,  buildingwork:{},		addstorage:{},				addworker:{freeworker:2,child:2},cost:{lumber:350,stone:150},			unlockRes:{},			unlockJob:["child"],	costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 2 new settlers", "space for 2 children"],statement:"With all the work to do, the settlement needs more residents. Cabins will allow families with children to join the town."},
	forge:	{name: "Forge",			count:0, buildWorkers:6, buildTime:100,unlocked:false,	buildingwork:{},		addstorage:{copper:10},		addworker:{smith:1},		cost:{wood:50,lumber:250,stone:350,brick:200},unlockRes:["spear"],  unlockJob:["smith"],	costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 1 metalsmith","10 copper storage"],statement:"A forge will allow one metalsmith to begin turning smelted metals into useful tools and weapons.",		},
	coppermine:{name:"Copper Shaft",count:0, buildWorkers:3, buildTime:60, unlocked:false,	buildingwork:{},		addstorgae:{},				addworker:{copperminer:2},	cost:{lumber:100},							unlockRes:[],			unlockJob:["copperminer"],costratio:1.4,	buildOnce:false,	tempCount:0,	addsText:["space for 2 copper miners"],					statement:"Copper ore can now be mined. Add more mineshafts to increase worker capacity."},
	ironmine:{name: "Iron Shaft",	count:0, buildWorkers:3, buildTime:60, unlocked:false,	buildingwork:{},		addstorgae:{},				addworker:{ironminer:2},	cost:{lumber:100},							unlockRes:[],			unlockJob:["ironminer"],costratio:1.5,		buildOnce:false,	tempCount:0,	addsText:["space for 2 iron miners"],					statement:"Iron ore production is online."},
	coalmine:{name: "Coal Shaft",	count:0, buildWorkers:3, buildTime:60, unlocked:false,	buildingwork:{},		addstorgae:{},				addworker:{coalminer:2},	cost:{lumber:100},							unlockRes:[],			unlockJob:["coalminer"],costratio:1.3,		buildOnce:false,	tempCount:0,	addsText:["space for 2 coal miners"],					statement:"The coal mine is opporational."},
	//new mine types should be placed after 'build mine' building button in building tab list

	//give kilns a drop-down menu for picking what to do - turn wood to charcoal, turn clay to brick, turn ore to metal - different recipe based on what is selected. keep track of number of kilns and kilnworkers but treat consumption/generation separately?
	councilhall:{name: "Town Hall", count:0, buildWorkers:10,buildTime:200,  unlocked:false, tempCount:0, 												cost:{wood:200, rock:200, lumber:400, stone:300}, 	unlockRes:[], 	unlockJob:[],			costratio:1,	buildOnce:true,	statement:"The Council Hall has been constructed. The first meeting will be held immediately."},
	armory:		{name: "Armory",	count:0, buildWorkers:7, buildTime:100,unlocked:false,	buildingwork:{},		addstorage:{spear:15},		addworker:{},				cost:{wood:50,lumber:250,stone:100},		unlockRes:[], 		 	unlockJob:[],			costratio:3,		buildOnce:false,	tempCount:0,	addsText:["15 spear storage"],					statement:"The armory will allow your townsfolk to stockpile weapons to arm explorers and defend the settlement",		},
	mine:	{name: "Build Mine",	count:0, buildWorkers:5, buildTime:100,unlocked:false,	buildingwork:{},		addstorage:{},				addworker:{},				cost:{lumber:200},							unlockRes:[],			unlockJob:[],			costratio:1.2,		buildOnce:true,	tempCount:0,	addsText:["space for 1 miner"],						statement:"Adding a mineshaft will allow collection of ores."},
	bridge:{},
	market:{},
	docks:{},
	citywalls:{},

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
	for (var i=0;i<Buildings[buildingName]["addsText"].length;i++){
		addsText+=Buildings[buildingName]["addsText"][i];
		addsText+="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
	}
	addsText = addsText.slice(0,-70);

	newBuild.innerHTML = "<div class='tooltiptext'><p>Requires ("+ Buildings[buildingName]["buildWorkers"] +") workers to build<br>Cost:&nbsp;<span id='"+ buildingName +"Costs'> </span><br><br>Adds: <span id='"+ buildingName +"Adds'>"+ addsText +"</span></p></div><div id='"+ buildingName +"progress' class='buildBar'><p class='buildText'>"+ Buildings[buildingName]["name"] +" [<span id='"+ buildingName +"'>0</span>]</p></div>";
	//the cost gets put in in the unlock() function

	newBuild.addEventListener("click",addBuildingEvent);

	document.getElementById("pan2").insertBefore(newBuild, document.getElementById("buildBlank"));
	alertPanel("pan2");
};
function validateBuildings(){//changes the building buttons to grey out if there are not enough resources, and text to black if not enough max resources
	for (var i in Buildings){
		if(Buildings[i]["unlocked"] && !Buildings[i]["buildOnce"] && document.getElementById(i+"Build").className != "deadBuilding"){
			var make=true;
			var makeMax=true;
			for(var j in Buildings[i]["cost"]){
				var cost = Math.round(Buildings[i]["cost"][j]*Math.pow(Buildings[i]["costratio"],(Buildings[i]["count"]+Buildings[i]["tempCount"])));
				if(Stuff[j]["stored"]<cost){
					make=false;
				}
				if(Stuff[j]["maxstored"]<cost){
					makeMax=false;
				}
			}
			if(make){
				if(i==="mine"&&GlobVar.Token[10]||i==="mine"&&GlobVar.mineToken=="0"){
					//do nothing, this prevents the first mine from showing buildable
				} else {
					document.getElementById(i+"Build").className = "buildingButton";
				}	
			} else {
				document.getElementById(i+"Build").className = "buildingOff";
			}
			if(makeMax){
				if(i==="mine"&&GlobVar.Token[10]||i==="mine"&&GlobVar.mineToken=="0"){
					//do nothing, this prevents the mine from showing buildable if there is not one currently discivered
				} else {
					document.getElementById(i+"progress").style.color = "white";
				}
			} else {
				document.getElementById(i+"progress").style.color = "black";
			}
		}
	}
}
{/* Ideas for stuff to add
	ranch:	{unlock:cattle}
	cabbin: {addworker:{free:3}} and adds children which consume less food but don't do any work
	market: {unlock:"gold"} sell food and stuff for gold in separate tab or as a rate  //tech add dock to increase commerce "You have built most of the stuctures that you and your council know how to build, but you remember many other wonderful things from you past lives in the Great City. You allow some settlers to study and draft plans for new types of buildings."
	fishery: //unlocked by dock tech
	
	market ideas - have traders come infrequently to buy certain resources, can get more to come as population grows or other things, eventually a steady trickle of certain resource for gold (no max on gold)
	*/
	//make it so that the new jobs don't show up until after the first building is made? (like no farmers until farm)
}

//"GLOBAL" VARIABLES - go through and see which of these can be local variables - no need to have them all global probably
var GlobVar = {
	counter1 : 0,	//timer for removing "statement" messages
	ActiveRes : " ",	//to set active research
	buildBuild : [],	//if empty, not building, otherwise building whatever is in the array - can have multiple values of same building
	buildConstruct : [],//used to store completion of building with same index in buildBuild (0 to 100)
	buildWorkers : 0,	//number of free workers to currently used for construction
	time : 1,			//cheat time to construct a building
	knowledge : 0,		//the prestige variable
	resolve : 0,		//late game prestige variable - unplanned story (something good hopefully)
	JobBoxes : ["camp", "fields",],//keeps track of all the job boxes that have been created (or made visible)
	factor : 0.5, 		//to alter the speed of resrouces collection (and food consumption). Higher numer collects more resources per tick.
	statementLog : "",	//to store the log of the game **can make a function to update and call doc.logOut that take the new string as a parameter
	exploreCount : 1,	//number times you go exploring (starts with base area revealed)
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
	previousTime:0,		//time on the last tick
	pendingStatements:[],//a backlog of statements to show
	textAlerts:[],		//keep track of pop-ups telling not enough resources, etc
	mark1: "pan1",
	mark2: "pan2",
	workerChance: .00004,	//fractional chance to attract a new worker each tick
	mercyChance: 0,		//so that people come eventually
	space: 1,			//total number of workers that can live in the camp 
	exploreMessages: ["Your explorers map some new area but find nothing of use.",
						"The party leader decided to head southeast and begin maping the hills there.",
						"x-find first mining site",
						"The hills to the northeast look to have better prospects than down south.",
						"Who knows how deep this forrest goes? Scouts say to keep looking in the hills for a good mining location.",
						"x-find 2nd mining site",
						"These seem to be foothills of a low mountain range to the east.",
						"The river continues it's course through the dense forrest upriver away from the settlement. What does the land have to offer downriver?",
						"x- find clay",
						"Scouts say this trip was especially boring.",
						"The area seems safe to send workers, and you can continues to expand the settlement southward into the grassland.",
						"x-all immediate area scouted",
						"The party ventured out a bit further into the wild.",//make some exploring time unlock the roadbuilding tech or some other tech?
						"x-find bears, need to take spears now",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x",
						"x"],
	paused: true,
	panic: false,
	explorers:0,//number of current explorers (total). used to reduce food consumption b/c don't feed explorers.
	mineToken:[0],//slot[0] of the array stack says what next mine will be: 0 for a bust, 1 for copper, 2 for iron, 3 for coal, - add on to the end, remove from front when a mine is built. if array is empty, build mine button is incative

}
	var nextCol=1;			//keeps track of the column in which to add the next job box - should not be adjusted by GlobVar save.

//elements to litsen to
window.onload = function () {//add event listeners after DOM has loaded or you will get null instead of element
	console.log("localStorage 'Reset' value: "+localStorage.getItem("Reset"));
	
	//reset can have three values: 'full' runs the intro text and initial t=0 gamestate (full reset), 'saveLoad' runs the current save in local storage, 'prestige' resets everything but the prestige variables and shows new intro text
	if(localStorage.getItem("Reset")!==null&&localStorage.getItem("Reset")==="saveLoad") {//don't show intro text
		document.body.removeChild(document.getElementById("closeMe"));
		console.log("intro removed");
		loadGame();
	} else {
		setup();
		document.querySelector(".closebtn").addEventListener("click", function(){
			let introText = document.querySelector(".closebtn").parentElement;
			introText.style.top="-400%";
			setTimeout(function(){introText.parentElement.removeChild(introText)},2000);//don't think we need this element anyomre after close
			GlobVar.paused=false;
			populate();
		});
		document.getElementById("intro").style = "transition:color 4s; color:white;";
		document.querySelector(".closebtn").style = "color:green; transition-property: color; transition-duration: 4s; transition-delay: 4s;"
		if(localStorage.getItem("Reset")==="prestige"){//for presige reset have new intro text
			document.getElementById("intro").innerHTML = "The settlement has become crowded and stagnent, and there are still many wanderers who are excluded over conserns for space and resources. You decide to travel down the river for a few weeks and start building again. Informed by some Knowledge of development, you belive you can do better this time. The ongoing conflicts of the Great City still weighs on your mind."
			console.log("intro changed");
			GlobVar.knowledge = parseInt(localStorage.getItem("Knowledge"));
			GlobVar.resolve = parseInt(localStorage.getItem("Resolve"));
			if (GlobVar.resolve>0){//second level of prestige (maybe someday the game will get here)
				document.getElementById("intro").innerHTML = "You know what has befallen the Great City and set out to rebuild a resistance town with heightened Resolve";
			}
		}
		localStorage.setItem("Reset","saveLoad");
	}

	//and now add the event listners:
	document.body.addEventListener("transitionend", updateTransition);//ends the white flash when food runs out

	var cheat = document.getElementById("title");
	cheat.addEventListener("click",testFunc);

	var setButtons = document.querySelectorAll(".butt, .buttSelected, .buttAttn");
	for (var i=0;i<setButtons.length;i++){
		setButtons[i].addEventListener("click",panelEvent);
	}

	//add listeners for moving workers' jobs
	var jobIds = document.querySelectorAll(".userAdd0");

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
	var setResearchs = document.querySelectorAll(".researchButton, .researchButtonSelected");
	for (i=0;i<setResearchs.length;i++){
		//the ids must be "research_name" in the HTML file
		setResearchs[i].addEventListener("click",SwapResearchEvent);
	}

	//add event listener for council build button
	document.getElementById("buildCounc").addEventListener("click", councilListen);

	var councilMessages = document.querySelectorAll(".councilMessage");
	for (i=0;i<councilMessages.lengh;i++){
		councilMessages[i].addEventListener("click",CouncilMessageEvent);
	}

	//make a bunch of tokens set to true that get set to false later when the action triggers and is no longer needed
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
	document.getElementById("reset").addEventListener("click",resetGame);
	document.getElementById("resetYes").addEventListener("click",resetYes);
	document.getElementById("resetNo").addEventListener("click",resetNo);
	document.getElementById("prestige").addEventListener("click",prestigeGame);

	document.getElementById("closeMessage").addEventListener("click",closeMessage);
	document.getElementById("enterName").addEventListener("click",enterName);
	document.getElementById("tips").addEventListener("click",openInfo);
	document.getElementById("settings").addEventListener("click",openSettings);//need to write this html, make a research bars option
	document.getElementById("closeSettings").addEventListener("click",closeSettings);
	document.getElementById("settingButton1").addEventListener("click",renameSettlement);
	document.getElementById("settingButton2").addEventListener("click",turnResourceBars);
	
	document.getElementById("buildMineButton").addEventListener("click",mineListen);

	document.addEventListener("keypress",keyPressedWhatDo);

	document.getElementById("statementLog").addEventListener("click", function(){//this got to be kind of a mess... keep working on it
		console.log("statementLog clicked, visibility is: "+document.querySelector(".logOut").style.visibility);
		if(document.querySelector(".logOut").style.visibility != "visible"){
			document.querySelector(".logOut").style.visibility = "visible";
			console.log("make visible!");
			setTimeout(function(){document.addEventListener("click", closeEventLog)},10);//this gets added and the same click registers to run it if not in setTimeout()
		}
	})
}

function openInfo(){//should there be an 'X' to close the info window?
	if(document.getElementById("tipText").style.display!="block"){
		document.getElementById("tipText").style.display="block";
		setTimeout(function(){document.addEventListener("click", closeInfo)},10);//this gets added and the same click registers to run it if not in setTimeout()
	}
}
function closeInfo(){
	if(document.getElementById("tipText").style.display=="block"){
		document.getElementById("tipText").style.display="none";
		document.removeEventListener("click", closeInfo);
	}
}
function closeEventLog(){
	if(document.querySelector(".logOut").style.visibility == "visible"){
		document.querySelector(".logOut").style.visibility = "hidden";
		console.log("make hidden");
		document.removeEventListener("click",closeEventLog);
	}
}
function populate(){
	Stuff.food.stored = 100;
	document.getElementById("food").innerHTMl = Stuff.food.stored;
	logStatement("You have built a shack and gathered some supplies. Now your attention turns to bigger plans.","regular",true,true);	
}
function panelEvent(e){
	Panel("pan" + e.currentTarget.id.charAt(e.currentTarget.id.length-1)); //pan0, pan1 strings
}
function moveworkerEvent(e){
	var num = 1;
	if (e.shiftKey) {
		num = -2;
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
		num = -2;
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
function addBuildingEvent(e){//why do I have these?
	addBuilding(e, e.currentTarget.id.slice(0,-5));
}
function SwapResearchEvent(e){//I don't need this stuff this way at all. leftover from learning, should change
	SwapActiveRes(e.currentTarget.id);
}
function CouncilMessageEvent(e){
	var num = 1 + e.currentTarget.id.charAt(e.currentTarget.id.length-1);
	e.currentTarget.style.display = "none"
	document.getElementById("council"+ num).style.display = "block";
}
function Panel(select){
	var tempNum = select.slice(-1);//tab number
	if(document.getElementById("butt"+tempNum).className === "buttAttn"){
		document.getElementById("butt"+tempNum).className = "buttSelected";
	}
	if(select==="pan1"||select==="pan6"){
		if(select === GlobVar.mark1){//do nothing
		} else {
				document.getElementById(GlobVar.mark1).style.display = "none";
				document.getElementById("butt"+GlobVar.mark1.slice(-1)).className = "butt"
				GlobVar.mark1 = select;
				document.getElementById(GlobVar.mark1).style.display = "inline-block";
				document.getElementById("butt"+GlobVar.mark1.slice(-1)).className = "buttSelected"
			
		}
	} else {
		if(select===GlobVar.mark2){//do nothing
		} else {
			document.getElementById(GlobVar.mark2).style.display = "none";
			document.getElementById("butt"+GlobVar.mark2.slice(-1)).className = "butt"
			GlobVar.mark2 = select;
			document.getElementById(GlobVar.mark2).style.display = "inline-block";
			document.getElementById("butt"+GlobVar.mark2.slice(-1)).className = "buttSelected"
		}
	}
}

//////////////////////////////////////////////////////////////////////////add and remove workers///////////////////////////////////////////////////////////////////////////////////
function moveworker(workkey,num){

	//makes the text flash red if you already have max workers (should this make just the max or just the numbers flash (harder)?)
	if(Jobs[workkey]["workers"]===Jobs[workkey]["maxworkers"]){
		let divElement = document.getElementById(workkey+"Job").firstChild;		
		divElement.style.transition = ".25s";
		divElement.style.color = "red";
		setTimeout(function(){divElement.style.color = "black";},250);
		return;

	} 
	if(Jobs.freeworker.workers<num){
		let divElement = document.getElementById("freeworkerJob0");	//if I remove the '0' in the id name there is a problem where save reload removes freeworker box	
		divElement.style.transition = ".25s";
		divElement.style.color = "red";
		setTimeout(function(){divElement.style.color = "black";},250);
		return;
	}

	if(document.getElementById(workkey+"Job").firstChild.style){//not sure why this is null sometimes from restart
		document.getElementById(workkey+"Job").firstChild.style.transition = "0s";//the always runs too soon and prevents the fade out if it's in the above if()
	}

	if (num === -1){
		num = Math.min(Jobs[workkey]["maxworkers"]-Jobs[workkey]["workers"],Jobs.freeworker.workers);
	}

	if (num === -2){
		num = Math.floor(Math.min(Jobs[workkey]["maxworkers"]-Jobs[workkey]["workers"],Jobs.freeworker.workers)/2);
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

	if (num === -2){
		num = Math.floor(Jobs[lessworkkey]["workers"]/2);
	}

	if (Jobs[lessworkkey]["workers"]-num>=0){
		Jobs[lessworkkey]["workers"]-=num;
		Jobs["freeworker"]["workers"]+=num;

		document.getElementById(lessworkkey+"s").innerHTML = Jobs[lessworkkey]["workers"];
		document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
	}
}

//////////////////////////////////////////////////////////////////////////add buildings////////////////////////////////////////////////////////////////////////////////
function revertTextColor(resource){//is there a better way to make sure the proper resource gets done in the setTimeout? see below, the for(key in ...) just calls the one key because it doesn't store the key at the time of the call. guess I could have a temp array that stores all the effeced resource names instead
	setTimeout(function(){document.getElementById(resource+"Stuff").querySelector(".resourceBarMax").style.color="white";console.log(resource+" text back to white, "+document.getElementById(resource+"Stuff").querySelector(".resourceBarMax").style.color)},2000);
}//actually I think it looks better without this
function addBuilding(ev, buildkey){

	var canbuild = true; 
	var txtNotEnough = " ";

	//enough free worekers to build?    
	if(Buildings[buildkey]["buildWorkers"]>Jobs["freeworker"]["workers"]){
		canbuild = false;
		txtNotEnough+= "workers, "
	}
	//can we build it?
	for(var key in Buildings[buildkey]["cost"]){
		//should make actualcost a method in Buildings - Buildings.actualcost("buildkey")? the tempcount stores how many are being built so that cost is updated correctly
		var actualcost = Math.round(Buildings[buildkey]["cost"][key]*Math.pow(Buildings[buildkey]["costratio"],(Buildings[buildkey]["count"]+Buildings[buildkey]["tempCount"])));

		if(actualcost>Stuff[key]["stored"]){
			canbuild = false;
			txtNotEnough+=(key+", ");

			//make the red lines if setting is enabled
			//make this check to see if there is enough resource storage - if not then make some other indicator for that resource like whole bar turns purple?
			let barBox = document.getElementById(key+"Stuff").querySelector(".resourceBarBoxOn");
			if(barBox){//don't do this stuff if resource bars aren't enabled
				let redDiv = document.createElement("div");
				//redDiv.style.opacity="1";
				//redDiv.style.transition="opacity 1s linear 2s;"
				barBox.appendChild(redDiv);
				setTimeout(function(){redDiv.style.opacity="0";},2000);
				setTimeout(function(){barBox.removeChild(redDiv)},3000);

				if(actualcost<=Stuff[key]["maxstored"]){
					redDiv.className = "noResourceBuildBar";
					redDiv.style.width = (actualcost/Stuff[key]["maxstored"]*100)+"%";
				} else {
					redDiv.className = "noStorageBuildBar";
					redDiv.style.width = "100%";
					//document.getElementById(key+"Stuff").querySelector(".resourceBarMax").style.color="red";
					//revertTextColor(key);//this otherwise doesn't make the text white for all resources, just the last key value (or first?)
				}
			}
		}	
	}
	txtNotEnough = txtNotEnough.slice(0,-2);//remove the comma and space after the last entry

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

 		var costTxt = " ";
		//pay for the building
		for(var keyy in Buildings[buildkey]["cost"]){

			actualcost = Math.round(Buildings[buildkey]["cost"][keyy]*Math.pow(Buildings[buildkey]["costratio"],Buildings[buildkey]["count"]+Buildings[buildkey]["tempCount"]-1));   //consider making function actualcost(buildkey,key) which returns value calculated value

			Stuff[keyy]["stored"]-=actualcost;
			document.getElementById(keyy).innerHTML = Stuff[keyy]["stored"].toFixed(1);
		
			costTxt += Math.round(actualcost*Buildings[buildkey]["costratio"]) + "&nbsp;" + keyy + "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		}//&nbsp; needs ';' right?
		costTxt = costTxt.slice(0,-70);

		if (!Buildings[buildkey]["buildOnce"]){
			document.getElementById(buildkey+"Costs").innerHTML = costTxt;	 //may be better way to do this but don't want to try to update cost that doesn't exist
		}

		//no we can't :(
	}  else {
		textAlert(ev, "need "+ txtNotEnough);// +" to build " + Buildings[buildkey]["name"]);
	}
	return(canbuild);
}
function buildUp(){
	for(var i=0;i<GlobVar.buildBuild.length;i++){
		if (GlobVar.buildConstruct[i]<100){
			GlobVar.buildConstruct[i]+=(100/Buildings[GlobVar.buildBuild[i]]["buildTime"]/10*GlobVar.time); //need to loop through buildkeys in array 1
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

	//re-direct to special building calls, should probably make a general special case here that includes all the biuldOnce buildings like town hall, bridge, marketplace. could have a switch/case or just a bunch of ifs to call finishing functions for new tabs etc. displaed
	if(buildkey == "councilhall"){
		Buildings.councilhall.count++;
		finishCouncil(index);
	} else {

		if(Buildings[buildkey]["count"]==0){
			
			//add the new jobs that the building unlocks
			for(var i=0;i<Buildings[buildkey]["unlockJob"].length;i++){
				var newJob = Buildings[buildkey]["unlockJob"][i];

				addJobElement(newJob);

				Jobs[newJob]["unlocked"]=true;
				document.getElementById(newJob+"s").innerHTML = Jobs[newJob]["workers"];
				document.getElementById(newJob+"sMax").innerHTML = Jobs[newJob]["maxworkers"];

			}
		}

		//add storage space
		for(var keyyy in Buildings[buildkey]["addstorage"]){
			Stuff[keyyy]["maxstored"]+=Buildings[buildkey]["addstorage"][keyyy];
			if(Stuff[keyyy]["unlocked"]){
				document.getElementById(keyyy + "Max").innerHTML = Stuff[keyyy]["maxstored"];
				document.getElementById(keyyy+"Stuff").querySelector(".resourceBarMax").innerHTML = Stuff[keyyy]["maxstored"];
			}
		}
		//add worker space (and free workers)
		for(let key4 in Buildings[buildkey]["addworker"]){
			if(key4 === "freeworker"){
				console.log("adding to freeworker");
				GlobVar.space+=Buildings[buildkey]["addworker"][key4];
				document.getElementById("workerspace").innerHTML = GlobVar.space-Jobs.freeworker.maxworkers;
			} else if (key4 === "child"){
				console.log("adding to "+key4+ ", currently "+Jobs[key4]["workers"]);
				Jobs[key4]["workers"]+=Buildings[buildkey]["addworker"][key4];
				Jobs[key4]["maxworkers"]+=Buildings[buildkey]["addworker"][key4];
				document.getElementById(key4+"s").innerHTML = Jobs[key4]["workers"];
				document.getElementById(key4+"sMax").innerHTML = Jobs[key4]["maxworkers"];
				console.log("now "+key4+ "has "+Jobs[key4]["workers"]);
			} else {
			Jobs[key4]["maxworkers"]+=Buildings[buildkey]["addworker"][key4];
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

		GlobVar.buildWorkers -= Buildings[buildkey]["buildWorkers"];//do I even use this variable? if so, need to update it in the food panic event bit and maybe somewhere will killing workers
		document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
		document.getElementById(buildkey + "progress").style.width = "0%";
		GlobVar.buildBuild.splice(index,1);
		GlobVar.buildConstruct.splice(index,1);

		
	}
	drawBuilding(buildkey,Buildings[buildkey]["count"]);
}

//////////////////////////////////////////////////////////////////////////unlocking buildings and the resources those buildings start with////////////////////////////////////////////////////////////////////////////////// 
function unlock(unlockkey){

	if(!Buildings[unlockkey]["unlocked"]){

		//adds newly unlocked resources
		for(var i=0;i<Buildings[unlockkey]["unlockRes"].length;i++){

			var tempStuff = Buildings[unlockkey]["unlockRes"][i];
			if(!Stuff[tempStuff]["unlocked"]){
				Stuff[tempStuff]["unlocked"] = true;

				addResourceLine(tempStuff);
			}
		}
		
		addBuildingButton(unlockkey);
		Buildings[unlockkey]["unlocked"] = true;

		var costTxt = " ";

		for(var key in Buildings[unlockkey]["cost"]){//make this output the same as the update cost output from addBuilding()
			costTxt += Buildings[unlockkey]["cost"][key].toFixed(0) + "&nbsp;" + key + ",&nbsp;";
		}

		costTxt = costTxt.slice(0,-7);

		document.getElementById(unlockkey+"Costs").innerHTML = costTxt;

		logStatement(Buildings[unlockkey]["statement"],"regular",true,true);

		return true;
	} else {
		return false;
	}
}

//////////////////////////////////////////////////////////////////////////research////////////////////////////////////////////////////////////////////////////////////
function SwapActiveRes(x){
	if(GlobVar.ActiveRes!==" "){
		document.getElementById(GlobVar.ActiveRes).className = "researchButton";
	}
	if(x!==" "){
		GlobVar.ActiveRes = x;
		console.log("set research to "+x);
		document.getElementById(GlobVar.ActiveRes).className = "researchButtonSelected";
		document.getElementById("research").innerHTML = Research[GlobVar.ActiveRes]["completion"];
		document.getElementById("researchStuff").querySelector(".resourceBarBar").style.width = (Research[GlobVar.ActiveRes]["completion"]/Research[GlobVar.ActiveRes]["totalRes"]*100)+"%";

		//need to check for 'resource bars on' here too and make resourceNums display:none? no, don't think so
		Stuff.research.maxstored=Research[x]["totalRes"];
		Stuff.research.stored=Research[x]["completion"];

		document.getElementById("researchMax").innerHTML = Research[GlobVar.ActiveRes]["totalRes"];
		document.getElementById("researchStuff").querySelector(".resourceBarMax").innerHTML=Research[GlobVar.ActiveRes]["totalRes"];

		Stuff.research.maxstored = Research[GlobVar.ActiveRes]["totalRes"];
	
		//change the tooltip for researchers
		var consumeStr = "";
		for(var i in Research[x]["resCost"]){
			consumeStr += Research[x]["resCost"][i]*5*GlobVar.factor + " " + i + " / sec<br>";
		}
		document.getElementById("researchersMake").innerHTML = Jobs.researcher.make.research*Jobs.researcher.workbonus*5*GlobVar.factor+" research / sec<br>and consumes:<br>"+consumeStr;
	}
}
var Research = {
	FarmEquip:	{name:"Farm Equipment",		resCost:{wood:2,lumber:1}, 		totalRes:1000, 	completion:0, unlocked:true,  done:false, reward:"Improves farmers' food output by 20%.", 						statement:"The farmers want to design a wooden plow and other<br>equipment which should improve crop output significantly."},
	StoneAxe:	{name:"Stone Axes",			resCost:{lumber:1,stone:2}, 	totalRes:1500, 	completion:0, unlocked:true,  done:false, reward:"Resets woodcutter and lumberworker output to 2.5/sec.", 		statement:"You notice that the axes that most of your comrads have<br>brought with them, and the few saws and other metal tools,<br>have been dulling and deteriorating to the point of uselessness.<br>It seems that the best course of action is to develop new<br>stone axes for felling trees and shaping them into boards."},
	//work on the CSS for the double-line entrees like Resource Management, may need a different style for single line and double line researches (use regular expressions???)
	//maybe just rename it so it's smaller and fits in the box?
	ResourceMgmt:{name:"Resource<br>Management",resCost:{food:.5},				totalRes:2000,  completion:0, unlocked:true,  done:false, reward:"Gives an optional setting for how resource amounts are displayed.", statement:"There is often uncertainty in town about which resources should be<br>prioritized. While it won't affect collection rate or storage, the Council<br>thinks you could implement a better system to account for stored resrouces."},
	StoneChisel:{name:"Stone Chisels",		resCost:{lumber:.5,rock:.5,stone:1},totalRes:1000,completion:0,unlocked:false,done:false, reward:"Increases output of both masons and rockcutters by 30%.", 		statement:"The most proficient mason, though he was new to cutting rock when he began,<br>thinks he can improve stone chisel design to increase output of both rock and stone."},
	FindOre:	{name:"Ore Finding",		resCost:{food:1,lumber:1},		totalRes:500, 	completion:0, unlocked:false, done:false, reward:"You may begin to explore the surrounding area for resources.", 	statement:"You decide that is about time to start exploring the surroundings area.<br>Before any souting parties leave though, several people should be trained to lookout for mining sites.<br>Requires at least 2 researchers (teacher and pupils)"},
	Smelting:	{name:"Smelting",			resCost:{brick:1,lumber:1,stone:1,wood:1},totalRes:2700,completion:0, unlocked:false, done:false, reward:"Figure out a way to smelt ore into usable metal.", 	statement:"With the right materials, the mining expert can<br>lead the design of kilns for smelting ores."},
	Brickmaking:{name:"Brickmaking",		resCost:{wood:1,clay:1},		totalRes:1000,	completion:0, unlocked:false, done:false, reward:"Learn to turn clay into bricks over wood fires.", 		statement:"Clay from the riverbank could be formed into bricks. Exactly how will take some tinkering."},

	//ideas for furute upgrades (implement above first)
	ResourcePlng:{name:"Resource<br>Planning",resCost:{food:.5},			totalRes:4000,  completion:0, unlocked:false, done:false, reward:"Gives an optional setting to mark required resources for resource-lacking new construction", statement:"The Council wants to be better-able to project how long it will<br>take to stockpile the resoruces needed for new construction."},
	Metalwork:	{name:"Metalworking",		resCost:{copper:.1,wood:1},		totalRes:1000, 	completion:0, unlocked:false, done:false, reward:"Can produce copper spears for the armory.", 					statement:"Now that you have access to copper, some folks decide to try smithing.<br>They will start by making crude metal weapons to protect the settlment from wild animals."},
	Roads:		{name:"Roadbuilding",		resCost:{wood:1,stone:3},		totalRes:5000,	completion:0, unlocked:false, done:false, reward:"Increases production of hillside, forest, and riverbank workers by 10%.",statement:"By building dedicated roads leading from the town to the various resource production<br>locations, workers can reduce travel time and improve output efficiency."},//add roads to the map
	Barns1:		{name:"Improve Barns",		resCost:{wood:1,lumber:1,stone:1},totalRes:2000,completion:0, unlocked:false, done:false, reward:"Increase barn storage by 20%. Barns will now require lumber.",statement:"Update plans for barn construction while improving all<br>current barns. This will allow for more raw material storage."},
	Planning:	{name:"City Planning",		resCost:{food:2,wood:1,stone:2},totalRes:2000,  completion:0, unlocked:false, done:false, reward:"Reduces cost ratio of all buildings by 10%.",					statement:"Several of the council members think that the settlement can reduce<br>the cost of new buildigns by creating a master plan<br>for the city. They start mapping zones on some of the paper <br>that has be donated by a few of the townsfolk, and will mark<br>out zones for new construction with stone markers."},//can add something to the map, like scrolling or zoning designations, idk
	BasicBuild: {name:"Basic Buildings",    resCost:{lumber:2,stone:1,brick:2},totalRes:3000,completion:0,unlocked:false, done:false, reward:"Allows construction of several new buildings", 				statement:"Townsfolk have been asking for new buildings that no one<br>is quite sure how to construct. A team of capernters will<br>work out designs that do not need advanced tools to build."},

	IronSmelt:	{name:"Iron Smelting",		resCost:{brick:1,lumber:1,stone:1,wood:1}},
	Metalwork2: {name:"Metalworking 2"},//create things out of iron like nails and saws - add a resource for construction material (nails, tools, shingles)
	Roads2:  	{name:"Improved roads"},//coblestone roads replace crude dirt roads
	Construction:{name:"Construction"},//lets you make buildings with nails and saws
	Cement:		{name:"Cement"},//more buildings
	Glass:		{name:"Glassmaking"},//windows and stuff?
	Overseer:   {name:"Affordable Housing", reward:"Reduces cost ratio of all housing buildings but they<br>will require one additional construction worker<br>and take 20% more time to build", statement:"The council is still not sure why the cost of buildings keeps increasing. They decide the each new housing project will need an overseer to keep track of resource usage."},
	Contractors:{name:"Contractors", reward:"Reduces building time by 30% but requires an additional<br>worker per building (additional 2 workers for buildings<br>that currently require 5 or more workers)", statement:"Some proficient builders have been identified over the last few<br>months, and the council taps them to lead new construction projects."},
	Rafts:		{name:"Raftbuilding", reward:"Can make rafts to explore along the river", statement:"The river is wide and too difficult to cross unaided. In order explore accross the river, you decide to construct a few rafts to carry explorers and supplies."},
//bridge should be it's own unique project like council hall (one time thing). Should be a research to plan it, and afer research button appears in town hall tab to build bridge (lots of resources and workers).
//once bridge is complete (not research) increase the rate of any resources found across the river by a lot.
	Bridge:		{name:"Bridge Planning", reward:"Design plans for contructing a bridge to allow exploring accross the river without needing rafts", statement:"The rafts can only carry so much weight, and the explorers have gone as far as they can using rafts. To allow further exploration accross the river and access to resources, you begin planning a massive construction project to put in a bridge."},
};
function addResearchButton(research){
	Research[research]["unlocked"] = true;

	var div = document.createElement("div");
	div.className = "researchButton";
	div.id = research;
	div.addEventListener("click",SwapResearchEvent);

	var uses = "";
	for(var i in Research[research]["resCost"]){
		uses += Research[research]["resCost"][i] + " " + i;
		uses += " and ";
	}
	uses = uses.slice(0,-5);
	div.innerHTML = "<div id ='"+ research + "resBar' class='resBar'> <p class='resText'>"+Research[research]["name"]+"</p></div><div class='tooltiptext'>"+Research[research]["statement"]+"<br><br>Takes "+Research[research]["totalRes"]+" research points<br>Uses "+uses+" per research<br><br>"+Research[research]["reward"]+"</div>";
	document.getElementById("pan3").insertBefore(div,document.getElementById("doneResBox"));
	alertPanel("pan3");
}
function makeTiny(researchStr){
	var resDiv = document.getElementById(researchStr);
	resDiv.className = "tinyRes";
	resDiv.removeChild(document.getElementById(researchStr+"resBar"));
	resDiv.removeEventListener("click",SwapResearchEvent);
	var p = document.createElement("p");
	if(Research[researchStr]["name"]==="Resource Management"){
		p.innerHTML = "Res Mgmt";
	} else if (Research[researchStr]["name"]==="Other long name here"){
		p.innerHTML = "other short name here";
	} else {
		p.innerHTML = Research[researchStr]["name"];
	}
	p.className = "tinyResText";
	resDiv.appendChild(p); // = Research[resUp]["name"];
	resDiv.querySelector(".tooltiptext").innerHTML = Research[researchStr]["reward"];
	resDiv.parentNode.removeChild(resDiv);
	document.getElementById("doneRes").insertBefore(resDiv,document.getElementById("finishedResSpacer"));
	console.log("trying to put "+ resDiv + " in front of "+document.getElementById("finishedResSpacer"));
	if(Research[researchStr]["done"]){
		console.log("research done: "+researchStr);
	} else{//don't do these things if the makeTiny call is on finished research from loading
		logStatement("Research complete:<br>"+Research[researchStr]["reward"],"research",true,false);
		doBonus(researchStr);
		GlobVar.ActiveRes = " ";
		Research[researchStr]["done"] = true;
	}
}
function researchIncr(resUp){

	var now = Date.now();
	var deltaTime = (now - GlobVar.previousTime)/1000;//time in seconds since last resource update, previousTime gets updated in incrRes function

	if(!Research[resUp]["done"]){

		var make = true;
		
		for(var resKey in Research[resUp]["resCost"]){

			var incr = Research[resUp]["resCost"][resKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]*deltaTime*5*GlobVar.factor;

			if(Stuff[resKey]["stored"]-incr<0 || !Stuff[resKey]["unlocked"]){//need to check all the required resources before consuming any
				make = false;
			}
		}
		//special cases
		if(GlobVar.ActiveRes==="FindOre"&&Jobs.researcher.workers<2){
			make=false;
		}

		if(make) {
			for(var incrKey in Research[resUp]["resCost"]){
				incr = -Research[resUp]["resCost"][incrKey]*Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]*GlobVar.factor;
				Stuff[incrKey]["rate"]+=incr;//don't I do the rate thing differently and not need this???
				Stuff[incrKey]["stored"]+= incr*deltaTime*5;
				document.getElementById(incrKey).innerHTML = Stuff[incrKey]["stored"].toFixed(1);
			}
			Research[resUp]["completion"]+= Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]*GlobVar.time*deltaTime*5; //can add research to efficiency which increase researcher output% but doesn't increase materials cost - need to add a new resEfficiency variable
			Stuff.research.rate = Jobs["researcher"]["workers"]*Jobs["researcher"]["workbonus"]*GlobVar.factor;

			document.getElementById(resUp + "resBar").style.width = Research[resUp]["completion"]/Research[resUp]["totalRes"]*100 + "%";

			if(Research[resUp]["completion"]>=Research[resUp]["totalRes"]){
				Research[resUp]["completion"]=Research[resUp]["totalRes"];

				makeTiny(resUp);

			}
			Stuff.research.stored = Research[resUp]["completion"];
		}
	}
}
function doBonus(resUp){//what to do when research is completed
	switch (resUp) {
		case "ResourceMgmt":
			document.getElementById("setting2").style.display="block";
			break;
	    case "FarmEquip":			
	        Jobs.farmer.workbonus = Jobs.farmer.workbonus*1.2;

			makeStr = "";
			consumeStr = "";
		
			for (var i in Jobs.farmer.make){
				if(Jobs["farmer"]["make"][i]>0){
					makeStr += Jobs["farmer"]["make"][i]*Jobs.farmer.workbonus*GlobVar.factor*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["farmer"]["make"][i]*Jobs.farmer.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}
			}
			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}
			makeStr = makeStr.slice(0,-4);
			document.getElementById("farmersMake").innerHTML = makeStr+consumeStr;

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
					makeStr += (Jobs["woodcutter"]["make"][i]*Jobs.woodcutter.workbonus*GlobVar.factor*5).toFixed(1) + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += (Jobs["woodcutter"]["make"][i]*Jobs.woodcutter.workbonus*GlobVar.factor*-5).toFixed(1) + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);
			document.getElementById("woodcuttersMake").innerHTML = makeStr+consumeStr;

			makeStr = "";
			consumeStr = "";

			for (var i in Jobs.lumberworker.make){
				if(Jobs["lumberworker"]["make"][i]>0){
					makeStr += Jobs["lumberworker"]["make"][i]*Jobs.lumberworker.workbonus*GlobVar.factor*5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += Jobs["lumberworker"]["make"][i]*Jobs.lumberworker.workbonus*GlobVar.factor*-5 + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				}

				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
			}

			if(consumeStr!==""){
				consumeStr = "<br>and consumes:<br>" + consumeStr;	
			}

			makeStr = makeStr.slice(0,-4);

			document.getElementById("lumberworkersMake").innerHTML = makeStr+consumeStr;

			var stoneStr = "One of the newest wanderers to join your camp used to supervise mining operations for the Great City. He offers to teach the group how to find ore and smelt it. After the training you will have good reason to begin scouting the surrounding area."
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
					makeStr += (Jobs["rockcutter"]["make"][i]*Jobs.rockcutter.workbonus*GlobVar.factor*5).toFixed(1) + " " + i + " / sec<br>"; //the 5 comes from ticks per second
				} else {
					consumeStr += (Jobs["rockcutter"]["make"][i]*Jobs.rockcutter.workbonus*GlobVar.factor*-5).toFixed(1) + " " + i + " / sec<br>"; //the 5 comes from ticks per second
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
		case "FindOre"://I feel like this should just be a hidden element written in the HTML file that gets visibility set to visible here and in onload (like build mine button) but I can add those three explore zone buttons like that and leave this here b/c it won't get generated in later game loads anyway
			//add an explore button to (mostly unsuccessfully) look for mining sites and expore the land
			var div = document.createElement("div");
			div.id = "exploreButton";
			div.className = "exploreButton";
			div.innerHTML = "<div class='tooltiptext' id='exploreTip'><p>Requires (<span id ='exploreWorkers'>1</span>) workers for the exploration party<br>The trip will need <span id='exploreCosts'>30 food</span></p></div><div id='exploreBar' class='buildBar'><p class='buildText' style='padding-top:15px'>Send a party to explore and<br> map the surrounding area</p></div>";
			div.addEventListener("click",exploreGo);
			document.getElementById("pan4").insertBefore(div,document.getElementById("#council1"));
			alertPanel("pan4");


			document.getElementById("council1").innerHTML="<i>In order to survey the surrounding land, primarily to uncover new resources, the Council decides to send out exploraion parties. The groups will meet at camp and carry extra food for their journeys. Trips will take more time and more people the further they roam from the town.</i>"
			break;
	    case "Smelting":
			unlock("kiln");
			addResearchButton("Metalwork");
			//need to add a newResearchButton() function;
	        break;
		case "Brickmaking":
			addJobElement("brickmaker");
			addResourceLine("brick");
			console.log("updating workshopCosts");
			document.getElementById("workshopAdds").innerHTML +="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;space for 2 brickmakers<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100 brick storage";			
			Buildings.workshop.addsText.push("space for 2 brickworkers");
			Buildings.workshop.addsText.push("100 brick storage");
			Buildings.workshop.addworker.brickmaker = 2;
			Buildings.workshop.addstorage.brick = 100;
			for(i=1;i<=Buildings.workshop.count;i++){
				Jobs.brickmaker.maxworkers+=2;
				Stuff.brick.maxstored+=100;
			}
			document.getElementById("brickmakersMax").innerHTML = Jobs.brickmaker.maxworkers;
			
	        break;
	    case "Metalwork":
			unlock("forge");
	       	break;
		case "Roads":
			for(var job in Jobs){
				if(Jobs[job]["box"]==="forest"||Jobs[job]["box"]==="hillside"||Jobs[job]["box"]==="riverbank"){
					Jobs[job]["workbonus"]*=1.1;
					if(Jobs[job]["unlocked"]){
						updateToolTip("job",job);
					}
				}
			}
			addResearchButton("Planning");
			drawRoads1();
			break;
		case "Barns1":
			Buildings.barn.cost.lumber = 50;

			var addsStr = "";
			for(var i in Buildings.barn.addstorage){
				Stuff[i]["maxstored"] += Buildings["barn"]["addstorage"][i]*.2*Buildings.barn.count;
				Buildings["barn"]["addstorage"][i] *=1.2;//so not a storebonus change, but a change to object parameters, does it matter?
				document.getElementById(i+"Max").innerHTML = Stuff[i]["maxstored"];
				document.getElementById(i+"Stuff").querySelector(".resourceBarMax").innerHTML = Stuff[i]["maxstored"];

				addsStr += Buildings["barn"]["addstorage"][i]+ " " + i+ " storage";
				addsStr +="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
			}
			addsStr = addsStr.slice(0,-70);
			document.getElementById("barnAdds").innerHTML = addsStr;

			updateToolTip("building","barn");
	        break;

		case "Planning":
			for(var i in Buildings){
				Buildings[i]["costratio"]=1+(Buildings[i]["costratio"]-1)*.9; 
				if(Buildings[i]["unlocked"]){
					updateToolTip("building",i);
				}
			}
			addResearchButton("BasicBuild");
			break;
		case "BasicBuild":
			unlock("silo");
			unlock("cabin");
			unlock("warehouse");//change warehouse to only unlock here and make brick storage in stoneyard, not warehouse
			break;
		case "Metalwork2":
			break;
		case "Roads2":
			break;
		case "Construction":
			break;
		case "Cement":
			break;
		case "Glass":
			break;
		case "ResourcePlng"://this needs to enable a check that get called in the check for resoures available.
			//not sure how to make this work
			GlobVar.resourceMark = true;//isn't JS great? don't need to declare this.
	}
}

////////////////////////////////////////////////////////////////////////////miscilanious functions////////////////////////////////////////////////////////////////////////////////////

//add in reasons that some workers in a given job die (explosion, bandits, murder/suicide)
function killWorkers(deadNum, job){//returns number of workers that couldn't be killed in that job
	if(job==="random"){//should this be weighted by number of workers in a given job, or are some jobs just more prone to dying? For now don't say where they died from
		let jobCounter = 0;
		let jobArray = [];
		for(let i in Jobs){
			if(Jobs[i]["unlocked"]&&Jobs[i]["workers"]>0){//stops initially trying to rand for 0-worker jobs but not jobs that fall to 0 during dying. may want to come back and if a job goes to 0 workers, remove it from the jobsArray before the next iteration of the while loop.
				jobArray[jobCounter]=i;
				console.log("into the array "+i);
				jobCounter++;
			}
		}

		if(Jobs.freeworker.maxworkers>deadNum){
			Jobs.freeworker.maxworkers-=deadNum;
		}else{
			alert("game over - too many people just died");//want to make sure big kill-offs only occur with moderate to high populations
		}

		while(deadNum>0){
			let killJob = jobArray[Math.floor(Math.random()*jobArray.length)];
			if(Jobs[killJob]["workers"]>0){
				Jobs[killJob]["workers"]--;
				document.getElementById(killJob+"s").innerHTML = Jobs[killJob]["workers"];
				deadNum--;
				console.log("killed a "+killJob);
			}//else just try again and eventually you will find a worker you can kill
		}
	}else{
		var jobWorkers = Jobs[job]["workers"];
		if(jobWorkers<deadNum){
			deadNum -= jobWorkers;
			console.log("Not enough workers in this job ("+job+") to kill off, "+deadNum+" not killed");//can kill them all and then call killWorkers again with 'random'; can just kill the number of workers and return the amount not killed (do this for now); etc
			Jobs[job]["workers"]=0;
			Jobs.freeworker.maxworkers -= jobWorkers;
		}else{
			Jobs[job]["workers"] -= deadNum;
			Jobs.freeworker.maxworkers -= deadNum;
			deadNum = 0;
		}
		document.getElementById(job+"s").innerHTML = Jobs[job]["workers"];
	}
	
	document.getElementById("freeworkersMax").innerHTML = Jobs.freeworker.maxworkers;
	document.getElementById("workerspace").innerHTML = GlobVar.space-Jobs.freeworker.maxworkers;
	return deadNum;
}
function alertPanel(pan){//should make this use 'jobs', 'buildings', 'map', etc instead of 'pan1', 'pan5';
	if(GlobVar.mark1!==pan&&GlobVar.mark2!==pan){
		document.getElementById("butt"+pan.slice(-1)).className = "buttAttn";
	}
}
function tryWorkerJoin(){
	if(Jobs.freeworker.maxworkers<GlobVar.space){
		if(GlobVar.cheating){
			GlobVar.mercyChance=100000;
		}
		GlobVar.mercyChance ++;
		if((Jobs.freeworker.maxworkers==1&&GlobVar.mercyChance>550)||Jobs.freeworker.maxworkers==2&&GlobVar.mercyChance>500||(Jobs.freeworker.maxworkers>2&& Math.random() <= GlobVar.workerChance + GlobVar.mercyChance*.000001)){
			Jobs.freeworker.maxworkers ++;
			Jobs.freeworker.workers ++;
			GlobVar.mercyChance = 0;
			document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
			document.getElementById("freeworkersMax").innerHTML = Jobs.freeworker.maxworkers;
			document.getElementById("workerspace").innerHTML = GlobVar.space - Jobs.freeworker.maxworkers;
		}
	}
}
function councilListen(e){
	addBuilding(e, "councilhall");
}
function mineListen(e){
	if(GlobVar.mineToken.length>0){
		switch(GlobVar.mineToken.shift()){
			case 0:
				logStatement("The mine site produced no usable resources","mine",true,true);
				//grey out the build mine button
				break;
			case 1:
				logStatement("The new mine produces copper ore. Add mineshafts to increase production","mine",true,true);
				//add building button for copper mine
				break;
			case 2:
				logStatement("The new mine produces iron ore. Add mineshafts to increase production","mine",true,true);
				//add building button for iron mine
				break;
			case 3:
				logStatement("The new mine produces coal. Add mineshafts to increase production","mine",true,true);
				//add building button for coal mine
				break;
		}
	} else {
		//make a pop-up floating text that there are no new sites to develop mines
		textAlert(e,"No more potential mining sites");
	}
	if(GlobVar.mineToken.length==0){
		//make the button inactive
		document.getElementById("buildMineButton").className = "buildingOff";
	}
}
function finishCouncil(index){//some of this can be run in finishBuilding() and then break out right after calling finishCouncil() for parts that are different
	Buildings.councilhall.unlocked = true;
	document.getElementById("buildCounc").style.display = "none";//why not just delete the element? maybe can show it again to 'upgrade town hall' and give new tech/new panel (make exploring manual)

	document.getElementById("butt3").style.display = "inline-block";	
	alertPanel("pan3");
	unlock("lab");//but want 'Research' to be on top
	let moveRes = document.getElementById("researchStuff");
	document.getElementById("stuff").removeChild(moveRes);
	document.getElementById("stuff").insertBefore(moveRes, document.getElementById("foodStuff"));
	moveRes.style.color = "green";
	
	logStatement("Council decree posted at Town Hall","council",true,false);
	addResearchButton("Barns1");//the first two research buttons are in the html file, I guess for reference? 
	addResearchButton("ResourceMgmt");

	document.getElementById("council1").style.visibility = "visible";
	Jobs.freeworker.workers += Buildings.councilhall.buildWorkers;
	GlobVar.buildWorkers -= Buildings.councilhall.buildWorkers;
	document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
	GlobVar.buildBuild.splice(index,1);
	GlobVar.buildConstruct.splice(index,1);
	logStatement(Research.FarmEquip.statement,"research",false,true);
	logStatement(Research.StoneAxe.statement,"research",false,true);
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
function logStatement(string, type, display, log){

	if(log){
		GlobVar.statementLog = string + "<br><br>" + GlobVar.statementLog;
		document.getElementById("logOut").innerHTML = GlobVar.statementLog;
	}
	
	if(display){
		GlobVar.pendingStatements.push(string);
		GlobVar.pendingStatements.push(type+"Msg");
		document.getElementById("statementNum").innerHTML = GlobVar.pendingStatements.length/2;

		if(GlobVar.pendingStatements.length===2){
		//	document.getElementById("statement").innerHTML = GlobVar.pendingStatements[0];
		//	document.getElementById("statement").className = type+"Msg";

			document.getElementById("message").innerHTML = string;//uhhh don't need this twice...
			document.getElementById("message").className = type+"Msg"; 
			document.getElementById("messagepop").className = "messagepop";
			GlobVar.paused=true;
		}
	}
}
function textAlert(ev, noGoStr){
	console.log(noGoStr);
	var y = ev.clientY+window.scrollY;
	var x = ev.clientX+window.scrollX;
	var div = document.createElement("div");
	div.innerHTML = noGoStr;
	div.className = "textAlert";
	div.style.top = (y-30)+"px";
	div.style.left = (x-60)+"px";
	GlobVar.textAlerts.push(div); 
	GlobVar.textAlerts.push(Date.now());
	document.body.appendChild(div);
}
function updateToolTip(kind,name){
	if(kind==="job"){
		var makeStr = "";
		var consumeStr ="";
		
		for (var i in Jobs[name]["make"]){
			if(Jobs[name]["make"][i]>0){
				makeStr += (Jobs[name]["make"][i]*Jobs[name]["workbonus"]*GlobVar.factor*5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
			} else {
				consumeStr += (Jobs[name]["make"][i]*Jobs[name]["workbonus"]*GlobVar.factor*-5).toFixed(1) + " " + Stuff[i]["name"].charAt(0).toLowerCase() + Stuff[i]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
			}
		}
		if(consumeStr!==""){
			consumeStr = "<br>and consumes:<br>" + consumeStr;	
		}
		makeStr = makeStr.slice(0,-4);
		document.getElementById(name +'sMake').innerHTML =  makeStr + consumeStr;
	} else if (kind==="building"&& !Buildings[name]["buildOnce"]){

		var addsText = ""
		for (var i=0;i<Buildings[name]["addsText"].length;i++){
			addsText+=Buildings[name]["addsText"][i];
			addsText+="<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		}
		addsText = addsText.slice(0,-70);
		//makes sure any changes in number of builders, costs, add get fixed

		var costTxt = " ";
		for(var keyy in Buildings[name]["cost"]){

			var actualcost = Math.round(Buildings[name]["cost"][keyy]*Math.pow(Buildings[name]["costratio"],Buildings[name]["count"]+Buildings[name]["tempCount"]-1));   //consider making function actualcost(buildkey,key) which returns value calculated value
			costTxt += Math.round(actualcost*Buildings[name]["costratio"]) + "&nbsp" + keyy + "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		}
		costTxt = costTxt.slice(0,-70);//did that fix it?

		document.getElementById(name+"Build").querySelector(".tooltiptext").innerHTML = "<p>Requires ("+ Buildings[name]["buildWorkers"] +") workers to build<br>Cost:&nbsp;<span id='"+ name +"Costs'> </span><br><br>Adds: <span id='"+ name +"Adds'>"+ addsText +"</span></p>";
		
		if (!Buildings[name]["buildOnce"]){
			document.getElementById(name+"Costs").innerHTML = costTxt;	 //may be better way to do this but don't want to try to update cost that doesn't exist
		}
	} else {
		console.log("trying to update a tooltip but no kind specified, or a buildOnce building");
	}
}
function closeMessage(){

	var n = GlobVar.pendingStatements.length;
	document.getElementById("statementNum").innerHTML = Math.max(n/2-1,0);

	if(n>0){//don't need this if? can't closeMessage if 0 messages, so n always > 0.
		let msgStyle = GlobVar.pendingStatements[1];
	
		if(msgStyle!=="starveMsg"&&msgStyle!=="councilMsg"&&msgStyle!=="exploreMsg"){// or any other stuff that shouldn't get logged
			document.getElementById("statementLog").style.borderColor = "orange";//make 'log' flash orange
			document.getElementById("statementLog").style.color = "orange";
		
			setTimeout(function(){//and back to white
				document.getElementById("statementLog").style.borderColor = "white";
				document.getElementById("statementLog").style.color = "white";
			},500);
		}
		GlobVar.pendingStatements.shift();
		GlobVar.pendingStatements.shift();//and the color
	}
	document.getElementById("message").className = "black";//so messages fade out and in.
	if(n>2){//load the next message
		
		setTimeout(function(){
			document.getElementById("message").innerHTML = GlobVar.pendingStatements[0];
			document.getElementById("message").className = GlobVar.pendingStatements[1];
			console.log("text set to: "+GlobVar.pendingStatements[0]+" and class set to: "+GlobVar.pendingStatements[1]);
		},500);
	} else {//close the message pop-up
		if(GlobVar.panic){//could also make background-color red instead of text because red text is alreay a -can't more workers' thing
			document.getElementById("hunterJob").querySelector(".userAdd0").style.transition = "color 0s";
			document.getElementById("hunterJob").querySelector(".userAdd0").style.color = "red";
			GlobVar.panic = false;
			setTimeout(function(){
				document.getElementById("hunterJob").querySelector(".userAdd0").style.transition = "color 7s 1s";
				document.getElementById("hunterJob").querySelector(".userAdd0").style.color = "black";
			},300);
		}
		
		setTimeout(function(){
			document.getElementById("messagepop").className = "messageHidden";
			GlobVar.paused=false;
		},100);
		
	}	
}
function enterName(){
	GlobVar.name = document.getElementById("nameStr").value;
	if(GlobVar.name===null||GlobVar.name===""||GlobVar.name===" "){
		GlobVar.name = "好阵营";
	} else {
		GlobVar.name = GlobVar.name[0].toUpperCase() + GlobVar.name.slice(1);
	}
	//need to take care of 'camp' 'hamlet' etc here (look up/update conditions)
	let newname = "";
	if(Buildings.shack.count<5){
		document.getElementById("")
	}
	if(GlobVar.space<5){
		newname = "A Lonely Beginning";
	} else if(Jobs.freeworker.maxworkers<20){
		newname = "Camp "+GlobVar.name;
	} else if(Jobs.freeworker.maxworkers<50) {
		newname = "Hamlet of "+GlobVar.name;
	} else if (Jobs.freeworker.maxworkers<=15000){
		newname = GlobVar.name + "town";
	} else {
		newname = "Cheating "+ GlobVar.name+" Cheatingtown";
	}
	document.getElementById("title").innerHTML = newname;
	document.getElementById("namePrompt").style.display="none";//can rename in settings now
}

function keyPressedWhatDo(e){
	var key = e.which || e.keyCode;
	if (key === 13) { // 13 is enter
		if(document.getElementById("namePrompt").style.display=="block"){
			console.log("enter key when namePrompt is up, close");
			enterName();
		} else if(document.getElementById("settingpop").style.display=="block") {
			console.log("enter key when settings is up, close");
			closeSettings();
		} else if(document.getElementById("messagepop").className=="messagepop"){
			console.log("enter key when messages is up, close");
			closeMessage();
		} else {//nothing to close...
			console.log("enter key pressed but IT DOES NOTHING!");
		}
	}
	  // code for enter
	if (key === 32){// 32 is spacebar I think
		//not sure what spacebar should do - pause game?
		if(!(document.getElementById("namePrompt").style.display==="block")){//don't override if typing in name
			GlobVar.paused = !(GlobVar.paused);
			e.preventDefault();
		}
		return false;
	}
}
function openSettings(){
	document.getElementById("settingpop").style.display="block";
	GlobVar.paused=true;
}
function closeSettings(){//could just make anonymous
	document.getElementById("settingpop").style.display = "none";
	GlobVar.paused=false;
}
function turnResourceBars(){
	
	if(document.getElementById("foodStuff").querySelector(".resourceBarBoxOff")){//not sure if this is the best way to do things. works for now.
		document.getElementById("setting2").querySelector(".settingButtonOff").innerHTML="On";
		document.getElementById("setting2").querySelector(".settingButtonOff").className="settingButtonOn";

		for(let i in Stuff){
			if(Stuff[i]["unlocked"]){
				//hide numbers, show bars
				document.getElementById(i+"Stuff").querySelector(".resNumsOn").className = "resNumsOff";
				document.getElementById(i+"Stuff").querySelector(".resourceBarBoxOff").className = "resourceBarBoxOn";
			}
		}
	} else {
		document.getElementById("setting2").querySelector(".settingButtonOn").innerHTML="Off";
		document.getElementById("setting2").querySelector(".settingButtonOn").className="settingButtonOff";

		for(let i in Stuff){
			if(Stuff[i]["unlocked"]){
				//hide bars, show numbers
				document.getElementById(i+"Stuff").querySelector(".resNumsOff").className = "resNumsOn";
				document.getElementById(i+"Stuff").querySelector(".resourceBarBoxOn").className = "resourceBarBoxOff";
			}
		}
	}
}
function renameSettlement(){
	document.getElementById("namePrompt").style.display="block";//special div just for this prompt
	document.getElementById("nameStr").value="";
	setTimeout(function(){document.getElementById("nameStr").focus();},100);
}


//////////////////////////////////////////////////////////////////////////exploring the land////////////////////////////////////////////////////////////////////////////////////
function exploreGo(ev){
	if(GlobVar.exploring){
		textAlert(ev, "We should wait until the last scouting party returns");
	} else {
		var explorers = Math.floor(Math.log(GlobVar.exploreCount+2)*2)+1;//how many people will go out exploring
		var explorersNext = Math.floor(Math.log(GlobVar.exploreCount+3)*2)+1;
		GlobVar.exploreNum = (explorers)*Math.pow(1.05,GlobVar.exploreCount-1);//the cost for this expedition (larger with distance and #of people)
		GlobVar.exploreNumNext = (explorersNext)*Math.pow(1.05,GlobVar.exploreCount);//cost for next expedition

		//need certain number of free workers and food for them to carry
		var go = true;	
		var noGoStr = "Not enough ";
		if(Jobs.freeworker.workers<explorers){
			noGoStr += "free workers, "
			go = false;
		}
		for(var i in GlobVar.exploreStuff){
			if(Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNum) > Stuff[i]["stored"]){
				go = false;
				noGoStr += Stuff[i]["name"]+", ";
			}
		}
		noGoStr = noGoStr.slice(0,-2);
		noGoStr += " for expedition"
 
		if(go){
			var tooltipStr = "";
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
			textAlert(ev, noGoStr);
		}
	}
}
function exploreUp(){
	GlobVar.exploreBar += GlobVar.time*1/(GlobVar.exploreNum);
	if(GlobVar.exploreBar>=100){
		GlobVar.exploreBar = 0;
		exploreEnd();
	}
	document.getElementById("exploreBar").style.width = GlobVar.exploreBar+"%";
}
function exploreEnd(){
	Jobs.freeworker.workers += Math.floor(Math.log(GlobVar.exploreCount+2)*2)+1;
	document.getElementById("freeworkers").innerHTML = Jobs.freeworker.workers;
	GlobVar.exploreCount++;
	console.log("ExploreCount: "+GlobVar.exploreCount);
	uncover();

	//should this be in a switch case statement instead? not sure what the difference is: }else if{ <or> case break;
	//discovery messages will still be here for now with 'x' in the array and have index Count#-2 in exploreMessage array
	if(GlobVar.exploreCount===4){
		//logStatement("The exploring party discovered a potential mining site. You can build a shaft to extract ore","discovery",true,true);
		
		drawMineSite(1);//am going to need to limit the number of mines somehow so that new mines show up in the right spot on the map. if you have not build mines and a new site opens up, where to place the mine (and when do give access to new ore?)
		//limit to three shafts at this loction, don't let new ore until all of these three have been built. remove click ability after the third, allows clicks again after discovering new mine sites
		//addJobElement("miner");//should i do this?
		//unlock("mine");

		//the following lines should be moved to the function that biulds a new mine. Make the miner job show up later too. A few pieces yet to clean up for the new discovering and building mines model.
		//also these should be copper miners, not just regular old miners, but check the miner job to see how it's labled.
	
		//need to do: add a number to the mineTokens array for a new copper mine
		GlobVar.mineToken.push(0);//the first mine is empty, LUL

		//make the buildMineButtonb vidible here
		document.getElementById("buildMineButton").style.visibility="visible";

	} else if(GlobVar.exploreCount===7) {//revisit this one for new system
		GlobVar.Token[10]=false;
		document.getElementById("mineBuild").className = "buildingButton";
		document.getElementById("mineBuild").addEventListener("click",addBuildingEvent);
		logStatement("The exploring party discovered another potential mining site. You can build a shaft to extract ore","discovery",true,true);
		drawMineSite(2);
		Buildings.mine.addworker.miner = 1;
		//need to fix tooltiptext and job name when "this mine produces copper ore" block executes
	} else if(GlobVar.exploreCount===10){
		logStatement("The exploring party found a site by the river to extract clay.","discovery",true,true);
		addResourceLine("clay");
		addJobElement("clayworker");
		addResearchButton("Brickmaking");
		
	} else if(GlobVar.exploreCount===13){
		logStatement("All the the immediate area around the base camp has been mapped. The next expeditions will need to venture futher along the valley or up the foothills.","discovery",true,true);
		addResearchButton("Roads");
	} else if(GlobVar.exploreCount===15) {
		killWorkers(4,"freeworker");
		logStatement("The last group of explorers was attacked by a wild animal and 4 explores died. They advise that all future exploring missions be armed.","discovery",true,true);
		logStatement("You help bury the dead and do what you can to calm the townsfolk. You should start making crude weapons as soon as you are able.","regular",true,true);
		//need to add a place and mechanic for making and storing weapons (need a few expensive items - should have a making... bar in the armory and only whole numbered items)
		//spears should be in the Stuff object by the resource line should appear somewhere else (different tab or below a line break in resource pannel)
		//also need a way to return some of the special items (and lose some of them each trip). for now just lose all of them
		GlobVar.exploreStuff.spear = 1;
		var tooltipStr = "";//tooltipUpdate() should be it's own function... lots to replace
		for (var i in GlobVar.exploreStuff){
			tooltipStr += Math.round(GlobVar.exploreStuff[i]*GlobVar.exploreNumNext) + " " + Stuff[i]["name"] + ",&nbsp;";
			//need to add in an update for the tooltip on sending an explore party - don't feel like it right now
		}
		tooltipStr = tooltipStr.slice(0,-7);
		document.getElementById("exploreCosts").innerHTML = tooltipStr;
	} else if (GlobVar.exploreCount===18) {
		logStatement("Your explorers find another mining site that should allow coal production.","discovery",true,true);
		//make miners select which mine??? have separate coal mines, copper, iron, etc?
	}
	
	 else {
		logStatement(GlobVar.exploreMessages[GlobVar.exploreCount-2],"explore",true,false);//should have an array of messages that get called exploreMsgArray[exploreCount]
	}
	//add in an ungrade or building with a small penalty to auto-explore if you have enough stuff?
	GlobVar.exploring = false;

	for(var x in GlobVar.exploreStuff){
		if(x!=="food" && document.getElementById(x)!==null){
			Stuff[x]["stored"]+=GlobVar["exploreStuff"][x]*GlobVar.exploreNum*.5;//return some of the resources except food (water is in resources 'pots' and those can get broken) - research to improve return rate "lecture on the importance of caring for stuff"
			if(Stuff[x]["stored"]>Stuff[x]["maxstored"]*Stuff[x]["storebonus"]){
				Stuff[x]["stored"]=Stuff[x]["maxstored"]*Stuff[x]["storebonus"];
			}
			document.getElementById(x).innerHTML = Stuff[x]["stored"].toFixed(1);//Aslo make an update resource function and replace lines like this with updateRes(resStr)
		}
	}
	alertPanel("pan6");//should really change this to title of panel (jobs, map, buildings) instead of panel number...
}

//////////////////////////////////////////////////////////////////////////cheating///////////////////////////////////////////////////////////////////////////////////
function Cheat(){
	GlobVar.cheating = true;
	GlobVar.time = 100;
}
function UnCheat(){
	GlobVar.cheating = false;
	GlobVar.time = 1;
}

//////////////////////////////////////////////////////////////////////////game loop////////////////////////////////////////////////////////////////////////////////////////
function run(){ 
	
	//transition and remove textAlerts
	for(var i=0; i<GlobVar.textAlerts.length; i+=2){
		if(Date.now() - GlobVar.textAlerts[i+1]>10){
			GlobVar.textAlerts[i].className = "textAlertFade";
		}
		if(Date.now() - GlobVar.textAlerts[i+1]>3000){
			i-=2;
			
			var div = GlobVar.textAlerts.shift();//remove the div
			GlobVar.textAlerts.shift();//also remove the time
			div.parentElement.removeChild(div);//should let it get trashed as it is no longer referenced when this loop ends
		}
	}

	if(!GlobVar.paused){//need anyhting else in a pause/unpause() function?
		
	//check for events met to unlock new content **TO DO** re-number tokens so that they go in order

		//win the game for now
		if(GlobVar.exploreCount>15&&Jobs.freeworker.maxworkers>34&&Stuff.copper.stored>0&&GlobVar.Token[99]&&Buildings.kiln.count>1){
			GlobVar.Token[99]=false;
			alert("That's it for now - check back later for more content. Thanks for playing!");
		}
		//make map tab alert on first built shed
		if(Buildings.shack.count===2&&GlobVar.Token[15]){
			GlobVar.Token[15]=false;
			alertPanel("pan6");
		}
		//first worker joins
		if(Jobs.freeworker.maxworkers>=2&& GlobVar.Token[1]){
			logStatement("Eventually another refugee wanders nearby, interested in what you are doing, and you convince him to join you in your work. Over time more people will surely come and stay if you have space to house them.","regular",true,true);
			GlobVar.Token[1] = false;	
		}
		//add forest box and woodcutter job
		if(Buildings.shack.count>=3&&Jobs.freeworker.maxworkers>2&& GlobVar.Token[2]){
			
			Stuff.wood.unlocked=true;

			addJobBox("forest");
			addJobElement("woodcutter");
			logStatement("Another wanderer joins your camp. Your new companions also carry axes, sharp for the time being. You suggest that you head back into the forest and cut more wood to continue building.","regular",true,true);
			GlobVar.Token[2] = false;
		}
		//statement - buildings cost more as you build them
		if(Buildings.shack.count==4&& GlobVar.Token[3]){
			logStatement("As you build more buildings they will require more resources. Why? Because that's what happens in this genre.","regular",true,true);
			GlobVar.Token[3] = false;
		}
		//change name
		if(Buildings.shack.count===5&& GlobVar.Token[0]){
			GlobVar.Token[0]=false;
			if(GlobVar.cheating){
				GlobVar.name="Cheating";
			} else {
				document.getElementById("settings").style.display="block";
				//here is where we make it glow document.getElementById("settings").className = "glow";
				logStatement("The wilderness is beginning to feel less lonely.","regular",true,true);
				document.getElementById("namePrompt").style.display="block";//special div just for this prompt
				setTimeout(function(){document.getElementById("nameStr").focus();},100);//not sure why I have to delay the focus, but it doesn't work without setTimeout
			}
		}
		//adds hillside box and rockcutter job
		if(Jobs.freeworker.maxworkers>=6&& GlobVar.Token[4]){

			addJobBox("hillside");
			console.log("added hillside");
			addJobElement("rockcutter");
			addResourceLine("rock");
			Stuff.rock.unlocked=true;
			logStatement("While wandering into the hills looking for the nightly firewood, one of the workers finds a small rocky clearing that can be turned into a quarry. The rock may be useful for new structures.","regular",true,true);
			drawBuilding("expandQ",1);
			console.log("drew quarry");
			GlobVar.Token[4] = false;
		}
		//unlocks shed (Woodshed)
		if(Buildings.shack.count===7){
			unlock("shed");
		}
		//story statement (could move later for better message flow)
		if(Buildings.shack.count===12&&GlobVar.Token[11]){
			GlobVar.Token[11]=false;
			logStatement("As the camp grows and residents becomes more familiar with eachother, some of them begin to discuss their past lives in the Great City.","regular",true,true);
			logStatement("Most of the refugees did specialized work and are still learning the basic struggle for survival, but they long to rebuild at least part of the society they once knew.","regular",true,true);
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
		if(Buildings.shed.count>3 && Buildings.expandQ.count>1){
			unlock("barn");
		}
		//unlocks lumberyard
		if(GlobVar.Token[14] && Buildings.shack.count>8 && Buildings.shed.count>4 && Buildings.barn.count>0){
			GlobVar.Token[14]=false;
			unlock("lumberyard");
			logStatement("Though you only have fairly simple tools, many showing signs of wear, the carpenter insists on setting up a lumberyard.","regular",true,true);
		}
		//unlocks stoneyard
		if(Buildings.shack.count>8 && Buildings.expandQ.count>2 && Buildings.lumberyard.count>0){
			unlock("workshop");
		}
		//unlocks hut
		if(!Buildings.hut.unlocked && Buildings.lumberyard.count>0 && Buildings.workshop.count>0){
			unlock("hut");
		}
		//makes townhall button visible (inline-block)
		if(Buildings.shack.count + Buildings.hut.count>=20 && GlobVar.Token[5]){
			logStatement("Though it may be premature, you have high hopes for the future growth of your little shanty town and decide to give the settlement a proper name.","regular",true,true);
			logStatement("You also decide that it is time to more formally organize, so you form a council to govern and make decisions.","regular",true,true);
			document.getElementById("title").innerHTML = "Hamlet of " + GlobVar.name;
			GlobVar.Token[5] = false;

			//give the town hall button a red color
			alertPanel("pan4");
			document.getElementById("butt4").style.display = "inline-block";
		}
		//increase rock and stone production 
		if(Research.StoneAxe.completion>350&&GlobVar.Token[6]){
			GlobVar.Token[6]=false;
			addResearchButton("StoneChisel");
			alertPanel("pan3");
		}
		//remove the first mine as useless //remove this statement as useless under new mine system
/*		if(Buildings.mine.tempCount===1&&GlobVar.Token[7]){
			GlobVar.Token[7] = false;
			if(GlobVar.Token[10]){
				document.getElementById("mineBuild").removeEventListener("click",addBuildingEvent);//should here also be the place to make it red out?
			}
		} */
		//this goes too
/*		if(Buildings.mine.count===1&&GlobVar.Token[8]){
			GlobVar.Token[8]=false;
			if(GlobVar.Token[10]){
				logStatement("The first mine yielded no usable resources. Another site must be located.",true,true)
				document.getElementById("mineBuild").className = "deadBuilding";
				console.log("mineBuild class: "+document.getElementById("mineBuild").className);
			} else {
				logStatement("The first mine yielded no usable resources. You can try building a mineshaft at the second location.","regular",true,true)
			}
		}*/
/*		if(Buildings.mine.count===2&&GlobVar.Token[9]){//another place to clean up with the new mine system
			GlobVar.Token[9]=false;
			logStatement("This mine produces copper ore which can be smelted into copper.","regular",true,true);
			//change mine buidling tooltiptext, miner job name and tooltiptext
			//need to adjust job.miner or buildings.mine properties here?
			//this innerHTML below will need to modified to include Stuff.copper.bonus is there is some prestiege modifier later
			document.getElementById("minerJob").querySelector(".userAdd").innerHTML='<b>&nbsp;Copper Miners: <span id="miners">1</span> / <span id="minersMax">1</span>&nbsp;</b><div class="tooltiptext"><p>Each copper miner makes: <br><span id="minersMake">0.3 Copper Ore / sec</span></p></div>'
			addResourceLine("cu_ore");
			//should I also rename the copper 
		} */
		//this doesn't need to get updated in game loop - should move to addworker function
		//adjusts the woodworker and lumberworker output as population grows to account for deteriorating axes. Could rewrite to be more general and re-usable
		if(!Research.StoneAxe.done&&GlobVar.pop!==Jobs.freeworker.maxworkers&&document.getElementById("forest")){
			GlobVar.pop = Jobs.freeworker.maxworkers;
			var bonus = 0;

			for(var i=1;i<=GlobVar.pop;i++){
				bonus+= Math.pow(0.92,GlobVar.pop-i)/GlobVar.pop;
			}

			for(var i=0; i<GlobVar.degrade.length; i++){
				
				var jobName = GlobVar.degrade[i];
				Jobs[jobName]["workbonus"] = bonus;

				var makeStr = "";
				var consumeStr ="";

				for (var j in Jobs[jobName]["make"]){
					if(Jobs[jobName]["make"][j]>0){
						makeStr += (Jobs[jobName]["make"][j]*Jobs[jobName]["workbonus"]*GlobVar.factor*5).toFixed(1) + " " + Stuff[j]["name"].charAt(0).toLowerCase() + Stuff[j]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
					} else {
						consumeStr += (Jobs[jobName]["make"][j]*Jobs[jobName]["workbonus"]*GlobVar.factor*-5).toFixed(1) + " " + Stuff[j]["name"].charAt(0).toLowerCase() + Stuff[j]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
					}

					//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
				}

				if(consumeStr!==""){
					consumeStr = "<br>and consumes:<br>" + consumeStr;	
				}

				makeStr = makeStr.slice(0,-4);
				if(document.getElementById(jobName + "sMake")){
					document.getElementById(jobName + "sMake").innerHTML = makeStr + consumeStr;
				}
			}
		}
		//unlock armory
		if(Buildings.forge.count>0&&GlobVar.Token[12]){
			GlobVar.Token[12]=false;
			unlock("armory");
		}
		//rename settlement to Town
		if(Jobs.freeworker.maxworkers>=50 && GlobVar.Token[13]){
			logStatement("The town is bustling. You feel a great sense of accomplishment, yet know there is much work to be done.","regular",true,true);
			document.getElementById("title").innerHTML = "Town of " + GlobVar.name;
			GlobVar.Token[13] = false;
		}

	//phase 1 done? - phase 2 unlocks from research - more phase 3 unlocks below?//
	//******************************************


		/////////continue the construction of new buildings - make this use deltaTime too
		if (GlobVar.buildBuild.length>0){
			buildUp()
		}



		//continue exploring
		if(GlobVar.exploring){
			exploreUp();
		}



	////////////////section to increment all stuff//////////////////////
	//the rate are updated in the run() function, the functions below this change resource amounts and write to the window

		//reset the 'rate' values for this loop to 0
		for(var i in Stuff){
			if(Stuff[i]["unlocked"]){
				Stuff[i]["rate"]=0;
				document.getElementById(i+"Rate").className = "rateZero";
			}
		}

		//////increment research///////////////////
		if(GlobVar.ActiveRes != " " && !Research[GlobVar.ActiveRes]["done"]){
			researchIncr(GlobVar.ActiveRes);
		}

		///////consume food/////////////////////////
		Stuff.food.stored -= ((Jobs.freeworker.maxworkers+Jobs.child.maxworkers*.53)*.6*GlobVar.factor)*((Date.now() - GlobVar.previousTime)/1000)*5;//deltaTime
		Stuff.food.rate -=   ((Jobs.freeworker.maxworkers+Jobs.child.maxworkers*.53)*.6*GlobVar.factor);

		//////increment resources///////////////////
		incrRes();

		//reset previous time for next cycle
		GlobVar.previousTime = Date.now();

		//output the rate values and the stored amounts
		//maybe make it so the rate only updates twice a second?
		for(var i in Stuff){
			if(Stuff[i]["unlocked"]){

				if (Stuff[i]["rateArray"].unshift(Stuff[i]["rate"])>15){
					Stuff[i]["rateArray"].pop();
				}
				let avgrate = 0;
				for (let j = 0; j<Stuff[i]["rateArray"].length;j++){
					avgrate += Stuff[i]["rateArray"][j];
				}
				avgrate = avgrate/Stuff[i]["rateArray"].length;

				if(Math.abs(Stuff[i]["rate"]-avgrate)<0.000001){//the rounding error makes it so I can't compare ===

					if(Stuff[i]["rate"]>0){
						document.getElementById(i+"Rate").className = "ratePos";
						document.getElementById(i+"Rate").innerHTML = "+"+(Stuff[i]["rate"]*5).toFixed(1);//why do I need the facotr of two here???
					} else if(Stuff[i]["rate"]===0) {
						document.getElementById(i+"Rate").className = "rateZero";
						document.getElementById(i+"Rate").innerHTML = (Stuff[i]["rate"]*5).toFixed(1);
					} else {
						document.getElementById(i+"Rate").className = "rateNeg";
						document.getElementById(i+"Rate").innerHTML = (Stuff[i]["rate"]*5).toFixed(1);
					}	
				} else {
					//make it yellow text here
					document.getElementById(i+"Rate").className = "rateChange";
					document.getElementById(i+"Rate").innerHTML = (avgrate*5).toFixed(1);
				}
				document.getElementById(i).innerHTML = Stuff[i]["stored"].toFixed(1);
				//this is fine, just make Stuff.research.maxstored get updated properly
				document.getElementById(i+"Stuff").querySelector(".resourceBarBar").style.width = (Stuff[i]["stored"]/Stuff[i]["maxstored"]*100)+"%";
			}			
		}

		//make buildings active or not
		validateBuildings();
		//incrResBuildings(); fix this to wrork with delta-time * rate
		if(GlobVar.cheating){
			for(var i in Stuff){
				if(Stuff[i]["unlocked"]){
					Stuff[i]["stored"]=Stuff[i]["maxstored"];
				}
			}
		}


		
		//If there is not enough food and kill off 25% of workers (leave children alone) and move everyone to hunting
		//<delete when done> 
		if(Stuff.food.stored<1){
			console.log("food stored at panic: "+Stuff.food.stored);
			if(Math.abs(Stuff.food.stored)>10*Stuff.food.maxstored){
				console.log("assume a re-load error");//still not sure why this happens or the best way to handle it but this works for now
				Stuff.food.stored = Stuff.food.maxstored*Stuff.food.storebonus;
			} else {
				let killWorkers = Math.ceil(Jobs.freeworker.maxworkers/4);

				document.body.className = "alert2"; //gets set back to class="normal" by a transition listener to make the flash effect (could make a setTimeout to change back the class...)
				GlobVar.panic = true;
				//need to come up with a different way to do this?
				GlobVar.pendingStatements.unshift("starveMsg");
				GlobVar.pendingStatements.unshift("In a food-shortage panic all available workers take to hunting.<br>["+killWorkers+"] workers have died of starvation.");
				document.getElementById("message").innerHTML = GlobVar.pendingStatements[0];
				document.getElementById("message").className = GlobVar.pendingStatements[1];
				document.getElementById("messagepop").className = "messagepop";
				GlobVar.paused=true;
				document.getElementById("statementNum").innerHTML = GlobVar.pendingStatements.length/2;//use that sweet JS type conversion;
			
				var tempFood = 0; 

				for(let i in GlobVar.buildBuild){
					//return the workers to freeworkers
					Jobs.freeworker.workers += Buildings[GlobVar.buildBuild[i]]["buildWorkers"];
					//return half the resources
					for(let j in Buildings[GlobVar.buildBuild[i]]["cost"]){
						Stuff[j]["stored"]+=Buildings[GlobVar.buildBuild[i]]["cost"][j]/2;
					}
					//set the build % bars back to 0
					document.getElementById(GlobVar.buildBuild[i] + "progress").style.width = "0%";
				}
				//remove all building buildings
				GlobVar.buildBuild=[];
				GlobVar.buildConstruct=[];

				for(var i in Jobs){
					
					if(Jobs[i]["unlocked"] && i!=="farmer" && i!=="child"){//add in any other protected people or food jobs

						tempFood+=Jobs[i]["workers"];
						Jobs[i]["workers"] = 0;
						document.getElementById(i + "s").innerHTML = Jobs[i]["workers"];
					}
				}
				Jobs.hunter.workers = tempFood-killWorkers;
				if(Jobs.hunter.workers<0){alert("starvation bug")}
				Jobs.freeworker.maxworkers -= killWorkers;
				Stuff.food.stored = Stuff.food.maxstored/3;
				document.getElementById("hunters").innerHTML = Jobs.hunter.workers;
				document.getElementById("freeworkersMax").innerHTML = Jobs.freeworker.maxworkers;
				document.getElementById("workerspace").innerHTML = GlobVar.space-Jobs.freeworker.maxworkers;

				if(Jobs.freeworker.maxworkers===0){
					setTimeout(function(){ alert("You have starved to death!  Game Over");
						resetYes();
						},1000);
				}
			}

		} 

		//see if a new worker joins
		tryWorkerJoin();

	} else {
		GlobVar.previousTime = Date.now();//so when paused don't build up a big delta time (negative food on message would lead to starvation for example)
	}
} setInterval(run,20);//changed from 200 - what is wrong now?
//////////////////////////////////////////////////////////////////////////end of game loop//////////////////////////////////////////////////////

//button to test a function
function testFunc(){
}

/////////////////////////////////////////local storage to save the game?///////////////
function storageAvailable(type) {//taken from MDN tutorial on Storage
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
function saveGame(){//add in the Jobs object for storage
	if (storageAvailable('localStorage')) {
		console.log('We can use localStorage');

		data.set("Stuff", Stuff);
		data.set("Buildings", Buildings);
		data.set("Jobs", Jobs);
		data.set("Research", Research);
		data.set("GlobVar", GlobVar);
		data.set("MapVars", MapVars);
		localStorage.setItem("Reset","saveLoad");

		//pop-up to show saved game
		if(document.getElementById("popupID")===null){
			var popup = document.createElement("div");
			popup.id = "popupID";
			popup.className = 'popupStyle'
			popup.innerHTML = "Game Saved";
			document.body.appendChild(popup);
			setTimeout(function(){document.getElementById("popupID").className= "popupTransition";console.log("className switched")},50);
			setTimeout(function(){document.getElementById("popupID").remove();},1500);
		}
	}
	else {
		alert('Too bad, no localStorage for us');
	}
} setInterval(saveGame, 5*60*1000);
function exportGame(){
	console.log("exporting");
	document.getElementById("exportWindow").className = "exportWindowOn";
	var exportStorage = {X_Stuff:Stuff,X_Buildings:Buildings,X_Jobs:Jobs,X_Research:Research,X_GlobVar:GlobVar,X_MapVars:MapVars};
	document.getElementById("exportStr").value = Base64.encode(JSON.stringify(exportStorage));
	document.getElementById("exportStr").select();
}
function closeExport(){
	document.getElementById("exportWindow").className = "exportWindowOff";
}
function openImportWindow(){
	document.getElementById("importWindow").className = "exportWindowOn";
}
function importGame(){
	console.log("importing");
	try { 
		var importStorage = JSON.parse(Base64.decode(document.getElementById("importStr").value));
		Stuff = importStorage.X_Stuff;
		Buildings = importStorage.X_Buildings;
		Jobs = importStorage.X_Jobs;
		Research = importStorage.X_Research;
		GlobVar = importStorage.X_GlobVar;
		MapVars = importStorage.X_MapVars;
		finishLoad();
	}
	catch(e) {
		alert("Error loading save string.\n\n"+e);
	}
}
function closeImport(){
	importGame();
	document.getElementById("importWindow").className = "exportWindowOff";
}
function loadGame(){//relaces the global objects with data in localstorage
	console.log("loading game");
	document.getElementById("loadingPopUp").style.display = "block";//this doesn't show up until after the loop in finishLoad() so it is useless. how do I make it appear first?
	if (storageAvailable("localStorage") && localStorage.getItem("GlobVar") !== null && localStorage.getItem("GlobVar")[0]==="{"){
		Stuff = data.get("Stuff");
		Buildings = data.get("Buildings"); 
		Jobs = data.get("Jobs");// GlobVar.nextCol = 1;//?? need to think about this
		GlobVar = data.get("GlobVar"); 
		Research = data.get("Research");
		MapVars = data.get("MapVars");
		console.log("got the objects");
		setTimeout(finishLoad(),10);//to try to get the 'loadding...' to pop up - seem to be using setTimeouts as a crutch now...
	} else {
		console.log("localStorage not available or no readable save in localStorage");
	}
}
function finishLoad(){//redoes boxes, researchs, messages, etc.
	GlobVar.paused=true;
	setup();//draws the map (in drawMap.js)
	
	console.log("trying to load...");
	
	//restore the open panels
	for(var i=1;i<=99;i++){
		var tempButt = document.getElementById("butt"+i);
		if(tempButt===null){break;}
		if(tempButt.style.display!=="none"){
			tempButt.className = "butt";
		}	
	}
	for(var i=1;i<=99;i++){
		var tempPan = document.getElementById("pan"+i);
		if(tempPan===null){break;}
		tempPan.style.display = "none";
	}

	//make elements visible that should be
	if(Buildings.shack.count>=5){
		document.getElementById("settings").style.display="block";
	}
	if(Research.ResourceMgmt.done===true){
		document.getElementById("setting2").style.display="block";
	}
/*	if(){
		document.getElementById("setting3").style.display="block";
	}*/

	//restore the right tabs
	document.getElementById(GlobVar.mark1).style.display = "inline-block";
	document.getElementById("butt"+GlobVar.mark1.slice(-1)).className = "buttSelected";
	document.getElementById(GlobVar.mark2).style.display = "inline-block";
	document.getElementById("butt"+GlobVar.mark2.slice(-1)).className = "buttSelected";

	var now = Date.now();
	var loadtime = GlobVar.previousTime;

	var delta = (now - loadtime)/1000;  //seconds since load; #of times to cycle at 1 second per call
	GlobVar.previousTime = now - 1000;  //1 second difference //this gets checked in incrRes() so need to set it here and it will be a constant until it gets updated in the run() loop
	
	//console.log("does loadingPopUp exist: "+typeof document.getElementById("loadingPopUp"));
	
	console.log("now: "+now+" loadtime: "+loadtime+" difference in second: "+(now-loadtime)/1000);

	//update to the stored values of all resources, maxes, buildings, costs; and delete anything that isn't unlocked
	for (var i in Stuff){
		if (Stuff[i]["unlocked"]){
			console.log("added resource "+i);
			//if the html element does not exist, make it
			if(document.getElementById(i+"Stuff")===null){
				addResourceLine(i);
			}
			//update the numbers
			document.getElementById(i).innerHTML = Stuff[i]["stored"].toFixed(1);
			document.getElementById(i+"Max").innerHTML = Stuff[i]["maxstored"].toFixed(0);
			document.getElementById(i+"Stuff").querySelector(".resourceBarMax").innerHTML = Stuff[i]["maxstored"];
		//if the element shouldn't exist but does, delete it
		} else if(document.getElementById(i+"Stuff")) {
			document.getElementById("stuff").removeChild(document.getElementById(i+"Stuff"));
		}
	}

	for (var i in Buildings){
		if (Buildings[i]["unlocked"] && !Buildings[i]["buildOnce"]){
			if(document.getElementById(i+"Build")===null){					
				addBuildingButton(i);
			}
				
			document.getElementById(i).innerHTML = Buildings[i]["count"];

			var costTxt = " ";
			for(var keyy in Buildings[i]["cost"]){

				var actualcost = Math.round(Buildings[i]["cost"][keyy]*Math.pow(Buildings[i]["costratio"],Buildings[i]["count"]+Buildings[i]["tempCount"]-1));   //consider making function actualcost(buildkey,key) which returns value calculated value
		
				costTxt += Math.round(actualcost*Buildings[i]["costratio"]) + "&nbsp" + keyy + "<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
			}
			costTxt = costTxt.slice(0,-56);
			document.getElementById(i+"Costs").innerHTML = costTxt;	

		} else if(document.getElementById(i+"Build")) {//may need some work once I add more unique buildings
			document.getElementById("pan2").removeChild(document.getElementById(i+"Build"));
		}
	}

	for(var i in Jobs){
		if(Jobs[i]["unlocked"]&&i!=="freeworker"&&i!=="child"){
			if(document.getElementById(i+"Job")===null){
				addJobElement(i);
			} else {//if the jobElement gets created, the tooltip is initialized then, but if the box already exists there may be a missmatch because of upgrades in the save so reset the tooltip text if the job is unlocked but the job element already exists
				var makeStr = "";
				var consumeStr ="";
	
				for (var j in Jobs[i]["make"]){
					if(Jobs[i]["make"][j]>0){
						makeStr += (Jobs[i]["make"][j]*Jobs[i]["workbonus"]*GlobVar.factor*5).toFixed(1) + " " + Stuff[j]["name"].charAt(0).toLowerCase() + Stuff[j]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
						console.log("Set makeStr of "+i+ " for "+ j +" to "+ (Jobs[i]["make"][j]*Jobs[i]["workbonus"]*GlobVar.factor*5).toFixed(1));
					} else {
						consumeStr += (Jobs[i]["make"][j]*Jobs[i]["workbonus"]*GlobVar.factor*-5).toFixed(1) + " " + Stuff[j]["name"].charAt(0).toLowerCase() + Stuff[j]["name"].slice(1) + " / sec<br>"; //the 5 comes from ticks per second
					}
				//buildings unlock resources for now, eventually research will, but not jobs - can also unlock resources with research or by building a building check in condistions part of run() loop -  remove buildings unlocking resources and make all Stuff.addResourceLine calls form conditions section otherwise I will need to add to Buildings[building][make] array with research, etc. nevermind, that is ok. let the buildings unlock initial things and unlock more by adjusting make array, is good that way
				}
				if(consumeStr!==""){
					consumeStr = "<br>and consumes:<br>" + consumeStr;	
				}
				makeStr = makeStr.slice(0,-4);
				document.getElementById(i+"sMake").innerHTML = makeStr + consumeStr;
			}
			document.getElementById(i+"s").innerHTML = Jobs[i]["workers"];
			document.getElementById(i+"sMax").innerHTML = Jobs[i]["maxworkers"];
		}
		else if(document.getElementById(i+"Job")) {
			document.getElementById(i+"Job").parentElement.removeChild(document.getElementById(i+"Job"));
		}
	}

	var jobBoxElem = document.querySelectorAll(".JobBox");
	for(var i=0; i<jobBoxElem.length; i++){//removes any extra jobBoxes
		var box = jobBoxElem[i].id;
		var keep = false;
		for(var j=0; j<GlobVar.JobBoxes.length; j++){
			if(box === GlobVar["JobBoxes"][j]){
				keep = true;
			}
		}
		if(!keep){
			document.getElementById(box).parentElement.removeChild(document.getElementById(box));
		}
	}

	//skip over Camp and freeworkers in the for loop because the box doesn't have the same tooltip formula
	document.getElementById("freeworkers").innerHTML = Jobs["freeworker"]["workers"];
	document.getElementById("freeworkersMax").innerHTML = Jobs["freeworker"]["maxworkers"];
	if(Jobs.child.unlocked){
		if(document.getElementById("childs")===null){
			addJobElement("child");
		}
		document.getElementById("childs").innerHTML = Jobs["child"]["workers"];
		document.getElementById("childsMax").innerHTML = Jobs["child"]["maxworkers"];
	} else {
		if(document.getElementById("childs")!=null){
			document.getElementById("childJob").parentElement.removeChild(document.getElementById("childJob"));
		}
	}

	//gain resources for the time lost (test - could be factor of 5 low right now)
	for(var i=0;i<delta;i++){
		var numJobsMaking = incrRes();
		document.getElementById("wood").innerHTML = Stuff.wood.stored;//why is this line here?
		if(numJobsMaking===0){
			console.log("break!");
			break;
		}
	}

	//make the active and finished research elements
	for (var i in Research){
		if (Research[i]["unlocked"]){
			if(document.getElementById(i)===null){		//don't make it if it exists			
				addResearchButton(i);
			}
			if( Research[i]["done"]){
				if(document.getElementById(i).className!=="tinyRes"){	//don't make small if already small
				    makeTiny(i);
				}
			} else {
				//make the research bar filled up %done
				document.getElementById(i + "resBar").style.width = Research[i]["completion"]/Research[i]["totalRes"]*100 + "%";
			}
		} else if(document.getElementById(i)) {//remove research boxes that are there now but haven't been unlocked in the save
			document.getElementById("pan3").removeChild(document.getElementById(i));
		}
	}
	SwapActiveRes(GlobVar.ActiveRes);

	//show the values that have been unlocked
	//if there are more than X people show buttons up to butt3
	//if there is a councilhall then show butt4
	//go through tokens in {if else} to see what else needs to be displayed
	//these should mostly be references Tokens, right? **TO DO** may want to simplify things later, will probably add here as reload bugs get reported.
	if(Jobs.freeworker.maxworkers>4){
		document.getElementById("title").innerHTML = "Camp " + GlobVar.name;
	}
	if(Jobs.freeworker.maxworkers>19){
		document.getElementById("title").innerHTML = "Hamlet of " + GlobVar.name;
		document.getElementById("butt1").style.display = "inline-block";
		document.getElementById("butt2").style.display = "inline-block";
		document.getElementById("butt4").style.display = "inline-block";
	}
	if(Buildings.councilhall.count>0){
		document.getElementById("butt3").style.display = "inline-block";
		document.getElementById("council1").style.visibility = "visible";
		document.getElementById("buildCounc").style.display = "none";
	}
	if(document.getElementById("exploreButton")===null && Research.FindOre.done){
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

	document.getElementById("loadingPopUp").style.display = "none";
	document.getElementById("logOut").innerHTML = GlobVar.statementLog;

	//show opened messages (for now only paused when there are messages, may need to change later)
	if(GlobVar.pendingStatements.length>0){
		document.getElementById("messagepop").className="messagepop";
		document.getElementById("message").className=GlobVar.pendingStatements[1];
		console.log("set class to :"+GlobVar.pendingStatements[1]);
	} else {
		document.getElementById("messagepop").className="messageHidden";
		document.getElementById("message").className="black";
		GlobVar.paused=false;
		console.log("unpaused at end of load");
	}

	if(document.getElementById("researchStuff")){
		//move research up, make green
		let moveRes = document.getElementById("researchStuff");
		console.log(moveRes);
		document.getElementById("stuff").removeChild(moveRes);
		document.getElementById("stuff").insertBefore(moveRes, document.getElementById("foodStuff"));
		moveRes.style.color = "green";
	}
} 
function resetGame(){
	document.getElementById("resetSure").style.display="block";
}
function resetYes(){
	document.getElementById("resetSure").style.display="none";
	localStorage.setItem("Reset","full");
	console.log("resetting everything");
	window.location.reload(false);
}
function resetNo(){
	document.getElementById("resetSure").style.display="none";
}
var deaths=0;//some late game thing that takes a lot of resources to attempt. The deaths of your brethren fuel you fight against the [foreign invaders]. 
function prestigeGame(){
	GlobVar.knowledge += Jobs.freeworker.maxworkers;
	GlobVar.resolve += deaths;
	localStorage.setItem("Knowledge",GlobVar.knowledge);
	localStorage.setItem("Resolve",GlobVar.resolve);
	localStorage.setItem("Reset","prestige");
	window.location.reload(false);//seems easiest
	console.log("can't see this");
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
//the following object was taken entirely from http://www.webtoolkit.info/javascript-base64.html according to their creative commons license
//it encodes and decodes strings and is used in importing and exporting saves
var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
		var c = 0;
		var c1 = 0;
		var c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


{/* Story ideas

Once you build up enough, barbarians attack you (must maintain troops and improve their armor/weapons - later can build walls or other fortifications to reduce number of soldiers needed for protection)
Once the city is very large whoever started the Great War comes for you
Say that you grow old and you pick a new leader after some time - could be related to prestige 
Some sort of exploring/making contact with the Great City or other civilizations (kittens?)
Electrical power


"As the town grows in size and reputation, more skilled workers are attracted. They offer insight and specialty on increasingly complex opperations"
*/
}