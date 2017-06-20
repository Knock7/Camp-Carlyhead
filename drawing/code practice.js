var bigCanvas, bigMap;
const bigMapMax=1000;//px size of the bigCanvas

var blackCanvas, blackMap;

window.onload = setup;

function setup(){
	
	document.getElementById("button").addEventListener("click",mapBlack);
	document.getElementById("input").addEventListener("click",addShed);
	document.getElementById("copy").addEventListener("click",buttonDraw);
	document.getElementById("uncover").addEventListener("click",uncover);

	document.getElementById("canvas").addEventListener("wheel",mapZoom,false);
	
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
  	base_image.src = 'forest.jpg';
  	base_image.onload = function(){//draw the bigMap canvas after the image has loaded so that the shapes don't get covered up
    	bigMap.drawImage(base_image, 0, 0,1000,1000);

		bigMap.fillStyle = 'black';
		bigMap.beginPath();
		bigMap.arc(500, 500, 75, 0, Math.PI * 2, false);
		bigMap.fill();

		bigMap.fillStyle = 'orange';
		bigMap.fillRect(25, 25, 100, 100);

		bigMap.fillStyle = 'brown';
		bigMap.fillRect(750,750,800,800);
		bigMap.fillRect(150,600,200,800);

		mapBlack();//draw the accessable blackMap after drawing the source bigMap
	}

	

	window.addEventListener('mousemove', function(e){ 
		if(curDown){
			var x = mapX + curXPos - e.pageX;
			var y = mapY + curYPos - e.pageY;

			//keep from scrolling outside the currently allowed area
			if(x<minXscroll){
				curXPos += minXscroll - x;
				x=minXscroll;	
			}
			if(y<minYscroll){
				curYPos += minYscroll - y;
				y=minYscroll;			
			}
			if(x+2*zoomLvl>maxXscroll){
				curXPos += maxXscroll - x - 2*zoomLvl;
				x= maxXscroll - 2*zoomLvl;		
			}
			if(y+2*zoomLvl>maxYscroll){
				curYPos += maxYscroll - y - 2*zoomLvl;
				y= maxYscroll - 2*zoomLvl;		
			}

			dragDraw(x,y);
		}
	});
	document.getElementById("canvas").addEventListener('mousedown', function(e){ 
		curYPos = e.pageY; 
		curXPos = e.pageX; 
		curDown = true; 
	});
	window.addEventListener('mouseup', function(e){ 
		if(curDown){
			curDown = false; 
			mapX += curXPos - e.pageX;
			mapY += curYPos - e.pageY;
			if(mapX<0){mapX=0}
			if(mapY<0){mapY=0}
			if(mapX+2*zoomLvl>bigMapMax){mapX=bigMapMax - 2*zoomLvl}
			if(mapY+2*zoomLvl>bigMapMax){mapY=bigMapMax - 2*zoomLvl}
		}
	});
}

var shedXY = 300;
function addShed(){
	bigMap.fillStyle = "brown";
	bigMap.fillRect(shedXY,shedXY,20,20);
	shedXY += 50;
	mapBlack();
}

function buttonDraw(){
	var x = parseInt(document.getElementById("input1").value,10);
	var y = parseInt(document.getElementById("input2").value,10); 
	var z = document.getElementById("input3").value;

	bigMap.fillStyle = z;
	bigMap.fillRect(x,y,50,50);

}

function dragDraw(x,y){
	smallMap.drawImage(blackCanvas, x, y, 2*zoomLvl, 2*zoomLvl, 0, 0, 400, 400);
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
	console.log("mapX: "+mapX);
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


	destinationCtx.drawImage(sourceCanvas, mapX, mapY, 2*zoomLvl, 2*zoomLvl, 0, 0, 400, 400);


	console.log("event "+e+ " move scroll by "+ e.deltaY);
	console.log("zoom level: "+zoomLvl+" source x,y: "+mapX+","+mapY+" source2 x,y: "+(mapX+2*zoomLvl)+","+(mapY+2*zoomLvl));
	
	
	return false;
}

var curYPos, curXPos;
var curDown=false;
var mapX=200;
var mapY=200;
var zoomLvl = 200;//200 is the default 1:1 mapping
var blackout = []
var minXscroll = 80;
var minYscroll = 80;
var maxXscroll = bigMapMax-120;//limit the scrolling to just outside the black areas
var maxYscroll = bigMapMax-40;
var maxZoomLvl = 400;//limit the max zoom

for(var i=0; i<bigMapMax/50; i++){
	blackout[i] = [];
	for(var j=0; j<bigMapMax/50; j++){
		blackout[i][j] = false;
		if(i<=2||j<=2||i>=bigMapMax/50-3||j>=bigMapMax/50-3){
			blackout[i][j] = true;
		}
	}
}
console.log(blackout);


function mapBlack(){
	//paints the areas you have not explored before showing on the small canvas
	console.log("fill black");
	blackMap.drawImage(bigCanvas,0,0,bigMapMax,bigMapMax);

	for(var i=0;i<bigMapMax/50;i++){
		for(var j=0;j<bigMapMax/50;j++){
			if(blackout[i][j]){
				blackMap.fillStyle = 'black';
				blackMap.fillRect(i*50,j*50,50,50);
				console.log("filled "+i+" "+j);
			}
		}
	}
	dragDraw(mapX,mapY);
}

function uncover(){
	var x = parseInt(document.getElementById("input1").value,10);
	var y = parseInt(document.getElementById("input2").value,10); 
	blackout[Math.round(x/50)][Math.round(y/50)]=false;//50x50 is the smallest reveal chunk size
	//may need to make the scroll area larger- if 
	if(x<minXscroll){
		minXscroll = Math.max(x-50,0);
	}
	if(x+zoomLvl*2>maxXscroll){
		maxXscroll = Math.min(x+zoomLvl*2+50,bigMapMax);
	}
	if(y<minYscroll){
		minYscroll = Math.max(y-50,0);
	}
	if(y+zoomLvl*2>maxYscroll){
		maxYscroll = Math.min(y+zoomLvl*2+50,bigMapMax);
	}
	mapBlack();
}

/*
now all 
*/