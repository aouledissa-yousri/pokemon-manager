import type { Metadata } from "next"
import { cookies } from "next/headers"

import { ThemeProvider, ThemeMode } from "@/src/global/providers/theme.provider"
import { ToastProvider } from "@/src/global/contexts/toast.context"
import "./globals.css"


export const metadata: Metadata = {
    title: "Pokemon Manager",
    description: "Manage trainers and their Pokemon teams",
}


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const cookieStore = await cookies()
    const initialMode: ThemeMode = cookieStore.get("mode")?.value === "light" ? "light" : "dark"

    return (
        <html lang="en">
            <body>
                <ThemeProvider initialMode={initialMode}>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
