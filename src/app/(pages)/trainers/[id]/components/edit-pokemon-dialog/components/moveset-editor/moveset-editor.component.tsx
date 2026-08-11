import { Box, Typography } from "@mui/material"

import { MoveAutocompleteComponent } from "@/src/domains/pokedex/shared/components/move-autocomplete/move-autocomplete.component"
import { PokemonDefaultsConfig } from "@/src/domains/pokemon-management/pokemon/configs/pokemon-defaults.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { MovesetEditorComponentProps } from "./moveset-editor.component.props"


export function MovesetEditorComponent(props: MovesetEditorComponentProps) {

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                }}
            >
                Moveset
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                {Array.from({ length: PokemonDefaultsConfig.MOVE_SLOT_COUNT }, (_, slotIndex) => (
                    <MoveAutocompleteComponent
                        key={slotIndex}
                        value={props.moves[slotIndex] ?? null}
                        onChange={(move) => props.onChangeSlot(slotIndex, move)}
                        label={`Move ${slotIndex + 1}`}
                    />
                ))}
            </Box>
        </Box>
    )
}
