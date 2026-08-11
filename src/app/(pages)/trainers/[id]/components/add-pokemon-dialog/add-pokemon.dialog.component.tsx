"use client"

import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { pokemonProxy } from "@/src/domains/pokemon-management/pokemon/proxies/pokemon.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { PokemonDefaultsConfig } from "@/src/domains/pokemon-management/pokemon/configs/pokemon-defaults.config"
import { AddPokemonFormValidationSchema, AddPokemonFormValidationSchemaElements, AddPokemonFormValidationSchemaInput } from "@/src/domains/pokemon-management/pokemon/validation-schemas/add-pokemon-form.validation-schema"
import { SpeciesAutocompleteComponent } from "@/src/domains/pokedex/shared/components/species-autocomplete/species-autocomplete.component"
import { SpeciesSummaryApiResponse } from "@/src/domains/pokedex/species/DTOs/api-responses/species-summary.api-response"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { useAddPokemonDialogStore } from "./add-pokemon.dialog.component.store"


export function AddPokemonDialogComponent() {

    const toast = useToast()

    const open = useAddPokemonDialogStore(state => state.open)
    const spaceId = useAddPokemonDialogStore(state => state.spaceId)
    const closeDialog = useAddPokemonDialogStore(state => state.closeDialog)

    const upsertPokemon = useSpaceStore(state => state.upsertPokemon)

    const [species, setSpecies] = useState<SpeciesSummaryApiResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { control, formState, handleSubmit, reset } = useForm<AddPokemonFormValidationSchemaInput, unknown, AddPokemonFormValidationSchemaElements>({
        resolver: zodResolver(AddPokemonFormValidationSchema),
        defaultValues: AddPokemonFormValidationSchema.parse({}),
        mode: "onChange",
    })

    const handleClose = () => {
        reset(AddPokemonFormValidationSchema.parse({}))
        setSpecies(null)
        closeDialog()
    }

    const onSubmit = async (values: AddPokemonFormValidationSchemaElements) => {

        if (!species || spaceId === null) return

        setIsSubmitting(true)

        try {
            const response = await pokemonProxy.addPokemon({
                spaceId,
                speciesId: species.id,
                speciesName: species.name,
                level: values.level,
            })

            if (response.success && response.data) {
                toast.show("Pokemon added to the space", "success")
                upsertPokemon(response.data)
                handleClose()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to add Pokemon", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                Add Pokemon
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                    <SpeciesAutocompleteComponent
                        value={species}
                        onChange={setSpecies}
                        autoFocus
                    />

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
                                fullWidth
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
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ opacity: 0.8 }}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={!species || !formState.isValid || isSubmitting}
                    >
                        Add Pokemon
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
