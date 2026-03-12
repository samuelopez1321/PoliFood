import type { Product } from "../types";

export const PRODUCTS: Product[] = [
    {
        id: 102,
        name: "Combo Clásico",
        description: "Hamburguesa sencilla, papas francesas y gaseosa",
        price: 18000,
        imgUrl: "/imagenes-productos/102.png",
        prepTimeMinutes: 18,
        available: true,
        storeId: 1,
        category: "Combos"
    },
    {
        id: 103,
        name: "Hamburguesa Doble Queso",
        description: "Doble carne de res, doble queso cheddar y salsa especial",
        price: 16000,
        imgUrl: "/imagenes-productos/103.png",
        prepTimeMinutes: 20,
        available: false,
        storeId: 1,
        category: "Combos"
    },
    {
        id: 104,
        name: "Perro Especial",
        description: "Salchicha premium, queso rallado, tocineta y papitas trituradas",
        price: 14000,
        imgUrl: "/imagenes-productos/104.png",
        prepTimeMinutes: 12,
        available: true,
        storeId: 1,
        category: "Combos"
    },
    {
        id: 105,
        name: "Salchipapa Mixta",
        description: "Papas francesas, salchicha, carne desmechada y salsas",
        price: 17000,
        imgUrl: "/imagenes-productos/105.png",
        prepTimeMinutes: 15,
        available: true,
        storeId: 1,
        category: "Snak"
    },
    {
        id: 106,
        name: "Arepa Burger",
        description: "Carne de res, queso campesino y vegetales en arepa blanca",
        price: 15000,
        imgUrl: "/imagenes-productos/106.png",
        prepTimeMinutes: 14,
        available: true,
        storeId: 1,
        category: "Snack"
    },
    {
        id: 107,
        name: "Coca Cola",
        description: "Bebida gaseosa personal",
        price: 5000,
        imgUrl: "/imagenes-productos/107.png",
        prepTimeMinutes: 2,
        available: true,
        storeId: 1,
        category: "Bebida"
    },
    {
        id: 108,
        name: "Ensalada Power Proteína",
        description: "Mix de lechugas, pollo a la plancha, quinoa, aguacate y semillas",
        price: 18000,
        imgUrl: "/imagenes-productos/108.png",
        prepTimeMinutes: 12,
        available: true,
        storeId: 2,
        category: "Ensaladas"
    },
    {
    id: 109,
    name: "Ensalada Veggie Fresh",
    description: "Espinaca, garbanzos, tomate cherry, pepino, zanahoria y vinagreta cítrica",
    price: 16000,
    imgUrl: "/imagenes-productos/109.png",
    prepTimeMinutes: 10,
    available: true,
    storeId: 2,
    category: "Ensaladas"
    },
    {
        id: 110,
        name: "Jugo Verde Detox",
        description: "Espinaca, piña, manzana verde y jengibre natural",
        price: 9000,
        imgUrl: "/imagenes-productos/110.png",
        prepTimeMinutes: 5,
        available: true,
        storeId: 2,
        category: "Jugos Naturales"
    },
    {
        id: 111,
        name: "Jugo Energía Roja",
        description: "Fresa, remolacha y naranja 100% natural sin azúcar añadida",
        price: 9500,
        imgUrl: "/imagenes-productos/111.png",
        prepTimeMinutes: 5,
        available: true,
        storeId: 2,
        category: "Jugos Naturales"
    },
    {
        id: 112,
        name: "Ensalada Tropical Fit",
        description: "Mix verde, mango, piña, nueces y queso bajo en grasa",
        price: 17000,
        imgUrl: "/imagenes-productos/112.png",
        prepTimeMinutes: 11,
        available: true,
        storeId: 2,
        category: "Ensaladas"
    },
    {
        id: 113,
        name: "Jugo Antioxidante Mix",
        description: "Arándanos, mora, banano y leche vegetal",
        price: 10000,
        imgUrl: "/imagenes-productos/113.png",
        prepTimeMinutes: 6,
        available: false,
        storeId: 2,
        category: "Jugos Naturales"
    }
    
];