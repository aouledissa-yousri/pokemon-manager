import { Box, Typography } from "@mui/material"

import { SpaceDisplayHelper } from "@/src/domains/trainer-management/space/helpers/space-display.helper"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TeamPokemonTileComponent } from "./components/team-pokemon-tile/team-pokemon-tile.component"
import { TeamPokemonPickerComponentProps } from "./team-pokemon-picker.component.props"


export function TeamPokemonPickerComponent(props: TeamPokemonPickerComponentProps) {

    const isFull = props.selectedIds.length >= props.maxTeamSize

    return (
        <GlassCardComponent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>

            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                }}
            >
                Select Your Team · {props.selectedIds.length} / {props.maxTeamSize}
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 1.5 }}>
                {props.entries.map(({ pokemon, space }) => {

                    const isSelected = props.selectedIds.includes(pokemon.id)

                    return (
                        <TeamPokemonTileComponent
                            key={pokemon.id}
                            pokemon={pokemon}
                            spaceName={SpaceDisplayHelper.getDisplayName(space)}
                            isSelected={isSelected}
                            isDisabled={!isSelected && isFull}
                            onToggle={() => props.onToggle(pokemon.id)}
                        />
                    )
                })}
            </Box>
        </GlassCardComponent>
    )
}
