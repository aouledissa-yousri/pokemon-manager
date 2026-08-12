"use client"

import { Box, Button, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded"
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { SpaceDisplayHelper } from "@/src/domains/trainer-management/space/helpers/space-display.helper"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { SortableItemComponent } from "@/src/domains/shared/components/sortable-item/sortable-item.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PokemonRosterCardComponent } from "../pokemon-roster-card/pokemon-roster-card.component"
import { SpaceSectionComponentProps } from "./space-section.component.props"


export function SpaceSectionComponent(props: SpaceSectionComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <GlassCardComponent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>

                <Box sx={{ flex: 1, minWidth: 200 }}>

                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: themeConfig.accentColor,
                        }}
                    >
                        Space · {props.space.pokemon.length} {props.space.pokemon.length === 1 ? "form" : "forms"}
                        {props.space.childSpaces.length > 0 &&
                            ` · ${props.space.childSpaces.length} nested`
                        }
                    </Typography>

                    <Typography sx={{ fontSize: 20, fontWeight: GlobalConfig.fontWeights.bold, lineHeight: 1.3 }}>
                        {SpaceDisplayHelper.getDisplayName(props.space)}
                    </Typography>

                    {props.space.metLocation &&
                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "text.secondary",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.25,
                            }}
                        >
                            <PlaceRoundedIcon sx={{ fontSize: 14 }} />
                            Met at {props.space.metLocation}
                        </Typography>
                    }
                </Box>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => props.onAddPokemon(props.space)}
                    >
                        Add Pokemon
                    </Button>

                    <Tooltip title="Add a nested space">
                        <IconButton
                            size="small"
                            onClick={() => props.onAddChildSpace(props.space)}
                            sx={{ color: "text.secondary", "&:hover": { color: themeConfig.accentColor } }}
                        >
                            <CreateNewFolderRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit space (name & met location)">
                        <IconButton
                            size="small"
                            onClick={() => props.onEditSpace(props.space)}
                            sx={{ color: "text.secondary", "&:hover": { color: themeConfig.accentColor } }}
                        >
                            <EditRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove space and all its forms">
                        <IconButton
                            size="small"
                            onClick={() => props.onRemoveSpace(props.space)}
                            sx={{ color: "text.secondary", "&:hover": { color: theme.palette.error.main } }}
                        >
                            <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {props.space.pokemon.length === 0 && props.space.childSpaces.length === 0 &&
                <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", py: 3 }}>
                    Nothing here yet — add the Pokemon this space is for, then any of its forms you want.
                </Typography>
            }

            {props.space.pokemon.length > 0 &&
                <SortableContext items={props.space.pokemon.map(pokemon => pokemon.id)} strategy={rectSortingStrategy}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2.5 }}>
                        {props.space.pokemon.map(pokemon => (
                            <SortableItemComponent
                                key={pokemon.id}
                                id={pokemon.id}
                                data={{ type: "pokemon", containerId: props.space.id }}
                            >
                                <PokemonRosterCardComponent
                                    pokemon={pokemon}
                                    onEdit={() => props.onEditPokemon(pokemon)}
                                    onCopy={() => props.onCopyPokemon(pokemon)}
                                    onRemove={() => props.onRemovePokemon(pokemon)}
                                    onToggleShiny={() => props.onToggleShiny(pokemon)}
                                />
                            </SortableItemComponent>
                        ))}
                    </Box>
                </SortableContext>
            }

            {props.space.childSpaces.length > 0 &&
                <SortableContext items={props.space.childSpaces.map(childSpace => childSpace.id)} strategy={verticalListSortingStrategy}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                            pl: 3,
                            borderLeft: `2px solid ${themeConfig.cardBorderColor}`,
                        }}
                    >
                        {props.space.childSpaces.map(childSpace => (
                            <SortableItemComponent
                                key={childSpace.id}
                                id={childSpace.id}
                                data={{ type: "space", containerId: props.space.id }}
                            >
                                <SpaceSectionComponent
                                    space={childSpace}
                                    onAddPokemon={props.onAddPokemon}
                                    onAddChildSpace={props.onAddChildSpace}
                                    onEditSpace={props.onEditSpace}
                                    onRemoveSpace={props.onRemoveSpace}
                                    onEditPokemon={props.onEditPokemon}
                                    onCopyPokemon={props.onCopyPokemon}
                                    onRemovePokemon={props.onRemovePokemon}
                                    onToggleShiny={props.onToggleShiny}
                                />
                            </SortableItemComponent>
                        ))}
                    </Box>
                </SortableContext>
            }
        </GlassCardComponent>
    )
}
