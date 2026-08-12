"use client"

import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { spaceProxy } from "@/src/domains/trainer-management/space/proxies/space.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { SpaceFormValidationSchema, SpaceFormValidationSchemaElements, SpaceFormValidationSchemaInput } from "@/src/domains/trainer-management/space/validation-schemas/space-form.validation-schema"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { useAddSpaceDialogStore } from "./add-space.dialog.component.store"


export function AddSpaceDialogComponent() {

    const toast = useToast()

    const open = useAddSpaceDialogStore(state => state.open)
    const trainerId = useAddSpaceDialogStore(state => state.trainerId)
    const parentSpaceId = useAddSpaceDialogStore(state => state.parentSpaceId)
    const closeDialog = useAddSpaceDialogStore(state => state.closeDialog)

    const upsertSpace = useSpaceStore(state => state.upsertSpace)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { control, formState, handleSubmit, reset } = useForm<SpaceFormValidationSchemaInput, unknown, SpaceFormValidationSchemaElements>({
        resolver: zodResolver(SpaceFormValidationSchema),
        defaultValues: SpaceFormValidationSchema.parse({}),
        mode: "onChange",
    })

    const handleClose = () => {
        reset(SpaceFormValidationSchema.parse({}))
        closeDialog()
    }

    const onSubmit = async (values: SpaceFormValidationSchemaElements) => {

        if (trainerId === null) return

        setIsSubmitting(true)

        try {
            const response = await spaceProxy.addSpace({ trainerId, parentSpaceId, ...values })

            if (response.success && response.data) {
                toast.show("Space added", "success")
                upsertSpace(response.data)
                handleClose()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to add space", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                {parentSpaceId === null ? "Add Space" : "Add Nested Space"}
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    A space holds one Pokemon and whichever of its forms you add
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Space name (optional)"
                                placeholder="e.g. Charizard line"
                                variant="filled"
                                fullWidth
                                autoFocus
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="metLocation"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Met location"
                                placeholder="e.g. Mt. Coronet"
                                variant="filled"
                                fullWidth
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
                        disabled={!formState.isValid || isSubmitting}
                    >
                        Add Space
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
