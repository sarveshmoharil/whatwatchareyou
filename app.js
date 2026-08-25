// ============================================================
// WHAT WATCH ARE YOU?
// A deliberately simple recommendation engine.
//
// The first 10 questions use small hand-written weights.
// Questions 11 and 12 are visual "taste tests".
// There is also an ARTISTIC score now, because visual taste should
// actually influence the kind of watch you get back.
//
// Nothing here is trained. It is intentionally readable JS.
// ============================================================

const QUESTIONS = [
  {
    kicker: "YOUR NORMAL DAY",
    text: "What do you actually do most of the time?",
    answers: [
      { text: "Build / code / tinker with things", weights: { tool: 3, chrono: 1 } },
      { text: "Study, write, think, make things beautiful", weights: { dress: 3, minimal: 1, artistic: 1 } },
      { text: "Run around, travel, get my hands dirty", weights: { adventure: 3, tool: 1 } },
      { text: "A suspicious amount of meetings / organizing", weights: { dress: 2, chrono: 2 } }
    ]
  },
  {
    kicker: "THE THING THAT PULLS YOU IN",
    text: "What could you happily spend an entire afternoon obsessing over?",
    answers: [
      { text: "Machines, mechanisms, how stuff works", weights: { tool: 3, chrono: 1 } },
      { text: "Art, architecture, fashion, old objects", weights: { dress: 2, artistic: 3 } },
      { text: "Maps, places, routes, the next trip", weights: { adventure: 3 } },
      { text: "Numbers, patterns, tiny details", weights: { minimal: 2, chrono: 2 } }
    ]
  },
  {
    kicker: "BODY IN MOTION",
    text: "Do you do sports / outdoorsy stuff / activities?",
    answers: [
      { text: "Absolutely. My shoes are always dirty.", weights: { adventure: 4, tool: 1 } },
      { text: "Occasionally — mostly walking and exploring", weights: { adventure: 2, minimal: 1 } },
      { text: "I enjoy sports as a spectator more than a participant", weights: { chrono: 2, dress: 1 } },
      { text: "My main sport is carrying a laptop", weights: { dress: 2, minimal: 1 } }
    ]
  },
  {
    kicker: "YOUR PERSONALITY IN A ROOM",
    text: "People are most likely to describe you as…",
    answers: [
      { text: "Curious and slightly chaotic", weights: { adventure: 2, tool: 2, artistic: 1 } },
      { text: "Calm, polished, a little old-fashioned", weights: { dress: 4 } },
      { text: "Precise and quietly intense", weights: { minimal: 3, tool: 1 } },
      { text: "Energetic, competitive, always doing something", weights: { chrono: 3, adventure: 1 } }
    ]
  },
  {
    kicker: "THE UNNECESSARY DETAIL",
    text: "Which tiny thing are you weirdly particular about?",
    answers: [
      { text: "Everything should be readable at a glance", weights: { tool: 2, minimal: 2 } },
      { text: "Textures, finishes, materials", weights: { dress: 2, artistic: 3 } },
      { text: "Functions. If it can't do something, why is it there?", weights: { tool: 3, chrono: 1 } },
      { text: "The vibe. Objects should feel like they have stories.", weights: { adventure: 2, dress: 1, artistic: 3 } }
    ]
  },
  {
    kicker: "PICK A SCENE",
    text: "You unexpectedly get a whole free Saturday. Where are you?",
    answers: [
      { text: "A trail, a coast, a mountain, somewhere with weather", weights: { adventure: 4 } },
      { text: "A quiet café with a notebook and no hurry", weights: { dress: 2, minimal: 2 } },
      { text: "A garage / desk / workshop making something", weights: { tool: 4 } },
      { text: "A city, a museum, then dinner with friends", weights: { chrono: 2, dress: 1, artistic: 2 } }
    ]
  },
  {
    kicker: "HOW YOU TELL TIME",
    text: "When you glance at a watch, what do you secretly want?",
    answers: [
      { text: "Instant readability. Bang. I know the time.", weights: { tool: 2, minimal: 3 } },
      { text: "A little theater — movement, dials, texture", weights: { chrono: 2, artistic: 3 } },
      { text: "Something elegant enough to disappear into an outfit", weights: { dress: 4 } },
      { text: "Something that looks ready to survive my day", weights: { adventure: 4 } }
    ]
  },
  {
    kicker: "DIAL MOOD",
    text: "Pick the dial you would stare at for no reason.",
    answers: [
      { text: "Classic round dial, warm markers, tiny seconds", weights: { dress: 3 } },
      { text: "Big hands, clear numerals, almost no decoration", weights: { minimal: 4 } },
      { text: "Three sub-dials and a satisfying amount of information", weights: { chrono: 4 } },
      { text: "Bold indices, lume, utility-first and slightly rugged", weights: { adventure: 3, tool: 2 } }
    ]
  },
  {
    kicker: "THE WORST SIN",
    text: "What would make you reject an otherwise cool watch?",
    answers: [
      { text: "It feels fragile", weights: { adventure: 3, tool: 1 } },
      { text: "It is trying way too hard to be fancy", weights: { minimal: 2, tool: 1 } },
      { text: "The design is boring", weights: { chrono: 2, adventure: 2, artistic: 2 } },
      { text: "It clashes with everything I own", weights: { dress: 2, minimal: 2 } }
    ]
  },
  {
    kicker: "THE VERY LAST TEXT QUESTION",
    text: "A stranger asks why you wear that watch. Your answer is…",
    answers: [
      { text: "Because it goes anywhere with me.", weights: { adventure: 4 } },
      { text: "Because I like the engineering.", weights: { tool: 4 } },
      { text: "Because it's beautiful.", weights: { dress: 3, artistic: 2 } },
      { text: "Because I love what happens on the dial.", weights: { chrono: 2, artistic: 3, minimal: 1 } }
    ]
  },

  // ----------------------------------------------------------
  // Question 11: ART TASTE TEST
  // These are real-photo searches from Flickr via LoremFlickr.
  // Each card has a different visual vocabulary.
  // ----------------------------------------------------------
  {
    kicker: "QUESTION 11 · VISUAL TASTE",
    text: "Which piece of art would you happily have on your wall?",
    visual: true,
    answers: [
      {
        label: "MADHUBANI",
        caption: "dense · ornate · alive",
        image: "https://loremflickr.com/900/700/madhubani,painting?lock=1101",
        fallback: "https://loremflickr.com/900/700/indian,folk,painting?lock=1101",
        weights: { artistic: 6, dress: 1, chrono: 1 }
      },
      {
        label: "CUBISM",
        caption: "geometric · fragmented · expressive",
        image: "https://images.pexels.com/photos/1258740/pexels-photo-1258740.jpeg",
        fallback: "https://images.pexels.com/photos/1258740/pexels-photo-1258740.jpeg",
        weights: { artistic: 6, dress: 2, chrono: 1 }
      },
      {
        label: "ART DECO",
        caption: "geometric · elegant · glamorous",
        image: "https://images.pexels.com/photos/12026673/pexels-photo-12026673.jpeg",
        fallback: "https://images.pexels.com/photos/12026673/pexels-photo-12026673.jpeg",
        weights: { artistic: 6, dress: 3, chrono: 1 }
      },
      {
        label: "MINIMAL",
        caption: "quiet · spacious · precise",
        image: "https://images.pexels.com/photos/15269510/pexels-photo-15269510.jpeg",
        fallback: "https://images.pexels.com/photos/15269510/pexels-photo-15269510.jpeg",
        weights: { minimal: 6, artistic: 1, dress: 1 }
      }
    ]
  },

  // ----------------------------------------------------------
  // Question 12: WATCH TASTE TEST
  // These image choices intentionally represent different design
  // languages, including an explicitly artistic watch.
  // ----------------------------------------------------------
  {
    kicker: "QUESTION 12 · WRIST TASTE",
    text: "Which watch makes your brain go 'yep, THAT one'?",
    visual: true,
    answers: [
      {
        label: "THE ARTIST",
        caption: "vivid · expressive · mechanical",
        image: "https://a.storyblok.com/f/119298/1712x2140/d857283834/poignet-mobile.jpg",
        fallback: "https://loremflickr.com/900/700/artistic,watch,colorful,dial?lock=1201",
        weights: { artistic: 7, chrono: 1 }
      },
      {
        label: "THE MINIMALIST",
        caption: "clean · quiet · geometric",
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        fallback: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        weights: { minimal: 7, dress: 1 }
      },
      {
        label: "THE ELEGANT",
        caption: "refined · timeless · graceful",
        image: "https://assets.catawiki.com/image/pr%3Acw_ldp_l/plain/assets/catawiki/assets/2023/12/19/2/f/a/2faca0fa-fe67-4592-8c56-eb7484d6eb53.jpg",
        fallback: "https://loremflickr.com/900/700/elegant,dress,watch?lock=1203",
        weights: { dress: 7, minimal: 1 }
      },
      {
        label: "THE CHRONOGRAPH",
        caption: "busy · sporty · mechanical",
        image: "https://images.pexels.com/photos/16739804/pexels-photo-16739804.jpeg",
        fallback: "https://images.pexels.com/photos/16739804/pexels-photo-16739804.jpeg",
        weights: { chrono: 7, tool: 1 }
      }
    ]
  }
];

