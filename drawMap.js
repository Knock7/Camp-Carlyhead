var bigCanvas, bigMap;
const bigMapMax=5000;//px size of the bigCanvas

var blackCanvas, blackMap;

//make all these variables properties of the MapVars
var curYPos, curXPos;
var curDown=false;
var mapX=2850;
var mapY=1800;
var zoomLvl = 500;//300 is the 1:1 mapping
var blackout = []
var minXscroll = 2850;
var minYscroll = 1800;
var maxXscroll = 3850;//limit the scrolling to just outside the black areas
var maxYscroll = 2800;
var maxZoomLvl = 500;//limit the max zoom (gets reset by uncover())
var minZoomLvl = 200;
var smallMapMax = 600;

//put all the other global variables in here and change this set of properties to be MapVars.Spots.shack etc.
var MapVars = {//			1			2			3			4		5			6			7		8			9			10
	Spots:{			
		shackSpots: 	[3095,2040, 3125,2045, 3158,2043, 3190,2030, 3217,2035, 3100,2070, 3135,2075, 3165,2071, 3200,2074, 3252,2030,
						3239,2058, 3275,2060, 3118,2099, 3150,2105, 3078,2105, 3177,2104, 3230,2098, 3261,2095, 3280,2025, 3070,2070],
		shedSpots: 		[3135,1999, 3085,2003, 3180,1990, 3110,1980, 3155,1970, 3200,1935, 3210,1968, 3102,1948, 3140,1930],
		expandQSpots: 	[3678,1925, 3682,1926, 3676,1927, 3684,1928, 3676,1929, 3678,1930, 3677,1927, 3676,1928],
		farmSpots: 		[3050,2150, 3125,2150, 3030,2225, 3105,2225],
		barnSpots: 		[3330,2030, 3333,2065, 3359,2033, 3363,2068],
		lumberyardSpots:[3228,2000, 3250,1975, 3278,1998, 3336,1997],
		workshopSpots:	[3400,2005, 3405,2030, 3445,2023, 3451,2048],
		hutSpots:		[3215,2170, 3240,2168, 3215,2200, 3240,2198, 3215,2230, 3240,2228, 3265,2166, 3265,2196, 3265,2226],
		labSpots:		[3367,2170, 3376,2170, 3385,2170, 3394,2170],
		mineSpots:		[3420,1935, 3410,2162, 3411,2164, 3413,2165],
		warehouseSpots:	[],
		kilnSpots:		[],
		siloSpots:		[],
		cabinSpots:		[],
		councilhallSpots:[3330,2170], 	
	},

	exploreSpots:	[//each index has a group of coordinates of 50x50 blocks to reveal after that # exploration
		[3800,2100, 3800,2150, 3800,2050, 3800,2000, 3800,2200, 3800,2250, 3800,2300],
		[],
		[],
		[],
		[],
		[],
	]
}

