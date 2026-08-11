import { redirect } from "next/navigation"

import { ClientRoutesConfig } from "@/src/global/configs/routes/client-routes.config"


export default function RootPage() {
    redirect(ClientRoutesConfig.TRAINERS)
}