// ============================================================
// 50-watch catalogue
// ============================================================
// Image tags are deliberately watch-specific.
// The previous version used loose searches such as "watch,adventure".
// Some stock-photo search endpoints interpreted those terms strangely
// and occasionally returned cats / street photos.
// Keeping "wristwatch" in every query makes the visual source much safer.
const CATALOGUE_IMAGE_TAGS = {
  adventure: "field,wristwatch",
  tool: "instrument,wristwatch",
  chrono: "chronograph,wristwatch",
  dress: "dress,wristwatch",
  minimal: "minimalist,wristwatch",
  artistic: "artistic,wristwatch,colorful"
};

const WATCH_CATALOGUE = [
  // FIELD / ADVENTURE — 10
  ["Rolex Explorer 36", "Field / Adventure", "adventure", 735500, "classic black field dial, 36mm", "rolex,explorer,watch"],
  ["Tudor Ranger", "Field / Adventure", "adventure", 260000, "vintage field numerals, rugged steel", "tudor,ranger,watch"],
  ["Hamilton Khaki Field Mechanical", "Field / Adventure", "adventure", 65000, "military field dial, hand-wound", "hamilton,khaki,field,watch"],
  ["Seiko Alpinist SPB121", "Field / Adventure", "adventure", 70000, "green compass bezel, mountain character", "seiko,alpinist,watch"],
  ["Longines Spirit", "Field / Adventure", "adventure", 220000, "aviation-inspired field watch, blue dial", "longines,spirit,watch"],
  ["Seiko 5 Sports", "Field / Adventure", "adventure", 30000, "sporty field-diver crossover", "seiko,5,sports,watch"],
  ["Baltic Hermétique", "Field / Adventure", "adventure", 65000, "compact vintage explorer aesthetic", "baltic,field,watch"],
  ["Christopher Ward C63 Sealander", "Field / Adventure", "adventure", 145000, "everyday adventure watch with strong legibility", "christopher,ward,sealander,watch"],
  ["Marathon General Purpose", "Field / Adventure", "adventure", 85000, "actual military-style utility", "marathon,field,watch"],
  ["Citizen Promaster Diver", "Field / Adventure", "adventure", 60000, "rugged luminous tool watch", "citizen,promaster,watch"],

  // TOOL / TECHNICAL — 10
  ["Sinn 556 I", "Tool / Technical", "tool", 190000, "clean instrument dial, German tool-watch spirit", "sinn,556,watch"],
  ["IWC Pilot's Watch Mark XX", "Tool / Technical", "tool", 480000, "aviation instrument readability", "iwc,pilot,watch"],
  ["Bell & Ross BR 03", "Tool / Technical", "tool", 390000, "square aviation-instrument case", "bell,ross,instrument,watch"],
  ["Casio G-Shock Mudmaster", "Tool / Technical", "tool", 30000, "extreme utility and digital information", "gshock,mudmaster,watch"],
  ["Victorinox FieldForce", "Tool / Technical", "tool", 50000, "practical Swiss everyday utility", "victorinox,field,watch"],
  ["Citizen Promaster Tough", "Tool / Technical", "tool", 70000, "lightweight titanium utility", "citizen,promaster,titanium,watch"],
  ["Seiko Prospex Turtle", "Tool / Technical", "tool", 55000, "chunky diving instrument", "seiko,prospex,turtle,watch"],
  ["Hamilton Khaki Navy Scuba", "Tool / Technical", "tool", 90000, "sporting utility with clean timing", "hamilton,khaki,scuba,watch"],
  ["Damasko DS30", "Tool / Technical", "tool", 200000, "hard-use technical German watch", "damasko,tool,watch"],
  ["Rado Captain Cook", "Tool / Technical", "tool", 180000, "retro diving equipment aesthetic", "rado,captain,cook,watch"],

  // CHRONOGRAPH — 10
  ["Omega Speedmaster Professional", "Chronograph", "chrono", 720000, "iconic moonwatch with three sub-dials", "omega,speedmaster,watch"],
  ["Rolex Daytona", "Chronograph", "chrono", 2200000, "luxury racing chronograph", "rolex,daytona,chronograph,watch"],
  ["Breitling Navitimer", "Chronograph", "chrono", 650000, "busy aviation slide-rule dial", "breitling,navitimer,watch"],
  ["Zenith Chronomaster Sport", "Chronograph", "chrono", 1050000, "high-beat sporty chronograph", "zenith,chronomaster,watch"],
  ["TAG Heuer Carrera", "Chronograph", "chrono", 420000, "racing-inspired modern chronograph", "tag,heuer,carrera,watch"],
  ["Tissot PRX Chronograph", "Chronograph", "chrono", 165000, "integrated bracelet retro-sport chrono", "tissot,prx,chronograph,watch"],
  ["Seiko Prospex Speedtimer", "Chronograph", "chrono", 85000, "Japanese racing chronograph", "seiko,speedtimer,chronograph"],
  ["Hamilton Intra-Matic AutoChrono", "Chronograph", "chrono", 180000, "sixties-inspired panda chronograph", "hamilton,intramatic,chronograph"],
  ["Longines Spirit Chronograph", "Chronograph", "chrono", 300000, "pilot chronograph with balanced sub-dials", "longines,spirit,chronograph"],
  ["Bulova Lunar Pilot", "Chronograph", "chrono", 95000, "space-program chronograph with huge personality", "bulova,lunar,pilot,watch"],

  // DRESS / ELEGANT — 8
  ["Cartier Tank Must", "Dress / Elegant", "dress", 370000, "rectangular Roman-numeral icon", "cartier,tank,watch"],
  ["Jaeger-LeCoultre Reverso", "Dress / Elegant", "dress", 900000, "reversible Art Deco geometry", "jaeger,lecoultre,reverso,watch"],
  ["Longines Flagship", "Dress / Elegant", "dress", 170000, "traditional Swiss dress styling", "longines,flagship,dress,watch"],
  ["Tissot Le Locle", "Dress / Elegant", "dress", 60000, "traditional guilloche-inspired dial", "tissot,le,locle,watch"],
  ["Frederique Constant Classics", "Dress / Elegant", "dress", 120000, "polished classical dress watch", "frederique,constant,classics,watch"],
  ["Cartier Santos", "Dress / Elegant", "dress", 700000, "screw-bezel icon with elegant geometry", "cartier,santos,watch"],
  ["Longines DolceVita", "Dress / Elegant", "dress", 160000, "rectangular deco-influenced elegance", "longines,dolcevita,watch"],
  ["Omega De Ville Prestige", "Dress / Elegant", "dress", 330000, "refined dress watch with restrained finishing", "omega,deville,watch"],

  // MINIMALIST — 7
  ["Nomos Tangente", "Minimalist", "minimal", 220000, "Bauhaus typography and thin geometry", "nomos,tangente,watch"],
  ["Junghans Max Bill", "Minimalist", "minimal", 125000, "Bauhaus restraint with domed crystal", "junghans,max,bill,watch"],
  ["Grand Seiko Snowflake", "Minimalist", "minimal", 520000, "textured dial with disciplined indices", "grand,seiko,snowflake,watch"],
  ["Cartier Tank Louis", "Minimalist", "minimal", 900000, "luxury geometry with near-perfect proportions", "cartier,tank,minimal,watch"],
  ["Rado True Square", "Minimalist", "minimal", 160000, "angular modern ceramic design", "rado,true,square,watch"],
  ["NOMOS Metro", "Minimalist", "minimal", 300000, "clean Bauhaus case with playful details", "nomos,metro,watch"],
  ["Seiko Presage Style60's", "Minimalist", "minimal", 65000, "retro restraint with strong geometry", "seiko,presage,watch"],

  // ARTISTIC / EXPRESSIVE — 5
  ["CODE41 Day41 x The Dial Artist", "Artistic / Expressive", "artistic", 450000, "abstract painted dial with visible mechanics", "colorful,artistic,watch,dial"],
  ["IFL Watches hand-painted koi", "Artistic / Expressive", "artistic", 500000, "hand-painted scene on the dial", "handpainted,artistic,watch"],
  ["Mr Jones A Perfectly Useless Afternoon", "Artistic / Expressive", "artistic", 100000, "illustrated dial that behaves like a tiny artwork", "illustrated,artistic,watch"],
  ["Van Cleef & Arpels Poetic Complications", "Artistic / Expressive", "artistic", 2500000, "poetic automata and miniature scenes", "van,cleef,poetic,watch"],
  ["AnOrdain Model 1", "Artistic / Expressive", "artistic", 220000, "handmade enamel dial with intense colour", "anordain,colorful,enamel,watch"]
].map(([name, type, key, price, vibe, imageQuery], index) => ({
  id: index + 1,
  name,
  type,
  key,
  price,
  vibe,
  imageQuery,
  // One unique lock per card keeps the catalogue from reusing the same photo.
  image: `https://loremflickr.com/700/700/${CATALOGUE_IMAGE_TAGS[key]}?lock=${2000 + index}`,
  fallback: `https://loremflickr.com/700/700/wristwatch?lock=${5000 + index}`
}));

