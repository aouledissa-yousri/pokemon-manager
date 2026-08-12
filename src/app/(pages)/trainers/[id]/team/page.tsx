"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Box, Button, Container, Skeleton } from "@mui/material"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import CatchingPokemonRoundedIcon from "@mui/icons-material/CatchingPokemonRounded"

import { trainerProxy } from "@/src/domains/trainer-management/trainer/proxies/trainer.proxy"
import { TrainerApiResponse } from "@/src/domains/trainer-management/trainer/DTOs/api-responses/trainer.api-response"
import { spaceProxy } from "@/src/domains/trainer-management/space/proxies/space.proxy"
import { useSpaceStore } from "@/src/domains/trainer-management/space/store/space.store"
import { SpaceTreeHelper } from "@/src/domains/trainer-management/space/helpers/space-tree.helper"
import { pokemonProxy } from "@/src/domains/pokemon-management/pokemon/proxies/pokemon.proxy"
import { PokemonApiResponse } from "@/src/domains/pokemon-management/pokemon/DTOs/api-responses/pokemon.api-response"
import { TeamAnalysisHelper, TeamMemberInput } from "@/src/domains/pokemon-management/team/helpers/team-analysis.helper"
import { TeamConfig } from "@/src/domains/pokemon-management/team/configs/team.config"
import { useSpeciesStore } from "@/src/domains/pokedex/species/store/species.store"
import { useMoveStore } from "@/src/domains/pokedex/move/store/move.store"
import { PageHeaderComponent } from "@/src/domains/shared/components/page-header/page-header.component"
import { EmptyStateComponent } from "@/src/domains/shared/components/empty-state/empty-state.component"
import { useToast } from "@/src/global/contexts/toast.context"
import { ClientRoutesConfig } from "@/src/global/configs/routes/client-routes.config"
import { TeamPokemonPickerComponent } from "./components/team-pokemon-picker/team-pokemon-picker.component"
import { TeamRosterComponent } from "./components/team-roster/team-roster.component"
import { TypeCoveragePanelComponent } from "./components/type-coverage-panel/type-coverage-panel.component"
import { TypeDistributionPanelComponent } from "./components/type-distribution-panel/type-distribution-panel.component"
import { WeaknessesPanelComponent } from "./components/weaknesses-panel/weaknesses-panel.component"
import { MoveDistributionPanelComponent } from "./components/move-distribution-panel/move-distribution-panel.component"


