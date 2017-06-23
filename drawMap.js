var bigCanvas, bigMap;
const bigMapMax=5000;//px size of the bigCanvas

var blackCanvas, blackMap;

//make all these variables properties of the MapVars
var curYPos, curXPos;
var curDown=false;
var mapX=2850;
var mapY=1800;
var zoomLvl = 200;//200 is the default 1:1 mapping
var blackout = []
var minXscroll = 2850;
var minYscroll = 1800;
var maxXscroll = 3450;//limit the scrolling to just outside the black areas
var maxYscroll = 2400;
var maxZoomLvl = 300;//limit the max zoom
var smallMapMax = 500;

var MapVars = {//		1			2			3			4		5			6			7		8			9			10			11
	shackSpots: 	[3075,2000, 3105,2005, 3138,2003, 3170,2010, 3197,1995, 3080,2030, 3115,2035, 3145,2028, 3180,2040, 3232,1990, 3219,2018],
	shedSpots: 		[3085,1975, 3125,1979, 3170,1960, 3100,1950, 3145,1940],
	expandQSpots: 	[3378,1925, 3380,1926, 3377,1927, 3379,1928, 3376,1929, 3378,1930],
	farmSpots: 		[],
	barnSpots: 		[],
	lumberyardSpots:[],
	workshopSpots:	[],
	hutSpots:		[],
	labSpots:		[],
	mineSpots:		[3420,1935, 3410,2162, 3411,2164, 3413,2165],
	warehouseSpots:	[],
	kilnSpots:		[],
	siloSpots:		[],
	cabinSpots:		[],
	councilhallSpots:[], 	
	andSoOn: [],

	exploreSpots:	[3400,1950, 3400,2000, 3400,1900, 3400,2050, 3400,2100, 3400,2150, 3400,2200],
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
  	base_image.src = 'images/bigMapDraft.bmp';
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

		/*testing places to put shacks and sheds etc
		for(var i=0;i<MapVars.shackSpots.length;i+=2){//shackspots is[x1,y1,x2,y2 and so on]
			console.log("draw shack");
			drawBuilding("shack",shackSpots[i],shackSpots[i+1]);
		}
		for(var i=0;i<shedSpots.length;i+=2){//shackspots is[x1,y1,x2,y2 and so on]
			drawBuilding("shed",shedSpots[i],shedSpots[i+1]);
		}
		for(var i=0;i<quarrySpots.length;i+=2){//shackspots is[x1,y1,x2,y2 and so on]
			drawBuilding("quarry",quarrySpots[i],quarrySpots[i+1]);
		}
		//end testing building spots*/



		drawBuilding("shack");//the first shack
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
	if(zoomLvl+changeInZoom>maxZoomLvl||zoomLvl+changeInZoom<100){
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
//initially set the blackout parts of the map as everything outside the starting 500x500 area
for(var i=0; i<bigMapMax/50; i++){
	blackout[i] = [];
	for(var j=0; j<bigMapMax/50; j++){
		blackout[i][j] = false;
		if(i<=57||j<=36||i>=68||j>=47){
			blackout[i][j] = true;
		}
	}
}


function mapBlack(){
	//paints the areas you have not explored before showing on the small canvas
	blackMap.drawImage(bigCanvas,0,0,bigMapMax,bigMapMax);

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
	var x = MapVars.exploreSpots[2*(GlobVar.exploreCount-2)];
	var y = MapVars.exploreSpots[2*(GlobVar.exploreCount-2)+1];
	blackout[Math.round(x/50)][Math.round(y/50)]=false;//50x50 is the smallest reveal chunk size
	//may need to make the scroll area larger- if 
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
function drawBuilding(name){
	if((Buildings[name]["count"]-1)*2>MapVars[name+"Spots"].length){
		console.log("need to add more coordinates to the "+name+"Spots array");
		return 0;
	}
	var x = MapVars[name+"Spots"][2*(Buildings[name]["count"]-1)];
	var y = MapVars[name+"Spots"][1+2*(Buildings[name]["count"]-1)];
	switch (name) {
	case "councilhall":
		bigMap.fillStyle = "yellow";
		bigMap.fillRect(x,y,12,7);
	case "shack":
		bigMap.fillStyle = 'rgb(79, 54, 2)';
        bigMap.fillRect(x, y, 5, 5);
        bigMap.beginPath();
        bigMap.moveTo(x,y);
        bigMap.lineTo(x+2.5,y-1.5);
        bigMap.lineTo(x+5,y);
        bigMap.fill();
		break;
	case "shed":
		bigMap.fillStyle = 'rgb(102, 84, 47)';
        bigMap.fillRect(x, y, 8, 3.5);
        bigMap.beginPath();
        bigMap.moveTo(x,y);
        bigMap.lineTo(x+3,y-1);
        bigMap.lineTo(x+8,y);
        bigMap.fill();
		break;
	case "expandQ":
		bigMap.fillStyle = 'rgb(86, 85, 82)';
        bigMap.beginPath();
        bigMap.arc(x,y,2,0,Math.PI*2,false);
        bigMap.fill();
        bigMap.closePath();
		break;
	case "farm":
		bigMap.fillStyle = "yellow";
		bigMap.fillRect(x,y,20,20);
		break;
	case "barn":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,7,6);
		break;
	case "lumberyard":
		bigMap.fillStyle = "lightbrown";
		bigMap.fillRect(x,y,8,2);
		break;
	case "workshop":
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x,y,6,3);
		break;
	case "hut":
		bigMap.fillStyle = "grey";
		bigMap.fillRect(x,y,5,5);
		break;
	case "lab":
		bigMap.fillStyle = "lightbrown";
		bigMap.fillRect(x,y,2,6);
		break;
	case "mine":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,5,5);
		bigMap.fillStyle = "black";
		bigMap.fillRect(x+1,y+1,3,4);
		break;
	case "warehouse":
		bigMap.fillStyle = "lightbrown";
		bigMap.fillRect(x,y,7,5);
		break;	
	case "kiln":
		bigMap.fillStyle = "red";
		bigMap.fillRect(x,y,3,2);
		break;
	case "silo":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,3,8);
		break;
	case "cabin":
		bigMap.fillStyle = "brown";
		bigMap.fillRect(x,y,10,5);
		break;				
	default:
		console.log("no valid building input");
		break;
	}
	mapBlack();
}

function testDraw(name){
	for(var i=0;i<MapVars[name+"Spots"].length;i+=2){
		console.log("drew building");
		drawBuilding(name);
	}
}