const WATCH_TYPES = [
  {
    type: "FIELD / ADVENTURE",
    title: "The Wayfarer",
    key: "adventure",
    description: "Rugged, legible, and happiest when there is weather. Your watch should feel like a reliable travel companion.",
    resultImage: "https://images.pexels.com/photos/30871176/pexels-photo-30871176.jpeg",
    fallback: "https://images.pexels.com/photos/30871176/pexels-photo-30871176.jpeg",
    examples: ["Rolex Explorer", "Tudor Ranger", "Omega Railmaster"]
  },
  {
    type: "TOOL / TECHNICAL",
    title: "The Instrument",
    key: "tool",
    description: "You want function to be visible. Good proportions, useful information, and absolutely no decorative nonsense.",
    resultImage: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    fallback: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    examples: ["Sinn 556", "IWC Pilot", "Bell & Ross BR 03"]
  },
  {
    type: "CHRONOGRAPH",
    title: "The Racer",
    key: "chrono",
    description: "You enjoy mechanical theater. Dials within dials, elapsed time, little details — the more personality the better.",
    resultImage: "https://images.pexels.com/photos/17060731/pexels-photo-17060731.jpeg",
    fallback: "https://images.pexels.com/photos/17060731/pexels-photo-17060731.jpeg",
    examples: ["Omega Speedmaster", "Breitling Navitimer", "Zenith Chronomaster"]
  },
  {
    type: "DRESS / ELEGANT",
    title: "The Quiet Classic",
    key: "dress",
    description: "Elegant without shouting. You notice typography, finishing, and the strange pleasure of something beautifully restrained.",
    resultImage: "https://assets.catawiki.com/image/pr%3Acw_ldp_l/plain/assets/catawiki/assets/2023/12/19/2/f/a/2faca0fa-fe67-4592-8c56-eb7484d6eb53.jpg",
    fallback: "https://images.pexels.com/photos/33694201/pexels-photo-33694201.jpeg",
    examples: ["Cartier Tank", "Jaeger-LeCoultre Reverso", "Longines Flagship"]
  },
  {
    type: "MINIMALIST",
    title: "The Clean Line",
    key: "minimal",
    description: "You like objects that communicate clearly and then get out of the way. Crisp markers, calm geometry, no clutter.",
    resultImage: "https://images.pexels.com/photos/2494608/pexels-photo-2494608.jpeg",
    fallback: "https://images.pexels.com/photos/2494608/pexels-photo-2494608.jpeg",
    examples: ["Grand Seiko", "Nomos Tangente", "Junghans Max Bill"]
  },

  {
    type: "ARTISTIC / EXPRESSIVE",
    title: "The Storyteller",
    key: "artistic",
    description: "You do not want a neutral object. You want the dial to tell a story — colour, texture, illustration, unusual finishing, or visible mechanical theatre.",
    resultImage: "https://a.storyblok.com/f/119298/1712x2140/d857283834/poignet-mobile.jpg",
    fallback: "https://a.storyblok.com/f/119298/1712x2140/d857283834/poignet-mobile.jpg ",
    examples: ["CODE41 Dial Artist", "AnOrdain Model 1", "Mr Jones Watches"]
  }
];

