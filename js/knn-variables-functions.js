//------
//KNN variables
//------
console.log("ml5 version:", ml5.version);

let isModelReady = false;
let isVideoReady = false;
let isClassifying = false;

// let video;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

let resultLabel = "";
let resultScore = 0.0;

let label0_score = 0.0;
let label1_score = 0.0;
let label2_score = 0.0;
let label0_count = 0;
let label1_count = 0;
let label2_count = 0;

let isAMirrorSelfie = {
  label_score: 0.0,
  label_count: 0,
  label_text: "This is a mirror selfie.",
};

let notAMirrorSelfie = {
  label_score: 0.0,
  label_count: 0,
  label_text: "This is NOT a mirror selfie.",
};

//--------------------------------------------------------------
// KNN functions
//--------------------------------------------------------------

function displayModelInfo(){
  let yShift = 60;
  fill(0, 255, 0);
  push();
  textSize(20);
  if (resultLabel === ""){
    text("I'm not guessing anything until you press the pink button" , 10, 20 + yShift);
  } else {
    text("Guessing it is a " + resultLabel + ": " + resultScore, 10, 20 + yShift);
  }
  
  pop();

  text(
    "Mirror Selfie:  " + label0_count + "  |  " + floor(label0_score) + "%",
    10,
    50 + yShift
  );
  text(
    "Not Mirror Selfie:  " + label1_count + "  |  " + floor(label1_score) + "%",
    10,
    70 + yShift
  );
  text(
    "Label 2:  " + label2_count + "  |  " + floor(label2_score) + "%",
    10,
    90 + yShift
  );
}

function modelReady() {
  console.log("Model Loaded: FeatureExtractor");
  isModelReady = true;
  loadKNNDataset();
}

function videoReady() {
  console.log("Device Ready");
  isVideoReady = true;
  loadKNNDataset();
}

function loadKNNDataset() {
  if (isModelReady && isVideoReady) {
    //knnClassifier.load("./myKNNDataset.json", KNNDatasetReady);
  }
}

function KNNDatasetReady() {
  console.log("Loaded: KNN Dataset");
  updateCounts();

  initClassification();
}

function initClassification() {
  isClassifying = true;
  console.log("Init Classification");
  classify();
}

//INPUTS

function keyPressed() {
  //
  if (key === "0") {
    addExample("0");
  } else if (key === "1") {
    addExample("1");
  } else if (key === "2") {
    addExample("2");
  }
  // key press with shift
  else if (key === ")") {
    clearLabel("0");
  } else if (key === "!") {
    clearLabel("1");
  } else if (key === "@") {
    clearLabel("2");
  }
  // init the classification
  else if (key === " ") {
    classify();
  }
  // key press with shift
  else if (key === "S") {
    saveMyKNN();
  } else if (key === "L") {
    loadMyKNN();
  }
}

//--------------------------------------------------------------
//Modelling
//--------------------------------------------------------------

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error("There is no examples in any label");
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(capture);
  knnClassifier.classify(features, gotResults);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      resultLabel = result.label;
      resultScore = confidences[result.label] * 100;
    }
    label0_score = confidences["mirrorSelfie"] * 100;
    label1_score = confidences["notMirrorSelfie"] * 100;
    //label2_score = confidences["2"] * 100;
  }

  classify();
}

function addExample(label) {
  const features = featureExtractor.infer(capture);
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save("myKNNDataset" + hour() + minute());
  console.log("Saved: KNN Dataset");
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load("./myKNNDataset.json", KNNDatasetReady);
}

function updateCounts() {
  const counts = knnClassifier.getCountByLabel();
  label0_count = counts["mirrorSelfie"];
  label1_count = counts["notMirrorSelfie"];
  // label2_count = counts["2"];
}

