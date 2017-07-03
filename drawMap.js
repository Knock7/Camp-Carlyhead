var MapVars = {//			1			2			3			4		5			6			7		8			9			10
	Spots:{			
		shack: 		[3095,2040, 3125,2045, 3158,2043, 3190,2030, 3217,2035, 3100,2070, 3135,2075, 3165,2071, 3200,2074, 3252,2030,
					 3239,2058, 3275,2060, 3118,2099, 3150,2105, 3078,2105, 3177,2104, 3230,2098, 3261,2095, 3280,2025, 3070,2070],
		shed: 		[3135,1999, 3085,2003, 3180,1990, 3110,1980, 3155,1970, 3200,1935, 3210,1968, 3102,1948, 3140,1930],
		expandQ: 	[3678,1925, 3682,1926, 3676,1927, 3684,1928, 3676,1929, 3678,1930, 3677,1927, 3676,1928],
		farm: 		[3050,2150, 3125,2150, 3030,2225, 3105,2225],
		barn: 		[3330,2030, 3333,2065, 3359,2033, 3363,2068],
		lumberyard:	[3228,2000, 3250,1975, 3278,1998, 3336,1997],
		workshop:	[3400,2005, 3405,2030, 3445,2023, 3451,2048],
		hut:		[3215,2170, 3240,2168, 3215,2200, 3240,2198, 3215,2230, 3240,2228, 3265,2166, 3265,2196, 3265,2226],
		lab:		[3367,2170, 3376,2170, 3385,2170, 3394,2170],
		mine:		[3857,2085, 3925,1910],
		warehouse:	[],
		kiln:		[],
		silo:		[],
		cabin:		[],
		councilhall:[3330,2170], 	
		forge:		[],
		armory:		[],
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
		[2850,2550, 2800,2500, 2800,2450, 2800,2400, 2800,2350, 2800,2550, 2850,2600],
		[2900,2650, 2950,2700, 3000,2750, 3050,2750, 3100,2750, 3150,2750, 3200,2750],
		[3150,1750, 3200,1750, 3250,1750, 3200,1700, 3250,1700, 3300,1700, 3350,1700],//12 - explored all areas (move this b/c not explored all araes)
		[3400,1700, 3400,1750, 3450,1700, 3450,1750, 3500,1700, 3500,1750, 3550,1750],
		[],//14 - need spears next trip
		[],
		[],
		[],
	],
	curYPos:0, 
	curXPos:0,
	curDown:false,
	mapX:2850,
	mapY:1800,
	zoomLvl: 500,//300 is the 1:1 mapping
	blackout: [],
	minXscroll: 2850,
	minYscroll: 1800,
	maxXscroll: 3850,//limit the scrolling to just outside the black areas
	maxYscroll: 2800,
	maxZoomLvl: 500,//limit the max zoom (gets reset by uncover())
	minZoomLvl: 200,
	smallMapMax: 600,
	bigMapMax:5000,//px size of the bigCanvas (constant)

	/*don't need these because they get added when they get values in setup(). these will be properties saved for loading though, so keep them here for reference?
	bigCanvas: null, 
	bigMap,
	blackCanvas, 
	blackMap,
	smallCanvas,
	smallMap,
	*/
}