const state = {
  current: 0,
  scores: { adventure: 0, dress: 0, chrono: 0, tool: 0, minimal: 0, artistic: 0 },
  answers: [],
  catalogueOpen: false,
  resultsReady: false
};

const els = {
  questionStage: document.getElementById("questionStage"),
  questionKicker: document.getElementById("questionKicker"),
  questionText: document.getElementById("questionText"),
  answers: document.getElementById("answers"),
  questionNumber: document.getElementById("questionNumber"),
  progressFill: document.getElementById("progressFill"),
  microCopy: document.getElementById("microCopy"),
  networkCaption: document.getElementById("networkCaption"),
  networkLinks: document.getElementById("networkLinks"),
  networkNodes: document.getElementById("networkNodes"),
  quizView: document.getElementById("quizView"),
  resultsView: document.getElementById("resultsView"),
  resultTitle: document.getElementById("resultTitle"),
  resultIntro: document.getElementById("resultIntro"),
  recommendations: document.getElementById("recommendations"),
  promptList: document.getElementById("promptList"),
  copyStatus: document.getElementById("copyStatus"),
  restartButton: document.getElementById("restartButton"),
  catalogueToggle: document.getElementById("catalogueToggle"),
  cataloguePanel: document.getElementById("cataloguePanel"),
  catalogueClose: document.getElementById("catalogueClose"),
  catalogueGrid: document.getElementById("catalogueGrid"),
  catalogueSearch: document.getElementById("catalogueSearch")
};

