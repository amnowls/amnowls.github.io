/*  ───────────────────────────────────────────────────────────────
    All the words on the site live here. Edit freely.
    Keep the punctuation around the text as it is: quotes "…", commas at line ends.

    Each project:
      id     short name used in links (anna-nolden.com/#memorymeter). Don't change once live.
      title, kind, year, where
      with   collaborators, or null
      mine   what YOU did
      tools  "made with": a list of short items
      line   one or two plain sentences
      note   optional extra line, or leave it out
      music  optional music credit
      media  what shows in the pop-up, in order. The first one is shown first.
             {img: "folder/name", alt: "…"}       a photo from media/folder/name-800.jpg etc.
             {video: "folder/name", alt: "…"}     a film from media/folder/name.mp4 (+ -poster.jpg)
               add  silent: true  if it has no sound
             {play: "play/space-os/", thumb: "folder/name", alt: "…"}   something you can try
             alt = a short description for people using screen readers (not shown on screen)
    ─────────────────────────────────────────────────────────────── */

window.SITE = {
  bio: [
    "I’m an interaction designer and design technologist based in Stockholm, studying Interactive Media Technology at KTH. Before that I studied Interaction Design Arts and Creative Computing at UAL in London. Originally from Boston.",
    "electronics  //  fabrication //  sound  //  interfaces"
  ],
  links: {
    email:    "annanolden0@gmail.com",
    github:   "https://github.com/amnowls",
    linkedin: "https://www.linkedin.com/in/anna-nolden-37017a252",
    cv:       "anna-nolden-cv.pdf"
  },
  // words joined by the hanging cords in the index (must match text in "tools" or "with" exactly)
  cords: ["ESP32", "Fusion 360", "3d print", "laser-cut ply", "Isabel Andrews"],
  credits: "Music in SPACE-OS by Tottomori. Collaborators are named on each project. Site built by hand; set in Times."
};

