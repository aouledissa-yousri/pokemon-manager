import { Box, Typography } from "@mui/material"

import { GlobalConfig } from "@/src/global/configs/global.config"
import { PokemonRosterCardComponent } from "../../../components/pokemon-roster-card/pokemon-roster-card.component"
import { TeamRosterComponentProps } from "./team-roster.component.props"


export function TeamRosterComponent(props: TeamRosterComponentProps) {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                    }}
                >
                    Your Roster
                </Typography>

                {props.action}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2.5 }}>
                {props.pokemonList.map(pokemon => (
                    <PokemonRosterCardComponent
                        key={pokemon.id}
                        pokemon={pokemon}
                        onToggleShiny={() => props.onToggleShiny(pokemon)}
                    />
                ))}
            </Box>
        </Box>
    )
}
