const screens = {
  name: document.getElementById("screen-name"),
  song: document.getElementById("screen-song"),
  special: document.getElementById("screen-special"),
  date: document.getElementById("screen-date"),
  final: document.getElementById("screen-final")
};

const correctName = "NANDITA";

let selectedLetters = [];
let currentSong = null;


// =====================================================
// NAME PUZZLE
// =====================================================

const shuffledLetters = ["N", "A", "N", "D", "I", "T", "A"];

const answer = document.getElementById("answer");
const tiles = document.getElementById("tiles");
const nameError = document.getElementById("nameError");


// Change Screen
function showScreen(screen) {
  Object.values(screens).forEach(s => {
    s.classList.remove("active");
  });

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Render Puzzle
function renderPuzzle() {

  answer.innerHTML = "";
  tiles.innerHTML = "";

  // Create 7 empty boxes for NANDITA
  for (let i = 0; i < 7; i++) {

    const slot = document.createElement("div");

    slot.className = "answer-slot";

    slot.textContent = selectedLetters[i] || "";

    answer.appendChild(slot);
  }


  // Shuffle letters
  const letters = [...shuffledLetters].sort(
    () => Math.random() - 0.5
  );


  // Create letter buttons
  letters.forEach((letter, index) => {

    const button = document.createElement("button");

    button.className = "letter-tile";

    button.textContent = letter;

    button.type = "button";

    button.dataset.index = index;


    // Letter click
    button.addEventListener("click", () => {

      // Maximum 7 letters
      if (selectedLetters.length >= 7) {
        return;
      }


      // Add selected letter
      selectedLetters.push(letter);


      // Remove clicked button appearance
      button.classList.add("used");


      nameError.textContent = "";


      // Update boxes
      renderAnswerOnly();


      // Disable used letters correctly
      markUsedTiles();

    });


    tiles.appendChild(button);

  });

}


// Update only answer boxes
function renderAnswerOnly() {

  [...answer.children].forEach((slot, i) => {

    slot.textContent = selectedLetters[i] || "";

  });

}


// Mark used letters
function markUsedTiles() {

  const needed = [...selectedLetters];


  [...tiles.children].forEach(button => {

    const index = needed.indexOf(button.textContent);


    if (index !== -1) {

      button.classList.add("used");

      needed.splice(index, 1);

    } else {

      button.classList.remove("used");

    }

  });

}


// =====================================================
// RESET PUZZLE
// =====================================================

document
  .getElementById("resetPuzzle")
  .addEventListener("click", () => {

    selectedLetters = [];

    nameError.textContent = "";

    renderPuzzle();

  });


// =====================================================
// CHECK NAME
// =====================================================

document
  .getElementById("checkName")
  .addEventListener("click", () => {

    const entered = selectedLetters.join("");


    if (entered === correctName) {

      nameError.textContent = "";

      showScreen(screens.song);

    } else {

      nameError.textContent =
        "Arre Nandu 😭 spelling bilkul exact honi chahiye!";

      selectedLetters = [];

      setTimeout(() => {

        renderPuzzle();

      }, 250);

    }

  });


// Start puzzle
renderPuzzle();


// =====================================================
// SONG SECTION
// =====================================================

// Put your 4 MP3 files here:
//
// assets
//   └── songs
//       ├── song1.mp3
//       ├── song2.mp3
//       ├── song3.mp3
//       └── song4.mp3


const songFiles = {

  1: "assets/songs/song1.mp3",

  2: "assets/songs/song2.mp3",

  3: "assets/songs/song3.mp3",

  4: "assets/songs/song4.mp3"

};


const songNames = {

  1: "Song One 💗",

  2: "Song Two 🌸",

  3: "Song Three ✨",

  4: "Song Four 🎶"

};


const player = document.getElementById("player");

const selectedSong =
  document.getElementById("selectedSong");


// Song selection
document
  .querySelectorAll(".song-card")
  .forEach(card => {

    card.addEventListener("click", () => {


      // Remove previous selection
      document
        .querySelectorAll(".song-card")
        .forEach(c => {

          c.classList.remove("selected");

        });


      // Select current song
      card.classList.add("selected");


      currentSong = card.dataset.song;


      // Set audio
      player.src = songFiles[currentSong];


      selectedSong.textContent =
        `${songNames[currentSong]} selected — playing now...`;


      // Try autoplay
      player.play().catch(() => {

        selectedSong.textContent =
          `${songNames[currentSong]} selected — press ▶ on the player if needed.`;

      });


      // Go to special question
      setTimeout(() => {

        showScreen(screens.special);

      }, 1100);

    });

  });


// =====================================================
// SPECIAL QUESTION
// =====================================================

document
  .getElementById("specialBtn")
  .addEventListener("click", () => {

    showScreen(screens.date);

    document
      .getElementById("dateInput")
      .focus();

  });


// =====================================================
// DATE SECTION
// =====================================================

function normalizeDate(value) {

  return value

    .toLowerCase()

    .replace(/[^a-z0-9]/g, "")

    .trim();

}


document
  .getElementById("checkDate")
  .addEventListener("click", checkDate);


document
  .getElementById("dateInput")
  .addEventListener("keydown", event => {

    if (event.key === "Enter") {

      checkDate();

    }

  });


function checkDate() {

  const value =
    normalizeDate(
      document.getElementById("dateInput").value
    );


  const acceptedDates = [

    "5october",

    "october5",

    "5oct",

    "oct5",

    "05october",

    "october05",

    "05oct",

    "oct05"

  ];


  if (acceptedDates.includes(value)) {

    document.getElementById("dateError").textContent = "";

    showBirthday();

  } else {

    document.getElementById("dateError").textContent =
      "Hmmm... dobara socho 😏 Aaj ki date kya hai?";

  }

}


// =====================================================
// FINAL BIRTHDAY SCREEN
// =====================================================

function showBirthday() {

  showScreen(screens.final);


  // Continue selected song
  if (currentSong) {

    player.src = songFiles[currentSong];

    player.play().catch(() => {});

  }


  // Start effects
  startConfetti();

  startPhotoRotation();

}


// =====================================================
// PHOTO SLIDESHOW
// =====================================================

let photoTimer;


function startPhotoRotation() {

  const photo =
    document.getElementById("finalPhoto");


  let index = 1;


  clearInterval(photoTimer);


  photoTimer = setInterval(() => {

    index++;

    if (index > 4) {

      index = 1;

    }


    photo.src =
      `assets/photos/photo${index}.jpeg`;

  }, 3200);

}


// =====================================================
// CONFETTI
// =====================================================

function startConfetti() {

  const confetti =
    document.getElementById("confetti");


  confetti.innerHTML = "";


  for (let i = 0; i < 90; i++) {

    const piece =
      document.createElement("span");


    piece.className =
      "confetti-piece";


    piece.style.left =
      Math.random() * 100 + "vw";


    piece.style.animationDelay =
      Math.random() * 1.8 + "s";


    piece.style.transform =
      `rotate(${Math.random() * 180}deg)`;


    confetti.appendChild(piece);

  }

}


// =====================================================
// FLOATING HEARTS
// =====================================================

const heartContainer =
  document.getElementById("hearts");


function createHeart() {

  const heart =
    document.createElement("span");


  heart.className =
    "floating-heart";


  heart.textContent =
    Math.random() > 0.45
      ? "♥"
      : "♡";


  heart.style.left =
    Math.random() * 100 + "%";


  heart.style.fontSize =
    (12 + Math.random() * 22) + "px";


  heart.style.animationDuration =
    (5 + Math.random() * 6) + "s";


  heartContainer.appendChild(heart);


  setTimeout(() => {

    heart.remove();

  }, 12000);

}


setInterval(createHeart, 650);


// =====================================================
// REPLAY
// =====================================================

document
  .getElementById("replay")
  .addEventListener("click", () => {


    clearInterval(photoTimer);


    selectedLetters = [];

    currentSong = null;


    // Stop song
    player.pause();

    player.currentTime = 0;

    player.src = "";


    // Clear date
    document
      .getElementById("dateInput")
      .value = "";


    document
      .getElementById("dateError")
      .textContent = "";


    // Remove song selection
    document
      .querySelectorAll(".song-card")
      .forEach(card => {

        card.classList.remove("selected");

      });


    selectedSong.textContent =
      "Choose one song to continue...";


    // Reset puzzle
    renderPuzzle();


    // Go back to beginning
    showScreen(screens.name);

  });