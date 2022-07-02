// NON MODIFICARE E NON CANCELLARE

window.addEventListener("load", function() {
  if (getAudioContext().state == 'suspended') {
    let audioIcon = document.querySelector("#pulsante-audio > span");
    if (audioIcon) {
      audioIcon.className = "lnr lnr-volume";
    } 
  }
});

function apriChiudiInfo() {
  var info = document.getElementById("pannello-info");
  if (info.classList.contains("aperto")) {
    info.classList.remove("aperto")
  } else {
    info.classList.add("aperto")
  }
}

function attivaDisattivaAudio() {
  if (getAudioContext().state == 'suspended') {
    getAudioContext().resume();
      document.querySelector("#pulsante-audio > span").className = "lnr lnr-volume-high";
  } else {
    if (getOutputVolume() > 0) {
      outputVolume(0);
      document.querySelector("#pulsante-audio > span").className = "lnr lnr-volume";
      disattivaAudio();
    } else {
      outputVolume(1);
      document.querySelector("#pulsante-audio > span").className = "lnr lnr-volume-high";
      attivaAudio();
    }
  }
}

function attivaAudio() {
  // può essere ridefenitita in sketch.js 
}

function disattivaAudio() {
  // può essere ridefenitita in sketch.js 
}