// ------------------------------------------------------------
// Real-image fallback helper.
// Broken image URLs should never leave an empty card behind.
// ------------------------------------------------------------
function attachImageFallback(imageElement, fallbackUrl) {
  if (!fallbackUrl) return;
  imageElement.addEventListener("error", () => {
    if (imageElement.dataset.fallbackUsed) return;
    imageElement.dataset.fallbackUsed = "true";
    imageElement.src = fallbackUrl;
  });
}

// ------------------------------------------------------------
// Fake neural network: purely visual progress, nothing learned.
// ------------------------------------------------------------
function buildFakeNetwork() {
  const layers = [{ count: 4, x: 30 }, { count: 5, x: 112 }, { count: 4, x: 208 }];

  layers.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.count; i++) {
      const y = 22 + i * (108 / Math.max(1, layer.count - 1));
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", layer.x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 5);
      circle.classList.add("node");
      circle.dataset.layer = layerIndex;
      circle.dataset.index = i;
      els.networkNodes.appendChild(circle);
    }
  });

  const layerNodes = [...els.networkNodes.children];
  layers.forEach((_, layerIndex) => {
    if (layerIndex === layers.length - 1) return;
    const from = layerNodes.filter(n => Number(n.dataset.layer) === layerIndex);
    const to = layerNodes.filter(n => Number(n.dataset.layer) === layerIndex + 1);
    from.forEach(fromNode => to.forEach(toNode => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", fromNode.getAttribute("cx"));
      line.setAttribute("y1", fromNode.getAttribute("cy"));
      line.setAttribute("x2", toNode.getAttribute("cx"));
      line.setAttribute("y2", toNode.getAttribute("cy"));
      line.classList.add("link");
      els.networkLinks.appendChild(line);
    }));
  });
}

