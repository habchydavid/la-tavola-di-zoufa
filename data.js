/* =====================================================================
   LA TAVOLA DI ZOUFA — everything you'll want to edit lives in this file
   ---------------------------------------------------------------------
   • Contact details, hours, menu, photos and all the text (EN / FR / AR).
   • You never need to touch index.html, styles.css or main.js to update
     the content.
   • Opening hours are still PLACEHOLDERS. Replace them.
   ===================================================================== */

window.SITE = {
  name: "La Tavola di Zoufa",

  // Contact (from the shop sign)
  phone: "+961 71 450 843",          // shown on the site
  whatsapp: "96171450843",           // digits only, with country code, no + or spaces
  instagram: "latavoladizoufa",      // handle without @ (leave "" to hide)
  mapsQuery: "Deir al Ahmar Main Road, Lebanon",

  // Opening hours, in Lebanon time. 0 = Sunday … 6 = Saturday.
  // [open, close] in 24h. A close of 24 means midnight. null = closed.
  hours: {
    0: [12, 23],
    1: null,
    2: [12, 23],
    3: [12, 23],
    4: [12, 23],
    5: [12, 24],
    6: [12, 24],
  },

  currency: "$",

  /* ---------------- "HOW IT'S MADE" VIDEO ----------------
     steps: the second (in the video) where each of the 5 steps starts:
     dough, tomato, mozzarella, oven, finish.
  */
  /* ---------------- OPENING VIDEO (first thing on the page, plays as you scroll) ----------------
     pizza: where the pizza sits in the LAST frame of the video (in video pixels),
     so the spinning cut-out (images/opening-pizza.png) lines up exactly.
  */
  openingVideo: {
    src: "images/opening.mp4?v=2", poster: "images/opening.jpg",
    speed: 1,     // the file itself is already sped up to ~4.5 s; 1 = play it as is
    pizza: { cx: 244, cy: 458, r: 236 },
  },
  pastaVideo: {
    src: "images/pasta-video.mp4", srcHD: "images/pasta-video-hd.mp4", poster: "images/pasta-video.jpg",
    steps: [0, 2.0, 4.0, 6.0, 7.2],   // mushrooms, cream, seasoning, pasta, toss
  },
  baguetteVideo: {
    src: "images/baguette-video.mp4", srcHD: "images/baguette-video-hd.mp4", poster: "images/baguette-video.jpg",
    steps: [0, 1.2, 5.0, 7.0],         // bread, avocado, tomato, ready
  },
  storyVideo: {
    src: "images/how-its-made.mp4",       // used on phones (lighter)
    srcHD: "images/how-its-made-hd.mp4",  // used on computers (sharper)
    poster: "images/how-its-made.jpg",
    steps: [0, 4.1, 5.07, 8.13, 11.23],
  },

  /* ---------------- MENU ----------------
     Each section has a title (EN / FR / AR) and a list of items.
     • name: one text for all languages, or { en, fr, ar }
     • price: number
     • featured: true  → shown in gold, like on the printed menu
     • desc: optional, { en, fr, ar }
     • photo: optional, e.g. "images/menu/pizza-diavola.jpg" (a square photo works best).
       When a dish has a photo it is shown instead of the drawing.
     • draw: optional. Pizza and pasta items with "draw" can be tapped
       to show a little illustration.
         pizza  sauce: "red" | "white" | "pesto"   cheese: true | false
                toppings: basil, tomato, salami, chili, mushroom, olive,
                          prosciutto, bresaola, rucola, parm, truffle,
                          burrata, gorgonzola, sujuk, honey, garlic, oregano
         pasta  sauce: "red" | "cream" | "pink" | "oil" | "ragu"
                extras: basil, parm, chili, parsley, pepper, truffle,
                        garlic, bacon, meatballs
  */
  menu: [
    {
      id: "pizza", art: "pizza",
      title: { en: "Pizza", fr: "Pizza", ar: "بيتزا" },
      items: [
        { name: "Pizza Marguerita", price: 11, draw: { sauce: "red", cheese: true, toppings: ["basil", "tomato"] } },
        { name: "Pizza Diavola", price: 13, photo: "images/menu/pizza-diavola.jpg", draw: { sauce: "red", cheese: true, toppings: ["salami", "chili"] } },
        { name: "Pizza Truffle", price: 15, photo: "images/menu/pizza-truffle.jpg", draw: { sauce: "white", cheese: true, toppings: ["mushroom", "truffle"] } },
        { name: "Pizza Regina", price: 14, photo: "images/menu/pizza-regina.jpg", draw: { sauce: "red", cheese: true, toppings: ["prosciutto", "mushroom", "olive"] } },
        { name: "Pizza Quattro", price: 13, photo: "images/menu/pizza-quattro.jpg", draw: { sauce: "white", cheese: true, toppings: ["gorgonzola", "parm"] } },
        { name: "Pizza Burrata", price: 22, featured: true, draw: { sauce: "red", cheese: false, toppings: ["burrata", "tomato", "basil"] } },
        { name: "Pizza Bresaola", price: 25, photo: "images/menu/pizza-bresaola.jpg", featured: true, draw: { sauce: "red", cheese: true, toppings: ["bresaola", "rucola", "parm"] } },
        { name: "Pizza Pesto", price: 13, photo: "images/menu/pizza-pesto.jpg", featured: true, draw: { sauce: "pesto", cheese: true, toppings: ["tomato", "basil"] } },
      ],
    },
    {
      id: "pasta", art: "pasta",
      title: { en: "Pasta", fr: "Pâtes", ar: "باستا" },
      items: [
        { name: "Pasta Arrabiata", price: 9, photo: "images/menu/pasta-arrabiata.jpg", draw: { sauce: "red", extras: ["chili", "parsley"] } },
        { name: "Pasta Alfredo", price: 13, draw: { sauce: "cream", extras: ["parm", "parsley"] } },
        { name: "Pasta Truffle", price: 14, draw: { sauce: "cream", extras: ["truffle", "parm"] } },
        { name: "Pasta Gluten Free", price: 14, draw: { sauce: "red", extras: ["basil", "parm"] } },
        { name: "Pasta Pink Sauce", price: 14, photo: "images/menu/pasta-pink-sauce.jpg", draw: { sauce: "pink", extras: ["parm", "basil"] } },
      ],
    },
    {
      id: "baguette",
      title: { en: "Sandwich Baguette", fr: "Sandwich Baguette", ar: "سندويش باغيت" },
      items: [
        {
          name: "Chicken Baguette", price: 7, photo: "images/menu/baguette.jpg", featured: true,
          desc: {
            en: "Grilled chicken, lettuce, tomato, mozzarella, avocado sauce",
            fr: "Poulet grillé, laitue, tomate, mozzarella, sauce avocat",
            ar: "دجاج مشوي، خس، بندورة، موتزاريلا، صلصة أفوكادو",
          },
        },
        {
          name: "Turkey Baguette", price: 5, photo: "images/menu/baguette.jpg", featured: true,
          desc: {
            en: "Smoked turkey, lettuce, tomato, cheese, mayo mustard, pickles",
            fr: "Dinde fumée, laitue, tomate, fromage, mayonnaise moutarde, cornichons",
            ar: "حبش مدخّن، خس، بندورة، جبنة، مايونيز بالخردل، مخلل",
          },
        },
      ],
    },
    {
      id: "dolci",
      title: { en: "Dolci", fr: "Dolci", ar: "حلويات" },
      items: [
        { name: "Tiramisu", price: 10 },
        { name: "Calzone Chocolate", price: 10 },
      ],
    },
    {
      id: "drink",
      title: { en: "Drink", fr: "Boissons", ar: "مشروبات" },
      items: [
        { name: { en: "Water", fr: "Eau", ar: "مياه" }, price: 1 },
        { name: "Pepsi", price: 2 },
        { name: "Perrier", price: 3 },
        { name: { en: "White wine", fr: "Vin blanc", ar: "نبيذ أبيض" }, price: 15 },
        { name: { en: "Rosé wine", fr: "Vin rosé", ar: "نبيذ روزيه" }, price: 16 },
        { name: { en: "Glass", fr: "Verre", ar: "كأس" }, price: 4 },
        { name: { en: "Beer", fr: "Bière", ar: "بيرة" }, price: 3 },
      ],
    },
  ],

  /* ---------------- PHOTOS ----------------
     Put your files in the /images folder and write the file name in "src",
     for example  src: "images/oven.jpg".  For a video use type: "video"
     and src: "images/kitchen.mp4". While src is empty a placeholder shows.
  */
  photos: [
    { src: "images/pasta-steam.jpg", type: "image", caption: { en: "Hot from the pan", fr: "Toutes chaudes de la poêle", ar: "سخنة من المقلاة" } },
    { src: "images/pizza-bianca.jpg", type: "image", caption: { en: "Fresh out of the oven", fr: "Tout juste sortie du four", ar: "طالعة من الفرن" } },
    { src: "images/dinner-table.jpg", type: "image", caption: { en: "Dinner at La Tavola", fr: "Dîner à La Tavola", ar: "عشاء في لا تافولا" } },
    { src: "images/how-its-made.mp4", type: "video", caption: { en: "Making a pizza", fr: "La préparation d'une pizza", ar: "تحضير البيتزا" } },
    { src: "images/pasta-pizza-bowl.jpg", type: "image", caption: { en: "Pasta in a pizza bowl", fr: "Des pâtes dans un bol de pizza", ar: "باستا داخل وعاء من عجينة البيتزا" } },
    { src: "images/pasta-wine.jpg", type: "image", caption: { en: "Pink sauce pasta, by lamplight", fr: "Pâtes sauce rosée, à la lueur de la lampe", ar: "باستا بالصلصة الوردية على ضوء القنديل" } },
  ],
};

