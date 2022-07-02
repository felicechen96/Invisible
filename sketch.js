let mic;

let facemesh;
let predictions = [];

let capture;  // fotogrammi catturati dalla webcam

let start=false;
let radius=30;

let p1 ;
let p2 ;

let step=0;

let centro;

function setup() {
  
  createCanvas(720, 720);
  
   p1 = createVector(0, 0);
   p2 = createVector(0, 0);
  
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(mic);
  
  capture = createCapture(VIDEO);
  capture.size( 640, 480 );
  capture.hide();
  
  centro = createVector(width/2, height/2);

  facemesh = ml5.facemesh(capture, modelReady);

  //capture sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });
  
  
  
}

function modelReady() {
  console.log("Model ready!");
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) 
    {
      
      if(j===12 || j===370)
      {
        const [x, y] = keypoints[j];

        fill(0, 255, 0);
        ellipse(x, y, 15, 15);
        
        if(j===12)
        {
          p1.x = x;
          p1.y = y;
        }
        if(j===370)
        {
          p2.x = x;
          p2.y = y;
        }
        //text(j,x,y);
      }
      else
        {
          const [x, y] = keypoints[j];
          fill(100);
          ellipse(x, y, 2, 2);
        }
    }
  }
}


function drawLines(x,y,amp,highMid)
{
  push();
  translate(x,y);
  let r1 = (int(radius/40.0)+1)*40;
  
  let x1 = -r1;
  let y1 = random(-r1,r1);
  
  let x2 = x1+2*r1;
  let y2 = y1+random(-20,20);
  
   // contorno linea
  stroke(0);
  strokeWeight(5);
  line(x1, y1, x2, y2);
  // interno linea
  stroke(255);
  strokeWeight(3);
  line(x1, y1, x2, y2);

  pop();
  
}

function drawLines1(x,y,amp,highMid)
{
  push();
  translate(x,y);
  let x1 = random(-radius,radius);
  let y1 = random(-radius,radius);
  
  let x2 = random(-radius,radius);
  let y2 = random(-radius,radius);
  
  strokeWeight(amp/400.0);
  stroke(int(amp)%200);

   // contorno linea
  stroke(0);
  strokeWeight(5);
  line(x1, y1, x2, y2);
  // interno linea
  stroke(255);
  strokeWeight(3);
  line(x1, y1, x2, y2);

 
  if(highMid>120)
  {
     for(let i=0;i<random(10,15);i++)
     {
        let x=random(-20,20);
        let y=random(-20,20);
 
        ellipse(x2+x,y2+y,2,2);
     }
  }
  
  pop();
  
}


function drawEffect()
{
  push();
  translate(centro.x-320,centro.y-240);
  if(!start)
  {
    background(0);
   image(capture, 0, 0); 
  
   drawKeypoints();
  }
  
  
  let spectrum = fft.analyze();
  let bass, lowMid, mid, highMid, treble;

  bass = fft.getEnergy("bass");
  lowMid = fft.getEnergy("lowMid");
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");
  treble = fft.getEnergy("treble");
  
  let amp = bass+lowMid+mid+highMid+treble;
  console.log(amp);
  
  if(amp>350.0)
  {
    start=true;
  }
  
  if(start && frameCount%6==0)
  {
     drawLines(p1.x,p1.y,amp,highMid);
     drawLines(p2.x,p2.y,amp,highMid);
     console.log(amp+"   "+highMid  );
     //radius+=2;
  }
  if(start && amp>300.0 && frameCount%3==0)
  {
     drawLines1(p1.x,p1.y,amp,highMid);
     drawLines1(p2.x,p2.y,amp,highMid);
     console.log(amp+"   "+highMid  );
     radius+=2;
  }
  
  pop();
  
}


function draw() 
{
  if(step===0)
  {
    background(100);
    textSize(80);
    stroke(255);
    fill(255);
    text("Invisible",200,200);
    textSize(30);
    text("By  Zhijie Chen",400,350);
    textSize(15);
    text("Click to start",520,400);
    
    if(mouseIsPressed && mouseY<600)
      {
        step=1;
      }
    
  }
  else if(step===1)
  {
      drawEffect();
  }

  
 
}

function touchStarted() {
  getAudioContext().resume();
}

// function setupResizable() {
//   centro = createVector(width/2, height/2);
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   setupResizable();
// }
