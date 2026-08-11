"use client"

import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { spaceProxy } from "@/src/domains/trainer-management/space/proxies/space.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { SpaceFormValidationSchema, SpaceFormValidationSchemaElements, SpaceFormValidationSchemaInput } from "@/src/domains/trainer-management/space/validation-schemas/space-form.validation-schema"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { useEditSpaceDialogStore } from "./edit-space.dialog.component.store"


export function EditSpaceDialogComponent() {

    const toast = useToast()

    const open = useEditSpaceDialogStore(state => state.open)
    const space = useEditSpaceDialogStore(state => state.space)
    const closeDialog = useEditSpaceDialogStore(state => state.closeDialog)

    const upsertSpace = useSpaceStore(state => state.upsertSpace)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { control, formState, handleSubmit } = useForm<SpaceFormValidationSchemaInput, unknown, SpaceFormValidationSchemaElements>({
        resolver: zodResolver(SpaceFormValidationSchema),
        defaultValues: SpaceFormValidationSchema.parse({}),
        values: space ? { name: space.name, metLocation: space.metLocation } : undefined,
        mode: "onChange",
    })

    const onSubmit = async (values: SpaceFormValidationSchemaElements) => {

        if (!space) return

        setIsSubmitting(true)

        try {
            const response = await spaceProxy.editSpace({ spaceId: space.id, ...values })

            if (response.success && response.data) {
                toast.show("Space updated", "success")
                upsertSpace(response.data)
                closeDialog()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to update space", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                Edit Space
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
