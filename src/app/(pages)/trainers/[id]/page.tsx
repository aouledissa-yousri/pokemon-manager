"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Box, Button, Container, Skeleton } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import CatchingPokemonRoundedIcon from "@mui/icons-material/CatchingPokemonRounded"
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { trainerProxy } from "@/src/domains/trainer-management/trainer/proxies/trainer.proxy"
import { TrainerApiResponse } from "@/src/domains/trainer-management/trainer/DTOs/api-responses/trainer.api-response"
import { spaceProxy } from "@/src/domains/trainer-management/space/proxies/space.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { SpaceApiResponse } from "@/src/domains/trainer-management/space/DTOs/api-responses/space.api-response"
import { SpaceDisplayHelper } from "@/src/domains/trainer-management/space/helpers/space-display.helper"
import { pokemonProxy } from "@/src/domains/pokemon-management/pokemon/proxies/pokemon.proxy"
import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"
import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { PageHeaderComponent } from "@/src/domains/shared/components/page-header/page-header.component"
import { EmptyStateComponent } from "@/src/domains/shared/components/empty-state/empty-state.component"
import { ConfirmDialogComponent } from "@/src/domains/shared/components/confirm-dialog/confirm.dialog.component"
import { SortableItemComponent } from "@/src/domains/shared/components/sortable-item/sortable-item.component"
import { useToast } from "@/src/global/contexts/toast.context"
import { ClientRoutesConfig } from "@/src/global/configs/routes/client-routes.config"
import { SpaceSectionComponent } from "./components/space-section/space-section.component"
import { AddSpaceDialogComponent } from "./components/add-space-dialog/add-space.dialog.component"
import { useAddSpaceDialogStore } from "./components/add-space-dialog/add-space.dialog.component.store"
import { EditSpaceDialogComponent } from "./components/edit-space-dialog/edit-space.dialog.component"
import { useEditSpaceDialogStore } from "./components/edit-space-dialog/edit-space.dialog.component.store"
import { AddPokemonDialogComponent } from "./components/add-pokemon-dialog/add-pokemon.dialog.component"
import { useAddPokemonDialogStore } from "./components/add-pokemon-dialog/add-pokemon.dialog.component.store"
import { EditPokemonDialogComponent } from "./components/edit-pokemon-dialog/edit-pokemon.dialog.component"
import { useEditPokemonDialogStore } from "./components/edit-pokemon-dialog/edit-pokemon.dialog.component.store"
import { CopyPokemonDialogComponent } from "./components/copy-pokemon-dialog/copy-pokemon.dialog.component"
import { useCopyPokemonDialogStore } from "./components/copy-pokemon-dialog/copy-pokemon.dialog.component.store"


