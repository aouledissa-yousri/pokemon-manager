import { PokemonApiResponse } from "../../pokemon/DTOs/api-responses/pokemon.api-response"
import { PokemonStatSpreadApiResponse } from "../../pokemon/DTOs/api-responses/pokemon-stat-spread.api-response"
import { NameFormatHelper } from "../../../pokedex/shared/helpers/name-format.helper"


const STAT_LABELS: { readonly key: keyof PokemonStatSpreadApiResponse, readonly label: string }[] = [
    { key: "hp", label: "HP" },
    { key: "attack", label: "Atk" },
    { key: "defense", label: "Def" },
    { key: "specialAttack", label: "SpA" },
    { key: "specialDefense", label: "SpD" },
    { key: "speed", label: "Spe" },
]

function formatSpeciesName(speciesName: string): string {
    return speciesName
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-")
}

function formatStatLine(prefix: string, stats: PokemonStatSpreadApiResponse, isDefault: (value: number) => boolean): string | null {

    const parts = STAT_LABELS
        .filter(stat => !isDefault(stats[stat.key]))
        .map(stat => `${stats[stat.key]} ${stat.label}`)

    return parts.length > 0 ? `${prefix}: ${parts.join(" / ")}` : null
}

function buildEntry(pokemon: PokemonApiResponse): string {

    const lines: string[] = []

    lines.push(pokemon.heldItem
        ? `${formatSpeciesName(pokemon.speciesName)} @ ${NameFormatHelper.prettify(pokemon.heldItem)}`
        : formatSpeciesName(pokemon.speciesName))

    if (pokemon.ability) lines.push(`Ability: ${NameFormatHelper.prettify(pokemon.ability)}`)
    if (pokemon.level !== 100) lines.push(`Level: ${pokemon.level}`)
    if (pokemon.isShiny) lines.push("Shiny: Yes")

    const evLine = formatStatLine("EVs", pokemon.evs, value => value === 0)
    if (evLine) lines.push(evLine)

    lines.push(`${NameFormatHelper.prettify(pokemon.nature)} Nature`)

    const ivLine = formatStatLine("IVs", pokemon.ivs, value => value === 31)
    if (ivLine) lines.push(ivLine)

    pokemon.moves
        .filter((move): move is string => !!move)
        .forEach(move => lines.push(`- ${NameFormatHelper.prettify(move)}`))

    return lines.join("\n")
}


interface _PokepasteHelper {
    readonly buildPokepaste: (pokemonList: PokemonApiResponse[]) => string
}

export const PokepasteHelper: _PokepasteHelper = Object.freeze({
    buildPokepaste: (pokemonList: PokemonApiResponse[]) => pokemonList.map(buildEntry).join("\n\n"),
})
