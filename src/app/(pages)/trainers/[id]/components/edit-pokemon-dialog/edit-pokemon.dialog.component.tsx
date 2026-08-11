"use client"

import { useEffect, useState } from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { pokemonProxy } from "@/src/domains/pokemon-management/pokemon/proxies/pokemon.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { PokemonDefaultsConfig } from "@/src/domains/pokemon-management/pokemon/configs/pokemon-defaults.config"
import { StatLabelsConfig } from "@/src/domains/pokemon-management/pokemon/configs/stat-labels.config"
import { StatEnum } from "@/src/domains/pokemon-management/pokemon/enums/stat.enum"
import { EditPokemonValidationSchema, EditPokemonValidationSchemaElements, EditPokemonValidationSchemaInput } from "@/src/domains/pokemon-management/pokemon/validation-schemas/edit-pokemon.validation-schema"
import { DEFAULT_IV_SPREAD } from "@/src/domains/pokemon-management/pokemon/validation-schemas/iv-spread.validation-schema"
import { DEFAULT_EV_SPREAD } from "@/src/domains/pokemon-management/pokemon/validation-schemas/ev-spread.validation-schema"
import { NatureEnum } from "@/src/domains/pokedex/nature/enums/nature.enum"
import { NatureModifiersConfig } from "@/src/domains/pokedex/nature/configs/nature-modifiers.config"
import { useSpeciesStore } from "@/src/domains/pokedex/species/store/species.store"
import { SpeciesDetailApiResponse } from "@/src/domains/pokedex/species/DTOs/api-responses/species-detail.api-response"
import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { AbilityAutocompleteComponent } from "@/src/domains/pokedex/shared/components/ability-autocomplete/ability-autocomplete.component"
import { ItemAutocompleteComponent } from "@/src/domains/pokedex/shared/components/item-autocomplete/item-autocomplete.component"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PokemonArtworkComponent } from "./components/pokemon-artwork/pokemon-artwork.component"
import { MovesetEditorComponent } from "./components/moveset-editor/moveset-editor.component"
import { PokemonStatPanelComponent } from "./components/pokemon-stat-panel/pokemon-stat-panel.component"
import { TypeDefensesPanelComponent } from "./components/type-defenses-panel/type-defenses-panel.component"
import { useEditPokemonDialogStore } from "./edit-pokemon.dialog.component.store"


function buildNatureHint(nature: NatureEnum): string {

    const modifier = NatureModifiersConfig[nature]
    if (!modifier.increased || !modifier.decreased) return "neutral"

    return `+${StatLabelsConfig[modifier.increased].shortLabel} / −${StatLabelsConfig[modifier.decreased].shortLabel}`
}


