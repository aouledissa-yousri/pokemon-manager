"use client"

import { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material"

import { pokemonProxy } from "@/src/domains/pokemon-management/pokemon/proxies/pokemon.proxy"
import { trainerProxy } from "@/src/domains/trainer-management/trainer/proxies/trainer.proxy"
import { useTrainerStore } from "@/src/domains/trainer-management/trainer/store/trainer.store"
import { spaceProxy } from "@/src/domains/trainer-management/space/proxies/space.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { SpaceApiResponse } from "@/src/domains/trainer-management/space/DTOs/api-responses/space.api-response"
import { SpaceDisplayHelper } from "@/src/domains/trainer-management/space/helpers/space-display.helper"
import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { useCopyPokemonDialogStore } from "./copy-pokemon.dialog.component.store"


const NEW_SPACE_VALUE = "new"


export function CopyPokemonDialogComponent() {

    const toast = useToast()

    const open = useCopyPokemonDialogStore(state => state.open)
    const pokemon = useCopyPokemonDialogStore(state => state.pokemon)
    const closeDialog = useCopyPokemonDialogStore(state => state.closeDialog)

    const trainers = useTrainerStore(state => state.trainers)
    const setTrainers = useTrainerStore(state => state.setTrainers)

    const currentTrainerId = useSpaceStore(state => state.trainerId)
    const setSpaces = useSpaceStore(state => state.setSpaces)

    const [targetTrainerId, setTargetTrainerId] = useState<number | "">("")
    const [targetSpaceValue, setTargetSpaceValue] = useState<string>(NEW_SPACE_VALUE)
    const [targetSpaces, setTargetSpaces] = useState<SpaceApiResponse[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {

        if (!open) return

        if (trainers.length === 0) {
            trainerProxy.findTrainers().then(response => {
                if (response.success && response.data) setTrainers(response.data)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleClose = () => {
        setTargetTrainerId("")
        setTargetSpaceValue(NEW_SPACE_VALUE)
        setTargetSpaces([])
        closeDialog()
    }

    const handleTrainerChange = async (newTrainerId: number) => {

        setTargetTrainerId(newTrainerId)
        setTargetSpaceValue(NEW_SPACE_VALUE)
        setTargetSpaces([])

        const response = await spaceProxy.findSpaces(newTrainerId)
        if (response.success && response.data) setTargetSpaces(response.data)
    }

    const handleCopy = async () => {

        if (!pokemon || targetTrainerId === "") return

        setIsSubmitting(true)

        try {
            const response = await pokemonProxy.copyPokemon({
                pokemonId: pokemon.id,
                targetTrainerId,
                targetSpaceId: targetSpaceValue === NEW_SPACE_VALUE ? undefined : Number(targetSpaceValue),
            })

            if (response.success && response.data) {
                toast.show(response.message, "success")

                if (targetTrainerId === currentTrainerId) {
                    const spacesResponse = await spaceProxy.findSpaces(targetTrainerId)
                    if (spacesResponse.success && spacesResponse.data) setSpaces(targetTrainerId, spacesResponse.data)
                }

                handleClose()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to copy Pokemon", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                Copy Pokemon
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    Copy {pokemon ? NameFormatHelper.prettify(pokemon.speciesName) : "this Pokemon"} — with its
                    full build, IVs and EVs — to another trainer&apos;s roster.
                </Typography>

                <TextField
                    select
                    label="Target trainer"
                    variant="filled"
                    fullWidth
                    value={targetTrainerId}
                    onChange={(event) => handleTrainerChange(Number(event.target.value))}
                >
                    {trainers.map(trainer => (
                        <MenuItem key={trainer.id} value={trainer.id}>
                            {trainer.name}
                            {trainer.id === currentTrainerId && " (this trainer)"}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Target space"
                    variant="filled"
                    fullWidth
                    disabled={targetTrainerId === ""}
                    value={targetSpaceValue}
                    onChange={(event) => setTargetSpaceValue(event.target.value)}
                >
                    <MenuItem value={NEW_SPACE_VALUE}>New space (created automatically)</MenuItem>

                    {targetSpaces.map(space => (
                        <MenuItem key={space.id} value={`${space.id}`}>
                            {SpaceDisplayHelper.getDisplayName(space)}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={handleClose} color="inherit" sx={{ opacity: 0.8 }}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    disableElevation
                    disabled={targetTrainerId === "" || isSubmitting}
                    onClick={handleCopy}
                >
                    Copy
                </Button>
            </DialogActions>
        </Dialog>
    )
}
