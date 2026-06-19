import { create } from 'zustand'
import type { Party, Player, GameType } from '@/types/party'
import { parties as mockParties } from '@/data/parties'

interface PartyState {
  parties: Party[]
  currentPartyId: string | null
  addParty: (party: Party) => void
  setCurrentParty: (id: string) => void
  updatePlayerStatus: (partyId: string, playerId: string, status: 'confirmed' | 'declined') => void
  addPlayer: (partyId: string, player: Player) => void
  getPartyById: (id: string) => Party | undefined
  getCurrentParty: () => Party | undefined
}

export const usePartyStore = create<PartyState>((set, get) => ({
  parties: mockParties,
  currentPartyId: null,

  addParty: (party) => set((state) => ({
    parties: [party, ...state.parties]
  })),

  setCurrentParty: (id) => set({ currentPartyId: id }),

  updatePlayerStatus: (partyId, playerId, status) => set((state) => ({
    parties: state.parties.map(p =>
      p.id === partyId
        ? { ...p, players: p.players.map(pl => pl.id === playerId ? { ...pl, status } : pl) }
        : p
    )
  })),

  addPlayer: (partyId, player) => set((state) => ({
    parties: state.parties.map(p =>
      p.id === partyId
        ? { ...p, players: [...p.players, player] }
        : p
    )
  })),

  getPartyById: (id) => get().parties.find(p => p.id === id),

  getCurrentParty: () => {
    const state = get()
    return state.parties.find(p => p.id === state.currentPartyId)
  }
}))