function animateNetwork(progress) {
  const nodes = [...els.networkNodes.children];
  const links = [...els.networkLinks.children];
  const activeNodes = Math.max(1, Math.ceil(nodes.length * progress));
  const activeLinks = Math.floor(links.length * progress);

  nodes.forEach((node, index) => node.classList.toggle("active", index < activeNodes));
  links.forEach((link, index) => link.classList.toggle("active", index < activeLinks));

  if (progress >= 1) els.networkCaption.textContent = "pretending this was mathematically meaningful ✓";
  else if (progress > 0.65) els.networkCaption.textContent = "hidden patterns are allegedly emerging…";
  else if (progress > 0.35) els.networkCaption.textContent = "the tiny machine is thinking…";
  else els.networkCaption.textContent = "waiting for data…";
}

// ------------------------------------------------------------
// Question renderer
// ------------------------------------------------------------
function renderQuestion() {
  const question = QUESTIONS[state.current];
  void els.questionStage.offsetWidth;
  els.questionStage.classList.remove("swap-in");
  els.questionStage.classList.add("swap-in");

  els.questionNumber.textContent = String(state.current + 1).padStart(2, "0");
  els.progressFill.style.width = `${((state.current + 1) / QUESTIONS.length) * 100}%`;
  els.questionKicker.textContent = question.kicker;
  els.questionText.textContent = question.text;
  els.answers.innerHTML = "";

  if (question.visual) {
    els.answers.classList.add("visual-grid");
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.className = "answer visual-answer";
      button.type = "button";

      const image = document.createElement("img");
      image.src = answer.image;
      image.alt = `${answer.label} visual choice`;
      image.loading = "eager";
      attachImageFallback(image, answer.fallback);

      const copy = document.createElement("span");
      copy.className = "visual-copy";
      copy.innerHTML = `<strong>${answer.label}</strong><small>${answer.caption}</small>`;

      button.appendChild(image);
      button.appendChild(copy);
      button.addEventListener("click", () => chooseAnswer(index, button));
      els.answers.appendChild(button);
    });
  } else {
    els.answers.classList.remove("visual-grid");
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.className = "answer";
      button.type = "button";
      button.dataset.letter = String.fromCharCode(65 + index);
      button.textContent = answer.text;
      button.addEventListener("click", () => chooseAnswer(index, button));
      els.answers.appendChild(button);
    });
  }

  animateNetwork(state.current / (QUESTIONS.length - 1));
  els.microCopy.textContent = state.current < 5
    ? "No bad answers. Only increasingly accurate wrists."
    : state.current < 10
      ? "The tiny machine is becoming weirdly opinionated."
      : state.current === 10
        ? "Now we stop asking questions and look at your taste."
        : "Final calibration. Choose with your eyes, not your résumé.";
}

