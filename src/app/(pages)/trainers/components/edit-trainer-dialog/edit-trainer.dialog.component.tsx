"use client"

import { useEffect, useMemo, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { trainerProxy } from "@/src/domains/trainer-management/trainer/proxies/trainer.proxy"
import { useTrainerStore } from "@/src/domains/trainer-management/trainer/store/trainer.store"
import { TrainerFormValidationSchema, TrainerFormValidationSchemaElements, TrainerFormValidationSchemaInput } from "@/src/domains/trainer-management/trainer/validation-schemas/trainer-form.validation-schema"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TrainerImagePickerComponent } from "../trainer-image-picker/trainer-image-picker.component"
import { useEditTrainerDialogStore } from "./edit-trainer.dialog.component.store"


export function EditTrainerDialogComponent() {

    const toast = useToast()

    const open = useEditTrainerDialogStore(state => state.open)
    const trainer = useEditTrainerDialogStore(state => state.trainer)
    const closeDialog = useEditTrainerDialogStore(state => state.closeDialog)

    const setTrainers = useTrainerStore(state => state.setTrainers)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const previewUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : null, [imageFile])

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
    }, [previewUrl])

    const { control, formState, handleSubmit } = useForm<TrainerFormValidationSchemaInput, unknown, TrainerFormValidationSchemaElements>({
        resolver: zodResolver(TrainerFormValidationSchema),
        defaultValues: TrainerFormValidationSchema.parse({}),
        values: trainer ? { name: trainer.name } : undefined,
        mode: "onChange",
    })

    const nameValue = useWatch({ control, name: "name" })

    const handleClose = () => {
        setImageFile(null)
        closeDialog()
    }

    const onSubmit = async (values: TrainerFormValidationSchemaElements) => {

        if (!trainer) return

        setIsSubmitting(true)

        try {
            const response = await trainerProxy.editTrainer({
                trainerId: trainer.id,
                name: values.name,
                imageFile,
            })

            if (response.success) {
                toast.show("Trainer updated", "success")

                const listResponse = await trainerProxy.findTrainers()
                if (listResponse.success && listResponse.data) setTrainers(listResponse.data)

                handleClose()
            } else {
                toast.show(response.message, "error")
            }
        } catch {
            toast.show("Failed to update trainer", "error")
        }

        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                Edit Trainer
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                    <TrainerImagePickerComponent
                        previewUrl={previewUrl ?? trainer?.image ?? null}
                        fallbackLetter={nameValue?.charAt(0) || "?"}
                        onSelect={setImageFile}
                    />

                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Trainer name"
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
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