export default function TrainerDetailPage() {

    const params = useParams<{ id: string }>()
    const trainerId = Number.parseInt(params.id, 10)

    const router = useRouter()
    const toast = useToast()

    const [trainer, setTrainer] = useState<TrainerApiResponse | null>(null)
    const [spaceToRemove, setSpaceToRemove] = useState<SpaceApiResponse | null>(null)
    const [pokemonToRemove, setPokemonToRemove] = useState<PokemonApiResponse | null>(null)

    const spaces = useSpaceStore(state => state.spaces)
    const isLoading = useSpaceStore(state => state.isLoading)

    const setSpaces = useSpaceStore(state => state.setSpaces)
    const setError = useSpaceStore(state => state.setError)
    const upsertPokemon = useSpaceStore(state => state.upsertPokemon)
    const removePokemonFromStore = useSpaceStore(state => state.removePokemon)
    const removeSpaceFromStore = useSpaceStore(state => state.removeSpace)
    const reorderSpacesInStore = useSpaceStore(state => state.reorderSpaces)
    const clearStore = useSpaceStore(state => state.clearStore)

    const pokemonCount = spaces.reduce((sum, space) => sum + space.pokemon.length, 0)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

    const fetchSpaces = useCallback(async () => {

        try {
            const [trainerResponse, spacesResponse] = await Promise.all([
                trainerProxy.findUniqueTrainer(trainerId),
                spaceProxy.findSpaces(trainerId),
            ])

            if (!trainerResponse.success || !trainerResponse.data) {
                toast.show(trainerResponse.message, "error")
                router.replace(ClientRoutesConfig.TRAINERS)
                return
            }

            setTrainer(trainerResponse.data)

            if (spacesResponse.success && spacesResponse.data) {
                setSpaces(trainerId, spacesResponse.data)
            } else {
                setError(spacesResponse.message)
                toast.show(spacesResponse.message, "error")
            }
        } catch {
            const message = "Failed to load the roster"
            setError(message)
            toast.show(message, "error")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainerId])

    useEffect(() => {

        if (Number.isNaN(trainerId)) {
            router.replace(ClientRoutesConfig.TRAINERS)
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect -- state updates happen after await, not synchronously
        fetchSpaces()
        return () => clearStore()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchSpaces])

    const handleToggleShiny = async (pokemon: PokemonApiResponse) => {

        const response = await pokemonProxy.editPokemon({ pokemonId: pokemon.id, isShiny: !pokemon.isShiny })

        if (response.success && response.data) upsertPokemon(response.data)
        else toast.show(response.message, "error")
    }

    const handleRemovePokemon = async () => {

        if (!pokemonToRemove) return

        const response = await pokemonProxy.removePokemon(pokemonToRemove.id)

        if (response.success) {
            toast.show("Pokemon released", "success")
            removePokemonFromStore(pokemonToRemove.id)
        } else {
            toast.show(response.message, "error")
        }

        setPokemonToRemove(null)
    }

    const handleRemoveSpace = async () => {

        if (!spaceToRemove) return

        const response = await spaceProxy.removeSpace(spaceToRemove.id)

        if (response.success) {
            toast.show("Space removed", "success")
            removeSpaceFromStore(spaceToRemove.id)
        } else {
            toast.show(response.message, "error")
        }

        setSpaceToRemove(null)
    }

    const handleSpaceDragEnd = async (event: DragEndEvent) => {

        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = spaces.findIndex(space => space.id === active.id)
        const newIndex = spaces.findIndex(space => space.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reordered = arrayMove(spaces, oldIndex, newIndex)
        const orderedIds = reordered.map(space => space.id)

        reorderSpacesInStore(orderedIds)

        const response = await spaceProxy.reorderSpaces(trainerId, orderedIds)
        if (!response.success) {
            toast.show(response.message, "error")
            fetchSpaces()
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>

            <PageHeaderComponent
                label="Trainer Roster"
                title={trainer?.name ?? "…"}
                subtitle={`${spaces.length} ${spaces.length === 1 ? "space" : "spaces"} · ${pokemonCount} Pokemon`}
                backAction={
                    <Button
                        startIcon={<ArrowBackRoundedIcon />}
                        color="inherit"
                        onClick={() => router.push(ClientRoutesConfig.TRAINERS)}
                        sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                    >
                        All Trainers
                    </Button>
                }
                action={
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<AddRoundedIcon />}
                        onClick={() => useAddSpaceDialogStore.getState().openDialog(trainerId)}
                    >
                        Add Space
                    </Button>
                }
            />

            {isLoading &&
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {[0, 1].map(index => (
                        <Skeleton key={index} variant="rounded" height={300} sx={{ borderRadius: "16px" }} />
                    ))}
                </Box>
            }

            {!isLoading && spaces.length === 0 &&
                <EmptyStateComponent
                    icon={<CatchingPokemonRoundedIcon />}
                    title="No spaces yet"
                    subtitle="Create a space for a Pokemon, then add it and whichever of its forms you want — as many spaces as you like."
                    action={
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={<AddRoundedIcon />}
                            onClick={() => useAddSpaceDialogStore.getState().openDialog(trainerId)}
                        >
                            Add Space
                        </Button>
                    }
                />
            }

            {!isLoading && spaces.length > 0 &&
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSpaceDragEnd}>
                    <SortableContext items={spaces.map(space => space.id)} strategy={verticalListSortingStrategy}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {spaces.map(space => (
                                <SortableItemComponent key={space.id} id={space.id}>
                                    <SpaceSectionComponent
                                        space={space}
                                        onAddPokemon={() => useAddPokemonDialogStore.getState().openDialog(space.id)}
                                        onEditSpace={() => useEditSpaceDialogStore.getState().openDialog(space)}
                                        onRemoveSpace={() => setSpaceToRemove(space)}
                                        onEditPokemon={(pokemon) => useEditPokemonDialogStore.getState().openDialog(pokemon)}
                                        onCopyPokemon={(pokemon) => useCopyPokemonDialogStore.getState().openDialog(pokemon)}
                                        onRemovePokemon={(pokemon) => setPokemonToRemove(pokemon)}
                                        onToggleShiny={handleToggleShiny}
                                    />
                                </SortableItemComponent>
                            ))}
                        </Box>
                    </SortableContext>
                </DndContext>
            }

            {/* Dialogs — mounted once, self-contained via Zustand stores */}
            <AddSpaceDialogComponent />
            <EditSpaceDialogComponent />
            <AddPokemonDialogComponent />
            <EditPokemonDialogComponent />
            <CopyPokemonDialogComponent />

            <ConfirmDialogComponent
                open={!!spaceToRemove}
                title="Remove space"
                message={`Remove ${spaceToRemove ? SpaceDisplayHelper.getDisplayName(spaceToRemove) : "this space"} and all ${spaceToRemove?.pokemon.length ?? 0} of its forms? This cannot be undone.`}
                confirmText="Remove"
                isDestructive
                onConfirm={handleRemoveSpace}
                onClose={() => setSpaceToRemove(null)}
            />

            <ConfirmDialogComponent
                open={!!pokemonToRemove}
                title="Release Pokemon"
                message={`Release ${pokemonToRemove ? NameFormatHelper.prettify(pokemonToRemove.speciesName) : "this Pokemon"}? Its build, IVs and EVs will be lost.`}
                confirmText="Release"
                isDestructive
                onConfirm={handleRemovePokemon}
                onClose={() => setPokemonToRemove(null)}
            />
        </Container>
    )
}
