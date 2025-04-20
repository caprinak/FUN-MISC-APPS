// Add these variables at the top
let beatCount = 0;
let volume = 1.0;
let isDarkTheme = false;

const audioFiles = {
    w: "sounds/sat-1.mp3",
    a: "sounds/sat-2.mp3",
    s: "sounds/sat-3.mp3",
    d: "sounds/sat-4.mp3",
    j: "sounds/snare.mp3",
    k: "sounds/crash.mp3",
    l: "sounds/kick-bass.mp3"
};

var numberOfDrumButtons = document.querySelectorAll(".drum").length;

// Map of keys to corresponding background images
var backgroundImages = [
   "images/tom1.png",
  "images/tom2.png",
  "images/tom3.png",
  "images/tom4.png",
  "images/snare.png",
  "images/crash.png",
  "images/kick.png",
  "images/drum-cursor.png"
 ];

for (var i = 0; i < numberOfDrumButtons; i++) {

  document.querySelectorAll(".drum")[i].addEventListener("click", function() {

    var buttonInnerHTML = this.innerHTML;

    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);
     // Randomly change background image
     var randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
     this.style.backgroundImage = `url('${randomImage}')`;

    // // Change background image based on the button clicked
    // if (backgroundImages[buttonInnerHTML]) {
    //   this.style.backgroundImage = `url('${backgroundImages[buttonInnerHTML]}')`;
    // }

  });

}

document.addEventListener("keypress", function(event) {

  makeSound(event.key);

  buttonAnimation(event.key);

});


function makeSound(key) {

  switch (key) {
    case "w":
      var sat1 = new Audio("sounds/sat-1.mp3");
      sat1.play();
      break;

    case "a":
      var sat2 = new Audio("sounds/sat-2.mp3");
      sat2.play();
      break;

    case "s":
      var sat3 = new Audio('sounds/sat-3.mp3');
      sat3.play();
      break;

    case "d":
      var sat4 = new Audio('sounds/sat-4.mp3');
      sat4.play();
      break;

    case "j":
      var snare = new Audio('sounds/snare.mp3');
      snare.play();
      break;

    case "k":
      var crash = new Audio('sounds/crash.mp3');
      crash.play();
      break;

    case "l":
      var kick = new Audio('sounds/kick-bass.mp3');
      kick.play();
      break;


    default: console.log(key);

  }

  // Update the beat count
  beatCount++;
  document.getElementById('beat-count').textContent = beatCount;
}


function buttonAnimation(currentKey) {

  var activeButton = document.querySelector("." + currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);

}

// Add these event listeners after existing code
document.getElementById('volume-control').addEventListener('click', toggleMute);
document.getElementById('random-beat').addEventListener('click', playRandomBeat);
document.getElementById('playback-speed').addEventListener('input', updateSpeed);
document.getElementById('record-btn').addEventListener('click', toggleRecording);

function toggleMute() {
  volume = volume === 1.0 ? 0.0 : 1.0;
  document.querySelector('#volume-control i').className = 
    volume === 1.0 ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

function playRandomBeat() {
  let delay = 0;
  const interval = 200; // 200ms between beats
  const keys = ['w', 'a', 's', 'd', 'j', 'k', 'l']; // Define available keys explicitly
  count = Math.floor(Math.random() * 33); // Number of beats to play
  for (let i = 0; i < count; i++) {
      setTimeout(() => {
          // Get 1-3 random sounds to play simultaneously
          const numSounds = Math.floor(Math.random() * 2) + 1; // 1 or 2 sounds
          
          for (let j = 0; j < numSounds; j++) {
              const randomKey = keys[Math.floor(Math.random() * keys.length)];
              makeSound(randomKey);
              const button = document.querySelector(`.${randomKey}`);
              if (button) {
                  buttonAnimation(randomKey);
                  // Also update the background image
                  const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
                  button.style.backgroundImage = `url('${randomImage}')`;
              }
          }
      }, delay);
      
      delay += interval;
  }
}

function updateSpeed(e) {
  const speed = e.target.value;
  document.getElementById('speed-value').textContent = speed + 'x';
  // Update the playback rate of audio elements
  document.querySelectorAll('audio').forEach(audio => {
    audio.playbackRate = speed;
  });
}

// Update the playRandomBeat function
function playRandomBeat1(count = 4) {
    let delay = 0;
    const interval = 200; // 200ms between beats
    const keys = ['w', 'a', 's', 'd', 'j', 'k', 'l']; // Define available keys explicitly
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            // Get 1-3 random sounds to play simultaneously
            const numSounds = Math.floor(Math.random() * 2) + 1; // 1 or 2 sounds
            
            for (let j = 0; j < numSounds; j++) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                makeSound(randomKey);
                const button = document.querySelector(`.${randomKey}`);
                if (button) {
                    buttonAnimation(randomKey);
                    // Also update the background image
                    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
                    button.style.backgroundImage = `url('${randomImage}')`;
                }
            }
        }, delay);
        
        delay += interval;
    }
}

// Remove the old event listener and add it when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const randomBeatBtn = document.getElementById('random-beat');
    if (randomBeatBtn) {
        randomBeatBtn.addEventListener('click', () => {
            console.log('Random beat triggered'); // Debug log
            playRandomBeat(4);
        });
    } else {
        console.error('Random beat button not found!'); // Error logging
    }
});


