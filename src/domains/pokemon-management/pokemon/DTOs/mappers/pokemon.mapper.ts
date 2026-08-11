import { PokemonDocument } from "../../schemas/pokemon.schema"
import { PokemonApiResponse } from "../api-responses/pokemon.api-response"
import { EditPokemonInput } from "../inputs/edit-pokemon.input"


interface _PokemonMapper {
    readonly mapToApiResponse: (pokemon: PokemonDocument) => PokemonApiResponse
    readonly mapEditInputToColumns: (editPokemonInput: EditPokemonInput) => Partial<PokemonDocument>
}

export const PokemonMapper: _PokemonMapper = Object.freeze({

    mapToApiResponse: (pokemon: PokemonDocument) => ({
        id: pokemon.id,
        spaceId: pokemon.spaceId,
        speciesId: pokemon.speciesId,
        speciesName: pokemon.speciesName,
        level: pokemon.level,
        nature: pokemon.nature,
        ability: pokemon.ability,
        heldItem: pokemon.heldItem,
        isShiny: pokemon.isShiny,
        moves: [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4] as const,
        ivs: {
            hp: pokemon.ivHp,
            attack: pokemon.ivAttack,
            defense: pokemon.ivDefense,
            specialAttack: pokemon.ivSpecialAttack,
            specialDefense: pokemon.ivSpecialDefense,
            speed: pokemon.ivSpeed,
        },
        evs: {
            hp: pokemon.evHp,
            attack: pokemon.evAttack,
            defense: pokemon.evDefense,
            specialAttack: pokemon.evSpecialAttack,
            specialDefense: pokemon.evSpecialDefense,
            speed: pokemon.evSpeed,
        },
        createdAt: pokemon.createdAt,
    }),

    mapEditInputToColumns: (editPokemonInput: EditPokemonInput) => ({
        ...(editPokemonInput.level !== undefined && { level: editPokemonInput.level }),
        ...(editPokemonInput.nature !== undefined && { nature: editPokemonInput.nature }),
        ...(editPokemonInput.ability !== undefined && { ability: editPokemonInput.ability }),
        ...(editPokemonInput.heldItem !== undefined && { heldItem: editPokemonInput.heldItem }),
        ...(editPokemonInput.isShiny !== undefined && { isShiny: editPokemonInput.isShiny }),
        ...(editPokemonInput.moves !== undefined && {
            move1: editPokemonInput.moves[0],
            move2: editPokemonInput.moves[1],
            move3: editPokemonInput.moves[2],
            move4: editPokemonInput.moves[3],
        }),
        ...(editPokemonInput.ivs !== undefined && {
            ivHp: editPokemonInput.ivs.hp,
            ivAttack: editPokemonInput.ivs.attack,
            ivDefense: editPokemonInput.ivs.defense,
            ivSpecialAttack: editPokemonInput.ivs.specialAttack,
            ivSpecialDefense: editPokemonInput.ivs.specialDefense,
            ivSpeed: editPokemonInput.ivs.speed,
        }),
        ...(editPokemonInput.evs !== undefined && {
            evHp: editPokemonInput.evs.hp,
            evAttack: editPokemonInput.evs.attack,
            evDefense: editPokemonInput.evs.defense,
            evSpecialAttack: editPokemonInput.evs.specialAttack,
            evSpecialDefense: editPokemonInput.evs.specialDefense,
            evSpeed: editPokemonInput.evs.speed,
        }),
    }),
})
