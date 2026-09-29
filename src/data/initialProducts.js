export const initialProducts = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    category: "smartphones",
    categoryName: {
      uz: "Smartfonlar",
      ru: "Смартфоны",
      en: "Smartphones"
    },
    price: 16800000,
    discountPrice: 15490000,
    rating: 4.9,
    reviewsCount: 84,
    stock: 14,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "A17 Pro protsessori, yengil va mustahkam tabiiy titan (Natural Titanium) korpus, 48MP professional kamera va 5x optik zum bilan smartfonlar olamidagi yangi cho'qqi.",
      ru: "Флагманский процессор Apple A17 Pro, корпус из натурального титана, камера 48 Мп с 5-кратным оптическим зумом и порт USB-C 3.0.",
      en: "Powered by the groundbreaking A17 Pro chip, premium Natural Titanium design, 48MP camera system with 5x zoom, and all-day battery life."
    },
    specs: {
      "Ekran / Экран": "6.7\" Super Retina XDR OLED, 120Hz ProMotion",
      "Protsessor / Процессор": "Apple A17 Pro (3 nm)",
      "Xotira / Память": "256GB / 8GB RAM",
      "Kamera / Камера": "48 MP + 12 MP + 12 MP (5x zoom)",
      "Akkumulyator / Баtaрея": "4422 mAh, 20W MagSafe",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    category: "smartphones",
    categoryName: {
      uz: "Smartfonlar",
      ru: "Смартфоны",
      en: "Smartphones"
    },
    price: 15200000,
    discountPrice: 13990000,
    rating: 4.8,
    reviewsCount: 62,
    stock: 9,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: true,
    isFlashSale: false,
    description: {
      uz: "Galaxy AI sun'iy intellekti, 200MP kamera, titan gardish va S Pen qalami bilan chegarasiz imkoniyatlar.",
      ru: "Интеллект Galaxy AI, камера 200 Мп, титановая рамка и встроенное перо S Pen для максимальной продуктивности.",
      en: "Unleash Galaxy AI, a stellar 200MP camera system, titanium frame, and built-in S Pen stylus."
    },
    specs: {
      "Ekran / Экран": "6.8\" Dynamic LTPO AMOLED 2X, 120Hz, 2600 nits",
      "Protsessor / Процессор": "Snapdragon 8 Gen 3 for Galaxy",
      "Xotira / Память": "512GB / 12GB RAM",
      "Kamera / Камера": "200 MP + 50 MP + 10 MP + 12 MP",
      "Akkumulyator / Батарея": "5000 mAh, 45W tezkor quvvatlash",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 3,
    name: "Apple MacBook Pro 16\" M3 Max 36GB / 1TB Space Black",
    category: "laptops",
    categoryName: {
      uz: "Noutbuklar",
      ru: "Ноутбуки",
      en: "Laptops"
    },
    price: 38500000,
    discountPrice: 35900000,
    rating: 5.0,
    reviewsCount: 45,
    stock: 6,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "M3 Max chipli eng kuchli professional noutbuk. 3D render, dasturlash va 8K video montaj uchun eng ideal tanlov.",
      ru: "Самый мощный ноутбук на чипе M3 Max. Идеальный выбор для 3D-графики, кодинга и монтажа видео 8K.",
      en: "The ultimate creative powerhouse with M3 Max silicon, extreme Liquid Retina XDR display, and 22-hour battery."
    },
    specs: {
      "Ekran / Экран": "16.2\" Liquid Retina XDR, 120Hz ProMotion",
      "Protsessor / Процессор": "Apple M3 Max (14-core CPU, 30-core GPU)",
      "Xotira / Память": "36GB Unified Memory / 1TB SSD",
      "Portlar / Порты": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      "Akkumulyator / Батарея": "22 soatgacha ishlash vaqti",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 4,
    name: "ASUS ROG Zephyrus G16 OLED Core Ultra 9 / RTX 4080",
    category: "laptops",
    categoryName: {
      uz: "Noutbuklar",
      ru: "Ноутбуки",
      en: "Laptops"
    },
    price: 32000000,
    discountPrice: null,
    rating: 4.8,
    reviewsCount: 29,
    stock: 5,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: false,
    isFlashSale: false,
    description: {
      uz: "Yupqa alyuminiy korpus, 2.5K OLED 240Hz ekran va RTX 4080 grafik kartasi bilan o'yinlar hamda ish uchun mo'ljallangan flagman.",
      ru: "Тонкий корпус, дисплей 2.5K OLED 240 Гц и видеокарта RTX 4080 для бескомпромиссного гейминга и создания контента.",
      en: "Sleek all-aluminum chassis featuring 2.5K OLED 240Hz screen and powerhouse GeForce RTX 4080 graphics."
    },
    specs: {
      "Ekran / Экран": "16\" OLED 2.5K 240Hz 0.2ms",
      "Protsessor / Процессор": "Intel Core Ultra 9 185H",
      "Videokarta / Видеокарта": "NVIDIA GeForce RTX 4080 12GB GDDR6",
      "Xotira / Память": "32GB LPDDR5X / 1TB PCIe 4.0 NVMe",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 5,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "audio",
    categoryName: {
      uz: "Quloqchinlar",
      ru: "Наушники",
      en: "Audio"
    },
    price: 4300000,
    discountPrice: 3790000,
    rating: 4.9,
    reviewsCount: 118,
    stock: 22,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "Dunyodagi eng ilg'or shovqinni bekor qilish (ANC) texnologiyasi va 30 soatlik quvvat zahirasi.",
      ru: "Лучшее в мире активное шумоподавление, непревзойденный Hi-Res звук и до 30 часов автономности.",
      en: "Industry-leading noise cancellation with two processors and 8 microphones for breathtaking audio purity."
    },
    specs: {
      "Turi / Тип": "To'liq o'lchamli simsiz quloqchinlar",
      "Shovqinni bekor qilish / ANC": "Faol adaptiv ANC tizimi",
      "Batareya / Батарея": "30 soatgacha (ANC yoniq holda)",
      "Ulanish / Подключение": "Bluetooth 5.2, LDAC, Multipoint",
      "Kafolat / Гарантия": "6 oy kafolat"
    }
  },
  {
    id: 6,
    name: "Apple AirPods Pro 2 (USB-C) MagSafe Case",
    category: "audio",
    categoryName: {
      uz: "Quloqchinlar",
      ru: "Наушники",
      en: "Audio"
    },
    price: 2950000,
    discountPrice: 2650000,
    rating: 4.9,
    reviewsCount: 154,
    stock: 28,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: true,
    isFlashSale: false,
    description: {
      uz: "H2 chipi, 2 barobar kuchli shovqinni bostirish va moslashuvchan audio rejimi bilan original AirPods Pro 2.",
      ru: "Чип H2, в 2 раза более эффективное шумоподавление и адаптивный прозрачный режим.",
      en: "Up to 2x more Active Noise Cancellation, Adaptive Audio, and personalized Spatial Audio."
    },
    specs: {
      "Chip / Чип": "Apple H2 Headphone chip",
      "Quvvat / Батарея": "6 soat (keys bilan 30 soat)",
      "Himoya / Защита": "IP54 chang va suvdan himoya",
      "Port / Разъем": "USB-C & MagSafe",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 7,
    name: "Apple Watch Series 10 GPS 46mm Jet Black",
    category: "watches",
    categoryName: {
      uz: "Aqlli soatlar",
      ru: "Смарт-часы",
      en: "Smartwatches"
    },
    price: 5800000,
    discountPrice: 5290000,
    rating: 4.8,
    reviewsCount: 47,
    stock: 12,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: false,
    description: {
      uz: "Yangi yupqa korpus, kattaroq keng burchakli OLED displey va tezkor quvvatlash tizimi.",
      ru: "Самый тонкий корпус за всю историю, увеличенный широкоугольный OLED экран и быстрая зарядка.",
      en: "Thinnest Apple Watch ever with our biggest display, sleep apnea tracking, and ultra-fast charging."
    },
    specs: {
      "Korpus / Корпус": "46mm alyuminiy Jet Black",
      "Displey / Дисплей": "Keng burchakli Always-On Retina OLED",
      "Sensorlar / Датчики": "EKG, yurak urishi, tana harorati, qon kislorodi",
      "Suvdan himoya / Водостойкость": "50 metr (WR50)",
      "Kafolat / Гарантия": "12 oy kafolat"
    }
  },
  {
    id: 8,
    name: "Samsung Galaxy Watch 6 Classic 47mm LTE Silver",
    category: "watches",
    categoryName: {
      uz: "Aqlli soatlar",
      ru: "Смарт-часы",
      en: "Smartwatches"
    },
    price: 4100000,
    discountPrice: 3590000,
    rating: 4.7,
    reviewsCount: 38,
    stock: 15,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: false,
    isFlashSale: true,
    description: {
      uz: "Aylanuvchi mexanik bezel, safir shisha va sog'lik ko'rsatkichlarini keng qamrovli monitoring qilish tizimi.",
      ru: "Вращающийся механический безель, сапфировое стекло и углубленный мониторинг показателей здоровья.",
      en: "Featuring iconic rotating bezel, sapphire crystal glass, and personalized heart rate zones."
    },
    specs: {
      "Displey / Дисплей": "1.5\" Super AMOLED Sapphire",
      "Material / Материал": "Zanglamaydigan po'lat / Кожаный ремешок",
      "Batareya / Батарея": "425 mAh, 40 soatgacha",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 9,
    name: "Sony PlayStation 5 Slim 1TB + 2 DualSense Controllers",
    category: "appliances",
    categoryName: {
      uz: "Maishiy texnika",
      ru: "Техника",
      en: "Electronics"
    },
    price: 7400000,
    discountPrice: 6850000,
    rating: 5.0,
    reviewsCount: 93,
    stock: 8,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "1TB ultra-tezkor SSD, 4K 120Hz o'yinlar va komplektda 2 dona original DualSense geympadi bilan unutilmas o'yin hissi.",
      ru: "Компактный PS5 Slim с 1 ТБ SSD, поддержкой 4K 120 Гц и 2 беспроводными геймпадами в комплекте.",
      en: "Sleek slim design with 1TB SSD, 4K ray tracing visuals, and includes two DualSense wireless controllers."
    },
    specs: {
      "SSD / Память": "1TB Custom Ultra-High Speed NVMe",
      "Grafika / Графика": "AMD RDNA 2, 10.3 TFLOPS, 4K 120fps",
      "Komplekt / Комплект": "PS5 Slim Console + 2x DualSense + Kabellar",
      "Kafolat / Гарантия": "12 oy rasmiy kafolat"
    }
  },
  {
    id: 10,
    name: "Dyson V15 Detect Absolute Simsiz Changyutgich",
    category: "appliances",
    categoryName: {
      uz: "Maishiy texnika",
      ru: "Техника",
      en: "Electronics"
    },
    price: 9800000,
    discountPrice: 8900000,
    rating: 4.9,
    reviewsCount: 51,
    stock: 7,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: false,
    description: {
      uz: "Lazer nurlanishli chang aniqlash tizimi, pyezoelektr datchik va 240 AW kuchli tortish quvvati.",
      ru: "Лазерная подсветка микропыли, пьезодатчик загрязнений и мощность всасывания 240 аВт.",
      en: "Dyson's most powerful, intelligent cordless vacuum with laser illumination for microscopic dust detection."
    },
    specs: {
      "Tortish kuchi / Мощность": "240 AW Hyperdymium motor",
      "Ishlash vaqti / Автономность": "60 daqiqagacha doimiy quvvat",
      "Filtr / Фильтрация": "99.99% mayda zarralarni ushlab qoluvchi HEPA",
      "Kafolat / Гарантия": "24 oy kafolat"
    }
  },
  {
    id: 11,
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    category: "accessories",
    categoryName: {
      uz: "Aksessuarlar",
      ru: "Аксессуары",
      en: "Accessories"
    },
    price: 1350000,
    discountPrice: 1180000,
    rating: 4.9,
    reviewsCount: 140,
    stock: 35,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: false,
    isFlashSale: false,
    description: {
      uz: "Sokin bosilish tugmalari, 8000 DPI Darkfield sensori va sekundiga 1000 qator aylantiruvchi MagSpeed g'ildiragi.",
      ru: "Бесшумные клики, датчик 8000 DPI на любой поверхности и электромагнитное колесо MagSpeed.",
      en: "Quiet Clicks and 8,000 DPI glass tracking for ultimate workflow precision and ergonomic comfort."
    },
    specs: {
      "Sensor / Сенсор": "Darkfield 8000 DPI (shisha ustida ham ishlaydi)",
      "Ulanish / Подключение": "Bluetooth Low Energy & Logi Bolt USB",
      "Batareya / Батарея": "70 kungacha to'liq quvvatda",
      "Kafolat / Гарантия": "12 oy kafolat"
    }
  },
  {
    id: 12,
    name: "Anker Prime 27,650mAh Power Bank (250W)",
    category: "accessories",
    categoryName: {
      uz: "Aksessuarlar",
      ru: "Аксессуары",
      en: "Accessories"
    },
    price: 1850000,
    discountPrice: 1590000,
    rating: 4.8,
    reviewsCount: 76,
    stock: 19,
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "Noutbuklar va telefonlarni bir vaqtda 250W gacha tezlikda quvvatlay oluvchi aqlli displeyli premium tashqi akkumulyator.",
      ru: "Мощный повербанк 250 Вт с умным информационным дисплеем для быстрой зарядки ноутбуков и телефонов.",
      en: "Multi-device fast charging power bank offering up to 250W output and digital smart display."
    },
    specs: {
      "Sig'im / Емкость": "27,650 mAh (99.54Wh aviatsiyaga ruxsat)",
      "Quvvat / Мощность": "Jami 250W (bitta portdan 140W PD 3.1)",
      "Portlar / Порты": "2x USB-C + 1x USB-A",
      "Kafolat / Гарантия": "12 oy kafolat"
    }
  },
  {
    id: 13,
    name: "Italiya Charm Erkaklar Klassik Tufligi (Oxford Royal)",
    category: "fashion",
    categoryName: {
      uz: "Kiyim & Poyabzal",
      ru: "Одежда и Обувь",
      en: "Fashion & Shoes"
    },
    price: 2800000,
    discountPrice: 2500000,
    rating: 4.9,
    reviewsCount: 38,
    stock: 12,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: true,
    isFeatured: true,
    isFlashSale: false,
    description: {
      uz: "100% tabiiy buzoq terisidan qo'lda tikilgan italyan uslubidagi qulay va hashamatli klassik tuflik. Rasmiy uchrashuvlar va to'ylar uchun ideal.",
      ru: "Роскошные классические туфли оксфорды ручной работы из 100% натуральной телячьей кожи.",
      en: "Handcrafted 100% genuine Italian calfskin Oxford dress shoes for formal and executive occasions."
    },
    specs: {
      "Material / Материал": "100% Tabiiy buzoq charmi (Natural Leather)",
      "Taglik / Подошва": "Durable Goodyear Welted rezina qoplamali",
      "O'lchamlar / Размеры": "40, 41, 42, 43, 44",
      "Ishlab chiqarilgan / Страна": "Italiya / Italy",
      "Kafolat / Гарантия": "6 oy sifat kafolati"
    }
  },
  {
    id: 14,
    name: "Air Zoom Pegasus Pro Sport Krossovkasi",
    category: "fashion",
    categoryName: {
      uz: "Kiyim & Poyabzal",
      ru: "Одежда и Обувь",
      en: "Fashion & Shoes"
    },
    price: 1450000,
    discountPrice: 1240000,
    rating: 4.8,
    reviewsCount: 52,
    stock: 18,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    isNew: false,
    isFeatured: true,
    isFlashSale: true,
    description: {
      uz: "Yugurish, trenirovka va kundalik yurish uchun yengil nafas oluvchi havo yostiqchali premium sport poyabzali.",
      ru: "Ультралегкие беговые кроссовки с амортизирующей воздушной подушкой.",
      en: "Lightweight and breathable athletic running shoes with responsive cushioning."
    },
    specs: {
      "Amortizatsiya / Амортизация": "Air Zoom Dual-Pod texnologiyasi",
      "Vazni / Вес": "260 gramm (juda yengil)",
      "O'lchamlar / Размеры": "39, 40, 41, 42, 43, 44, 45",
      "Kafolat / Гарантия": "6 oy rasmiy kafolat"
    }
  }
];
