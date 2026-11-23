(() => {
  const root = document.querySelector("[data-pdp]");
  if (!root) return;

  const title = root.dataset.title || "FRAIMOUS";
  const slug = root.dataset.slug || "work";
  const main = document.getElementById("pdp-main");
  const stage = document.getElementById("pdp-stage");
  const inquire = document.getElementById("pdp-inquire");
  const addBtn = document.getElementById("pdp-add");
  const thumbs = [...document.querySelectorAll(".pdp-thumb")];
  const hasCutouts = thumbs.some((t) => t.dataset.role === "cutout");
  const frames = [...document.querySelectorAll("[data-frame]")];
  const finishes = [...document.querySelectorAll("[data-finish]")];
  const sizes = [...document.querySelectorAll("button[data-size]")];
  const sizeChips = sizes;
  const orients = [...document.querySelectorAll("button[data-orient]")];
  const sizeGroups = [...document.querySelectorAll("[data-size-group]")];
  const visibleSizes = () => sizes.filter((b) => !b.closest("[hidden]"));

  const FRAME_LABEL = { black: "Black", white: "White", oak: "Red Oak", none: "No frame" };
  const SIZE_FILE = {
    "16×20": "16x20",
    "18×24": "18x24",
    "24×36": "24x36",
    "18×12": "18x12",
    "24×18": "24x18",
    "36×24": "36x24",
    "30×60": "30x60",
    "40×55": "40x55",
    "40×60": "40x60",
    "60×30": "60x30",
    "55×40": "55x40",
    "60×40": "60x40",
    "20×16": "20x16",
  };
  const STILL_WH = { portrait: [3072, 5440], landscape: [5120, 2880] };
  const PRINT_COPY = {
    luster:
      "Ultra Premium Luster Photo Paper. Between gloss and matte. High saturation. 10 mil (0.25 mm), 260 g/m². Made on demand.",
    mat: "Matte paper, 10.3 mil, 189 g/m², behind a white mat board. Made on demand.",
    canvas:
      "Gallery-wrap canvas, 1.25″ (3.18 cm) deep. Image continues around the edges. No glass. Ready to hang. Made on demand.",
  };
  const FRAME_COPY = {
    luster:
      ".75″ (1.9 cm) ayous wood. Black, White, or Red Oak. Acrylite front. Hardware included. Ready to hang. No mat.",
    mat: ".75″ (1.9 cm) ayous wood. Black, White, or Red Oak. White mat board. Acrylite front. Hardware included. Ready to hang.",
    canvas: "Gallery wrap. No frame, no mat, no glass. Hardware included. Ready to hang.",
  };
  const ASSET_V = "20261006d";
  // Web-optimised detail scans (library/web/detail/<slug>.jpg, long edge ≤ 5400, from the
  // largest source on disk: print master or keeper). [w, h] in px. Generated 2026-10-06.
  const DETAIL_WH = {/*angels*/"requies": [3038, 5400], "casus": [3038, 5400], "aureola": [3038, 5400], "gremium": [3038, 5400], "pallium": [3038, 5400], "descensus": [3038, 5400], "vitrea": [3038, 5400], "excubiae": [3038, 5400], "lumen": [3038, 5400], "sopor": [3038, 5400], "gratia": [3038, 5400], "candor": [3038, 5400], "quies": [3038, 5400], "silentium": [3038, 5400], "aula": [3038, 5400], "pinna": [3038, 5400], "caelifera": [3038, 5400], "petra": [3038, 5400], "nimbus": [3038, 5400], "ignis": [3038, 5400], "spira": [3038, 5400], "velamen": [3038, 5400], "desiderium": [3038, 5400], /*angels*/"adamas":[784,1168],"adscensus":[3600,5400],"aether":[919,1369],"aevum":[771,1371],"alpine-rings":[2880,5120],"annulus":[768,1360],"apex":[3600,5400],"arch-duel":[3352,4992],"ardor":[784,1168],"blue-lattice":[3136,4672],"bruma":[3600,5400],"cabin-seven":[3049,5400],"cable-desk":[2880,5120],"cavea":[919,1369],"clamor":[5400,3600],"clivus":[3600,5400],"cloud-pilot":[5400,3038],"collar":[3600,5400],"colonus":[464,688],"concentus":[919,1369],"convivium":[3600,5400],"cor":[919,1369],"cord-room":[3352,4992],"crates":[919,1369],"cubes":[3136,4672],"cubile":[919,1369],"culmen":[3600,5400],"daisy-iron":[5400,3600],"desert-seven":[2808,4992],"doll-pilot":[3136,4672],"dual-leap":[3136,4672],"earth-stretch":[2880,5120],"effigies":[919,1369],"electrum":[919,1369],"fastigium":[3600,5400],"felis":[720,1280],"flamma":[784,1168],"forest-arch":[2808,4992],"fornix":[768,1360],"fulgor":[3600,5400],"fulmen":[3600,5400],"furor":[3600,5400],"glass-walk":[3049,5400],"gradus":[3600,5400],"green-circuit":[5120,2880],"green-field":[3038,5400],"grid-ascent":[3600,5400],"halitus":[919,1369],"horse-floor":[3600,5400],"imago":[919,1369],"inversum":[768,1360],"iovis":[1152,1728],"iron-pair":[3136,4672],"iuba":[3600,5400],"iugum":[464,688],"iustitia":[1280,720],"lamina":[919,1369],"lapsus":[919,1369],"latebra":[720,1280],"leather-cap":[2880,5120],"letter-jewel":[2880,5120],"lorica":[919,1369],"lucerna":[784,1168],"lunar-walk":[2880,5120],"marmor":[919,1369],"mensa":[919,1369],"monile":[894,1369],"moon-terrace":[2880,5120],"needle-city":[5400,3038],"needle-mark":[2880,5120],"nervus":[919,1369],"nexum":[919,1369],"nexus":[919,1369],"oculus":[919,1369],"orbit-paper":[3049,5400],"orbital-library":[2880,5120],"osculum":[3600,5400],"papaver":[720,1280],"paper-face":[3049,5400],"paper-spread":[3049,5400],"patria":[919,1369],"pink-key":[2880,5120],"plexus":[919,1369],"poculum":[1280,720],"praeceps":[919,1369],"ptera":[838,1248],"pulvis":[919,1369],"radius":[919,1369],"ratio":[919,1369],"ring-seven":[3600,5400],"rosa":[720,1280],"sacrum":[771,1371],"saeclum":[771,1371],"scala":[3600,5400],"scandere":[3600,5400],"sequined-night":[2880,5120],"shoulder-split":[3136,4672],"silver-dome":[5400,3038],"silver-window":[2880,5120],"smoke-eyes":[2880,5120],"speculum":[784,1168],"stacked-line":[3136,4672],"stamen":[768,1360],"susurrus":[3600,5400],"thyrsus":[3600,5400],"tigris":[3600,5400],"trama":[919,1369],"transenna":[919,1369],"turris":[1008,1792],"twin-hold":[2880,5120],"typewriter-sun":[2880,5120],"umbra":[784,1168],"unda":[784,1168],"vacuum":[919,1369],"velum":[720,1280],"vigilia":[919,1369],"viscus":[919,1369],"visio":[919,1369],"vorago":[919,1369],"votum":[720,1280],"white-cords":[3352,4992],"white-pad":[3600,5400],"white-rabbit":[3352,4992],"the-point":[1264,1568],"the-embrace":[1264,1568],"the-set":[2592,1568]};
  // Living mocks per work (whole frame shown, autoplay muted loop inline, no controls).
  // Real detail in each detail file (long edge, px), from a calibrated spectral-cutoff estimate
  // (r2/spec.py). The zoom never shows past ~1 real px per CSS px (min 2×, max 8×). See library/web/detail/manifest.json.
  const DETAIL_REAL = {/*angels*/"requies": 5400, "casus": 5400, "aureola": 5400, "gremium": 5400, "pallium": 5400, "descensus": 5400, "vitrea": 5400, "excubiae": 5400, "lumen": 5400, "sopor": 5400, "gratia": 5400, "candor": 5400, "quies": 5400, "silentium": 5400, "aula": 5400, "pinna": 5400, "caelifera": 5400, "petra": 5400, "nimbus": 5400, "ignis": 5400, "spira": 5400, "velamen": 5400, "desiderium": 5400, /*angels*/ adamas: 500, adscensus: 1480, aether: 510, aevum: 570, "alpine-rings": 1410, annulus: 610, apex: 1420, "arch-duel": 1250, ardor: 470, "blue-lattice": 1340, bruma: 1550, "cabin-seven": 1450, "cable-desk": 1470, cavea: 550, clamor: 1650, clivus: 1350, "cloud-pilot": 1650, collar: 1750, colonus: 280, concentus: 550, convivium: 1580, cor: 580, "cord-room": 1460, crates: 580, cubes: 1460, cubile: 550, culmen: 1420, "daisy-iron": 1780, "desert-seven": 1250, "doll-pilot": 1230, "dual-leap": 1170, "earth-stretch": 1370, effigies: 590, electrum: 600, fastigium: 1350, felis: 690, flamma: 450, "forest-arch": 1250, fornix: 580, fulgor: 1550, fulmen: 1520, furor: 1780, "glass-walk": 1520, gradus: 1520, "green-circuit": 1500, "green-field": 1750, "grid-ascent": 1750, halitus: 500, "horse-floor": 1680, imago: 530, inversum: 420, iovis: 690, "iron-pair": 1200, iuba: 1550, iugum: 280, iustitia: 610, lamina: 560, lapsus: 560, latebra: 610, "leather-cap": 1280, "letter-jewel": 1440, lorica: 560, lucerna: 480, "lunar-walk": 1340, marmor: 550, mensa: 570, monile: 560, "moon-terrace": 1280, "needle-city": 1550, "needle-mark": 1410, nervus: 580, nexum: 1370, nexus: 560, oculus: 560, "orbit-paper": 1520, "orbital-library": 1280, osculum: 1750, papaver: 610, "paper-face": 1650, "paper-spread": 1580, patria: 530, "pink-key": 1280, plexus: 560, poculum: 560, praeceps: 590, ptera: 550, pulvis: 820, radius: 540, ratio: 580, "ring-seven": 1680, rosa: 1150, sacrum: 580, saeclum: 590, scala: 1420, scandere: 1380, "sequined-night": 1280, "shoulder-split": 1230, "silver-dome": 1580, "silver-window": 1280, "smoke-eyes": 1280, speculum: 450, "stacked-line": 1200, stamen: 610, susurrus: 1550, thyrsus: 1620, tigris: 1520, trama: 570, transenna: 560, turris: 860, "twin-hold": 1470, "typewriter-sun": 1470, umbra: 380, unda: 380, vacuum: 590, velum: 610, vigilia: 560, viscus: 580, visio: 580, vorago: 560, votum: 540, "white-cords": 1430, "white-pad": 1650, "white-rabbit": 1250, "the-point": 1568, "the-embrace": 1568, "the-set": 2592 };
  // Aspect range [min, max] of every image the stage can show per work (rooms, cutouts, video, stills).
  const STAGE_AR = {/*angels*/"requies": [0.667, 1.5], "casus": [0.667, 1.5], "aureola": [0.667, 1.5], "gremium": [0.667, 1.5], "pallium": [0.667, 1.5], "descensus": [0.667, 1.5], "vitrea": [0.667, 1.5], "excubiae": [0.667, 1.5], "lumen": [0.667, 1.5], "sopor": [0.667, 1.5], "gratia": [0.667, 1.5], "candor": [0.667, 1.5], "quies": [0.667, 1.5], "silentium": [0.667, 1.5], "aula": [0.667, 1.5], "pinna": [0.667, 1.5], "caelifera": [0.667, 1.5], "petra": [0.667, 1.5], "nimbus": [0.667, 1.5], "ignis": [0.667, 1.5], "spira": [0.667, 1.5], "velamen": [0.667, 1.5], "desiderium": [0.667, 1.5], /*angels*/ adamas: [0.671, 0.671], adscensus: [0.667, 1.5], aether: [0.672, 0.672], aevum: [0.562, 0.562], "alpine-rings": [0.562, 0.562], annulus: [0.565, 0.565], apex: [0.667, 1.5], "arch-duel": [0.672, 0.672], ardor: [0.671, 0.671], "blue-lattice": [0.671, 0.671], bruma: [0.667, 1.5], "cabin-seven": [0.676, 1.201], "cable-desk": [0.562, 0.562], cavea: [0.672, 0.672], clamor: [1.245, 1.5], clivus: [0.667, 1.5], "cloud-pilot": [1.778, 1.778], collar: [0.667, 1.5], colonus: [0.674, 0.674], concentus: [0.672, 0.672], convivium: [0.667, 1.5], cor: [0.672, 0.672], "cord-room": [0.672, 0.672], crates: [0.672, 0.672], cubes: [0.676, 1.201], cubile: [0.672, 0.672], culmen: [0.667, 1.5], "daisy-iron": [1.201, 1.5], "desert-seven": [0.676, 1.201], "doll-pilot": [0.676, 1.201], "dual-leap": [0.671, 0.671], "earth-stretch": [0.562, 0.562], effigies: [0.672, 0.672], electrum: [0.672, 0.672], fastigium: [0.667, 1.5], felis: [0.562, 0.562], flamma: [0.671, 0.671], "forest-arch": [0.562, 0.562], fornix: [0.565, 0.565], fulgor: [0.667, 1.5], fulmen: [0.667, 1.5], furor: [0.667, 1.5], "glass-walk": [0.667, 1.5], gradus: [0.667, 1.5], "green-circuit": [1.778, 1.778], "green-field": [0.562, 0.562], "grid-ascent": [0.567, 1.5], halitus: [0.672, 0.672], "horse-floor": [0.667, 1.5], imago: [0.672, 0.672], inversum: [0.565, 0.565], iovis: [0.667, 0.667], "iron-pair": [0.671, 0.671], iuba: [0.667, 1.5], iugum: [0.674, 0.674], iustitia: [1.778, 1.778], lamina: [0.672, 0.672], lapsus: [0.672, 0.672], latebra: [0.562, 0.562], "leather-cap": [0.562, 0.562], "letter-jewel": [0.562, 0.562], lorica: [0.672, 0.672], lucerna: [0.671, 1.5], "lunar-walk": [0.676, 1.5], marmor: [0.672, 0.672], mensa: [0.672, 0.672], monile: [0.653, 0.653], "moon-terrace": [0.667, 1.5], "needle-city": [1.778, 1.778], "needle-mark": [0.562, 0.562], nervus: [0.672, 0.672], nexum: [0.672, 0.672], nexus: [0.672, 0.672], oculus: [0.672, 0.672], "orbit-paper": [0.565, 1.778], "orbital-library": [0.667, 0.811], osculum: [0.667, 1.5], papaver: [0.562, 0.562], "paper-face": [0.565, 0.565], "paper-spread": [0.565, 0.565], patria: [0.672, 0.672], "pink-key": [0.562, 0.562], plexus: [0.672, 0.672], poculum: [1.778, 1.778], praeceps: [0.672, 0.672], ptera: [0.672, 1.5], pulvis: [0.672, 0.672], radius: [0.672, 0.672], ratio: [0.672, 0.672], "ring-seven": [0.676, 1.201], rosa: [0.562, 0.562], sacrum: [0.562, 0.562], saeclum: [0.562, 0.562], scala: [0.667, 1.5], scandere: [0.667, 1.5], "sequined-night": [0.562, 0.562], "shoulder-split": [0.671, 0.671], "silver-dome": [1.778, 1.778], "silver-window": [0.562, 0.562], "smoke-eyes": [0.562, 0.562], speculum: [0.671, 0.671], "stacked-line": [0.671, 0.671], stamen: [0.565, 0.565], susurrus: [0.667, 1.5], thyrsus: [0.667, 1.5], tigris: [0.667, 1.5], trama: [0.672, 0.672], transenna: [0.672, 0.672], turris: [0.562, 0.562], "twin-hold": [0.562, 0.562], "typewriter-sun": [0.562, 0.562], umbra: [0.671, 0.671], unda: [0.671, 0.671], vacuum: [0.672, 0.672], velum: [0.562, 0.562], vigilia: [0.672, 0.672], viscus: [0.672, 0.672], visio: [0.672, 0.672], vorago: [0.672, 0.672], votum: [0.562, 0.562], "white-cords": [0.672, 0.672], "white-pad": [0.667, 1.5], "white-rabbit": [0.672, 0.672] };
  // Works whose page offers finishes/sizes without matching cutouts: only these files exist. Never request the rest.
  const CUT_HAVE = {/*angels*/"requies": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "casus": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "aureola": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "gremium": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "pallium": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "descensus": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "vitrea": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "excubiae": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "lumen": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "sopor": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "gratia": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "candor": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "quies": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "silentium": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "aula": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "pinna": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "caelifera": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "petra": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "nimbus": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "ignis": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "spira": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "velamen": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", "desiderium": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36 canvas_24x36 canvas_40x55 canvas_40x60", /*angels*/ "cabin-seven": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", cubes: "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", "desert-seven": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", "doll-pilot": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", lucerna: "black_24x36 oak_24x36 white_24x36", "lunar-walk": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", "orbital-library": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36", ptera: "black_24x36 oak_24x36 white_24x36", "ring-seven": "black_16x20 black_18x24 black_24x36 oak_16x20 oak_18x24 oak_24x36 white_16x20 white_18x24 white_24x36" };

  // Round 3: outer frame box [x0, y0, x1, y1] (0–1 of the file) in every landscape room / scene / video file.
  // Detected (SIFT art match + frame-edge scan), checked on a sheet; video boxes are the union over the clip.
  const FRAME_BOX = {/*angels*/"requies_room.jpg": [0.25,  0.181,  0.417,  0.545], "casus_room.jpg": [0.284,  0.167,  0.457,  0.545], "aureola_room.jpg": [0.396,  0.271,  0.607,  0.729], "gremium_room.jpg": [0.812,  0.28,  0.969,  0.622], "pallium_room.jpg": [0.344,  0.104,  0.526,  0.5], "descensus_room.jpg": [0.671,  0.249,  0.851,  0.641], "vitrea_room.jpg": [0.333,  0.195,  0.536,  0.639], "excubiae_room.jpg": [0.355,  0.241,  0.592,  0.759], "lumen_room.jpg": [0.377,  0.231,  0.623,  0.769], "sopor_room.jpg": [0.47,  0.257,  0.693,  0.743], "gratia_room.jpg": [0.371,  0.148,  0.629,  0.711], "candor_room.jpg": [0.562,  0.3,  0.746,  0.7], "quies_room.jpg": [0.372,  0.222,  0.628,  0.778], "silentium_room.jpg": [0.168,  0.191,  0.345,  0.576], "aula_room.jpg": [0.168,  0.177,  0.352,  0.576], "pinna_room.jpg": [0.605,  0.297,  0.771,  0.659], "caelifera_room.jpg": [0.375, 0.071, 0.617, 0.616], "petra_room.jpg": [0.169,  0.11,  0.361,  0.529], "nimbus_room.jpg": [0.355,  0.241,  0.592,  0.759], "ignis_room.jpg": [0.456,  0.264,  0.646,  0.678], "spira_room.jpg": [0.605,  0.297,  0.771,  0.659], "velamen_room.jpg": [0.377,  0.231,  0.623,  0.769], "desiderium_room.jpg": [0.294,  0.212,  0.49,  0.639], /*angels*/"adscensus_room.jpg": [0.447, 0.129, 0.672, 0.635], "adscensus_room_mat.jpg": [0.374, 0.033, 0.732, 0.779], "apex_room.jpg": [0.387, 0.146, 0.613, 0.653], "apex_room_mat.jpg": [0.335, 0.033, 0.693, 0.78], "bruma_room.jpg": [0.437, 0.118, 0.68, 0.663], "bruma_room_mat.jpg": [0.404, 0.033, 0.762, 0.777], "cabin-seven_room.jpg": [0.281, 0.08, 0.593, 0.642], "clamor_room.jpg": [0.259, 0.1, 0.821, 0.662], "clamor_room_mat.jpg": [0.278, 0.146, 0.721, 0.624], "clivus_room.jpg": [0.271, 0.069, 0.596, 0.654], "clivus_room_mat.jpg": [0.404, 0.033, 0.762, 0.777], "collar_room.jpg": [0.447, 0.106, 0.672, 0.632], "collar_room_mat.jpg": [0.32, 0.033, 0.679, 0.788], "convivium_room.jpg": [0.406, 0.109, 0.655, 0.657], "convivium_room_mat.jpg": [0.306, 0.033, 0.664, 0.78], "cubes_room.jpg": [0.369, 0.047, 0.679, 0.603], "culmen_room.jpg": [0.305, 0.076, 0.618, 0.779], "culmen_room_mat.jpg": [0.32, 0.033, 0.678, 0.788], "daisy-iron_room.jpg": [0.125, 0.083, 0.919, 0.828], "daisy-iron_room_mat.jpg": [0.278, 0.145, 0.721, 0.623], "desert-seven_room.jpg": [0.384, 0.11, 0.715, 0.706], "doll-pilot_room.jpg": [0.411, 0.112, 0.738, 0.7], "fastigium_room.jpg": [0.364, 0.038, 0.684, 0.613], "fastigium_room_mat.jpg": [0.306, 0.033, 0.664, 0.78], "frm_098_hero_poster_clean.jpg": [0.335, 0.086, 0.611, 0.706], "fulgor_room.jpg": [0.235, 0.007, 0.558, 0.733], "fulgor_room_mat.jpg": [0.335, 0.033, 0.693, 0.78], "fulmen_room.jpg": [0.295, 0.147, 0.504, 0.614], "fulmen_room_mat.jpg": [0.32, 0.033, 0.679, 0.788], "furor_room.jpg": [0.535, 0.061, 0.948, 0.745], "glass-walk_live.jpg": [0.333, 0.112, 0.655, 1.0], "glass-walk_room_mat.jpg": [0.32, 0.033, 0.678, 0.78], "gradus_room.jpg": [0.37, 0.121, 0.639, 0.726], "gradus_room_mat.jpg": [0.267, 0.033, 0.625, 0.779], "grid-ascent_room_mat.jpg": [0.335, 0.033, 0.693, 0.78], "grid-ascent_room_v3.jpg": [0.426, 0.176, 0.595, 0.543], "horse-floor_live.jpg": [0.355, 0.084, 0.638, 0.746], "horse-floor_room.jpg": [0.328, 0.054, 0.674, 0.823], "horse-floor_room_mat.jpg": [0.32, 0.033, 0.678, 0.78], "iuba_room.jpg": [0.375, 0.104, 0.67, 0.767], "iuba_room_mat.jpg": [0.335, 0.033, 0.693, 0.78], "lucerna_room.jpg": [0.32, 0.087, 0.679, 0.835], "lunar-walk_room.jpg": [0.321, 0.093, 0.678, 0.895], "moon-terrace_room.jpg": [0.387, 0.108, 0.712, 0.692], "moon-terrace_room_mat.jpg": [0.32, 0.033, 0.678, 0.788], "osculum_room.jpg": [0.406, 0.111, 0.655, 0.671], "osculum_room_mat.jpg": [0.237, 0.033, 0.595, 0.777], "ptera_live.jpg": [0.402, 0.162, 0.605, 0.604], "ptera_room.jpg": [0.32, 0.087, 0.679, 0.835], "ring-seven_room.jpg": [0.366, 0.047, 0.681, 0.603], "scala_live.jpg": [0.341, 0.11, 0.652, 0.779], "scala_room.jpg": [0.351, 0.137, 0.568, 0.624], "scala_room_mat.jpg": [0.32, 0.033, 0.678, 0.788], "scandere_room.jpg": [0.337, 0.044, 0.652, 0.752], "scandere_room_mat.jpg": [0.237, 0.033, 0.595, 0.777], "susurrus_room.jpg": [0.422, 0.106, 0.666, 0.652], "susurrus_room_mat.jpg": [0.32, 0.033, 0.678, 0.778], "thyrsus_room.jpg": [0.335, 0.086, 0.613, 0.711], "thyrsus_room_mat.jpg": [0.32, 0.033, 0.678, 0.779], "tigris_room.jpg": [0.44, 0.118, 0.639, 0.563], "tigris_room_mat.jpg": [0.374, 0.033, 0.732, 0.779], "white-pad_live.jpg": [0.362, 0.129, 0.633, 0.701], "white-pad_room.jpg": [0.43, 0.077, 0.709, 0.702], "white-pad_room_mat.jpg": [0.32, 0.033, 0.678, 0.778]};

  const VIDEOS = {
    // Thyrsus: frm_098_hero.mp4 (fae1ba08) has a doubled, seamed art layer. Never ship it — the tab shows the clean still instead.
    thyrsus: { still: "../library/web/mocks/frm_098_hero_poster_clean.jpg", wh: [3072, 2048] },
    "horse-floor": { src: "../library/mocks/horse-floor_live.mp4", poster: "../library/web/mocks/horse-floor_live.jpg", wh: [3072, 2048] },
    scala: { src: "../library/mocks/scala_live.mp4", poster: "../library/web/mocks/scala_live.jpg", wh: [1536, 1024] },
    "white-pad": { src: "../library/mocks/white-pad_live.mp4", poster: "../library/web/mocks/white-pad_live.jpg", wh: [3072, 2048] },
    ptera: { src: "../library/mocks/ptera_live.mp4", poster: "../library/web/mocks/ptera_live.jpg", wh: [3072, 2048] },
    "glass-walk": { src: "../library/mocks/glass-walk_live.mp4", poster: "../library/web/video/glass-walk_live.jpg", wh: [3072, 2048] },
    "grid-ascent": { src: "../library/web/video/grid-ascent_climb.mp4", poster: "../library/web/video/grid-ascent_climb.jpg", wh: [1088, 1920] },
  };

  const state = {
    frame: (frames.find((b) => b.classList.contains("is-on")) || frames[0])?.dataset.frame || "black",
    finish: (finishes.find((b) => b.classList.contains("is-on")) || finishes[0])?.dataset.finish || "mat",
    size: (visibleSizes().find((b) => b.classList.contains("is-on")) || visibleSizes()[0] || sizes[0])?.dataset.size || (document.querySelector(".pdp-info .chip.is-locked .chip-in")?.textContent || "").trim() || "16×20",
    orient: (orients.find((b) => b.classList.contains("is-on")) || orients[0])?.dataset.orient || root.dataset.orient || "",
    view: /_room(?:_mat|_canvas)?(?:_v\d+)?\.jpg/.test((main && main.getAttribute("src")) || "") ? "room" : "cutout",
  };

  const sizeFile = (size) => SIZE_FILE[size] || String(size || "16x20").replace("×", "x");

  // Canvas cutouts only exist at canvas chip sizes. If a framed size (e.g. 18×12, 16×20)
  // reaches a canvas URL before size sync, map it to the page's canvas Medium chip
  // (same orientation) instead of requesting a 404. Does not change state.size or chips.
  const CANVAS_FALLBACK = { "16x20": "24x36", "18x24": "24x36", "18x12": "36x24", "24x18": "36x24", "20x16": "36x24", "30x60": "24x36", "60x30": "36x24", "40x60": "40x60", "60x40": "60x40" };
  const canvasChipFiles = () =>
    sizes.filter((b) => b.closest('[data-size-group="canvas"]')).map((b) => sizeFile(b.dataset.size));
  const canvasSizeFile = (size) => {
    const raw = sizeFile(size);
    // Old size-canon aliases (30×60 / 60×30) → live Medium chips. Chips unchanged.
    const sf = CANVAS_FALLBACK[raw] || raw;
    const chips = canvasChipFiles();
    if (!chips.length) return sf;
    if (chips.includes(sf)) return sf;
    const [w, h] = sf.split("x").map(Number);
    const land = w > h;
    const group = sizeGroups.find((g) => g.dataset.sizeGroup === "canvas");
    const named = group && [...group.querySelectorAll("button[data-size]")].find(
      (b) => (b.querySelector(".chip-name")?.textContent || "").trim() === "Medium"
    );
    const medium = named ? sizeFile(named.dataset.size) : "";
    const sameOrient = (c) => {
      const [cw, ch] = c.split("x").map(Number);
      return cw > ch === land;
    };
    if (medium && sameOrient(medium)) return medium;
    return chips.find(sameOrient) || medium || chips[0];
  };

  const HAVE = slug in CUT_HAVE ? new Set(CUT_HAVE[slug].split(" ").filter(Boolean)) : null;
  const cutUrl = (key) => `../library/mocks/cutouts/${slug}_${key}.png?v=${ASSET_V}`;
  const cutoutFor = (frame, size, finish) => {
    const sf = sizeFile(size);
    const fin = finish || state.finish;
    const fr = frame || "black";
    const key = fin === "canvas" ? `canvas_${canvasSizeFile(size)}` : fin === "mat" ? `mat_${fr}_${sf}` : `${fr}_${sf}`;
    if (!HAVE || HAVE.has(key)) return cutUrl(key);
    // Missing asset: never request it. Canvas has no stand-in; mat falls back to the same frame without mat.
    if (fin === "canvas") return "";
    const alt = [`${fr}_${sf}`, ...[...HAVE].filter((k) => k.startsWith(`${fr}_`))].find((k) => HAVE.has(k));
    return alt ? cutUrl(alt) : "";
  };

  const roomThumb = () => {
    // Canvas has no room mocks — never fall back to luster/mat rooms.
    if (state.finish === "canvas") {
      return thumbs.find((x) => x.dataset.role === "room" && x.dataset.finishRoom === "canvas") || null;
    }
    return (
      thumbs.find((x) => x.dataset.role === "room" && x.dataset.finishRoom === state.finish) ||
      thumbs.find((x) => x.dataset.role === "room")
    );
  };

  const roomSrc = () => roomThumb()?.dataset.src || "";

  const stillSrc = (orient) => {
    const o = orient || state.orient;
    if (o === "landscape") return root.dataset.stillLandscape || "";
    if (o === "portrait") return root.dataset.stillPortrait || "";
    return "";
  };

  const applyStill = () => {
    const src = stillSrc();
    if (!main || !src) return;
    main.src = src;
    const label = state.orient === "landscape" ? "Sidus, landscape" : "Orbis, portrait";
    main.alt = `${title}. ${label}`;
    const wh = STILL_WH[state.orient];
    if (wh) {
      main.width = wh[0];
      main.height = wh[1];
    }
    if (stage) stage.dataset.orient = state.orient || "";
  };

  const syncInquire = () => {
    if (!inquire) return;
    inquire.href = "/#inquire";
  };

  const syncShip = () => {
    const el = document.querySelector("[data-pdp-ship]");
    if (!el || !sizeChips.length || !window.FraimousCart) return;
    el.textContent = window.FraimousCart.pdpShipLine(state.size, state.finish);
  };

  const syncPrice = () => {
    const el = document.querySelector(".pdp-price");
    if (!el || !window.FraimousCart) return;
    if (!sizeChips.length && !document.getElementById("pdp-add")) return;
    const text = el.textContent || "";
    if (!/\$/.test(text) && !document.getElementById("pdp-add")) return;
    const C = window.FraimousCart;
    const sale = C.priceForSize(state.size, state.finish, slug);
    const list = C.originalPriceForSize ? C.originalPriceForSize(state.size, state.finish, slug) : sale;
    if (C.priceHTML && list > sale) el.innerHTML = C.priceHTML(list, sale);
    else el.textContent = C.money(sale);
  };

  const syncCopy = () => {
    const printEl = document.querySelector("[data-pdp-print]");
    const frameEl = document.querySelector("[data-pdp-frame]");
    const finish = PRINT_COPY[state.finish] ? state.finish : "luster";
    if (printEl) printEl.textContent = PRINT_COPY[finish];
    if (frameEl) frameEl.textContent = FRAME_COPY[finish];
  };

  let detailRaf = 0;
  let detailT = 0;
  let detailPaused = false;

  const stopDetailAuto = () => {
    if (detailRaf) cancelAnimationFrame(detailRaf);
    detailRaf = 0;
  };

  const clearDetailPan = () => {
    stopDetailAuto();
    detailPaused = false;
    detailT = 0;
    if (!stage || !main) return;
    stage.classList.remove("is-detail");
    stage.style.removeProperty("--pdp-zoom");
    main.style.removeProperty("transform-origin");
    main.style.removeProperty("transform");
  };

  const setDetailOrigin = (x, y) => {
    if (!main) return;
    main.style.transformOrigin = `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
  };

  const setDetailPan = (clientX, clientY) => {
    if (!stage || !main || !stage.classList.contains("is-detail")) return;
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    setDetailOrigin(x, y);
  };

  const tickDetailAuto = () => {
    if (!stage || !main || !stage.classList.contains("is-detail")) {
      detailRaf = 0;
      return;
    }
    if (!detailPaused) {
      // Slow ken-burns drift — shows more of the crop while scrolling
      detailT += 0.0022;
      const x = 0.5 + 0.18 * Math.sin(detailT);
      const y = 0.48 + 0.14 * Math.cos(detailT * 0.72);
      setDetailOrigin(x, y);
    }
    detailRaf = requestAnimationFrame(tickDetailAuto);
  };

  const enableDetailPan = () => {
    if (!stage || !main) return;
    clearDetailPan();
    stage.classList.add("is-detail");
    stage.classList.remove("is-cutout");
    // Lower zoom so more of the emphasis photo is visible
    stage.style.setProperty("--pdp-zoom", "1.12");
    setDetailOrigin(0.5, 0.48);
    detailPaused = false;
    detailT = 0;
    stopDetailAuto();
    detailRaf = requestAnimationFrame(tickDetailAuto);
  };

  const show = (src, cutout, opts = {}) => {
    if (!main || !src) return;
    const detail = !!opts.detail;
    // Soft swap: brief fade so size/thumb changes feel less jumpy
    main.style.opacity = "0.35";
    const apply = () => {
      hideVideo();
      clearFill();
      main.src = src;
      if (detail) {
        main.alt = `${title}, detail`;
      } else if (cutout) {
        if (state.finish === "canvas") {
          main.alt = `${title}, gallery wrap, ${state.size}`;
        } else {
          const mat = state.finish === "mat" ? " with mat" : "";
          main.alt = `${title}, ${FRAME_LABEL[state.frame] || state.frame} frame${mat}, ${state.size}`;
        }
      } else {
        main.alt = `${title} in room`;
      }
      if (stage) {
        if (detail) enableDetailPan();
        else {
          clearDetailPan();
          stage.classList.toggle("is-cutout", !!cutout);
        }
        stage.dataset.frame = state.frame;
        stage.dataset.size = sizeFile(state.size);
        stage.dataset.finish = state.finish;
      }
      const done = () => {
        fitStage();
        main.style.opacity = "1";
        main.removeEventListener("load", done);
      };
      if (main.complete) done();
      else main.addEventListener("load", done);
    };
    // allow opacity paint before src swap
    requestAnimationFrame(apply);
  };

  // ——— Stage video (living mock) ———
  const SCENE = VIDEOS[slug] && VIDEOS[slug].still ? VIDEOS[slug] : null;
  const VID = VIDEOS[slug] && VIDEOS[slug].src ? VIDEOS[slug] : null;
  let stageVideo = null;
  const ensureVideo = () => {
    if (!VID || !stage) return null;
    if (stageVideo) return stageVideo;
    const v = document.createElement("video");
    v.className = "pdp-video";
    v.controls = false;
    v.removeAttribute("controls");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    ["muted", "loop", "autoplay", "playsinline", "webkit-playsinline", "disablepictureinpicture"].forEach((a) => v.setAttribute(a, ""));
    v.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback noplaybackrate");
    v.setAttribute("preload", "auto");
    v.setAttribute("aria-label", `${title}, living mock`);
    v.poster = `${VID.poster}?v=${ASSET_V}`;
    v.width = VID.wh[0];
    v.height = VID.wh[1];
    v.hidden = true;
    v.src = `${VID.src}?v=${ASSET_V}`;
    stage.appendChild(v);
    stageVideo = v;
    return v;
  };
  const hideVideo = () => {
    if (stage) stage.classList.remove("is-video");
    if (main) main.hidden = false;
    if (stageVideo) {
      stageVideo.pause();
      stageVideo.hidden = true;
    }
  };
  const showVideo = () => {
    const v = ensureVideo();
    if (!v || !main) return;
    clearDetailPan();
    stage.style.setProperty("--ar", `${VID.wh[0]} / ${VID.wh[1]}`);
    stage.classList.remove("is-cutout");
    stage.classList.add("is-video");
    main.hidden = true;
    v.hidden = false;
    v.controls = false;
    v.removeAttribute("controls");
    v.muted = true;
    fitStage();
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  // ——— Round 3: phone room fill. When a landscape room / scene / video would leave a band > 4% in the
  // locked stage, fill the stage (cover) with a crop that only trims the room's sides, aimed at the frame.
  // The frame box must keep >= 4% of the stage clear on every side; otherwise the image stays contain.
  const FILL_BAND = 0.04;
  const FILL_MARGIN = 0.04;
  const fileOf = (u) => String(u || "").split("?")[0].split("#")[0].split("/").pop();
  const fillLog = {};
  let fillEl = null;
  const clearFill = () => {
    if (!stage) return;
    stage.classList.remove("is-fill");
    stage.style.removeProperty("--fill-s");
    if (fillEl) fillEl.style.removeProperty("object-position");
    fillEl = null;
    delete stage.dataset.fill;
  };
  const fitStage = () => {
    clearFill();
    if (!stage || !stage.classList.contains("is-locked")) return;
    if (stage.classList.contains("is-cutout") || stage.classList.contains("is-detail")) return;
    const isVid = stage.classList.contains("is-video") && stageVideo && !stageVideo.hidden;
    const el = isVid ? stageVideo : main;
    if (!el) return;
    const file = fileOf(isVid ? VID.poster : el.currentSrc || el.getAttribute("src"));
    const box = FRAME_BOX[file];
    if (!box) return;
    const nw = isVid ? VID.wh[0] : el.naturalWidth;
    const nh = isVid ? VID.wh[1] : el.naturalHeight;
    if (!nw || !nh) return;
    const a = nw / nh;
    const G = stage.parentElement ? stage.parentElement.clientWidth : 0;
    const H = parseFloat(stage.style.getPropertyValue("--pdp-stage-h")) || 0;
    if (!G || !H || H * a <= G) return; // only side trims (landscape file in a taller stage)
    const band = (H - Math.min(H, G / a)) / 2 / H;
    if (band <= FILL_BAND) return;
    // Height: fill the stage; shrink a hair (<= 4% band) only if the file's own frame sits within 4% of its edge.
    const need = (d) => (d < FILL_MARGIN ? (0.5 - FILL_MARGIN) / (0.5 - d) : 1);
    let sc = Math.min(need(box[1]), need(1 - box[3]));
    let edge = false;
    if (sc <= 1 - 2 * FILL_BAND + 1e-6) { sc = 1; edge = true; } // frame at/over the file's own edge: same in contain
    const wf = G / (sc * H * a); // visible fraction of the file's width
    if (wf >= 1) return;
    const m = FILL_MARGIN * wf;
    const cx = (box[0] + box[2]) / 2;
    let L = Math.min(Math.max(cx - wf / 2, 0), 1 - wf);
    if (box[0] - L < m) L = Math.max(0, box[0] - m);
    if (L + wf - box[2] < m) L = Math.min(1 - wf, box[2] + m - wf);
    const ml = (box[0] - L) / wf, mr = (L + wf - box[2]) / wf;
    const rec = { file, band: +band.toFixed(4), wf: +wf.toFixed(4), L: +L.toFixed(4), ml: +ml.toFixed(4), mr: +mr.toFixed(4), sc: +sc.toFixed(4), edge };
    if (ml < FILL_MARGIN - 1e-3 || mr < FILL_MARGIN - 1e-3) {
      rec.fallback = true;
      fillLog[file] = rec;
      stage.dataset.fill = "contain";
      return;
    }
    fillLog[file] = rec;
    stage.classList.add("is-fill");
    stage.style.setProperty("--fill-s", sc.toFixed(4));
    el.style.objectPosition = `${(1 - wf > 0 ? (L / (1 - wf)) * 100 : 50).toFixed(2)}% 50%`;
    fillEl = el;
    stage.dataset.fill = "cover";
  };

  // ——— Detail zoom (every PDP): click → 5–8× of the largest scan, pointer pans; touch drag/pinch ———
  const DWH = DETAIL_WH[slug] || null;
  const detailUrl = DWH ? `../library/web/detail/${slug}.jpg?v=${ASSET_V}` : "";
  const Z = { el: null, img: null, open: false, ready: false, fit: 1, z: 1, zMax: 1, tx: 0, ty: 0, gx: 0, gy: 0, raf: 0, ptrs: new Map(), down: null, pinch: null, opener: null, mouse: true };
  const zScale = () => Z.fit * Z.z;
  const zClamp = () => {
    const vw = window.innerWidth, vh = window.innerHeight, s = zScale();
    const W = DWH[0] * s, H = DWH[1] * s;
    const cx = (v, size, view) => (size <= view ? (view - size) / 2 : Math.min(0, Math.max(view - size, v)));
    Z.tx = cx(Z.tx, W, vw);
    Z.ty = cx(Z.ty, H, vh);
  };
  const zApply = () => {
    if (!Z.img) return;
    zClamp();
    Z.img.style.transform = `translate3d(${Z.tx.toFixed(1)}px, ${Z.ty.toFixed(1)}px, 0) scale(${zScale().toFixed(5)})`;
  };
  const zLayout = (keepCenter) => {
    if (!DWH) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const cxImg = keepCenter ? (vw / 2 - Z.tx) / zScale() : DWH[0] / 2;
    const cyImg = keepCenter ? (vh / 2 - Z.ty) / zScale() : DWH[1] / 2;
    Z.fit = Math.min(vw / DWH[0], vh / DWH[1]);
    // Per-work cap from the file's REAL detail: never more than ~1 real px per CSS px (min 2×, max 8×).
    const realScale = Math.min(1, (DETAIL_REAL[slug] || Math.max(DWH[0], DWH[1])) / Math.max(DWH[0], DWH[1]));
    Z.real = Math.round(realScale * Math.max(DWH[0], DWH[1]));
    Z.zMax = Math.max(2, Math.min(8, realScale / Z.fit));
    if (!keepCenter) Z.z = Math.min(6, Z.zMax);
    Z.z = Math.min(Z.z, Z.zMax);
    Z.tx = vw / 2 - cxImg * zScale();
    Z.ty = vh / 2 - cyImg * zScale();
    zApply();
  };
  // Mouse: pointer position across the viewport maps to the same fraction of the print.
  const zAim = (clientX, clientY) => {
    const vw = window.innerWidth, vh = window.innerHeight, s = zScale();
    const fx = Math.min(1, Math.max(0, clientX / vw)), fy = Math.min(1, Math.max(0, clientY / vh));
    Z.gx = -(DWH[0] * s - vw) * fx;
    Z.gy = -(DWH[1] * s - vh) * fy;
  };
  const zTick = () => {
    Z.raf = 0;
    if (!Z.open || !Z.mouse) return;
    const dx = Z.gx - Z.tx, dy = Z.gy - Z.ty;
    Z.tx += dx * 0.2;
    Z.ty += dy * 0.2;
    zApply();
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) Z.raf = requestAnimationFrame(zTick);
  };
  const zKick = () => { if (!Z.raf) Z.raf = requestAnimationFrame(zTick); };
  const closeZoom = () => {
    if (!Z.open) return;
    Z.open = false;
    Z.closedAt = performance.now();
    Z.el.classList.remove("is-open");
    document.documentElement.classList.remove("pdp-zoom-lock");
    Z.ptrs.clear();
    Z.pinch = null;
    Z.down = null;
    if (Z.opener && Z.opener.focus) Z.opener.focus({ preventScroll: true });
  };
  const buildZoom = () => {
    if (Z.el) return;
    const el = document.createElement("div");
    el.className = "pdp-zoom";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", `${title}, piece detail`);
    el.innerHTML = '<img class="pdp-zoom-img" alt="" draggable="false" /><button type="button" class="pdp-zoom-close" aria-label="Close detail">Close ×</button><p class="pdp-zoom-load">Loading detail…</p><p class="pdp-zoom-hint"></p>';
    document.body.appendChild(el);
    Z.el = el;
    Z.img = el.querySelector(".pdp-zoom-img");
    Z.img.alt = `${title}, piece detail`;
    Z.img.width = DWH[0];
    Z.img.height = DWH[1];
    Z.img.addEventListener("load", () => {
      Z.ready = true;
      el.classList.add("is-ready");
    });
    el.querySelector(".pdp-zoom-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closeZoom();
    });
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest(".pdp-zoom-close")) return;
      if (Z.tapOk) closeZoom();
      Z.tapOk = false;
    });
    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".pdp-zoom-close")) return;
      Z.mouse = e.pointerType === "mouse";
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      Z.tapOk = false;
      Z.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (Z.ptrs.size === 1) {
        Z.down = { x: e.clientX, y: e.clientY, t: performance.now(), tx: Z.tx, ty: Z.ty, moved: false };
      } else if (Z.ptrs.size === 2) {
        const [a, b] = [...Z.ptrs.values()];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        Z.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: Z.z, px: (mx - Z.tx) / zScale(), py: (my - Z.ty) / zScale() };
        if (Z.down) Z.down.moved = true;
      }
    });
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "mouse" && !Z.ptrs.size) {
        Z.mouse = true;
        zAim(e.clientX, e.clientY);
        zKick();
        return;
      }
      if (!Z.ptrs.has(e.pointerId)) return;
      Z.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (Z.pinch && Z.ptrs.size >= 2) {
        const [a, b] = [...Z.ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        Z.z = Math.min(Z.zMax, Math.max(1, Z.pinch.z * (d / Z.pinch.d)));
        Z.tx = mx - Z.pinch.px * zScale();
        Z.ty = my - Z.pinch.py * zScale();
        zApply();
      } else if (Z.down) {
        const dx = e.clientX - Z.down.x, dy = e.clientY - Z.down.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) Z.down.moved = true;
        if (e.pointerType === "mouse") {
          zAim(e.clientX, e.clientY);
          zKick();
        } else {
          Z.mouse = false;
          Z.tx = Z.down.tx + dx;
          Z.ty = Z.down.ty + dy;
          zApply();
        }
      }
    });
    const up = (e) => {
      if (!Z.ptrs.has(e.pointerId)) return;
      Z.ptrs.delete(e.pointerId);
      if (Z.ptrs.size < 2) Z.pinch = null;
      if (Z.ptrs.size === 1) {
        const [a] = [...Z.ptrs.values()];
        Z.down = { x: a.x, y: a.y, t: performance.now(), tx: Z.tx, ty: Z.ty, moved: true };
        return;
      }
      if (!Z.ptrs.size && Z.down) {
        // Close on the click that follows a clean tap/click (not on pointerup), so the
        // synthetic click can't fall through to the stage underneath and reopen the zoom.
        Z.tapOk = !Z.down.moved && performance.now() - Z.down.t < 450 && e.type === "pointerup";
        Z.down = null;
      }
    };
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const s0 = zScale();
        const px = (e.clientX - Z.tx) / s0, py = (e.clientY - Z.ty) / s0;
        Z.z = Math.min(Z.zMax, Math.max(1, Z.z * Math.exp(-e.deltaY * 0.0015)));
        Z.tx = e.clientX - px * zScale();
        Z.ty = e.clientY - py * zScale();
        Z.gx = Z.tx;
        Z.gy = Z.ty;
        zApply();
      },
      { passive: false }
    );
    window.addEventListener("keydown", (e) => {
      if (Z.open && e.key === "Escape") closeZoom();
    });
    window.addEventListener("resize", () => {
      if (Z.open) zLayout(true);
    });
  };
  const openZoom = (clientX, clientY) => {
    if (!DWH) return;
    buildZoom();
    Z.opener = document.activeElement;
    const coarse = window.matchMedia && window.matchMedia("(hover: none)").matches;
    Z.el.querySelector(".pdp-zoom-hint").textContent = coarse
      ? "Drag to explore · pinch to zoom · tap to close"
      : "Move to explore · scroll to zoom · click or Esc to close";
    if (Z.img.getAttribute("src") !== detailUrl) {
      Z.ready = false;
      Z.el.classList.remove("is-ready");
      Z.img.src = detailUrl;
    }
    if (Z.img.complete && Z.img.naturalWidth) {
      Z.ready = true;
      Z.el.classList.add("is-ready");
    }
    Z.open = true;
    Z.el.classList.add("is-open");
    document.documentElement.classList.add("pdp-zoom-lock");
    zLayout(false);
    Z.mouse = !coarse;
    if (!coarse && typeof clientX === "number") {
      zAim(clientX, clientY);
      Z.tx = Z.gx;
      Z.ty = Z.gy;
      zApply();
    }
    const btn = Z.el.querySelector(".pdp-zoom-close");
    if (btn) btn.focus({ preventScroll: true });
  };
  window.FraimousZoom = { open: openZoom, close: closeZoom, state: Z, detail: DWH ? { src: detailUrl, wh: DWH } : null };

  const selectThumb = (el) => {
    thumbs.forEach((x) => x.classList.toggle("is-on", x === el));
  };

  const roomPill = document.getElementById("pdp-room-pill");
  const syncRoomPill = () => {
    if (!roomPill) return;
    roomPill.textContent = state.view === "room" ? "View piece" : "View in Room";
    roomPill.setAttribute("aria-pressed", state.view === "room" ? "true" : "false");
  };

  let lastFramedSize = "";
  const framedThumbSize = () => {
    const g = sizeGroups.find((x) => x.dataset.sizeGroup === "framed");
    if (!g) return state.size;
    const sizesIn = [...g.querySelectorAll("button[data-size]")].map((b) => b.dataset.size);
    if (lastFramedSize && sizesIn.includes(lastFramedSize)) return lastFramedSize;
    const m = mediumOf(g);
    return (m && m.dataset.size) || sizesIn[0] || state.size;
  };
  const refreshCutoutThumbs = () => {
    if (state.finish !== "canvas") lastFramedSize = state.size;
    thumbs
      .filter((t) => t.dataset.role === "room")
      .forEach((t) => {
        const match = t.dataset.finishRoom !== state.finish;
        t.hidden = roomPill ? (state.view !== "room" || match) : match;
      });
    thumbs
      .filter((t) => t.dataset.role === "cutout")
      .forEach((t) => {
        const frame = t.dataset.frameShot;
        const shot = t.dataset.finishShot || "";
        const fin = shot || state.finish;
        // Canvas chips (e.g. 40×55) have no framed/mat cutouts — keep those thumbs on a framed size (no 404s).
        const thumbSize = state.finish === "canvas" && fin !== "canvas" ? framedThumbSize() : state.size;
        const src = cutoutFor(frame, thumbSize, fin === "canvas" ? "canvas" : fin);
        const img = t.querySelector("img");
        if (img && src) img.src = src;
        t.dataset.src = src;
        if (state.finish === "canvas") {
          t.hidden = shot !== "canvas" && !( !shot && frame === "black");
          if (!shot && frame === "black") {
            const csrc = cutoutFor("black", state.size, "canvas");
            if (img && csrc) img.src = csrc;
            t.dataset.src = csrc;
            t.hidden = !csrc;
          }
        } else if (shot === "canvas") {
          t.hidden = true;
        } else if (shot === "luster") {
          t.hidden = state.finish !== "luster";
        } else if (shot === "mat") {
          t.hidden = state.finish !== "mat";
        } else {
          t.hidden = state.finish === "luster" ? false : state.finish !== "mat";
        }
        if (!t.dataset.src) t.hidden = true;
      });
  };

  const syncFrameBox = () => {
    const frameBox = document.querySelector(".pdp-opt .swatches")?.closest(".pdp-opt");
    if (!frameBox) return;
    // Canvas has no frame: keep the row (so Add to cart never moves) but take it out of play.
    const na = state.finish === "canvas";
    frameBox.hidden = false;
    frameBox.classList.toggle("is-na", na);
    frameBox.toggleAttribute("inert", na);
    frameBox.setAttribute("aria-disabled", na ? "true" : "false");
  };

  const applySelection = () => {
    refreshCutoutThumbs();
    if (orients.length && !thumbs.length) {
      applyStill();
    } else if (!hasCutouts) {
      const still = thumbs.find((t) => t.dataset.role === "still" || t.dataset.role === "room");
      if (still) selectThumb(still);
      show(still?.dataset.src || roomSrc(), false);
    } else if (state.finish === "canvas") {
      // No *_room_canvas.jpg sitewide — stage always shows the canvas cutout.
      state.view = "cutout";
      const cut =
        thumbs.find((t) => t.dataset.role === "cutout" && t.dataset.finishShot === "canvas" && !t.hidden) ||
        thumbs.find((t) => t.dataset.role === "cutout" && !t.hidden);
      if (cut) selectThumb(cut);
      show(cutoutFor(state.frame, state.size, "canvas"), true);
    } else if (state.view === "room") {
      const room = roomThumb();
      if (room) selectThumb(room);
      show(roomSrc(), false);
    } else {
      const cut =
        thumbs.find((t) => t.dataset.role === "cutout" && t.dataset.frameShot === state.frame && t.dataset.finishShot === state.finish && !t.hidden) ||
        thumbs.find((t) => t.dataset.role === "cutout" && t.dataset.frameShot === state.frame && !t.hidden) ||
        thumbs.find((t) => t.dataset.role === "cutout" && !t.hidden);
      if (cut) selectThumb(cut);
      show(cutoutFor(state.frame, state.size), true);
    }
    syncFrameBox();
    syncInquire();
    syncShip();
    syncPrice();
    syncCopy();
    syncRoomPill();
  };

  const setFrame = (frame) => {
    state.frame = frame;
    if (hasCutouts) state.view = "cutout";
    syncFrameBox();
    frames.forEach((b) => {
      const on = b.dataset.frame === frame;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    applySelection();
  };

  const setSize = (size) => {
    state.size = size;
    sizes.forEach((b) => {
      const on = b.dataset.size === size;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (hasCutouts && state.view === "room") state.view = "cutout";
    applySelection();
  };

  const mediumOf = (group) => {
    if (!group) return null;
    const chips = [...group.querySelectorAll("button[data-size]")];
    const byName = (name) =>
      chips.find((b) => (b.querySelector(".chip-name")?.textContent || "").trim() === name);
    // Framed mocks are Gallery 24×36. Canvas Medium defaults to first Medium chip (Thyrsus: 24×36).
    if (group.dataset.sizeGroup === "framed") {
      return (
        byName("Gallery") ||
        chips.find((b) => String(b.dataset.size || "").replace("×", "x") === "24x36") ||
        byName("Medium") ||
        chips[0] ||
        null
      );
    }
    return byName("Medium") || chips[0] || null;
  };

  const syncFinishSizeGroups = () => {
    const finishGroups = sizeGroups.filter(
      (g) => g.dataset.sizeGroup === "framed" || g.dataset.sizeGroup === "canvas"
    );
    if (!finishGroups.length) return;
    const want = state.finish === "canvas" ? "canvas" : "framed";
    finishGroups.forEach((g) => {
      g.hidden = g.dataset.sizeGroup !== want;
    });
    const group = finishGroups.find((g) => g.dataset.sizeGroup === want);
    // Keep the current size when the new mount offers it; fall back to the default only when it doesn't.
    const keep = group ? [...group.querySelectorAll("button[data-size]")].find((b) => b.dataset.size === state.size) : null;
    const next = keep || mediumOf(group);
    if (next) {
      state.size = next.dataset.size;
      sizes.forEach((b) => {
        const on = b === next;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
  };

  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      if (t.dataset.role === "detail" || t.dataset.role === "zoom") {
        openZoom();
        return;
      }
      if (t.dataset.role === "video") {
        state.view = "video";
        selectThumb(t);
        showVideo();
        syncRoomPill();
        return;
      }
      if (t.dataset.role === "room") {
        state.view = "room";
        selectThumb(t);
        show(t.dataset.src, false);
        return;
      }
      if (t.dataset.role === "cutout") {
        if (t.dataset.frameShot) state.frame = t.dataset.frameShot;
        if (t.dataset.finishShot === "mat" || t.dataset.finishShot === "luster" || t.dataset.finishShot === "canvas") {
          state.finish = t.dataset.finishShot;
          finishes.forEach((b) => {
            const on = b.dataset.finish === state.finish;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
          });
          syncFinishSizeGroups();
        }
        setFrame(state.frame);
      }
    });
  });

  frames.forEach((b) => {
    b.addEventListener("click", () => setFrame(b.dataset.frame));
  });

  sizes.forEach((b) => {
    b.addEventListener("click", () => setSize(b.dataset.size));
  });

  const setFinish = (finish, { force } = {}) => {
    // Re-clicking the active mount is a no-op (it used to reset the size).
    if (!force && finish === state.finish) return;
    state.finish = finish;
    finishes.forEach((b) => {
      const on = b.dataset.finish === finish;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    syncFrameBox();
    syncFinishSizeGroups();
    if (hasCutouts) state.view = "cutout";
    applySelection();
  };
  finishes.forEach((b) => b.addEventListener("click", () => setFinish(b.dataset.finish)));

  const setOrient = (orient) => {
    if (!orient || !orients.length) return;
    state.orient = orient;
    orients.forEach((b) => {
      const on = b.dataset.orient === orient;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    sizeGroups.forEach((g) => {
      if (g.dataset.sizeGroup === "framed" || g.dataset.sizeGroup === "canvas") return;
      g.hidden = g.dataset.sizeGroup !== orient;
    });
    const next = visibleSizes().find((b) => b.classList.contains("is-on")) || visibleSizes()[0];
    if (next) {
      state.size = next.dataset.size;
      visibleSizes().forEach((b) => {
        const on = b === next;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    applySelection();
  };
  orients.forEach((b) => b.addEventListener("click", () => setOrient(b.dataset.orient)));

  // Round 3: "View cart" link once something is added (space reserved, so nothing moves).
  const CART_URL = (document.querySelector(".nav-cart") && document.querySelector(".nav-cart").getAttribute("href")) || "/cart.html";
  let viewCart = null;
  if (addBtn) {
    viewCart = document.createElement("a");
    viewCart.className = "pdp-viewcart";
    viewCart.href = CART_URL;
    viewCart.textContent = "View cart →";
    viewCart.setAttribute("aria-hidden", "true");
    viewCart.tabIndex = -1;
    addBtn.insertAdjacentElement("afterend", viewCart);
  }
  const showViewCart = () => {
    if (viewCart) {
      viewCart.classList.add("is-on");
      viewCart.removeAttribute("aria-hidden");
      viewCart.removeAttribute("tabindex");
    }
    document.querySelectorAll(".pdp-sticky-cart").forEach((a) => (a.hidden = false));
  };
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (!window.FraimousCart) return;
      window.FraimousCart.add({
        slug,
        title,
        frame: state.finish === "canvas" ? "black" : state.frame,
        finish: state.finish,
        size: state.size,
        qty: 1,
      });
      const prev = addBtn.textContent;
      showViewCart();
      addBtn.textContent = "Added";
      addBtn.classList.add("is-added");
      addBtn.disabled = true;
      setTimeout(() => {
        addBtn.textContent = prev;
        addBtn.classList.remove("is-added");
        addBtn.disabled = false;
      }, 1400);
    });
  }


  if (stage && main) {
    stage.addEventListener("mousemove", (e) => {
      if (!stage.classList.contains("is-detail")) return;
      detailPaused = true;
      setDetailPan(e.clientX, e.clientY);
    });
    stage.addEventListener("mouseleave", () => {
      if (!stage.classList.contains("is-detail")) return;
      detailPaused = false;
    });
    stage.addEventListener(
      "touchstart",
      () => {
        if (stage.classList.contains("is-detail")) detailPaused = true;
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchmove",
      (e) => {
        if (!stage.classList.contains("is-detail")) return;
        const t = e.touches && e.touches[0];
        if (!t) return;
        detailPaused = true;
        setDetailPan(t.clientX, t.clientY);
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchend",
      () => {
        if (stage.classList.contains("is-detail")) detailPaused = false;
      },
      { passive: true }
    );
  }

  // Gallery extras: living-mock video thumb (works that have one) + detail zoom thumb (every work).
  const thumbsWrap = document.querySelector(".pdp-thumbs");
  if (thumbsWrap && SCENE) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pdp-thumb";
    b.dataset.role = "scene";
    const ssrc = `${SCENE.still}?v=${ASSET_V}`;
    b.dataset.src = ssrc;
    b.setAttribute("aria-label", "In room, styled still");
    b.innerHTML = `<img src="${ssrc}" alt="" />`;
    const first = thumbsWrap.querySelector(".pdp-thumb");
    if (first && first.nextSibling) thumbsWrap.insertBefore(b, first.nextSibling);
    else thumbsWrap.appendChild(b);
    thumbs.push(b);
    b.addEventListener("click", () => {
      state.view = "scene";
      selectThumb(b);
      show(ssrc, false);
      syncRoomPill();
    });
  }
  if (thumbsWrap && VID) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pdp-thumb";
    b.dataset.role = "video";
    b.setAttribute("aria-label", "Living mock, video");
    b.innerHTML = `<img src="${VID.poster}?v=${ASSET_V}" alt="" />`;
    const first = thumbsWrap.querySelector(".pdp-thumb");
    if (first && first.nextSibling) thumbsWrap.insertBefore(b, first.nextSibling);
    else thumbsWrap.appendChild(b);
    thumbs.push(b);
    b.addEventListener("click", () => {
      state.view = "video";
      selectThumb(b);
      showVideo();
    });
  }
  if (thumbsWrap && DWH && !thumbs.some((t) => t.dataset.role === "detail")) {
    const og = document.querySelector('meta[property="og:image"]');
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pdp-thumb";
    b.dataset.role = "zoom";
    b.setAttribute("aria-label", "Zoom into the piece detail");
    b.innerHTML = `<img src="${(og && og.getAttribute("content")) || detailUrl}" alt="" />`;
    thumbsWrap.appendChild(b);
    b.addEventListener("click", () => openZoom());
  }
  if (stage && DWH) {
    stage.setAttribute("title", "Click to zoom into the piece");
    stage.addEventListener("click", (e) => {
      if (Z.closedAt && performance.now() - Z.closedAt < 400) return;
      openZoom(e.clientX, e.clientY);
    });
  }

  // ——— Locked stage box (round 2): one height per work and viewport width, so switching
  // finish/size/thumb never moves the page. Width hugs each image; height never changes.
  const thumbsBox = document.querySelector(".pdp-thumbs");
  let lockedW = 0;
  const lockStage = (force) => {
    if (!stage) return;
    const col = stage.parentElement;
    const G = col ? col.clientWidth : 0;
    if (!G || (!force && G === lockedW)) return;
    lockedW = G;
    const vh = window.innerHeight;
    const desk = window.matchMedia("(min-width: 961px)").matches;
    let cap;
    if (desk) {
      // Keep the thumb row on the first screen.
      const top = stage.getBoundingClientRect().top + window.scrollY;
      const th = thumbsBox ? thumbsBox.offsetHeight || 76 : 0;
      cap = Math.min(880, vh - top - th - 28);
    } else {
      cap = Math.min(760, vh * 0.78);
    }
    cap = Math.max(260, cap);
    const nat = main && main.naturalWidth ? main.naturalWidth / main.naturalHeight : 1;
    const ar = STAGE_AR[slug] || [nat, nat];
    const hOf = (a) => Math.min(cap, G / a);
    const hTall = hOf(ar[0]); // most portrait state
    const hShort = hOf(ar[1]); // most landscape state
    // Near-matching states: hug the shortest (bands ≤ 4%). Mixed portrait/landscape works:
    // geometric mean = smallest worst-case band (reported in the round-2 audit).
    const H = hTall / hShort <= 1.35 ? Math.min(hTall, hShort / 0.96) : Math.sqrt(hTall * hShort);
    stage.style.setProperty("--pdp-stage-h", `${Math.round(H)}px`);
    stage.classList.add("is-locked");
    fitStage();
  };

  // Framed and canvas size rows can wrap differently: reserve the taller one so Add to cart never moves.
  const evenSizeRows = () => {
    const rows = sizeGroups.filter((g) => g.dataset.sizeGroup === "framed" || g.dataset.sizeGroup === "canvas");
    if (rows.length < 2) return;
    rows.forEach((g) => (g.style.minHeight = ""));
    const hs = rows.map((g) => {
      const was = g.hidden;
      g.hidden = false;
      const h = g.offsetHeight;
      g.hidden = was;
      return h;
    });
    const m = Math.max(...hs);
    rows.forEach((g) => (g.style.minHeight = `${m}px`));
  };

  // Fixed thumb boxes (whole image, contain): widths no longer depend on the selected size, so the row never re-wraps.
  const fixThumbs = () => {
    if (!thumbsBox) return;
    const portrait = (STAGE_AR[slug] ? STAGE_AR[slug][0] : 0.8) < 1;
    const cut = portrait ? 0.86 : 1.5;
    thumbsBox.querySelectorAll(".pdp-thumb").forEach((t) => {
      const role = t.dataset.role;
      let w = cut;
      if (role === "room" || role === "scene" || role === "still") w = 1.5;
      else if (role === "video" && VID) w = Math.min(1.5, VID.wh[0] / VID.wh[1]);
      else if ((role === "zoom" || role === "detail") && DWH) w = Math.min(1.5, Math.max(0.56, DWH[0] / DWH[1]));
      t.style.setProperty("--tw", w.toFixed(3));
    });
    thumbsBox.classList.add("is-fixed");
  };

  // The thumb row shows a different number of thumbs per finish: reserve the tallest so nothing below moves.
  const evenThumbs = () => {
    if (!thumbsBox || !hasCutouts) return;
    thumbsBox.style.minHeight = "";
    const keep = { finish: state.finish, view: state.view, size: state.size };
    let m = thumbsBox.offsetHeight;
    const fins = [...new Set(finishes.map((b) => b.dataset.finish))];
    const views = roomPill ? ["room", "cutout"] : [state.view];
    fins.forEach((f) => views.forEach((v) => {
      state.finish = f;
      state.view = v;
      refreshCutoutThumbs();
      m = Math.max(m, thumbsBox.offsetHeight);
    }));
    Object.assign(state, keep);
    refreshCutoutThumbs();
    thumbsBox.style.minHeight = `${m}px`;
  };

  // ——— Phone quick-add bar: title, live price, Add to cart (same handler and options) ———
  const priceEl = document.querySelector(".pdp-price");
  if (addBtn && priceEl) {
    const bar = document.createElement("div");
    bar.className = "pdp-sticky";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Quick add");
    bar.innerHTML = '<div class="pdp-sticky-meta"><span class="pdp-sticky-title"></span><span class="pdp-sticky-line"><span class="pdp-sticky-price"></span><a class="pdp-sticky-cart" hidden>View cart</a></span></div><button type="button" class="btn btn--solid pdp-sticky-add">Add to cart</button>';
    bar.querySelector(".pdp-sticky-title").textContent = title;
    bar.querySelector(".pdp-sticky-cart").href = CART_URL;
    if (viewCart && viewCart.classList.contains("is-on")) bar.querySelector(".pdp-sticky-cart").hidden = false;
    const bp = bar.querySelector(".pdp-sticky-price");
    const bb = bar.querySelector(".pdp-sticky-add");
    const syncBar = () => {
      bp.innerHTML = priceEl.innerHTML || (priceEl.textContent || "").trim();
      bb.textContent = addBtn.textContent;
      bb.disabled = addBtn.disabled;
      bb.classList.toggle("is-added", addBtn.classList.contains("is-added"));
    };
    bb.addEventListener("click", () => addBtn.click());
    document.body.appendChild(bar);
    document.body.classList.add("has-pdp-sticky");
    syncBar();
    new MutationObserver(syncBar).observe(priceEl, { childList: true, characterData: true, subtree: true });
    new MutationObserver(syncBar).observe(addBtn, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["disabled", "class"] });
    const setShown = (on) => {
      bar.classList.toggle("is-shown", on);
      bar.toggleAttribute("inert", !on);
    };
    setShown(false);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => setShown(!e.isIntersecting)), { threshold: 0 }).observe(addBtn);
    }
  }

  applySelection();
  fixThumbs();
  evenThumbs();
  evenSizeRows();
  lockStage(true);
  window.addEventListener("load", () => { lockStage(true); evenSizeRows(); evenThumbs(); });
  let rzT = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rzT);
    rzT = setTimeout(() => { lockStage(false); evenSizeRows(); evenThumbs(); }, 120);
  });
  window.FraimousStage = { lock: lockStage, ar: STAGE_AR[slug] || null, fit: fitStage, fills: fillLog, box: FRAME_BOX };

  document.addEventListener("fraimous:editions", () => { try { syncPrice(); } catch (e) {} });
  document.addEventListener("fraimous:member", () => { try { syncPrice(); } catch (e) {} });

})();