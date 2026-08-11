import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"

import { GlobalConfig } from "@/src/global/configs/global.config"
import { ConfirmDialogComponentProps } from "./confirm.dialog.component.props"


export function ConfirmDialogComponent(props: ConfirmDialogComponentProps) {

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="xs" fullWidth>

            <DialogTitle sx={{ fontWeight: GlobalConfig.fontWeights.bold, fontSize: 20 }}>
                {props.title}
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {props.message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={props.onClose} color="inherit" sx={{ opacity: 0.8 }}>
                    {props.cancelText ?? "Cancel"}
                </Button>

                <Button
                    onClick={props.onConfirm}
                    variant="contained"
                    color={props.isDestructive ? "error" : "primary"}
                    disableElevation
                >
                    {props.confirmText ?? "Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
