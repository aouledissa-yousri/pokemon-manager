"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, Container, Skeleton } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import CatchingPokemonRoundedIcon from "@mui/icons-material/CatchingPokemonRounded"
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable"

import { trainerProxy } from "@/src/domains/trainer-management/trainer/proxies/trainer.proxy"
import { useTrainerStore } from "@/src/domains/trainer-management/trainer/store/trainer.store"
import { TrainerApiResponse } from "@/src/domains/trainer-management/trainer/DTOs/api-responses/trainer.api-response"
import { PageHeaderComponent } from "@/src/domains/shared/components/page-header/page-header.component"
import { EmptyStateComponent } from "@/src/domains/shared/components/empty-state/empty-state.component"
import { ConfirmDialogComponent } from "@/src/domains/shared/components/confirm-dialog/confirm.dialog.component"
import { SortableItemComponent } from "@/src/domains/shared/components/sortable-item/sortable-item.component"
import { useToast } from "@/src/global/contexts/toast.context"
import { ClientRoutesConfig } from "@/src/global/configs/routes/client-routes.config"
import { TrainerCardComponent } from "./components/trainer-card/trainer-card.component"
import { AddTrainerDialogComponent } from "./components/add-trainer-dialog/add-trainer.dialog.component"
import { useAddTrainerDialogStore } from "./components/add-trainer-dialog/add-trainer.dialog.component.store"
import { EditTrainerDialogComponent } from "./components/edit-trainer-dialog/edit-trainer.dialog.component"
import { useEditTrainerDialogStore } from "./components/edit-trainer-dialog/edit-trainer.dialog.component.store"


export default function TrainersPage() {

    const toast = useToast()
    const router = useRouter()

    const trainers = useTrainerStore(state => state.trainers)
    const isLoading = useTrainerStore(state => state.isLoading)

    const setTrainers = useTrainerStore(state => state.setTrainers)
    const reorderTrainersInStore = useTrainerStore(state => state.reorderTrainers)
    const setError = useTrainerStore(state => state.setError)

    const [trainerToRemove, setTrainerToRemove] = useState<TrainerApiResponse | null>(null)

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

    const fetchTrainers = useCallback(async () => {

        try {
            const response = await trainerProxy.findTrainers()

            if (response.success && response.data) {
                setTrainers(response.data)
            } else {
                setError(response.message)
                toast.show(response.message, "error")
            }
        } catch {
            const message = "Failed to load trainers"
            setError(message)
            toast.show(message, "error")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchTrainers()
    }, [fetchTrainers])

    const handleRemoveTrainer = async () => {

        if (!trainerToRemove) return

        const response = await trainerProxy.removeTrainer(trainerToRemove.id)

        if (response.success) {
            toast.show("Trainer removed", "success")
            fetchTrainers()
        } else {
            toast.show(response.message, "error")
        }

        setTrainerToRemove(null)
    }

    const handleDragEnd = async (event: DragEndEvent) => {

        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = trainers.findIndex(trainer => trainer.id === active.id)
        const newIndex = trainers.findIndex(trainer => trainer.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reordered = arrayMove(trainers, oldIndex, newIndex)
        const orderedIds = reordered.map(trainer => trainer.id)

        reorderTrainersInStore(orderedIds)

        const response = await trainerProxy.reorderTrainers(orderedIds)
        if (!response.success) {
            toast.show(response.message, "error")
            fetchTrainers()
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>

            <PageHeaderComponent
                label="Pokemon Manager"
                title="Trainers"
                subtitle="Every trainer and their team, in one place"
                action={
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<AddRoundedIcon />}
                        onClick={() => useAddTrainerDialogStore.getState().openDialog()}
                    >
                        Add Trainer
                    </Button>
                }
            />

            {isLoading &&
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 3 }}>
                    {[0, 1, 2].map(index => (
                        <Skeleton key={index} variant="rounded" height={112} sx={{ borderRadius: "16px" }} />
                    ))}
                </Box>
            }

            {!isLoading && trainers.length === 0 &&
                <EmptyStateComponent
                    icon={<CatchingPokemonRoundedIcon />}
                    title="No trainers yet"
                    subtitle="Add your first trainer to start building Pokemon teams."
                    action={
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={<AddRoundedIcon />}
                            onClick={() => useAddTrainerDialogStore.getState().openDialog()}
                        >
                            Add Trainer
                        </Button>
                    }
                />
            }

            {!isLoading && trainers.length > 0 &&
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={trainers.map(trainer => trainer.id)} strategy={rectSortingStrategy}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 3 }}>
                            {trainers.map(trainer => (
                                <SortableItemComponent key={trainer.id} id={trainer.id}>
                                    <TrainerCardComponent
                                        trainer={trainer}
                                        onOpen={() => router.push(ClientRoutesConfig.TRAINER_DETAIL(trainer.id))}
                                        onEdit={() => useEditTrainerDialogStore.getState().openDialog(trainer)}
                                        onRemove={() => setTrainerToRemove(trainer)}
                                    />
                                </SortableItemComponent>
                            ))}
                        </Box>
                    </SortableContext>
                </DndContext>
            }

            {/* Dialogs — mounted once, self-contained via Zustand stores */}
            <AddTrainerDialogComponent />
            <EditTrainerDialogComponent />

            <ConfirmDialogComponent
                open={!!trainerToRemove}
                title="Remove trainer"
                message={`Remove ${trainerToRemove?.name ?? "this trainer"} and their entire Pokemon roster? This cannot be undone.`}
                confirmText="Remove"
                isDestructive
                onConfirm={handleRemoveTrainer}
                onClose={() => setTrainerToRemove(null)}
            />
        </Container>
    )
}