function setup(){
	smallCanvas = document.getElementById('canvas');
	smallMap = smallCanvas.getContext('2d');

	bigCanvas = document.getElementById('bigCanvas');
	bigMap = bigCanvas.getContext('2d');

	blackCanvas = document.getElementById('blackedCanvas');
	blackMap = blackCanvas.getContext('2d');

	bigMap.fillStyle = 'green';
	bigMap.fillRect(0,0,800,800);

	//draw the big map
  	base_image = new Image();
  	base_image.src = 'images/bigMapDraft2.png';
  	base_image.onload = function(){//draw the bigMap canvas after the image has loaded so that the shapes don't get covered up
    	bigMap.drawImage(base_image, 0, 0,bigMapMax,bigMapMax);

		bigMap.fillStyle = 'black';
		bigMap.beginPath();
		bigMap.arc(500, 500, 75, 0, Math.PI * 2, false);
		bigMap.fill();

		bigMap.fillStyle = 'orange';
		bigMap.fillRect(25, 25, 100, 100);

		bigMap.fillStyle = 'brown';
		bigMap.fillRect(750,750,800,800);
		bigMap.fillRect(150,600,200,800);
		console.log("big map loaded");

		//draw all the buildings that currently exist, including the first shack
		for(var b in Buildings){
			if(Buildings[b]["unlocked"]){
				for(var i=1;i<=Buildings[b]["count"];i++){
					drawBuilding(b,i);
				}
			}
		}

		mapBlack();//draw the accessable blackMap after drawing the source bigMap
	}

	
	smallCanvas.addEventListener("wheel",mapZoom,false);
	window.addEventListener('mousemove', function(e){ 
		if(curDown){
			var x = mapX + (curXPos - e.pageX)*zoomLvl*2/smallMapMax;
			var y = mapY + (curYPos - e.pageY)*zoomLvl*2/smallMapMax;

			//keep from scrolling outside the currently allowed area
			if(x<minXscroll){
				curXPos += (minXscroll - x)/(zoomLvl*2/smallMapMax);
				x=minXscroll;	
			}
			if(y<minYscroll){
				curYPos += (minYscroll - y)/(zoomLvl*2/smallMapMax);
				y=minYscroll;			
			}
			if(x+2*zoomLvl>maxXscroll){
				curXPos += (maxXscroll - (x + 2*zoomLvl))/(zoomLvl*2/smallMapMax);
				x= maxXscroll - 2*zoomLvl;		
			}
			if(y+2*zoomLvl>maxYscroll){
				curYPos += (maxYscroll - y - 2*zoomLvl)/(zoomLvl*2/smallMapMax);
				y= maxYscroll - 2*zoomLvl;		
			}

			dragDraw(x,y);
		}
	});
	smallCanvas.addEventListener('mousedown', function(e){ 
		curYPos = e.pageY; 
		curXPos = e.pageX; 
		curDown = true; 
	});
	window.addEventListener('mouseup', function(e){ 
		if(curDown){
			curDown = false; 
			mapX += (curXPos - e.pageX)*zoomLvl*2/smallMapMax;
			mapY += (curYPos - e.pageY)*zoomLvl*2/smallMapMax;
			if(mapX<0){mapX=0}
			if(mapY<0){mapY=0}
			if(mapX+2*zoomLvl>bigMapMax){mapX=bigMapMax - 2*zoomLvl}
			if(mapY+2*zoomLvl>bigMapMax){mapY=bigMapMax - 2*zoomLvl}
		}
	});
}
function dragDraw(x,y){
	smallMap.drawImage(blackCanvas, x, y, 2*zoomLvl, 2*zoomLvl, 0, 0, smallMapMax, smallMapMax);
}
function mapZoom(e){
	e.preventDefault();
	var destinationCanvas = document.getElementById("canvas");
	var sourceCanvas = blackCanvas;
	var destinationCtx = destinationCanvas.getContext('2d');

	maxZoomLvl = Math.min((maxXscroll-minXscroll)/2,(maxYscroll-minYscroll)/2);

	var changeInZoom = e.deltaY;
	if(zoomLvl+changeInZoom>maxZoomLvl||zoomLvl+changeInZoom<minZoomLvl){//300 is the minimum zoom level which takes a 600x600 shot of the blackedCanvas to display on the 600x600 small map canvas (1:1)
		console.log("trying to zoom out or in too far");
		return false;
	}

	zoomLvl += changeInZoom;
	mapX = mapX-changeInZoom;
	mapY = mapY-changeInZoom;

	if(mapX<minXscroll){
		mapX = minXscroll;
	} else if (mapX+zoomLvl*2>maxXscroll){
		mapX = maxXscroll - zoomLvl*2;
	}

	if(mapY<minYscroll){
		mapY = minYscroll;
	} else if (mapY+zoomLvl*2>maxYscroll){
		mapY = maxYscroll - zoomLvl*2;
	}


	destinationCtx.drawImage(sourceCanvas, mapX, mapY, 2*zoomLvl, 2*zoomLvl, 0, 0, smallMapMax, smallMapMax);
	
	
	return false;
}
//initially set the blackout parts of the map as everything outside the starting 900x900 area
for(var i=0; i<bigMapMax/50; i++){
	blackout[i] = [];
	for(var j=0; j<bigMapMax/50; j++){		
		if(i<=57||j<=36||i>=76||j>=55){
			blackout[i][j] = true;
		} else {
			blackout[i][j] = false;
		}
	}
}
//and the corners to make it more circular
blackout[58][37]=true; blackout[59][37]=true; blackout[58][38]=true;
blackout[75][37]=true; blackout[74][37]=true; blackout[75][38]=true;
blackout[58][54]=true; blackout[58][53]=true; blackout[59][54]=true;
blackout[75][54]=true; blackout[74][54]=true; blackout[75][53]=true;