function setup(){
	//put the following into loadMap() which gets called here
	MapVars.smallCanvas = document.getElementById('canvas');
	MapVars.smallMap = MapVars.smallCanvas.getContext('2d');
	console.log("smallMap is set: "+typeof MapVars.smallMap+MapVars.smallMap);

	MapVars.bigCanvas = document.getElementById('bigCanvas');
	MapVars.bigMap = MapVars.bigCanvas.getContext('2d');
	console.log("bigMap is set: "+typeof MapVars.bigMap+MapVars.bigMap);

	MapVars.blackCanvas = document.getElementById('blackedCanvas');
	MapVars.blackMap = MapVars.blackCanvas.getContext('2d');
	console.log("blackMap is set: "+typeof MapVars.blackMap+MapVars.blackMap);

	//initialize blackout array if it is empty;
	if(MapVars.blackout.length===0){
		setBlackout();
	}

	//draw the big map
  	base_image = new Image();
  	base_image.src = 'images/bigMapDraft2.png';
  	base_image.onload = function(){//draw the bigMap canvas after the image has loaded so that the shapes don't get covered up
    	MapVars.bigMap.drawImage(base_image, 0, 0,MapVars.bigMapMax,MapVars.bigMapMax);
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

	
	MapVars.smallCanvas.addEventListener("wheel",mapZoom,false);
	window.addEventListener('mousemove', function(e){ 
		if(MapVars.curDown){
			var x = MapVars.mapX + (MapVars.curXPos - e.pageX)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			var y = MapVars.mapY + (MapVars.curYPos - e.pageY)*MapVars.zoomLvl*2/MapVars.smallMapMax;

			//keep from scrolling outside the currently allowed area
			if(x<MapVars.minXscroll){
				MapVars.curXPos += (MapVars.minXscroll - x)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				x=MapVars.minXscroll;	
			}
			if(y<MapVars.minYscroll){
				MapVars.curYPos += (MapVars.minYscroll - y)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				y=MapVars.minYscroll;			
			}
			if(x+2*MapVars.zoomLvl>MapVars.maxXscroll){
				MapVars.curXPos += (MapVars.maxXscroll - (x + 2*MapVars.zoomLvl))/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				x= MapVars.maxXscroll - 2*MapVars.zoomLvl;		
			}
			if(y+2*MapVars.zoomLvl>MapVars.maxYscroll){
				MapVars.curYPos += (MapVars.maxYscroll - y - 2*MapVars.zoomLvl)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				y= MapVars.maxYscroll - 2*MapVars.zoomLvl;		
			}

			dragDraw(x,y);
		}
	});
	window.addEventListener('touchmove', function(e){ 
		if(MapVars.curDown){
			e.preventDefault();
			var x = MapVars.mapX + (MapVars.curXPos - e.changedTouches[0].screenX)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			var y = MapVars.mapY + (MapVars.curYPos - e.changedTouches[0].screenY)*MapVars.zoomLvl*2/MapVars.smallMapMax;

			//keep from scrolling outside the currently allowed area
			if(x<MapVars.minXscroll){
				MapVars.curXPos += (MapVars.minXscroll - x)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				x=MapVars.minXscroll;	
			}
			if(y<MapVars.minYscroll){
				MapVars.curYPos += (MapVars.minYscroll - y)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				y=MapVars.minYscroll;			
			}
			if(x+2*MapVars.zoomLvl>MapVars.maxXscroll){
				MapVars.curXPos += (MapVars.maxXscroll - (x + 2*MapVars.zoomLvl))/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				x= MapVars.maxXscroll - 2*MapVars.zoomLvl;		
			}
			if(y+2*MapVars.zoomLvl>MapVars.maxYscroll){
				MapVars.curYPos += (MapVars.maxYscroll - y - 2*MapVars.zoomLvl)/(MapVars.zoomLvl*2/MapVars.smallMapMax);
				y= MapVars.maxYscroll - 2*MapVars.zoomLvl;		
			}
			dragDraw(x,y);
		}
	}, { passive: false });
	MapVars.smallCanvas.addEventListener('mousedown', function(e){ 
		MapVars.curXPos = e.pageX; 
		MapVars.curYPos = e.pageY; 
		MapVars.curDown = true; 
	});
	MapVars.smallCanvas.addEventListener('touchstart', function(e){ 
		MapVars.curXPos = e.changedTouches[0].screenX; 
		MapVars.curYPos = e.changedTouches[0].screenY;
		MapVars.curDown = true; 
	});
	window.addEventListener('mouseup', function(e){ 
		if(MapVars.curDown){
			MapVars.curDown = false; 
			MapVars.mapX += (MapVars.curXPos - e.pageX)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			MapVars.mapY += (MapVars.curYPos - e.pageY)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			if(MapVars.mapX<0){MapVars.mapX=0}
			if(MapVars.mapY<0){MapVars.mapY=0}
			if(MapVars.mapX+2*MapVars.zoomLvl>MapVars.bigMapMax){MapVars.mapX=MapVars.bigMapMax - 2*MapVars.zoomLvl}
			if(MapVars.mapY+2*MapVars.zoomLvl>MapVars.bigMapMax){MapVars.mapY=MapVars.bigMapMax - 2*MapVars.zoomLvl}
		}
	});
	window.addEventListener('touchend', function(e){ //e.pageX doesn't work for touchscreen? need to take some time to write event handlers for touch on the map
		if(MapVars.curDown){
			MapVars.curDown = false; 
			MapVars.mapX += (MapVars.curXPos - e.changedTouches[0].screenX)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			MapVars.mapY += (MapVars.curYPos - e.changedTouches[0].screenY)*MapVars.zoomLvl*2/MapVars.smallMapMax;
			if(MapVars.mapX<0){MapVars.mapX=0}
			if(MapVars.mapY<0){MapVars.mapY=0}
			if(MapVars.mapX+2*MapVars.zoomLvl>MapVars.bigMapMax){MapVars.mapX=MapVars.bigMapMax - 2*MapVars.zoomLvl}
			if(MapVars.mapY+2*MapVars.zoomLvl>MapVars.bigMapMax){MapVars.mapY=MapVars.bigMapMax - 2*MapVars.zoomLvl}
		}
	});


}

function setBlackout(){
	//initially set the blackout parts of the map as everything outside the starting 900x900 area
	for(var i=0; i<MapVars.bigMapMax/50; i++){
		MapVars.blackout[i] = [];
		for(var j=0; j<MapVars.bigMapMax/50; j++){		
			if(i<=57||j<=36||i>=76||j>=55){
				MapVars.blackout[i][j] = true;
			} else {
				MapVars.blackout[i][j] = false;
			}
		}
	}
	//and the corners to make it more circular
	MapVars.blackout[58][37]=true; MapVars.blackout[59][37]=true; MapVars.blackout[58][38]=true;
	MapVars.blackout[75][37]=true; MapVars.blackout[74][37]=true; MapVars.blackout[75][38]=true;
	MapVars.blackout[58][54]=true; MapVars.blackout[58][53]=true; MapVars.blackout[59][54]=true;
	MapVars.blackout[75][54]=true; MapVars.blackout[74][54]=true; MapVars.blackout[75][53]=true;
}

function dragDraw(x,y){
	MapVars.smallMap.drawImage(MapVars.blackCanvas, x, y, 2*MapVars.zoomLvl, 2*MapVars.zoomLvl, 0, 0, MapVars.smallMapMax, MapVars.smallMapMax);
}
function mapZoom(e){
	e.preventDefault();
	var destinationCanvas = document.getElementById("canvas");
	var sourceCanvas = MapVars.blackCanvas;
	var destinationCtx = destinationCanvas.getContext('2d');

	MapVars.maxZoomLvl = Math.max((MapVars.maxXscroll-MapVars.minXscroll)/2,(MapVars.maxYscroll-MapVars.minYscroll)/2);

	var changeInZoom = e.deltaY;
	if(MapVars.zoomLvl+changeInZoom>MapVars.maxZoomLvl||MapVars.zoomLvl+changeInZoom<MapVars.minZoomLvl){//300 is the minimum zoom level which takes a 600x600 shot of the blackedCanvas to display on the 600x600 small map canvas (1:1)
		console.log("trying to zoom out or in too far");
		return false;
	}

	MapVars.zoomLvl += changeInZoom;
	MapVars.mapX = MapVars.mapX-changeInZoom;
	MapVars.mapY = MapVars.mapY-changeInZoom;

	if(MapVars.mapX<MapVars.minXscroll){
		MapVars.mapX = MapVars.minXscroll;
	} else if (MapVars.mapX+MapVars.zoomLvl*2>MapVars.maxXscroll){
		MapVars.mapX = MapVars.maxXscroll - MapVars.zoomLvl*2;
	}

	if(MapVars.mapY<MapVars.minYscroll){
		MapVars.mapY = MapVars.minYscroll;
	} else if (MapVars.mapY+MapVars.zoomLvl*2>MapVars.maxYscroll){
		MapVars.mapY = MapVars.maxYscroll - MapVars.zoomLvl*2;
	}


	destinationCtx.drawImage(sourceCanvas, MapVars.mapX, MapVars.mapY, 2*MapVars.zoomLvl, 2*MapVars.zoomLvl, 0, 0, MapVars.smallMapMax, MapVars.smallMapMax);
	
	
	return false;
}

//need to fix - instead of chaging the bigMap, then painting it black on blackMap and copying to smallMap, change both big and black when drawing building, and only repaint big to black after exploring new areas and uncover()ing.
function mapBlack(){//don't call this unless you have to! (slows down computer)
	//paints the areas you have not explored before showing on the small canvas
	MapVars.blackMap.drawImage(MapVars.bigCanvas,0,0,MapVars.bigMapMax,MapVars.bigMapMax);
	MapVars.blackMap.fillStyle = 'black';
	//blacks out 50x50 sections of the map according to blackout array
	for(var i=0;i<MapVars.bigMapMax/50;i++){
		for(var j=0;j<MapVars.bigMapMax/50;j++){
			if(MapVars.blackout[i][j]){
				MapVars.blackMap.fillRect(i*50,j*50,50,50);
			}
		}
	}
	dragDraw(MapVars.mapX,MapVars.mapY);
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
		MapVars.blackout[Math.round(x/50)][Math.round(y/50)]=false;//50x50 is the smallest reveal chunk size
		MapVars.blackMap.drawImage(MapVars.bigCanvas,x,y,50,50,x,y,50,50);

		//may need to make the scroll area larger if the border is no longer black
		if(x<=MapVars.minXscroll){
			MapVars.minXscroll = Math.max(x-50,0);
		}
		if(x+50>=MapVars.maxXscroll){
			MapVars.maxXscroll = Math.min(x+100,MapVars.bigMapMax);
		}
		if(y<=MapVars.minYscroll){
			MapVars.minYscroll = Math.max(y-50,0);
		}
		if(y+50>=MapVars.maxYscroll){
			MapVars.maxYscroll = Math.min(y+100,MapVars.bigMapMax);
		}
	}
	dragDraw(MapVars.mapX,MapVars.mapY)
}
function drawBuilding(name,number){

	if((number-1)*2>=MapVars["Spots"][name].length){
		console.log("need to add more coordinates to the "+name+" Spots array");
		return 0;
	}
	var x = MapVars["Spots"][name][2*(number-1)];
	var y = MapVars["Spots"][name][1+2*(number-1)];
	switch (name) {
	case "councilhall":
		MapVars.blackMap.fillStyle = "grey";
		MapVars.blackMap.fillRect(x,y,37,24);
		MapVars.blackMap.beginPath();
		MapVars.blackMap.arc(x+18,y,11,0,Math.PI,true);
		MapVars.blackMap.fill();
		MapVars.blackMap.fillStyle = "rgb(132, 86, 5)";
		MapVars.blackMap.fillRect(x+3,y+3,14,18);
		MapVars.blackMap.fillRect(x+20,y+3,14,18);
		MapVars.blackMap.beginPath();
		MapVars.blackMap.arc(x+18,y,8,0,Math.PI,true);
		MapVars.blackMap.fill();
		break;
	case "shack":
		MapVars.blackMap.fillStyle = 'rgb(79, 54, 2)';
    	MapVars.blackMap.fillRect(x, y, 16, 16);
        MapVars.blackMap.beginPath();
        MapVars.blackMap.moveTo(x,y);
        MapVars.blackMap.lineTo(x+8,y-5);
        MapVars.blackMap.lineTo(x+16,y);
        MapVars.blackMap.fill();
		break;
	case "shed":
		MapVars.blackMap.fillStyle = 'rgb(102, 84, 47)';
        MapVars.blackMap.fillRect(x, y, 21, 10);
        MapVars.blackMap.beginPath();
        MapVars.blackMap.moveTo(x,y);
        MapVars.blackMap.lineTo(x+8,y-4);
        MapVars.blackMap.lineTo(x+21,y);
        MapVars.blackMap.fill();
		break;
	case "expandQ":
		MapVars.blackMap.fillStyle = 'rgb(86, 85, 82)';
        MapVars.blackMap.beginPath();
        MapVars.blackMap.arc(x,y,8,0,Math.PI*2,false);
        MapVars.blackMap.fill();
		break;
	case "farm":
		MapVars.blackMap.fillStyle = "yellow";
		MapVars.blackMap.fillRect(x,y,60,60);
		break;
	case "barn":
		MapVars.blackMap.fillStyle = "brown";
		MapVars.blackMap.fillRect(x,y,20,15);
        MapVars.blackMap.beginPath();
        MapVars.blackMap.moveTo(x,y);
        MapVars.blackMap.lineTo(x+3,y-9);
		MapVars.blackMap.lineTo(x+10,y-14);
        MapVars.blackMap.lineTo(x+17,y-9);
		MapVars.blackMap.lineTo(x+20,y);
        MapVars.blackMap.fill();		
		break;
	case "lumberyard":
		MapVars.blackMap.fillStyle = "rgb(175, 149, 29)";
		MapVars.blackMap.fillRect(x,y,35,12);
		break;
	case "workshop":
		MapVars.blackMap.fillStyle = "grey";
		MapVars.blackMap.fillRect(x,y,32,15);
		break;
	case "hut":
		MapVars.blackMap.fillStyle = 'rgb(79, 54, 2)';
		MapVars.blackMap.fillRect(x,y,18,15);
		MapVars.blackMap.fillStyle = "grey";
		MapVars.blackMap.fillRect(x+1,y+1,16,14);
		MapVars.blackMap.fillStyle = 'rgb(79, 54, 2)';
		MapVars.blackMap.beginPath();
			MapVars.blackMap.moveTo(x,y);
        	MapVars.blackMap.lineTo(x+3,y-8);
        	MapVars.blackMap.lineTo(x+15,y-8);
			MapVars.blackMap.lineTo(x+18,y);
        MapVars.blackMap.fill();			
		break;
	case "lab":
		MapVars.blackMap.fillStyle = "grey";
		MapVars.blackMap.fillRect(x,y,12,24);
		MapVars.blackMap.fillStyle = "rgb(132, 86, 5)";
		MapVars.blackMap.fillRect(x,y+3,9,18);
		break;
	case "mine":
		MapVars.blackMap.fillStyle = 'rgb(79, 54, 2)';
		MapVars.blackMap.fillRect(x,y,15,15);
		MapVars.blackMap.fillStyle = "black";
		MapVars.blackMap.fillRect(x+3,y+3,9,12);
		break;
	case "warehouse":
		MapVars.blackMap.fillStyle = "lightbrown";
		MapVars.blackMap.fillRect(x,y,22,15);
		break;	
	case "kiln":
		MapVars.blackMap.fillStyle = "red";
		MapVars.blackMap.fillRect(x,y,9,4);
		break;
	case "silo":
		MapVars.blackMap.fillStyle = "brown";
		MapVars.blackMap.fillRect(x,y,9,24);
		break;
	case "cabin":
		MapVars.blackMap.fillStyle = "brown";
		MapVars.blackMap.fillRect(x,y,30,15);
		break;				
	default:
		console.log("no valid building input");
		break;
	}
	dragDraw(MapVars.mapX,MapVars.mapY);//what if when you uncover new area, it draws that section from bigMap over the section on blackedMap? seems faster. do that and just draw buildings to blackMap which will be the main map - bigMap is just to draw new terrain.
}
//draws the first quarry spot
function drawQuarry(){
	MapVars.blackMap.fillStyle = 'rgb(86, 85, 82)';
	MapVars.blackMap.beginPath();
	MapVars.blackMap.arc(3674,1924,8,0,Math.PI*2,false);
	MapVars.blackMap.fill();
	MapVars.blackMap.closePath();
}
//draws the first set of dirt roads
function drawRoads1(){
	MapVars.blackMap.strokeStyle = 'rgb(183, 125, 23)';
	MapVars.blackMap.lineWidth = 3;
	MapVars.blackMap.beginPath();
	MapVars.blackMap.moveTo(2975,2300);
	MapVars.blackMap.lineTo(3048,2133);
	MapVars.blackMap.lineTo(3300,2125);
	MapVars.blackMap.lineTo(3325,2000);
	MapVars.blackMap.lineTo(3325,1950);
	MapVars.blackMap.lineTo(3200,1955);
	MapVars.blackMap.lineTo(3140,1950);
	MapVars.blackMap.stroke();	
	dragDraw(MapVars.mapX,MapVars.mapY);	
}
//draws the sites to try mining
function drawMineSite(num){
	var x = MapVars.Spots.mine[(num-1)*2];
	var y = MapVars.Spots.mine[(num-1)*2+1];
	MapVars.blackMap.strokeStyle = "red";
	MapVars.blackMap.lineWidth = 2;
	MapVars.blackMap.beginPath();
		MapVars.blackMap.moveTo(x+1,y+1);
		MapVars.blackMap.lineTo(x+13,y+13);
		MapVars.blackMap.moveTo(x+13,y+1);
		MapVars.blackMap.lineTo(x+1,y+13);
	MapVars.blackMap.stroke();
	dragDraw(MapVars.mapX,MapVars.mapY)
}

