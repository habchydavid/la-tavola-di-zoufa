/* =====================================================================
   LA TAVOLA DI ZOUFA — everything you'll want to edit lives in this file
   ---------------------------------------------------------------------
   • Contact details, hours, menu, photos and all the text (EN / FR / AR).
   • You never need to touch index.html, styles.css or main.js to update
     the content.
   • All details below are PLACEHOLDERS. Replace them with the real ones.
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
     tags: "house" (house special), "spicy", "veg"
     Pizza "draw" = how the little illustration looks:
       sauce: "red" | "white"     cheese: true | false
       toppings: basil, salami, chili, mushroom, olive, prosciutto, rucola,
                 parm, sujuk, honey, garlic, oregano, gorgonzola
     Pasta "draw":
       sauce: "red" | "oil" | "cream" | "ragu"
       extras: basil, parm, chili, garlic, parsley, pepper, bacon, meatballs
  */
  menu: {
    pizza: [
      {
        name: "Margherita", price: 9, tags: ["veg"],
        desc: {
          en: "Tomato, fresh mozzarella, basil, olive oil.",
          fr: "Tomate, mozzarella fraîche, basilic, huile d'olive.",
          ar: "بندورة، موتزاريلا طازجة، حبق، زيت زيتون.",
        },
        draw: { sauce: "red", cheese: true, toppings: ["basil"] },
      },
      {
        name: "Marinara", price: 7, tags: ["veg"],
        desc: {
          en: "Tomato, garlic, oregano, olive oil. No cheese, the Naples original.",
          fr: "Tomate, ail, origan, huile d'olive. Sans fromage, l'originale de Naples.",
          ar: "بندورة، ثوم، أوريغانو، زيت زيتون. بدون جبنة، كما في نابولي.",
        },
        draw: { sauce: "red", cheese: false, toppings: ["garlic", "oregano"] },
      },
      {
        name: "Diavola", price: 11, tags: ["spicy"],
        desc: {
          en: "Tomato, mozzarella, spicy salami, fresh chili.",
          fr: "Tomate, mozzarella, salami piquant, piment frais.",
          ar: "بندورة، موتزاريلا، سلامي حار، فليفلة حارة.",
        },
        draw: { sauce: "red", cheese: true, toppings: ["salami", "chili"] },
      },
      {
        name: "Funghi", price: 10, tags: ["veg"],
        desc: {
          en: "Tomato, mozzarella, sautéed mushrooms, parsley.",
          fr: "Tomate, mozzarella, champignons sautés, persil.",
          ar: "بندورة، موتزاريلا، فطر مقلي، بقدونس.",
        },
        draw: { sauce: "red", cheese: true, toppings: ["mushroom"] },
      },
      {
        name: "Quattro Formaggi", price: 12, tags: ["veg"],
        desc: {
          en: "White base, mozzarella, gorgonzola, provolone, parmesan.",
          fr: "Base blanche, mozzarella, gorgonzola, provolone, parmesan.",
          ar: "قاعدة بيضاء، موتزاريلا، غورغونزولا، بروفولون، بارميزان.",
        },
        draw: { sauce: "white", cheese: true, toppings: ["gorgonzola", "parm"] },
      },
      {
        name: "Prosciutto e Rucola", price: 13, tags: [],
        desc: {
          en: "Tomato, mozzarella, prosciutto, rocket, parmesan shavings.",
          fr: "Tomate, mozzarella, prosciutto, roquette, copeaux de parmesan.",
          ar: "بندورة، موتزاريلا، بروشوتو، جرجير، شرائح بارميزان.",
        },
        draw: { sauce: "red", cheese: true, toppings: ["prosciutto", "rucola", "parm"] },
      },
      {
        name: "La Zoufa", price: 13, tags: ["house", "spicy"],
        desc: {
          en: "Our house pizza: tomato, mozzarella, sujuk, black olives, chili honey.",
          fr: "La pizza de la maison : tomate, mozzarella, soujouk, olives noires, miel pimenté.",
          ar: "بيتزا البيت: بندورة، موتزاريلا، سجق، زيتون أسود، عسل بالفليفلة الحارة.",
        },
        draw: { sauce: "red", cheese: true, toppings: ["sujuk", "olive", "honey"] },
      },
    ],

    pasta: [
      {
        name: "Spaghetti al Pomodoro", price: 8, tags: ["veg"],
        desc: {
          en: "Slow-cooked tomato sauce, basil, parmesan.",
          fr: "Sauce tomate mijotée, basilic, parmesan.",
          ar: "صلصة بندورة مطبوخة على نار هادئة، حبق، بارميزان.",
        },
        draw: { sauce: "red", extras: ["basil", "parm"] },
      },
      {
        name: "Aglio, Olio e Peperoncino", price: 8, tags: ["veg", "spicy"],
        desc: {
          en: "Garlic, olive oil, chili flakes, parsley.",
          fr: "Ail, huile d'olive, piment, persil.",
          ar: "ثوم، زيت زيتون، فليفلة حارة مجروشة، بقدونس.",
        },
        draw: { sauce: "oil", extras: ["garlic", "chili", "parsley"] },
      },
      {
        name: "Carbonara", price: 11, tags: [],
        desc: {
          en: "Egg yolk, pecorino, crispy pancetta, black pepper. No cream.",
          fr: "Jaune d'œuf, pecorino, pancetta croustillante, poivre noir. Sans crème.",
          ar: "صفار بيض، جبنة بيكورينو، بانشيتا مقرمشة، فلفل أسود. بدون كريما.",
        },
        draw: { sauce: "cream", extras: ["bacon", "pepper", "parm"] },
      },
      {
        name: "Bolognese", price: 11, tags: [],
        desc: {
          en: "Beef ragù, slow-cooked for hours, parmesan.",
          fr: "Ragù de bœuf mijoté pendant des heures, parmesan.",
          ar: "راغو لحم بقر مطبوخ لساعات، بارميزان.",
        },
        draw: { sauce: "ragu", extras: ["parm", "basil"] },
      },
      {
        name: "Spaghetti della Nonna", price: 12, tags: ["house"],
        desc: {
          en: "Tomato sauce, homemade meatballs, basil. Just like grandma's.",
          fr: "Sauce tomate, boulettes maison, basilic. Comme chez grand-mère.",
          ar: "صلصة بندورة، كبب لحم بيتية، حبق. مثل طبخ التيتا.",
        },
        draw: { sauce: "red", extras: ["meatballs", "basil", "parm"] },
      },
    ],
  },

  /* ---------------- PHOTOS ----------------
     Put your files in the /images folder and write the file name in "src",
     for example  src: "images/oven.jpg".  For a video use type: "video"
     and src: "images/kitchen.mp4". While src is empty a placeholder shows.
  */
  photos: [
    { src: "", type: "image", caption: { en: "The oven", fr: "Le four", ar: "الفرن" } },
    { src: "", type: "image", caption: { en: "Fresh out of the oven", fr: "Tout juste sortie du four", ar: "طالعة من الفرن" } },
    { src: "", type: "image", caption: { en: "Our little dining room", fr: "Notre petite salle", ar: "صالتنا الصغيرة" } },
    { src: "", type: "video", caption: { en: "Stretching the dough", fr: "On étire la pâte", ar: "فرد العجينة" } },
    { src: "", type: "image", caption: { en: "Spaghetti night", fr: "Soirée spaghetti", ar: "سهرة سباغيتي" } },
    { src: "", type: "image", caption: { en: "Main road at sunset", fr: "La route principale au coucher du soleil", ar: "الطريق العام وقت الغروب" } },
  ],
};

