let capture;
let touchToggle = true;
let userIsTouching = false;
let versionLog = "adding buttons - v1";
let textToLog;

let btn_selfie = {
  x: 0,
  y: 0,
  width: 0,
  height: 50,
  text: "Touch here if mirror selfie",
  fillColor: "lightyellow"
};

let btn_notSelfie = {
  x: 0,
  y: 0,
  width: 0,
  height: 50,
  text: "Here if NOT a mirror selfie",
  fillColor: "lightblue"
};

let btn_classify = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  text: "Start Classification",
  fillColor: "lightgreen"
};

let btn_saveJSON = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  text: "Save JSON",
  fillColor: "hotpink"
};

let inputBoxes = [];

function setup() {
  //------
  // KNN setup
  //------
  featureExtractor = ml5.featureExtractor("MobileNet", modelReady);

  //------
  // Mobile setup
  //------
  let constraints;
  if (isMobile.any()) {
    constraints = {
      audio: false,
      video: {
        facingMode: {
          exact: "environment",
        },
      },
    };
  } else {
    console.log("Working on desktop");
    constraints = {
      audio: false,
      video: {
        facingMode: "user",
      },
    };
  }
  createCanvas(displayWidth, displayHeight - 100);
  capture = createCapture(constraints, videoReady);

  capture.hide();

  btn_selfie.width = width / 2;
  btn_notSelfie.x = width / 2;
  btn_notSelfie.width = width / 2;
  btn_classify.x = 0;
  btn_classify.y = height - 50;
  btn_classify.width = width/2;
  btn_classify.height = 50;
  btn_saveJSON.x = width/2;
  btn_saveJSON.y = btn_classify.y
  btn_saveJSON.width = width/2;
  btn_saveJSON.height = 50;
}

function draw() {
  image(capture, 0, 50);

  fill(btn_selfie.fillColor);
  rect(btn_selfie.x, 
       btn_selfie.y, 
       btn_selfie.width, 
       btn_selfie.height);
  fill("black");
  text(btn_selfie.text, 
       btn_selfie.x + 5, 
       btn_selfie.y + 25);

  fill(btn_notSelfie.fillColor);
  rect(btn_notSelfie.x, 
       btn_notSelfie.y, 
       btn_notSelfie.width, 
       btn_notSelfie.height);
  fill("black");
  text(btn_notSelfie.text, 
       btn_notSelfie.x + 5, 
       btn_notSelfie.y + 25);

  fill(btn_classify.fillColor);
  rect(btn_classify.x, 
       btn_classify.y, 
       btn_classify.width, 
       btn_classify.height);
  fill("black");
  text(btn_classify.text, 
       btn_classify.x + 5, 
       btn_classify.y + 25);

  fill(btn_saveJSON.fillColor);
  rect(btn_saveJSON.x, 
       btn_saveJSON.y, 
       btn_saveJSON.width, 
       btn_saveJSON.height);
  fill("black");
  text(btn_saveJSON.text, 
       btn_saveJSON.x + 5, 
       btn_saveJSON.y + 25);

  if (isClassifying) {
    // do something with the "resultLabel."
  }

  detectMobileInfo();
  displayModelInfo();
  updateTextLog();
}

function touchStarted() {
  touchToggle = !touchToggle;
  userIsTouching = true;
}

function touchEnded() {
  userIsTouching = false;
}

function touchMoved() {
  // otherwise the display will move around with your touch :(
  return false;
}

function updateTextLog() {
  let mobileLog = document.getElementById("mobile-log");
  mobileLog.textContent = textToLog;
}

function detectMobileInfo() {
  if (isMobile.any()) {
    textToLog = "Mobile Detected: " + mouseX + " " + userIsTouching;

    if (userIsTouching) {
      textToLog = versionLog + " | Touching | (" + mouseX + "," + mouseY + ")";
      checkInput1();
      checkInput2();
      checkInput3();
      checkInput4();
    } else {
      textToLog = versionLog + " | No touching";
    }
  } else {
    textToLog = "On Desktop: " + userIsTouching;
    if (mouseIsPressed) {
      checkInput1();
      checkInput2();
      checkInput3();
      checkInput4();
    }
  }
}

function checkInput1() {
  if (
    mouseX > btn_selfie.x &&
    mouseX < btn_selfie.x + btn_selfie.width &&
    mouseY > btn_selfie.y &&
    mouseY < btn_selfie.y + btn_selfie.height
  ) {
    btn_selfie.fillColor = "yellow";
    textToLog = "Logging a Mirror Selfie";
    addExample("mirrorSelfie");
  } else {
      btn_selfie.fillColor = "lightyellow";

  }
}

function checkInput2() {
  if (
    mouseX > btn_notSelfie.x &&
    mouseX < btn_notSelfie.x + btn_notSelfie.width &&
    mouseY > btn_notSelfie.y &&
    mouseY < btn_notSelfie.y + btn_notSelfie.height
  ) {
    btn_notSelfie.fillColor = "cyan";
    textToLog = "Logging NOT a Mirror Selfie"
    addExample("notMirrorSelfie");
  } else {
      btn_notSelfie.fillColor = "lightblue";

  }
}

function checkInput3() {
  if (
    mouseX > btn_classify.x &&
    mouseX < btn_classify.x + btn_classify.width &&
    mouseY > btn_classify.y &&
    mouseY < btn_classify.y + btn_classify.height
  ) {
    btn_classify.fillColor = "green";
    textToLog = "Starting Classification";
    initClassification();

  } else {
    btn_classify.fillColor = "lightgreen";
  }
}

function checkInput4() {
  if (!isClassifying) {
    if (
      mouseX > btn_saveJSON.x &&
      mouseX < btn_saveJSON.x + btn_saveJSON.width &&
      mouseY > btn_saveJSON.y &&
      mouseY < btn_saveJSON.y + btn_saveJSON.height
    ) {
      btn_saveJSON.fillColor = "pink";
      btn_savingJSON.text = "Saving JSON";
      textToLog = "Saving JSON";
      saveMyKNN();
    }
  } else {
    btn_saveJSON.fillColor = "hotpink";
    btn_saveJSON.text = "Save JSON";
  }
}