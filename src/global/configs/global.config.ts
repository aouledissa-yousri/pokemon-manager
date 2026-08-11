import { Poppins } from "next/font/google"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "600", "700"],
})

export const GlobalConfig = Object.freeze({
    appName: "Pokemon Manager",
    fontFamily: poppins.style.fontFamily,
    fontClassName: poppins.className,
    fontWeights: {
        thin: 100,
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
    },
    statColors: {
        calculated: "#22C55E",
        calculatedGlow: "0 0 12px rgba(34, 197, 94, 0.45)",
    },
})
