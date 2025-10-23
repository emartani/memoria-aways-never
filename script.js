const allPhrases = [
  {
    en: "I always brush my teeth.",
    pt: "Eu sempre escovo meus dentes.",
    img: "brush_teeth.png"
  },
  {
    en: "I never forget my homework.",
    pt: "Eu nunca esqueço minha lição de casa.",
    img: "do_homework.png"
  },
  {
    en: "I always say please.",
    pt: "Eu sempre digo por favor.",
    img: "say_please.png"
  },
  {
    en: "I never shout at friends.",
    pt: "Eu nunca grito com os amigos.",
    img: "no_shout.png"
  },
  {
    en: "I always help my parents.",
    pt: "Eu sempre ajudo meus pais.",
    img: "help_parents.png"
  },
  {
    en: "I never eat too much candy.",
    pt: "Eu nunca como doces demais.",
    img: "no_candy.png"
  },
  {
    en: "I always read before bed.",
    pt: "Eu sempre leio antes de dormir.",
    img: "read_bed.png"
  },
  {
    en: "I never play with electricity.",
    pt: "Eu nunca brinco com eletricidade.",
    img: "no_electricity.png"
  }
];

const flipSound = new Audio("sounds/flip.mp3");
const matchSound = new Audio("sounds/match.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const celebrationSound = new Audio("sounds/celebration.mp3");
celebrationSound.volume = 1.0;

let selected = [];
let matched = [];
let isLocked = false;
let cards = [];

function startGame(level) {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";
  selected = [];
  matched = [];
  isLocked = false;

  grid.className = "grid";
  grid.classList.add(level === "easy" ? "easy-grid" : "hard-grid");

  let phrases = level === "easy" ? shuffleArray(allPhrases).slice(0, 4) : allPhrases;
 cards = [...phrases, ...phrases].sort(() => 0.5 - Math.random());

  cards.forEach((phrase, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;
    card.innerHTML = "";
    card.onclick = () => flipCard(card, phrase);
    grid.appendChild(card);
  });
}

function flipCard(card, phrase) {
  if (isLocked || matched.includes(card.dataset.index) || selected.includes(card)) return;

  // Exibe o conteúdo da carta
  card.innerHTML = `
    <img src="images/${phrase.img}" alt="" />
    <div>${phrase.en}</div>
    <div class="translation">${phrase.pt}</div>
  `;

  flipSound.play();

  // Toca a frase apenas no primeiro card
  if (selected.length === 0) {
    speak(phrase.en);
  }

  selected.push(card);

  if (selected.length === 2) {
    isLocked = true;

    const [card1, card2] = selected;

    // Verifica se os textos são iguais e os cards são diferentes
    if (card1.innerText === card2.innerText && card1 !== card2) {
      matched.push(card1.dataset.index, card2.dataset.index);
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchSound.play();
      isLocked = false;

      console.log("Matched:", matched.length, "Cards:", cards.length);

      // Verifica se o jogo terminou
      if (matched.length === cards.length) {
        setTimeout(() => {
          console.log("Tocando celebration...");
          speechSynthesis.cancel(); // interrompe qualquer fala em andamento
          celebrationSound.currentTime = 0;
          celebrationSound.play();
          document.getElementById("congratsScreen").style.display = "flex";
        }, 1000);
      }

    } else {
      // Par incorreto → fala a frase do segundo card
      speak(phrase.en);
      wrongSound.play();
      setTimeout(() => {
        card1.innerHTML = "";
        card2.innerHTML = "";
        isLocked = false;
      }, 4000);
    }

    selected = [];
  }
}


function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function restartGame() {
  document.getElementById("congratsScreen").style.display = "none";
  document.querySelector(".menu").style.display = "block";
  document.getElementById("gameGrid").innerHTML = "";
}