/* ---------------- ALL THE TEXT ON THE SITE ---------------- */
window.TEXT = {
  en: {
    "pv.h2": "How we make our pasta",
    "pv.s1t": "The mushrooms",
    "pv.s1p": "Sliced mushrooms, sizzling in the pan.",
    "pv.s2t": "The cream",
    "pv.s2p": "A generous pour of cream, simmered until silky.",
    "pv.s3t": "The seasoning",
    "pv.s3p": "Cracked black pepper, and everything folded together.",
    "pv.s4t": "The pasta",
    "pv.s4p": "Fresh ribbons of pasta go straight into the sauce.",
    "pv.s5t": "The toss",
    "pv.s5p": "Tossed until every strand is coated, then straight to your table.",
    "bv.h2": "How we make our baguettes",
    "bv.s1t": "The baguette",
    "bv.s1p": "Baked in our oven, then opened while it's still warm.",
    "bv.s2t": "The avocado",
    "bv.s2p": "Fresh avocado, spread from end to end.",
    "bv.s3t": "The tomato",
    "bv.s3p": "Ripe tomato slices over the meat and melted cheese.",
    "bv.s4t": "Ready",
    "bv.s4p": "Folded shut, pressed and cut, ready for your table.",
    "brand.sub": "Italian Restaurant",
    "nav.story": "Our pizza", "nav.menu": "Menu", "nav.photos": "Photos", "nav.visit": "Visit",
    "hero.tagline": "Neapolitan pizza & Italian pasta, on the main road of Deir al Ahmar.",
    "hero.cta1": "See the menu",
    "hero.cta2": "Order on WhatsApp",

    "story.eyebrow": "How it's made",
    "story.oven": "Oven", "story.time": "Time",
    "story.s1t": "The dough",
    "story.s1p": "Flour, water, salt and yeast, then a long, slow rest. Every ball is stretched by hand, never with a rolling pin.",
    "story.s2t": "The tomato",
    "story.s2p": "Ripe tomatoes crushed with a pinch of salt. That's all. Good tomatoes don't need help.",
    "story.s3t": "The mozzarella",
    "story.s3p": "A generous handful of mozzarella, scattered all the way to the edge.",
    "story.s4t": "The oven",
    "story.s4p": "Into our gas oven at 450°C. In about ninety seconds the crust puffs up and gets its golden, blistered edge.",
    "story.s5t": "The finish",
    "story.s5p": "Sliced, topped with fresh basil, and straight to your table.",
    "story.hint": "Scroll to watch it come together ↓",
    "story.soundOn": "Sound on", "story.soundOff": "Sound off",

    "pasta.eyebrow": "And the pasta",
    "pasta.title": "Straight from the pan.",
    "pasta.text": "Cooked al dente, finished in the pan with its sauce, and brought to your table still steaming.",
    "pasta.cta": "See the pasta",

    "menu.eyebrow": "The menu",
    "menu.hint": "Tap a pizza or pasta to see it",
    "menu.note": "Prices in US dollars.",

    "photos.eyebrow": "Gallery",
    "photos.title": "Snapshots from the kitchen",
    "photos.hint": "Drag them around, or click one to open it",
    "photos.hintTouch": "Tap a photo to open it",
    "photos.soon": "Photo coming soon",
    "photos.soonVideo": "Video coming soon",

    "visit.eyebrow": "Come by",
    "visit.title": "Pull up a chair",
    "visit.find": "Find us",
    "visit.address": "Main Road, Deir al Ahmar, Baalbek-Hermel, Lebanon",
    "visit.directions": "Get directions →",
    "visit.hours": "Hours",
    "visit.closed": "Closed",
    "visit.contact": "Call or message",
    "visit.call": "Call us",
    "status.open": "We're open until {t}. Come on in!",
    "status.closed": "Closed right now. We open {d} at {t}.",
    "status.today": "today", "status.tomorrow": "tomorrow",

    "footer.love": "Made with love, tomatoes and a lot of mozzarella.",
    "wa.msg": "Hi! I'd like to place an order 🍕",
  },

  fr: {
    "pv.h2": "Comment on prépare nos pâtes",
    "pv.s1t": "Les champignons",
    "pv.s1p": "Des champignons émincés qui grésillent dans la poêle.",
    "pv.s2t": "La crème",
    "pv.s2p": "Une belle dose de crème, mijotée jusqu'à devenir onctueuse.",
    "pv.s3t": "L'assaisonnement",
    "pv.s3p": "Du poivre noir concassé, et on mélange le tout.",
    "pv.s4t": "Les pâtes",
    "pv.s4p": "Les pâtes fraîches plongent directement dans la sauce.",
    "pv.s5t": "Le mélange final",
    "pv.s5p": "Mélangées jusqu'à ce que chaque brin soit enrobé, puis directement à votre table.",
    "bv.h2": "Comment on prépare nos baguettes",
    "bv.s1t": "La baguette",
    "bv.s1p": "Cuit dans notre four, puis ouvert encore tiède.",
    "bv.s2t": "L'avocat",
    "bv.s2p": "De l'avocat frais, étalé d'un bout à l'autre.",
    "bv.s3t": "La tomate",
    "bv.s3p": "Des tranches de tomate mûre sur la viande et le fromage fondu.",
    "bv.s4t": "C'est prêt",
    "bv.s4p": "Refermée, pressée et coupée, prête pour votre table.",
    "brand.sub": "Restaurant italien",
    "nav.story": "Notre pizza", "nav.menu": "Menu", "nav.photos": "Photos", "nav.visit": "Nous trouver",
    "hero.tagline": "Pizza napolitaine et pâtes italiennes, sur la route principale de Deir el Ahmar.",
    "hero.cta1": "Voir le menu",
    "hero.cta2": "Commander sur WhatsApp",

    "story.eyebrow": "Comment on la fait",
    "story.oven": "Four", "story.time": "Temps",
    "story.s1t": "La pâte",
    "story.s1p": "Farine, eau, sel et levure, puis un long repos. Chaque pâton est étiré à la main, jamais au rouleau.",
    "story.s2t": "La tomate",
    "story.s2p": "Des tomates mûres écrasées avec une pincée de sel. C'est tout. Une bonne tomate n'a besoin de rien d'autre.",
    "story.s3t": "La mozzarella",
    "story.s3p": "Une belle poignée de mozzarella, répartie jusqu'au bord.",
    "story.s4t": "Le four",
    "story.s4p": "Direction notre four à gaz, à 450 °C. En quatre-vingt-dix secondes environ, la croûte gonfle et se dore.",
    "story.s5t": "La touche finale",
    "story.s5p": "Découpée, garnie de basilic frais, et directement à votre table.",
    "story.hint": "Faites défiler pour la voir prendre forme ↓",
    "story.soundOn": "Activer le son", "story.soundOff": "Couper le son",

    "pasta.eyebrow": "Et les pâtes",
    "pasta.title": "Tout droit de la poêle.",
    "pasta.text": "Cuites al dente, terminées à la poêle avec leur sauce, et servies encore fumantes.",
    "pasta.cta": "Voir les pâtes",

    "menu.eyebrow": "La carte",
    "menu.hint": "Touchez une pizza ou des pâtes pour les voir",
    "menu.note": "Prix en dollars américains.",

    "photos.eyebrow": "Galerie",
    "photos.title": "Instantanés de la cuisine",
    "photos.hint": "Déplacez-les, ou cliquez pour les ouvrir",
    "photos.hintTouch": "Touchez une photo pour l'ouvrir",
    "photos.soon": "Photo à venir",
    "photos.soonVideo": "Vidéo à venir",

    "visit.eyebrow": "Passez nous voir",
    "visit.title": "Installez-vous",
    "visit.find": "Nous trouver",
    "visit.address": "Route principale, Deir el Ahmar, Baalbek-Hermel, Liban",
    "visit.directions": "Itinéraire →",
    "visit.hours": "Horaires",
    "visit.closed": "Fermé",
    "visit.contact": "Appelez ou écrivez-nous",
    "visit.call": "Appeler",
    "status.open": "Ouvert jusqu'à {t}. Entrez !",
    "status.closed": "Fermé pour le moment. Ouverture {d} à {t}.",
    "status.today": "aujourd'hui", "status.tomorrow": "demain",

    "footer.love": "Fait avec amour, des tomates et beaucoup de mozzarella.",
    "wa.msg": "Bonjour ! J'aimerais passer une commande 🍕",
  },

  ar: {
    "pv.h2": "كيف نحضّر الباستا",
    "pv.s1t": "الفطر",
    "pv.s1p": "فطر مقطّع شرائح يُقلى في المقلاة.",
    "pv.s2t": "الكريما",
    "pv.s2p": "كمية سخية من الكريما تُطهى على نار هادئة حتى تصبح ناعمة.",
    "pv.s3t": "التتبيلة",
    "pv.s3p": "فلفل أسود مطحون، ثم نمزج كل شيء معاً.",
    "pv.s4t": "الباستا",
    "pv.s4p": "شرائط الباستا تدخل مباشرة إلى الصلصة.",
    "pv.s5t": "اللمسة الأخيرة",
    "pv.s5p": "تُقلَّب حتى يتغطّى كل خيط بالصلصة، ثم مباشرة إلى طاولتك.",
    "bv.h2": "كيف نحضّر الباغيت",
    "bv.s1t": "الباغيت",
    "bv.s1p": "يُخبز في فرننا، ثم يُفتح وهو لا يزال ساخناً.",
    "bv.s2t": "الأفوكادو",
    "bv.s2p": "أفوكادو طازج يُدهن من طرف إلى طرف.",
    "bv.s3t": "البندورة",
    "bv.s3p": "شرائح بندورة ناضجة فوق اللحم والجبنة الذائبة.",
    "bv.s4t": "جاهزة",
    "bv.s4p": "تُغلق وتُضغط وتُقطَّع، جاهزة لطاولتك.",
    "brand.sub": "مطعم إيطالي",
    "nav.story": "البيتزا", "nav.menu": "القائمة", "nav.photos": "الصور", "nav.visit": "زورونا",
    "hero.tagline": "بيتزا نابوليتانية وباستا إيطالية، على الطريق العام في دير الأحمر.",
    "hero.cta1": "تصفّح القائمة",
    "hero.cta2": "اطلب عبر واتساب",

    "story.eyebrow": "كيف نحضّرها",
    "story.oven": "الفرن", "story.time": "الوقت",
    "story.s1t": "العجينة",
    "story.s1p": "طحين وماء وملح وخميرة، ثم وقت طويل لترتاح. كل كرة عجين تُفرد باليد، ولا نستعمل الشوبك أبداً.",
    "story.s2t": "البندورة",
    "story.s2p": "بندورة ناضجة مهروسة مع رشّة ملح. هذا كل شيء. البندورة الطيبة لا تحتاج إلى شيء آخر.",
    "story.s3t": "الموتزاريلا",
    "story.s3p": "كمية سخية من الموتزاريلا، موزّعة حتى الأطراف.",
    "story.s4t": "الفرن",
    "story.s4p": "إلى فرن الغاز على حرارة ٤٥٠ درجة. خلال تسعين ثانية تقريباً تنتفخ الأطراف وتصبح ذهبية ومقرمشة.",
    "story.s5t": "اللمسة الأخيرة",
    "story.s5p": "تُقطَّع، يُضاف إليها الحبق الطازج، ثم مباشرة إلى طاولتك.",
    "story.hint": "مرّر للأسفل لتشاهدها تتحضّر ↓",
    "story.soundOn": "شغّل الصوت", "story.soundOff": "اكتم الصوت",

    "pasta.eyebrow": "والباستا",
    "pasta.title": "مباشرة من المقلاة.",
    "pasta.text": "مطبوخة al dente، تُنهى في المقلاة مع صلصتها، وتصل إلى طاولتك والبخار يتصاعد منها.",
    "pasta.cta": "شوف الباستا",

    "menu.eyebrow": "القائمة",
    "menu.hint": "اضغط على أي بيتزا أو باستا لتراها",
    "menu.note": "الأسعار بالدولار الأميركي.",

    "photos.eyebrow": "الصور",
    "photos.title": "لقطات من المطبخ",
    "photos.hint": "حرّكها كما تشاء، أو اضغط لفتحها",
    "photos.hintTouch": "اضغط على صورة لفتحها",
    "photos.soon": "الصورة قريباً",
    "photos.soonVideo": "الفيديو قريباً",

    "visit.eyebrow": "زورونا",
    "visit.title": "تفضّلوا",
    "visit.find": "العنوان",
    "visit.address": "الطريق العام، دير الأحمر، بعلبك الهرمل، لبنان",
    "visit.directions": "الاتجاهات ←",
    "visit.hours": "ساعات العمل",
    "visit.closed": "مغلق",
    "visit.contact": "اتصل أو راسلنا",
    "visit.call": "اتصل بنا",
    "status.open": "مفتوح الآن حتى {t}. تفضّلوا!",
    "status.closed": "مغلق الآن. نفتح {d} الساعة {t}.",
    "status.today": "اليوم", "status.tomorrow": "غداً",

    "footer.love": "مصنوع بالحب، والبندورة، والكثير من الموتزاريلا.",
    "wa.msg": "مرحبا! بدّي أطلب 🍕",
  },
};