function chooseAnswer(answerIndex, button) {
  if (button.classList.contains("selected")) return;
  button.classList.add("selected");

  const chosen = QUESTIONS[state.current].answers[answerIndex];
  Object.entries(chosen.weights).forEach(([type, weight]) => state.scores[type] += weight);
  state.answers.push(answerIndex);

  const lastQuestion = state.current === QUESTIONS.length - 1;
  if (lastQuestion) {
    animateNetwork(1);
    setTimeout(showResults, 550);
    return;
  }

  state.current += 1;
  setTimeout(renderQuestion, 360);
}

// ------------------------------------------------------------
// Recommendation logic
// ------------------------------------------------------------
function rankWatchTypes() {
  const boostedScores = { ...state.scores };

  // A few deliberately transparent "non-linear" nudges.
  // They make the engine feel more personality-like without becoming opaque.
  if (boostedScores.tool >= 7) boostedScores.tool += 2;
  if (boostedScores.chrono >= 6 && boostedScores.adventure >= 5) boostedScores.chrono += 1;
  if (boostedScores.dress >= 6 && boostedScores.minimal >= 6) boostedScores.minimal += 1;
  if (boostedScores.artistic >= 6) boostedScores.artistic += 2;
  if (boostedScores.artistic >= boostedScores.minimal + 3) boostedScores.artistic += 2;

  return WATCH_TYPES
    .map(watch => ({ ...watch, score: boostedScores[watch.key] }))
    .sort((a, b) => b.score - a.score);
}

function topMatches() {
  return rankWatchTypes().slice(0, 3);
}

// ------------------------------------------------------------
// Search prompts for the final screen.
// ------------------------------------------------------------
function buildPrompts(first) {
  const styleMap = {
    adventure: "field / adventure watch, rugged, highly legible, strong lume, 36–40mm",
    tool: "technical tool watch, instrument-style dial, high legibility, durable, strong lume",
    chrono: "mechanical chronograph, detailed sub-dials, racing or aviation character, premium movement",
    dress: "elegant dress watch, slim profile, refined dial, leather strap or polished bracelet",
    minimal: "minimalist watch, clean markers, restrained dial, Bauhaus or modernist design, thin profile",
    artistic: "artistic / expressive watch, colorful or hand-painted dial, unusual textures, visible craft or mechanical theatre"
  };

  const base = styleMap[first.key];
  return [
    `${base}, budget under ₹75,000, real listings only, compare reputable Indian sellers`,
    `${base}, budget ₹75,000–₹2,00,000, prioritize movement quality and long-term serviceability`,
    `${base}, luxury options above ₹2,00,000, prioritize unusual design and excellent finishing`,
    `${base}, show alternatives from Seiko, Citizen, Tissot, Hamilton, Longines, Oris, Sinn, Tudor and similar brands`
  ];
}

async function copyPrompt(prompt, button) {
  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = "copied ✓";
    els.copyStatus.textContent = "Copied to your clipboard ✦";
    setTimeout(() => {
      button.textContent = "copy";
      els.copyStatus.textContent = "";
    }, 1500);
  } catch {
    window.prompt("Copy this prompt:", prompt);
  }
}

function renderWatchImage(watch) {
  const wrap = document.createElement("div");
  wrap.className = "watch-photo-wrap";

  const image = document.createElement("img");
  image.className = "watch-photo";
  image.src = watch.resultImage;
  image.alt = `Real ${watch.type.toLowerCase()} watch reference`;
  image.loading = "eager";
  attachImageFallback(image, watch.fallback);

  wrap.appendChild(image);
  return wrap;
}