window.PROJECTS = [
  {
    id: "memorymeter", title: "Memory Meter", kind: "device + app", year: 2026,
    where: "KTH, DM2601",
    with: "Chanhee Jeong, Montana Eriksson, Szu-Yi Ho",
    mine: "Full double-diamond process with the group; I modelled, built, and soldered the remote control.",
    tools: ["ESP32", "Bluetooth LE", "rotary encoder", "Fusion 360", "3d print", "SwiftUI", "projector"],
    line: "Inspired by the familial ritual of marking height on walls, Memory Meter digitizes this tradition to allow it to continue through moves and time. Videos of each child's growth project life-sized on your wall with easy home setup.",
    note: "Showing at NAVET Week, Scenkonstmuseet, 9–10 Dec 2026.",
    media: [
      {video: "memorymeter/film", alt: "Film: recording a height at the wall and playing it back."},
      {img: "memorymeter/controller", alt: "The remote control: a grey 3D-printed box with black buttons and a knob."},
      {img: "memorymeter/wall", alt: "A person at the wall, a parent holding the controller, the projector beside them."},
      {img: "memorymeter/setup", alt: "Setup diagram showing where the projector goes."}
    ]
  },
  {
    id: "ispy", title: "i-spy", kind: "installation", year: 2026,
    where: "UAL, IDA graduate show",
    with: "Isabel Andrews",
    mine: "3d modelling, fabrication and soldering, LCD panel, interface graphics, program prototyping.",
    tools: ["5× ESP32s", "microphones", "UDP", "Whisper", "FastAPI", "Fusion 360", "laser-cut ply", "tin can"],
    line: "Five hidden microphones around an exhibition space with a central spy-station, where all audio signals are received. Pick a channel with a slider, listen through a tin can, and watch a machine try to transcribe what it hears.",
    media: [
      {img: "ispy/monitor", alt: "A white plywood monitor with a blue floor-plan screen, a tin can speaker and a small LCD."},
      {img: "ispy/transcript", alt: "The screen showing a live, partly misheard transcript."},
      {img: "ispy/detail", alt: "Close-up of finger joints, the tin can and the waveform display."},
      {img: "ispy/visitor", alt: "A visitor choosing a channel."}
    ]
  },
  {
    id: "spaceos", title: "SPACE-OS", kind: "interface", year: 2026,
    where: "UAL, IDA final major project",
    with: null,
    mine: "solo; built with Claude Code from my specs.",
    tools: ["HTML", "canvas", "isometric", "Claude Code"],
    line: "An imagined OS desktop where files are stored spatially. You locate your digital belongings by remembering where you put them.",
    music: "Tottomori (walkthrough and prototype)",
    media: [
      {video: "spaceos/walkthrough", alt: "Walkthrough: moving through rooms, opening furniture, the trash, painting a room, Find."},
      {img: "spaceos/room", alt: "An isometric room with a desk, shelf and trunk."},
      {play: "play/space-os/", thumb: "spaceos/room", alt: "The working prototype. Move the cursor to pan; click furniture to open."},
      {img: "spaceos/desk", alt: "The work desk opened, showing its files."}
    ]
  },
  {
    id: "sowwhat", title: "Sow What?!", kind: "arcade game", year: 2026,
    where: "UAL, Science Museum ‘Future of Food’ brief",
    with: "Isabel Andrews",
    mine: "game code, sprites, all music and sound, screen mount.",
    tools: ["Phaser.js", "Raspberry Pi", "Aseprite", "Logic", "Fusion 360", "laser-cut ply", "resin"],
    line: "A small arcade game about seed laws, with a custom arcade cabinet. You farm, season by season, making decisions as time passes and playing mini-games to, hopefully, escape a gloomy future.",
    media: [
      {img: "sowwhat/cabinet", alt: "The arcade cabinet: painted plywood, a screen, a bean-shaped joystick."},
      {video: "sowwhat/gameplay", alt: "Gameplay: escaping the seed inspector."},
      {img: "sowwhat/show", alt: "A visitor playing at the show."},
      {img: "sowwhat/panel", alt: "The control panel with the resin bean joystick."},
      {img: "sowwhat/minigames", alt: "Four mini-game screens: inspector, planting, slots, jail."}
    ]
  },
  {
    id: "transmitter", title: "Transmission Pending", kind: "communication system", year: 2025,
    where: "UAL Creative Computing Institute",
    with: "Isabel Andrews",
    mine: "Modelled and fabricated both devices; electronics and soldering.",
    tools: ["ESP32", "MicroPython", "MQTT", "text-to-speech", "Fusion 360", "3d print"],
    line: "Two devices, a transmitter and receiver, serve as a wireless communication system designed aroun the slow technology movement. Spell a message letter by letter on a dial. In another room it arrives as a voice, through a cone, and plays once. Presence, intention, and listening forefront the interaction.",
    media: [
      {video: "transmitter/film", silent: true, alt: "Film: spelling a message on the dial, then lifting the cone to hear it."},
      {img: "transmitter/pair", alt: "The white transmitter and receiver side by side."},
      {img: "transmitter/dial", alt: "Hands spelling a message on the letter dial."},
      {img: "transmitter/lcd", alt: "The blue display: message inbound, plays once only."},
      {img: "transmitter/transmitter", alt: "The transmitter in raking light."},
      {img: "transmitter/receiver", alt: "The receiver with its cone."}
    ]
  },
  {
    id: "chaoscillator", title: "the chaoscillator", kind: "instrument", year: 2024,
    where: "UAL Creative Computing Institute",
    with: null,
    mine: "programming, electronics, Pd patch, soldering, sculpting",
    tools: ["polymer clay", "MPR121", "Arduino", "PureData"],
    line: "A slab of red clay with ten eyelets. Touch pulls the tones down, and nothing turns them off.",
    media: [
      {video: "chaoscillator/teaser", alt: "Teaser: hands on the clay, the tones changing."},
      {img: "chaoscillator/object", alt: "The red clay pad with ten metal eyelets and its wires."},
      {img: "chaoscillator/overhead", alt: "Two hands playing it at a desk."},
      {img: "chaoscillator/ghost", alt: "Translucent hands over the pad."}
    ]
  }
];

window.EXTRAS = [
  {
    id: "myco", title: "Mycomorphosis", kind: "book", year: 2024,
    where: "UAL London College of Communication, Design Production",
    with: null,
    mine: "solo: researched, wrote, typeset, printed and bound it",
    tools: ["homemade mycelium paper", "screenprint", "coptic binding", "G.F. Smith recycled paper"],
    line: "A book about mycelium and circular economy, envisioning a future in which our systems are inspired by the circular processes found in nature. 58 pages, written, set and coptic-bound by hand, on mycelium as material and model.",
    media: [
      {video: "myco/flip", silent: true, alt: "Flipping through the book."},
      {img: "myco/covers", alt: "Two copies: one covered in scrap cotton, one in reused card."},
      {img: "myco/spine", alt: "The exposed coptic binding."},
      {img: "myco/spread", alt: "A spread with text set as a diagram."}
    ]
  }
];
