"use client"

import { useMemo } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded"

import { PokepasteHelper } from "@/src/domains/pokemon-management/team/helpers/pokepaste.helper"
import { useToast } from "@/src/global/contexts/toast.context"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { usePokepasteDialogStore } from "./pokepaste.dialog.component.store"


export function PokepasteDialogComponent() {

    const toast = useToast()

    const open = usePokepasteDialogStore(state => state.open)
    const pokemonList = usePokepasteDialogStore(state => state.pokemonList)
    const closeDialog = usePokepasteDialogStore(state => state.closeDialog)

    const pokepasteText = useMemo(() => PokepasteHelper.buildPokepaste(pokemonList), [pokemonList])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pokepasteText)
            toast.show("Copied to clipboard", "success")
        } catch {
            toast.show("Failed to copy — select and copy the text manually", "error")
        }
    }

    return (
        <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                Share as Pokepaste
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    Paste this into Pokemon Showdown&apos;s team import or pokepast.es
                </Typography>
            </DialogTitle>

            <DialogContent>
                <TextField
                    value={pokepasteText}
                    multiline
                    fullWidth
                    minRows={10}
                    maxRows={20}
                    variant="filled"
                    slotProps={{ htmlInput: { readOnly: true, sx: { fontFamily: "monospace", fontSize: 13 } } }}
                    onFocus={(event) => event.target.select()}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={closeDialog} color="inherit" sx={{ opacity: 0.8 }}>
                    Close
                </Button>

                <Button
                    variant="contained"
                    disableElevation
                    startIcon={<ContentCopyRoundedIcon />}
                    onClick={handleCopy}
                >
                    Copy to Clipboard
                </Button>
            </DialogActions>
        </Dialog>
    )
}
