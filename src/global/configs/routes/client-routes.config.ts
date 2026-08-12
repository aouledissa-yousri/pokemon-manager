export const ClientRoutesConfig = Object.freeze({
    HOME: "/",
    TRAINERS: "/trainers",
    TRAINER_DETAIL: (trainerId: number) => `/trainers/${trainerId}`,
    TRAINER_TEAM: (trainerId: number) => `/trainers/${trainerId}/team`,
})
