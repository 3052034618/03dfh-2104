export type GameType = '本格' | '欢乐' | '情感' | '恐怖'

export type PlayerStatus = 'confirmed' | 'pending' | 'declined'

export type PlayerRole = 'birthday' | 'player'

export interface Store {
  id: string
  name: string
  address: string
  city: string
}

export interface Player {
  id: string
  name: string
  avatar: string
  status: PlayerStatus
  role: PlayerRole
  timeSlots: string[]
  dietaryRestrictions: string
  isNewbie: boolean
  rejectedThemes: GameType[]
  phone: string
}

export interface Party {
  id: string
  city: string
  storeId: string
  storeName: string
  storeAddress: string
  totalSeats: number
  birthdayDate: string
  birthdayTime: string
  gameTypes: GameType[]
  needCake: boolean
  needPhoto: boolean
  needHostBlessing: boolean
  birthdayPersonName: string
  birthdayPersonAvatar: string
  players: Player[]
  status: 'draft' | 'inviting' | 'confirmed' | 'completed'
  createdAt: string
}

export interface Reminder {
  id: string
  partyId: string
  partyName: string
  role: PlayerRole
  content: string
  arrivalTime: string
  dressSuggestion: string
  taboos: string[]
  ceremonyFlow: string[]
  storeAddress: string
  countdown: string
}

export interface City {
  id: string
  name: string
}
