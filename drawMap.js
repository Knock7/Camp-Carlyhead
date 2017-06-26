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
		mineSpots:		[3857,2085, 3925,1910],
		warehouseSpots:	[],
		kilnSpots:		[],
		siloSpots:		[],
		cabinSpots:		[],
		councilhallSpots:[3330,2170], 	
	},

	exploreSpots:	[//each index has a group of coordinates of 50x50 blocks to reveal after that # exploration
		[3800,2100, 3800,2150, 3800,2050, 3800,2000, 3800,2200, 3800,2250, 3800,2300],
		[3800,2350, 3800,2400, 3800,2450, 3800,2500, 3800,2550, 3850,2400, 3850,2350],
		[3850,2300, 3850,2250, 3850,2200, 3850,2150, 3850,2100, 3850,2050, 3850,2000],//3 - discover mine 1
		[3800,1950, 3750,1900, 3700,1850, 3800,1900, 3750,1850, 3700,1800, 3650,1800],
		[3600,1800, 3550,1800, 3500,1800, 3450,1800, 3400,1800, 3350,1800, 3300,1800],
		[3850,1950, 3850,1900, 3800,1850, 3850,1850, 3900,1850, 3900,1900, 3900,1950],//6 - discover mine 2
		[3900,2000, 3900,2050, 3900,2100, 3900,2150, 3950,2000, 3950,2050, 3950,2100],
		[3050,1800, 3100,1800, 3150,1800, 3200,1800, 3250,1800, 3300,1750, 3350,1750],
		[2850,2200, 2850,2250, 2850,2300, 2850,2350, 2850,2400, 2850,2450, 2850,2500],//9 - discover clay
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

		mapBlack();//draw the accessable blackMap after drawing the source bigMap

		//draw all the buildings that currently exist, including the first shack
		for(var b in Buildings){
			if(Buildings[b]["unlocked"]){
				for(var i=1;i<=Buildings[b]["count"];i++){
					drawBuilding(b,i);
				}
			}
		}

		
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
	window.addEventListener('touchmove', function(e){ 
		if(curDown){
			e.preventDefault();
			var x = mapX + (curXPos - e.changedTouches[0].screenX)*zoomLvl*2/smallMapMax;
			var y = mapY + (curYPos - e.changedTouches[0].screenY)*zoomLvl*2/smallMapMax;

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
	}, { passive: false });
	smallCanvas.addEventListener('mousedown', function(e){ 
		curXPos = e.pageX; 
		curYPos = e.pageY; 
		curDown = true; 
	});
	smallCanvas.addEventListener('touchstart', function(e){ 
		curXPos = e.changedTouches[0].screenX; 
		curYPos = e.changedTouches[0].screenY;
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
	window.addEventListener('touchend', function(e){ //e.pageX doesn't work for touchscreen? need to take some time to write event handlers for touch on the map
		if(curDown){
			curDown = false; 
			mapX += (curXPos - e.changedTouches[0].screenX)*zoomLvl*2/smallMapMax;
			mapY += (curYPos - e.changedTouches[0].screenY)*zoomLvl*2/smallMapMax;
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


//need to fix - instead of chaging the bigMap, then painting it black on blackMap and copying to smallMap, change both big and black when drawing building, and only repaint big to black after exploring new areas and uncover()ing.
function mapBlack(){//don't call this unless you have to! (slows down computer)
	//paints the areas you have not explored before showing on the small canvas
	blackMap.drawImage(bigCanvas,0,0,bigMapMax,bigMapMax);
	blackMap.fillStyle = 'black';
	//blacks out 50x50 sections of the map according to blackout array
	for(var i=0;i<bigMapMax/50;i++){
		for(var j=0;j<bigMapMax/50;j++){
			if(blackout[i][j]){
				blackMap.fillRect(i*50,j*50,50,50);
			}
		}
	}
	dragDraw(mapX,mapY);
}
function uncover(){
	console.log("uncover "+ (GlobVar.exploreCount-1));
	if((GlobVar.exploreCount-1)>=MapVars.exploreSpots.length){
		console.log("need to add more coordinates to the exploreSpots array");
		return 0;
	}
	var x,y;
	for(var i=0;i<MapVars.exploreSpots[GlobVar.exploreCount-2].length;i+=2){
		x = MapVars.exploreSpots[GlobVar.exploreCount-2][i];
		y = MapVars.exploreSpots[GlobVar.exploreCount-2][i+1];
		blackout[Math.round(x/50)][Math.round(y/50)]=false;//50x50 is the smallest reveal chunk size
		blackMap.drawImage(bigCanvas,x,y,50,50,x,y,50,50);

		//may need to make the scroll area larger if the border is no longer black
		if(x<=minXscroll){
			minXscroll = Math.max(x-50,0);
		}
		if(x+50>=maxXscroll){
			maxXscroll = Math.min(x+100,bigMapMax);
		}
		if(y<=minYscroll){
			minYscroll = Math.max(y-50,0);
		}
		if(y+50>=maxYscroll){
			maxYscroll = Math.min(y+100,bigMapMax);
		}
	}
	dragDraw(mapX,mapY)
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
		blackMap.fillStyle = "grey";
		blackMap.fillRect(x,y,37,24);
		blackMap.beginPath();
		blackMap.arc(x+18,y,11,0,Math.PI,true);
		blackMap.fill();
		blackMap.fillStyle = "rgb(132, 86, 5)";
		blackMap.fillRect(x+3,y+3,14,18);
		blackMap.fillRect(x+20,y+3,14,18);
		blackMap.beginPath();
		blackMap.arc(x+18,y,8,0,Math.PI,true);
		blackMap.fill();
		break;
	case "shack":
		blackMap.fillStyle = 'rgb(79, 54, 2)';
        blackMap.fillRect(x, y, 16, 16);
        blackMap.beginPath();
        blackMap.moveTo(x,y);
        blackMap.lineTo(x+8,y-5);
        blackMap.lineTo(x+16,y);
        blackMap.fill();
		break;
	case "shed":
		blackMap.fillStyle = 'rgb(102, 84, 47)';
        blackMap.fillRect(x, y, 21, 10);
        blackMap.beginPath();
        blackMap.moveTo(x,y);
        blackMap.lineTo(x+8,y-4);
        blackMap.lineTo(x+21,y);
        blackMap.fill();
		break;
	case "expandQ":
		blackMap.fillStyle = 'rgb(86, 85, 82)';
        blackMap.beginPath();
        blackMap.arc(x,y,8,0,Math.PI*2,false);
        blackMap.fill();
		break;
	case "farm":
		blackMap.fillStyle = "yellow";
		blackMap.fillRect(x,y,60,60);
		break;
	case "barn":
		blackMap.fillStyle = "brown";
		blackMap.fillRect(x,y,20,15);
        blackMap.beginPath();
        blackMap.moveTo(x,y);
        blackMap.lineTo(x+3,y-9);
		blackMap.lineTo(x+10,y-14);
        blackMap.lineTo(x+17,y-9);
		blackMap.lineTo(x+20,y);
        blackMap.fill();		
		break;
	case "lumberyard":
		blackMap.fillStyle = "rgb(175, 149, 29)";
		blackMap.fillRect(x,y,35,12);
		break;
	case "workshop":
		blackMap.fillStyle = "grey";
		blackMap.fillRect(x,y,32,15);
		break;
	case "hut":
		blackMap.fillStyle = 'rgb(79, 54, 2)';
		blackMap.fillRect(x,y,18,15);
		blackMap.fillStyle = "grey";
		blackMap.fillRect(x+1,y+1,16,14);
		blackMap.fillStyle = 'rgb(79, 54, 2)';
		blackMap.beginPath();
			blackMap.moveTo(x,y);
        	blackMap.lineTo(x+3,y-8);
        	blackMap.lineTo(x+15,y-8);
			blackMap.lineTo(x+18,y);
        blackMap.fill();			
		break;
	case "lab":
		blackMap.fillStyle = "grey";
		blackMap.fillRect(x,y,12,24);
		blackMap.fillStyle = "rgb(132, 86, 5)";
		blackMap.fillRect(x,y+3,9,18);
		break;
	case "mine":
		blackMap.fillStyle = 'rgb(79, 54, 2)';
		blackMap.fillRect(x,y,15,15);
		blackMap.fillStyle = "black";
		blackMap.fillRect(x+3,y+3,9,12);
		break;
	case "warehouse":
		blackMap.fillStyle = "lightbrown";
		blackMap.fillRect(x,y,22,15);
		break;	
	case "kiln":
		blackMap.fillStyle = "red";
		blackMap.fillRect(x,y,9,4);
		break;
	case "silo":
		blackMap.fillStyle = "brown";
		blackMap.fillRect(x,y,9,24);
		break;
	case "cabin":
		blackMap.fillStyle = "brown";
		blackMap.fillRect(x,y,30,15);
		break;				
	default:
		console.log("no valid building input");
		break;
	}
	dragDraw(mapX,mapY);//what if when you uncover new area, it draws that section from bigMap over the section on blackedMap? seems faster. do that and just draw buildings to blackMap which will be the main map - bigMap is just to draw new terrain.
}
//draws the first quarry spot
function drawQuarry(){
	blackMap.fillStyle = 'rgb(86, 85, 82)';
	blackMap.beginPath();
	blackMap.arc(3674,1924,8,0,Math.PI*2,false);
	blackMap.fill();
	blackMap.closePath();
}
//draws the first set of dirt roads
function drawRoads1(){
	blackMap.strokeStyle = 'rgb(183, 125, 23)';
	blackMap.lineWidth = 3;
	blackMap.beginPath();
	blackMap.moveTo(2975,2300);
	blackMap.lineTo(3048,2133);
	blackMap.lineTo(3300,2125);
	blackMap.lineTo(3325,2000);
	blackMap.lineTo(3325,1950);
	blackMap.lineTo(3200,1955);
	blackMap.lineTo(3140,1950);
	blackMap.stroke();	
	dragDraw(mapX,mapY);	
}
//draws the sites to try mining
function drawMineSite(num){
	var x = MapVars.Spots.mineSpots[(num-1)*2];
	var y = MapVars.Spots.mineSpots[(num-1)*2+1];
	blackMap.strokeStyle = "red";
	blackMap.lineWidth = 2;
	blackMap.beginPath();
		blackMap.moveTo(x+1,y+1);
		blackMap.lineTo(x+13,y+13);
		blackMap.moveTo(x+13,y+1);
		blackMap.lineTo(x+1,y+13);
	blackMap.stroke();
	dragDraw(mapX,mapY)
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
			blackMap.strokeStyle = "red";
		} else {
			blackMap.strokeStyle = "black";
		}
		blackMap.beginPath();
		blackMap.moveTo(i*50,0);
		blackMap.lineTo(i*50,bigMapMax);
		blackMap.stroke();

		blackMap.moveTo(0,i*50);
		blackMap.lineTo(bigMapMax,i*50);
		blackMap.stroke();
	}
	blackMap.strokeStyle = "blue";
	blackMap.strokeText("3000,2000",2975,2000)
	dragDraw(mapX,mapY);
}