/* ---------------- ALL THE TEXT ON THE SITE ---------------- */
window.TEXT = {
  en: {
    "intro.kicker": "Pizzeria · Spaghetteria",
    "nav.story": "Our pizza", "nav.menu": "Menu", "nav.photos": "Photos", "nav.visit": "Visit",
    "hero.kicker": "Pizzeria · Spaghetteria",
    "hero.tagline": "Neapolitan pizza & Italian spaghetti, on the main road of Deir al Ahmar.",
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

    "pasta.eyebrow": "And the spaghetti",
    "pasta.title": "Twirl it like Nonna.",
    "pasta.text": "Spaghetti cooked al dente, then tossed in the pan with the sauce so every strand is coated.",
    "pasta.hint": "Keep scrolling to twirl ↓",

    "menu.eyebrow": "The menu",
    "menu.sub": "What's cooking today",
    "menu.pizza": "Pizza", "menu.pasta": "Pasta",
    "menu.hint": "Tap a dish to take a look",
    "menu.note": "Prices in US dollars.",
    "tag.house": "House special", "tag.spicy": "Spicy", "tag.veg": "Vegetarian",

    "photos.eyebrow": "On the wall",
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
    "intro.kicker": "Pizzeria · Spaghetteria",
    "nav.story": "Notre pizza", "nav.menu": "Menu", "nav.photos": "Photos", "nav.visit": "Nous trouver",
    "hero.kicker": "Pizzeria · Spaghetteria",
    "hero.tagline": "Pizza napolitaine et spaghetti à l'italienne, sur la route principale de Deir el Ahmar.",
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

    "pasta.eyebrow": "Et les spaghetti",
    "pasta.title": "Enroulez-les comme Nonna.",
    "pasta.text": "Des spaghetti al dente, sautés à la poêle avec la sauce pour bien enrober chaque brin.",
    "pasta.hint": "Continuez à défiler ↓",

    "menu.eyebrow": "La carte",
    "menu.sub": "Au menu aujourd'hui",
    "menu.pizza": "Pizzas", "menu.pasta": "Pâtes",
    "menu.hint": "Touchez un plat pour le voir",
    "menu.note": "Prix en dollars américains.",
    "tag.house": "Spécialité", "tag.spicy": "Épicé", "tag.veg": "Végétarien",

    "photos.eyebrow": "Au mur",
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
    "intro.kicker": "بيتزا · سباغيتي",
    "nav.story": "البيتزا", "nav.menu": "القائمة", "nav.photos": "الصور", "nav.visit": "زورونا",
    "hero.kicker": "بيتزا · سباغيتي",
    "hero.tagline": "بيتزا نابوليتانية وسباغيتي إيطالية، على الطريق العام في دير الأحمر.",
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

    "pasta.eyebrow": "والسباغيتي",
    "pasta.title": "لفّها على الشوكة مثل تيتا.",
    "pasta.text": "سباغيتي مطبوخة al dente، ثم تُقلَّب في المقلاة مع الصلصة حتى يتغطّى كل خيط منها.",
    "pasta.hint": "تابع النزول لتلفّها ↓",

    "menu.eyebrow": "القائمة",
    "menu.sub": "ماذا نطبخ اليوم",
    "menu.pizza": "بيتزا", "menu.pasta": "باستا",
    "menu.hint": "اضغط على أي طبق لتراه",
    "menu.note": "الأسعار بالدولار الأميركي.",
    "tag.house": "طبق البيت", "tag.spicy": "حار", "tag.veg": "نباتي",

    "photos.eyebrow": "على الحائط",
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
