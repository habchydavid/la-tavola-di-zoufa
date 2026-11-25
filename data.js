/* =====================================================================
   LA TAVOLA DI ZOUFA — everything you'll want to edit lives in this file
   ---------------------------------------------------------------------
   • Contact details, hours, menu, photos and all the text (EN / FR / AR).
   • You never need to touch index.html, styles.css or main.js to update
     the content.
   • Contact details and hours are still PLACEHOLDERS. Replace them.
   ===================================================================== */

window.SITE = {
  name: "La Tavola di Zoufa",

  // Contact (placeholders, so replace these)
  phone: "+961 70 000 000",          // shown on the site
  whatsapp: "96170000000",           // digits only, with country code, no + or spaces
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

  /* ---------------- MENU ----------------
     Each section has a title (EN / FR / AR) and a list of items.
     • name: one text for all languages, or { en, fr, ar }
     • price: number
     • featured: true  → shown in gold, like on the printed menu
     • desc: optional, { en, fr, ar }
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
        { name: "Pizza Diavola", price: 13, draw: { sauce: "red", cheese: true, toppings: ["salami", "chili"] } },
        { name: "Pizza Truffle", price: 15, draw: { sauce: "white", cheese: true, toppings: ["mushroom", "truffle"] } },
        { name: "Pizza Regina", price: 14, draw: { sauce: "red", cheese: true, toppings: ["prosciutto", "mushroom", "olive"] } },
        { name: "Pizza Quattro", price: 13, draw: { sauce: "white", cheese: true, toppings: ["gorgonzola", "parm"] } },
        { name: "Pizza Burrata", price: 22, featured: true, draw: { sauce: "red", cheese: false, toppings: ["burrata", "tomato", "basil"] } },
        { name: "Pizza Bresaola", price: 25, featured: true, draw: { sauce: "red", cheese: true, toppings: ["bresaola", "rucola", "parm"] } },
        { name: "Pizza Pesto", price: 13, featured: true, draw: { sauce: "pesto", cheese: true, toppings: ["tomato", "basil"] } },
      ],
    },
    {
      id: "pasta", art: "pasta",
      title: { en: "Pasta", fr: "Pâtes", ar: "باستا" },
      items: [
        { name: "Pasta Arrabiata", price: 9, draw: { sauce: "red", extras: ["chili", "parsley"] } },
        { name: "Pasta Alfredo", price: 13, draw: { sauce: "cream", extras: ["parm", "parsley"] } },
        { name: "Pasta Truffle", price: 14, draw: { sauce: "cream", extras: ["truffle", "parm"] } },
        { name: "Pasta Gluten Free", price: 14, draw: { sauce: "red", extras: ["basil", "parm"] } },
        { name: "Pasta Pink Sauce", price: 14, draw: { sauce: "pink", extras: ["parm", "basil"] } },
      ],
    },
    {
      id: "baguette",
      title: { en: "Sandwich Baguette", fr: "Sandwich Baguette", ar: "سندويش باغيت" },
      items: [
        {
          name: "Chicken Baguette", price: 7, featured: true,
          desc: {
            en: "Grilled chicken, lettuce, tomato, mozzarella, avocado sauce",
            fr: "Poulet grillé, laitue, tomate, mozzarella, sauce avocat",
            ar: "دجاج مشوي، خس، بندورة، موتزاريلا، صلصة أفوكادو",
          },
        },
        {
          name: "Turkey Baguette", price: 5, featured: true,
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
    { src: "", type: "image", caption: { en: "The oven", fr: "Le four", ar: "الفرن" } },
    { src: "", type: "image", caption: { en: "Fresh out of the oven", fr: "Tout juste sortie du four", ar: "طالعة من الفرن" } },
    { src: "", type: "image", caption: { en: "Our dining room", fr: "Notre salle", ar: "صالتنا" } },
    { src: "", type: "video", caption: { en: "Stretching the dough", fr: "On étire la pâte", ar: "فرد العجينة" } },
    { src: "", type: "image", caption: { en: "Pasta night", fr: "Soirée pâtes", ar: "سهرة باستا" } },
    { src: "", type: "image", caption: { en: "Main road at sunset", fr: "La route principale au coucher du soleil", ar: "الطريق العام وقت الغروب" } },
  ],
};

/* ---------------- ALL THE TEXT ON THE SITE ---------------- */
window.TEXT = {
  en: {
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
    "story.s3p": "Soft, milky mozzarella, torn by hand and scattered across the pizza.",
    "story.s4t": "The oven",
    "story.s4p": "Into our gas oven at 450°C. In about ninety seconds the crust puffs up and gets its golden, blistered edge.",
    "story.s5t": "The finish",
    "story.s5p": "Fresh basil and a drizzle of olive oil, then straight to your table.",

    "pasta.eyebrow": "And the pasta",
    "pasta.title": "Twirl it like Nonna.",
    "pasta.text": "Pasta cooked al dente, then tossed in the pan with the sauce so every strand is coated.",
    "pasta.hint": "Keep scrolling to twirl ↓",

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
    "story.s3p": "Une mozzarella fondante, déchirée à la main et répartie sur la pizza.",
    "story.s4t": "Le four",
    "story.s4p": "Direction notre four à gaz, à 450 °C. En quatre-vingt-dix secondes environ, la croûte gonfle et se dore.",
    "story.s5t": "La touche finale",
    "story.s5p": "Du basilic frais et un filet d'huile d'olive, puis directement à votre table.",

    "pasta.eyebrow": "Et les pâtes",
    "pasta.title": "Enroulez-les comme Nonna.",
    "pasta.text": "Des pâtes al dente, sautées à la poêle avec la sauce pour bien enrober chaque brin.",
    "pasta.hint": "Continuez à défiler ↓",

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
    "story.s3p": "موتزاريلا طرية، نقطّعها باليد ونوزّعها على البيتزا.",
    "story.s4t": "الفرن",
    "story.s4p": "إلى فرن الغاز على حرارة ٤٥٠ درجة. خلال تسعين ثانية تقريباً تنتفخ الأطراف وتصبح ذهبية ومقرمشة.",
    "story.s5t": "اللمسة الأخيرة",
    "story.s5p": "حبق طازج ورشّة زيت زيتون، ثم مباشرة إلى طاولتك.",

    "pasta.eyebrow": "والباستا",
    "pasta.title": "لفّها على الشوكة مثل تيتا.",
    "pasta.text": "باستا مطبوخة al dente، ثم تُقلَّب في المقلاة مع الصلصة حتى يتغطّى كل خيط منها.",
    "pasta.hint": "تابع النزول لتلفّها ↓",

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