function showResults() {
  const matches = topMatches();
  const first = matches[0];

  els.quizView.hidden = true;
  els.resultsView.hidden = false;
  state.resultsReady = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
  showScrollCue();
  els.resultTitle.textContent = `You are ${first.title.toLowerCase()} energy.`;
  els.resultIntro.textContent = `Your strongest signal is ${first.type.toLowerCase()}. The top three below are real-watch references for that design lane — and because your visual answers matter, an artistic result is genuinely artistic rather than just "a nice silver watch."`;

  els.recommendations.innerHTML = "";

  matches.forEach((watch, index) => {
    const card = document.createElement("article");
    card.className = `watch-card ${index === 0 ? "is-top" : ""}`;

    const imageWrap = renderWatchImage(watch);
    if (index === 0) {
      const tag = document.createElement("span");
      tag.className = "top-pick";
      tag.textContent = "top personality match";
      imageWrap.appendChild(tag);
    }

    const meta = document.createElement("div");
    meta.className = "watch-meta";
    meta.innerHTML = `
      <div class="watch-type">${watch.type}</div>
      <h3>${watch.title}</h3>
      <p>${watch.description}</p>
      <span class="score-badge">personality score: ${watch.score}</span>
      <p class="examples"><strong>Search this lane:</strong> ${watch.examples.join(" · ")}</p>
    `;

    card.appendChild(imageWrap);
    card.appendChild(meta);
    els.recommendations.appendChild(card);
  });

  const prompts = buildPrompts(first);
  els.promptList.innerHTML = "";
  prompts.forEach(prompt => {
    const row = document.createElement("div");
    row.className = "prompt-row";

    const code = document.createElement("code");
    code.textContent = prompt;

    const button = document.createElement("button");
    button.className = "copy-prompt";
    button.type = "button";
    button.textContent = "copy";
    button.addEventListener("click", () => copyPrompt(prompt, button));

    row.appendChild(code);
    row.appendChild(button);
    els.promptList.appendChild(row);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ------------------------------------------------------------
// Catalogue
// ------------------------------------------------------------
function formatPrice(rupees) {
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}

function cataloguePrompt(item) {
  return `Find the ${item.name} watch, compare authentic new and pre-owned listings in India, show current prices and reputable sellers.`;
}

function renderCatalogue(filter = "") {
  const needle = filter.trim().toLowerCase();
  const matches = WATCH_CATALOGUE.filter(item =>
    !needle || `${item.name} ${item.type} ${item.key} ${item.vibe}`.toLowerCase().includes(needle)
  );

  els.catalogueGrid.innerHTML = "";

  matches.forEach(item => {
    const card = document.createElement("article");
    card.className = "catalogue-card";
    card.dataset.key = item.key;

    const media = document.createElement("div");
    media.className = "catalogue-media";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = `${item.name} reference photograph`;
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    // If the primary photo fails, use a watch-only fallback rather than
    // another broad keyword search that could return a random object.
    attachImageFallback(image, item.fallback);
    media.appendChild(image);

    const body = document.createElement("div");
    body.className = "catalogue-body";
    body.innerHTML = `
      <div class="catalogue-type">${item.type}</div>
      <h3>${item.name}</h3>
      <p class="catalogue-vibe">${item.vibe}</p>
      <div class="catalogue-price">~ ${formatPrice(item.price)}</div>
      <div class="catalogue-hover">
        <span>copy a shopping search ✦</span>
        <button class="catalogue-copy" type="button">copy prompt</button>
      </div>
    `;

    const copyButton = body.querySelector(".catalogue-copy");
    copyButton.addEventListener("click", event => {
      event.stopPropagation();
      copyPrompt(cataloguePrompt(item), copyButton);
    });

    card.appendChild(media);
    card.appendChild(body);
    els.catalogueGrid.appendChild(card);
  });
}

function openCatalogue() {
  state.catalogueOpen = true;
  els.cataloguePanel.hidden = false;
  document.body.classList.add("catalogue-open");
  renderCatalogue(els.catalogueSearch.value);
}

function closeCatalogue() {
  state.catalogueOpen = false;
  els.cataloguePanel.hidden = true;
  document.body.classList.remove("catalogue-open");
}

function showScrollCue() {
  const cue = document.getElementById("scrollCue");
  if (!cue) return;
  cue.classList.add("is-visible");

  // The cue is only a gentle nudge. It disappears once the user starts
  // scrolling, or after a few seconds if they prefer to click around first.
  window.setTimeout(() => cue.classList.remove("is-visible"), 6500);
}

function hideScrollCueOnScroll() {
  const cue = document.getElementById("scrollCue");
  if (!cue) return;
  if (window.scrollY > 90) cue.classList.remove("is-visible");
}

function restartQuiz() {
  state.current = 0;
  state.answers = [];
  Object.keys(state.scores).forEach(key => state.scores[key] = 0);
  els.resultsView.hidden = true;
  els.quizView.hidden = false;
  state.resultsReady = false;
  document.getElementById("scrollCue")?.classList.remove("is-visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderQuestion();
}

els.restartButton.addEventListener("click", restartQuiz);
els.catalogueToggle.addEventListener("click", openCatalogue);
els.catalogueClose.addEventListener("click", closeCatalogue);
els.catalogueSearch.addEventListener("input", event => renderCatalogue(event.target.value));
els.cataloguePanel.addEventListener("click", event => {
  if (event.target === els.cataloguePanel) closeCatalogue();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && state.catalogueOpen) closeCatalogue();
});

window.addEventListener("scroll", hideScrollCueOnScroll, { passive: true });

buildFakeNetwork();
renderQuestion();