function mapBlack(){
	//paints the areas you have not explored before showing on the small canvas
	blackMap.drawImage(bigCanvas,0,0,bigMapMax,bigMapMax);
	//blacks out 50x50 sections of the map according to blackout array
	for(var i=0;i<bigMapMax/50;i++){
		for(var j=0;j<bigMapMax/50;j++){
			if(blackout[i][j]){
				blackMap.fillStyle = 'black';
				blackMap.fillRect(i*50,j*50,50,50);
			}
		}
	}
	dragDraw(mapX,mapY);
}

function uncover(){
	if((GlobVar.exploreCount-2)*2>=MapVars.exploreSpots.length){
		console.log("need to add more coordinates to the exploreSpots array");
		return 0;
	}
	var x,y;
	for(var i=0;i<MapVars.exploreSpots[GlobVar.exploreCount-2].length;i+=2){
		x = MapVars.exploreSpots[GlobVar.exploreCount-2][i];
		y = MapVars.exploreSpots[GlobVar.exploreCount-2][i+1];
		blackout[Math.round(x/50)][Math.round(y/50)]=false;//50x50 is the smallest reveal chunk size

		//may need to make the scroll area larger if the border is no longer black
		if(x<minXscroll){
			minXscroll = Math.max(x-50,0);
		}
		if(x+50>=maxXscroll){
			maxXscroll = Math.min(x+100,bigMapMax);
		}
		if(y<minYscroll){
			minYscroll = Math.max(y-50,0);
		}
		if(y+50>=maxYscroll){
			maxYscroll = Math.min(y+100,bigMapMax);
		}
	}
	mapBlack();
}

/*
now all 
*/

///////////////////////////draw shapes!///////////////

//window.addEventListener("load",loadUp);