function testDraw(name){
	if(name==="all"){

		for(var s in MapVars.Spots){
			for(var i=1;i<=(MapVars["Spots"][s].length)/2;i++){
				console.log("drew building");
				drawBuilding(s,i);
			}
		}

	} else {
		for(var i=1;i<=(MapVars["Spots"][name].length)/2;i++){
			console.log("drew building");
			drawBuilding(name,i);
		}
	}
}

function linesOnBigMap(){

	for(var i=1;i<MapVars.bigMapMax/50;i++){
		console.log("i:"+i);
		if(i%5===0){
			MapVars.blackMap.strokeStyle = "red";
		} else {
			MapVars.blackMap.strokeStyle = "black";
		}
		MapVars.blackMap.beginPath();
		MapVars.blackMap.moveTo(i*50,0);
		MapVars.blackMap.lineTo(i*50,MapVars.bigMapMax);
		MapVars.blackMap.stroke();

		MapVars.blackMap.moveTo(0,i*50);
		MapVars.blackMap.lineTo(MapVars.bigMapMax,i*50);
		MapVars.blackMap.stroke();
	}
	MapVars.blackMap.strokeStyle = "blue";
	MapVars.blackMap.strokeText("3000,2000",2975,2000)
	dragDraw(MapVars.mapX,MapVars.mapY);
}