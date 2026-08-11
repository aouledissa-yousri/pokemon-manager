"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { Alert, Snackbar } from "@mui/material"


export type ToastSeverity = "success" | "error" | "warning" | "info"

interface ToastContextValue {
    readonly show: (message: string, severity: ToastSeverity) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)


export function ToastProvider({ children }: { readonly children: React.ReactNode }) {

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState<ToastSeverity>("info")

    const show = useCallback((newMessage: string, newSeverity: ToastSeverity) => {
        setMessage(newMessage)
        setSeverity(newSeverity)
        setOpen(true)
    }, [])

    const contextValue = useMemo(() => ({ show }), [show])

    return (
        <ToastContext.Provider value={contextValue}>

            {children}

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={severity}
                    variant="filled"
                    onClose={() => setOpen(false)}
                    sx={{ borderRadius: "10px", fontWeight: 500 }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    )
}


export function useToast(): ToastContextValue {

    const context = useContext(ToastContext)

    if (!context) throw new Error("useToast must be used within a ToastProvider")

    return context
}