export default function TeamBuilderPage() {

    const params = useParams<{ id: string }>()
    const trainerId = Number.parseInt(params.id, 10)

    const router = useRouter()
    const toast = useToast()

    const [trainer, setTrainer] = useState<TrainerApiResponse | null>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const spaces = useSpaceStore(state => state.spaces)
    const spaceStoreTrainerId = useSpaceStore(state => state.trainerId)
    const isLoading = useSpaceStore(state => state.isLoading)
    const setSpaces = useSpaceStore(state => state.setSpaces)
    const setError = useSpaceStore(state => state.setError)
    const upsertPokemon = useSpaceStore(state => state.upsertPokemon)

    const speciesDetails = useSpeciesStore(state => state.speciesDetails)
    const loadSpeciesDetail = useSpeciesStore(state => state.loadSpeciesDetail)

    const moves = useMoveStore(state => state.moves)
    const loadMoves = useMoveStore(state => state.loadMoves)

    const fetchTrainerAndSpaces = useCallback(async () => {

        try {
            const [trainerResponse, spacesResponse] = await Promise.all([
                trainerProxy.findUniqueTrainer(trainerId),
                spaceProxy.findSpaces(trainerId),
            ])

            if (!trainerResponse.success || !trainerResponse.data) {
                toast.show(trainerResponse.message, "error")
                router.replace(ClientRoutesConfig.TRAINERS)
                return
            }

            setTrainer(trainerResponse.data)

            if (spacesResponse.success && spacesResponse.data) {
                setSpaces(trainerId, spacesResponse.data)
            } else {
                setError(spacesResponse.message)
                toast.show(spacesResponse.message, "error")
            }
        } catch {
            const message = "Failed to load the roster"
            setError(message)
            toast.show(message, "error")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainerId])

    useEffect(() => {

        if (Number.isNaN(trainerId)) {
            router.replace(ClientRoutesConfig.TRAINERS)
            return
        }

        if (spaceStoreTrainerId === trainerId) {
            trainerProxy.findUniqueTrainer(trainerId).then(response => {
                if (response.success && response.data) setTrainer(response.data)
            })
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect -- state updates happen after await, not synchronously
        fetchTrainerAndSpaces()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainerId, spaceStoreTrainerId])

    useEffect(() => {
        loadMoves()
    }, [loadMoves])

    const entries = useMemo(() => SpaceTreeHelper.getAllPokemonWithSpace(spaces), [spaces])

    const selectedPokemon = useMemo(
        () => selectedIds
            .map(id => entries.find(entry => entry.pokemon.id === id)?.pokemon)
            .filter((pokemon): pokemon is PokemonApiResponse => !!pokemon),
        [selectedIds, entries],
    )

    const selectedSpeciesIdsKey = useMemo(
        () => Array.from(new Set(selectedPokemon.map(pokemon => pokemon.speciesId))).sort((a, b) => a - b).join(","),
        [selectedPokemon],
    )

    useEffect(() => {

        selectedSpeciesIdsKey.split(",").filter(Boolean).forEach(speciesIdText => {
            loadSpeciesDetail(Number.parseInt(speciesIdText, 10))
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSpeciesIdsKey])

    const handleToggleSelect = (pokemonId: number) => {
        setSelectedIds(current => {

            if (current.includes(pokemonId)) return current.filter(id => id !== pokemonId)
            if (current.length >= TeamConfig.MAX_TEAM_SIZE) return current

            return [...current, pokemonId]
        })
    }

    const handleToggleShiny = async (pokemon: PokemonApiResponse) => {

        const response = await pokemonProxy.editPokemon({ pokemonId: pokemon.id, isShiny: !pokemon.isShiny })

        if (response.success && response.data) upsertPokemon(response.data)
        else toast.show(response.message, "error")
    }

    const teamMembers: TeamMemberInput[] = selectedPokemon
        .filter(pokemon => speciesDetails[pokemon.speciesId])
        .map(pokemon => ({ pokemon, types: speciesDetails[pokemon.speciesId].types }))

    const isAnalysisReady = teamMembers.length > 0
        && teamMembers.length === selectedPokemon.length
        && moves.length > 0

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>

            <PageHeaderComponent
                label="Team Builder"
                title={trainer?.name ?? "…"}
                subtitle="Pick up to 6 Pokemon to analyze your team"
                backAction={
                    <Button
                        startIcon={<ArrowBackRoundedIcon />}
                        color="inherit"
                        onClick={() => router.push(ClientRoutesConfig.TRAINER_DETAIL(trainerId))}
                        sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                    >
                        Back to Roster
                    </Button>
                }
            />

            {isLoading &&
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: "16px" }} />
            }

            {!isLoading && entries.length === 0 &&
                <EmptyStateComponent
                    icon={<CatchingPokemonRoundedIcon />}
                    title="No Pokemon yet"
                    subtitle="Add some Pokemon to this trainer before building a team."
                />
            }

            {!isLoading && entries.length > 0 &&
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    <TeamPokemonPickerComponent
                        entries={entries}
                        selectedIds={selectedIds}
                        maxTeamSize={TeamConfig.MAX_TEAM_SIZE}
                        onToggle={handleToggleSelect}
                    />

                    {selectedPokemon.length === 0 &&
                        <EmptyStateComponent
                            title="Select at least one Pokemon"
                            subtitle="Your team's roster and analysis will appear here."
                        />
                    }

                    {selectedPokemon.length > 0 &&
                        <TeamRosterComponent pokemonList={selectedPokemon} onToggleShiny={handleToggleShiny} />
                    }

                    {selectedPokemon.length > 0 && !isAnalysisReady &&
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 3 }}>
                            {[0, 1, 2, 3].map(index => (
                                <Skeleton key={index} variant="rounded" height={280} sx={{ borderRadius: "16px" }} />
                            ))}
                        </Box>
                    }

                    {isAnalysisReady &&
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 3 }}>
                            <TypeCoveragePanelComponent
                                moveTypeSegments={TeamAnalysisHelper.getMoveTypeCoverage(teamMembers, moves)}
                                checklist={TeamAnalysisHelper.getTypeCoverageChecklist(teamMembers, moves)}
                            />

                            <TypeDistributionPanelComponent
                                segments={TeamAnalysisHelper.getSpeciesTypeDistribution(teamMembers)}
                            />

                            <WeaknessesPanelComponent
                                weaknesses={TeamAnalysisHelper.getWeaknesses(teamMembers)}
                            />

                            <MoveDistributionPanelComponent
                                distribution={TeamAnalysisHelper.getMoveDistribution(teamMembers, moves)}
                            />
                        </Box>
                    }
                </Box>
            }
        </Container>
    )
}