function loadUp(){
    document.getElementById("button1").addEventListener("click",drawShack);
    document.getElementById("button2").addEventListener("click",drawShed);
    document.getElementById("button3").addEventListener("click",drawQuarry);
    document.getElementById("button4").addEventListener("click",drawShed);
    document.getElementById("button5").addEventListener("click",drawShed);
    document.getElementById("button6").addEventListener("click",drawShed);
}
function drawBuilding(name,number){
	if((number-1)*2>=MapVars["Spots"][name+"Spots"].length){
		console.log("need to add more coordinates to the "+name+"Spots array");
		return 0;
	}
	var x = MapVars["Spots"][name+"Spots"][2*(number-1)];
	var y = MapVars["Spots"][name+"Spots"][1+2*(number-1)];
	switch (name) {
	case "councilhall":
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x,y,37,24);
		bigMap.beginPath();
		bigMap.arc(x+18,y,11,0,Math.PI,true);
		bigMap.fill();
		bigMap.fillStyle = "rgb(132, 86, 5)";
		bigMap.fillRect(x+3,y+3,14,18);
		bigMap.fillRect(x+20,y+3,14,18);
		bigMap.beginPath();
		bigMap.arc(x+18,y,8,0,Math.PI,true);
		bigMap.fill();
		break;
	case "shack":
		bigMap.fillStyle = 'rgb(79, 54, 2)';
        bigMap.fillRect(x, y, 16, 16);
        bigMap.beginPath();
        bigMap.moveTo(x,y);
        bigMap.lineTo(x+8,y-5);
        bigMap.lineTo(x+16,y);
        bigMap.fill();
		break;
	case "shed":
		bigMap.fillStyle = 'rgb(102, 84, 47)';
        bigMap.fillRect(x, y, 21, 10);
        bigMap.beginPath();
        bigMap.moveTo(x,y);
        bigMap.lineTo(x+8,y-4);
        bigMap.lineTo(x+21,y);
        bigMap.fill();
		break;
	case "expandQ":
		bigMap.fillStyle = 'rgb(86, 85, 82)';
        bigMap.beginPath();
        bigMap.arc(x,y,8,0,Math.PI*2,false);
        bigMap.fill();
		break;
	case "farm":
		bigMap.fillStyle = "yellow";
		bigMap.fillRect(x,y,60,60);
		break;
	case "barn":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,20,15);
        bigMap.beginPath();
        bigMap.moveTo(x,y);
        bigMap.lineTo(x+3,y-9);
		bigMap.lineTo(x+10,y-14);
        bigMap.lineTo(x+17,y-9);
		bigMap.lineTo(x+20,y);
        bigMap.fill();		
		break;
	case "lumberyard":
		bigMap.fillStyle = "rgb(175, 149, 29)";
		bigMap.fillRect(x,y,35,12);
		break;
	case "workshop":
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x,y,32,15);
		break;
	case "hut":
		bigMap.fillStyle = 'rgb(79, 54, 2)';
		bigMap.fillRect(x,y,18,15);
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x+1,y+1,16,14);
		bigMap.fillStyle = 'rgb(79, 54, 2)';
		bigMap.beginPath();
		bigMap.moveTo(x,y);
        bigMap.lineTo(x+3,y-8);
        bigMap.lineTo(x+15,y-8);
		bigMap.lineTo(x+18,y);
        bigMap.fill();			
		break;
	case "lab":
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x,y,12,24);
		bigMap.fillStyle = "rgb(132, 86, 5)";
		bigMap.fillRect(x,y+3,9,18);
		break;
	case "mine":
		bigMap.fillStyle = 'rgb(79, 54, 2)';
		bigMap.fillRect(x,y,15,15);
		bigMap.fillStyle = "black";
		bigMap.fillRect(x+3,y+3,9,12);
		break;
	case "warehouse":
		bigMap.fillStyle = "lightbrown";
		bigMap.fillRect(x,y,22,15);
		break;	
	case "kiln":
		bigMap.fillStyle = "red";
		bigMap.fillRect(x,y,9,4);
		break;
	case "silo":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,9,24);
		break;
	case "cabin":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,30,15);
		break;				
	default:
		console.log("no valid building input");
		break;
	}
	mapBlack();
}
function drawQuarry(){
	bigMap.fillStyle = 'rgb(86, 85, 82)';
	bigMap.beginPath();
	bigMap.arc(3674,1924,8,0,Math.PI*2,false);
	bigMap.fill();
	bigMap.closePath();
}
function drawRoads1(){
	bigMap.strokeStyle = 'rgb(183, 125, 23)';
	bigMap.lineWidth = 3;
	bigMap.beginPath();
	bigMap.moveTo(2975,2300);
	bigMap.lineTo(3048,2133);
	bigMap.lineTo(3300,2125);
	bigMap.lineTo(3325,2000);
	bigMap.lineTo(3325,1950);
	bigMap.lineTo(3200,1955);
	bigMap.lineTo(3140,1950);
	bigMap.stroke();	
	mapBlack();	
}

function testDraw(name){
	if(name==="all"){

		for(var s in MapVars.Spots){
			for(var i=1;i<=(MapVars["Spots"][s].length)/2;i++){
				console.log("drew building");
				drawBuilding(s.slice(0,-5),i);
			}
		}

	} else {
		for(var i=1;i<=(MapVars["Spots"][name+"Spots"].length)/2;i++){
			console.log("drew building");
			drawBuilding(name,i);
		}
	}
}

function linesOnBigMap(){

	for(var i=1;i<bigMapMax/50;i++){
		console.log("i:"+i);
		if(i%5===0){
			bigMap.strokeStyle = "red";
		} else {
			bigMap.strokeStyle = "black";
		}
		bigMap.beginPath();
		bigMap.moveTo(i*50,0);
		bigMap.lineTo(i*50,bigMapMax);
		bigMap.stroke();

		bigMap.moveTo(0,i*50);
		bigMap.lineTo(bigMapMax,i*50);
		bigMap.stroke();
	}
	bigMap.strokeStyle = "blue";
	bigMap.strokeText("3000,2000",2975,2000)
	mapBlack();
}