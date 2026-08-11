// Attacker → defender → damage multiplier. Omitted pairs default to 1 (neutral).
// Gen 6+ chart (Steel no longer resists Ghost/Dark).
export const TypeEffectivenessConfig: Readonly<Record<string, Readonly<Record<string, number>>>> = Object.freeze({
    normal: Object.freeze({ rock: 0.5, ghost: 0, steel: 0.5 }),
    fire: Object.freeze({ fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 }),
    water: Object.freeze({ fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 }),
    electric: Object.freeze({ water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 }),
    grass: Object.freeze({ fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 }),
    ice: Object.freeze({ fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 }),
    fighting: Object.freeze({ normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 }),
    poison: Object.freeze({ grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 }),
    ground: Object.freeze({ fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 }),
    flying: Object.freeze({ electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 }),
    psychic: Object.freeze({ fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 }),
    bug: Object.freeze({ fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 }),
    rock: Object.freeze({ fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 }),
    ghost: Object.freeze({ normal: 0, psychic: 2, ghost: 2, dark: 0.5 }),
    dragon: Object.freeze({ dragon: 2, steel: 0.5, fairy: 0 }),
    dark: Object.freeze({ fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 }),
    steel: Object.freeze({ fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 }),
    fairy: Object.freeze({ fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }),
})