export function EditPokemonDialogComponent() {

    const toast = useToast()

    const open = useEditPokemonDialogStore(state => state.open)
    const pokemon = useEditPokemonDialogStore(state => state.pokemon)
    const closeDialog = useEditPokemonDialogStore(state => state.closeDialog)

    const upsertPokemon = useSpaceStore(state => state.upsertPokemon)
    const loadSpeciesDetail = useSpeciesStore(state => state.loadSpeciesDetail)
    const speciesDetails = useSpeciesStore(state => state.speciesDetails)

    const detail: SpeciesDetailApiResponse | null = pokemon ? speciesDetails[pokemon.speciesId] ?? null : null

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { control, formState, handleSubmit, reset, setValue } = useForm<EditPokemonValidationSchemaInput, unknown, EditPokemonValidationSchemaElements>({
        resolver: zodResolver(EditPokemonValidationSchema),
        defaultValues: EditPokemonValidationSchema.parse({}),
        mode: "onChange",
    })

    useEffect(() => {

        if (!open || !pokemon) return

        loadSpeciesDetail(pokemon.speciesId)

        reset({
            level: pokemon.level,
            nature: pokemon.nature,
            ability: pokemon.ability,
            heldItem: pokemon.heldItem,
            isShiny: pokemon.isShiny,
            moves: [...pokemon.moves] as [string | null, string | null, string | null, string | null],
            ivs: { ...pokemon.ivs },
            evs: { ...pokemon.evs },
        })
    }, [open, pokemon, reset, loadSpeciesDetail])

    const watchedLevel = useWatch({ control, name: "level" }) ?? PokemonDefaultsConfig.DEFAULT_LEVEL
    const watchedNature = useWatch({ control, name: "nature" }) ?? NatureEnum.HARDY
    const watchedIsShiny = useWatch({ control, name: "isShiny" }) ?? false
    const rawMoves = useWatch({ control, name: "moves" }) ?? []
    const rawIvs = useWatch({ control, name: "ivs" })
    const rawEvs = useWatch({ control, name: "evs" })

    const watchedMoves: [string | null, string | null, string | null, string | null] = [
        rawMoves[0] ?? null, rawMoves[1] ?? null, rawMoves[2] ?? null, rawMoves[3] ?? null,
    ]
    const watchedIvs = { ...DEFAULT_IV_SPREAD, ...rawIvs }
    const watchedEvs = { ...DEFAULT_EV_SPREAD, ...rawEvs }

    const handleIvChange = (stat: StatEnum, value: number) => {

        const clamped = Math.max(
            PokemonDefaultsConfig.MIN_IV,
            Math.min(PokemonDefaultsConfig.MAX_IV, Math.trunc(value) || 0),
        )
        setValue("ivs", { ...watchedIvs, [stat]: clamped }, { shouldValidate: true, shouldDirty: true })
    }

    const handleEvChange = (stat: StatEnum, value: number) => {

        const clamped = Math.max(
            PokemonDefaultsConfig.MIN_EV,
            Math.min(PokemonDefaultsConfig.MAX_EV, Math.trunc(value) || 0),
        )
        setValue("evs", { ...watchedEvs, [stat]: clamped }, { shouldValidate: true, shouldDirty: true })
    }

    const handleMoveChange = (slotIndex: number, move: string | null) => {

        const nextMoves = [...watchedMoves] as [string | null, string | null, string | null, string | null]
        nextMoves[slotIndex] = move
        setValue("moves", nextMoves, { shouldValidate: true, shouldDirty: true })
    }

    const onSubmit = async (values: EditPokemonValidationSchemaElements) => {

        if (!pokemon) return

        setIsSubmitting(true)

        try {
            const response = await pokemonProxy.editPokemon({ pokemonId: pokemon.id, ...values })

            if (response.success && response.data) {
                toast.show("Pokemon updated", "success")
                upsertPokemon(response.data)
                closeDialog()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to update Pokemon", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="lg" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20, pb: 1 }}>
                Edit Pokemon
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    Build, moveset, IVs & EVs — stats update live
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 1 }}>
                    <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: { md: 360 }, flexShrink: 0 }}>

                            <PokemonArtworkComponent
                                speciesName={pokemon?.speciesName ?? ""}
                                artworkUrl={detail?.artworkUrl ?? null}
                                shinyArtworkUrl={detail?.shinyArtworkUrl ?? null}
                                isShiny={watchedIsShiny}
                                types={detail?.types ?? []}
                                onToggleShiny={(isShiny) => setValue("isShiny", isShiny, { shouldValidate: true, shouldDirty: true })}
                            />

                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 1.5 }}>

                                <Controller
                                    name="level"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            onChange={(event) => field.onChange(Number(event.target.value))}
                                            type="number"
                                            label="Level"
                                            variant="filled"
                                            slotProps={{
                                                htmlInput: {
                                                    min: PokemonDefaultsConfig.MIN_LEVEL,
                                                    max: PokemonDefaultsConfig.MAX_LEVEL,
                                                },
                                            }}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="nature"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Nature"
                                            variant="filled"
                                        >
                                            {Object.values(NatureEnum).map(nature => (
                                                <MenuItem key={nature} value={nature}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 1 }}>
                                                        <span>{NameFormatHelper.prettify(nature)}</span>
                                                        <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                                                            {buildNatureHint(nature)}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>

                            <Controller
                                name="ability"
                                control={control}
                                render={({ field }) => (
                                    <AbilityAutocompleteComponent
                                        value={field.value || null}
                                        onChange={(ability) => field.onChange(ability ?? "")}
                                    />
                                )}
                            />

                            <Controller
                                name="heldItem"
                                control={control}
                                render={({ field }) => (
                                    <ItemAutocompleteComponent
                                        value={field.value || null}
                                        onChange={(item) => field.onChange(item ?? "")}
                                    />
                                )}
                            />

                            <MovesetEditorComponent
                                moves={watchedMoves}
                                onChangeSlot={handleMoveChange}
                            />
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <PokemonStatPanelComponent
                                baseStats={detail?.baseStats ?? null}
                                ivs={watchedIvs}
                                evs={watchedEvs}
                                level={watchedLevel}
                                nature={watchedNature}
                                onIvChange={handleIvChange}
                                onEvChange={handleEvChange}
                            />

                            <TypeDefensesPanelComponent types={detail?.types ?? null} />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={closeDialog} color="inherit" sx={{ opacity: 0.8 }}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={!formState.isValid || isSubmitting}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
