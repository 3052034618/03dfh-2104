import { create } from 'zustand'
import type { Party, Player, Reminder } from '@/types/party'
import { parties as mockParties } from '@/data/parties'
import { reminders as mockReminders } from '@/data/reminders'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

const STORAGE_KEY = 'birthday_party_store'

const loadFromStorage = (): { parties: Party[]; reminders: Reminder[] } | null => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.parties && data.parties.length > 0) {
        return { parties: data.parties, reminders: data.reminders || [] }
      }
    }
  } catch (e) {
    console.warn('[PartyStore] Failed to load from storage:', e)
  }
  return null
}

const saveToStorage = (state: { parties: Party[]; reminders: Reminder[] }) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify({
      parties: state.parties,
      reminders: state.reminders
    }))
  } catch (e) {
    console.warn('[PartyStore] Failed to save to storage:', e)
  }
}

const initialData = loadFromStorage()
const initialParties = initialData ? initialData.parties : mockParties
const initialReminders = initialData ? initialData.reminders : mockReminders

const generateCountdown = (date: string, time: string): string => {
  const target = dayjs(`${date} ${time}`)
  const now = dayjs()
  const diffDays = target.diff(now, 'day')
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays < 7) return `${diffDays}天后`
  return `${Math.floor(diffDays / 7)}周后`
}

const generateRemindersForParty = (party: Party): Reminder[] => {
  const countdown = generateCountdown(party.birthdayDate, party.birthdayTime)
  const startTime = dayjs(`${party.birthdayDate} ${party.birthdayTime}`)
  const arrivalTime = startTime.subtract(15, 'minute').format('HH:mm')
  const gameTypeStr = party.gameTypes.join('、')

  const ceremonyFlow = [
    `${arrivalTime} 到店签到`,
    `${party.birthdayTime} 主持人开场介绍`,
    `${startTime.add(15, 'minute').format('HH:mm')} 分发角色剧本`,
    `${startTime.add(210, 'minute').format('HH:mm')} 剧本复盘`,
    `${startTime.add(225, 'minute').format('HH:mm')} 蛋糕环节`,
    `${startTime.add(240, 'minute').format('HH:mm')} 合影留念`
  ]

  const taboos = ['不要提前搜索剧本攻略', '不要迟到', '不要剧透给未到场的朋友']
  if (party.gameTypes.includes('恐怖')) taboos.push('恐怖本注意调节心态，感到不适及时告知DM')
  if (party.needHostBlessing) taboos.push('不要提前知道惊喜环节内容')

  const dressSuggestion = party.gameTypes.includes('恐怖')
    ? '建议深色休闲装，增强沉浸感；胆小者可带护身符'
    : party.gameTypes.includes('情感')
      ? '建议浅色系服装，拍照效果更好'
      : party.gameTypes.includes('欢乐')
        ? '建议亮色休闲装，配合欢乐氛围'
        : '休闲舒适即可'

  return [
    {
      id: `r-${party.id}-b`,
      partyId: party.id,
      partyName: `${party.birthdayPersonName}生日局`,
      role: 'birthday' as const,
      content: `你是今天的寿星！${party.needCake ? '蛋糕已为你备好' : ''}${party.needPhoto ? '，专业摄影师就位' : ''}${party.needHostBlessing ? '，还有惊喜祝福环节哦' : ''}`,
      arrivalTime: startTime.subtract(30, 'minute').format('HH:mm'),
      dressSuggestion: '可穿便装，建议浅色/亮色衣服拍照上镜，寿星当然要是全场最亮眼的！',
      taboos: ['不要提前看剧本', '不要透露惊喜环节', '放松心情享受生日！'],
      ceremonyFlow,
      storeAddress: party.storeAddress,
      countdown
    },
    {
      id: `r-${party.id}-p`,
      partyId: party.id,
      partyName: `${party.birthdayPersonName}生日局`,
      role: 'player' as const,
      content: `${party.birthdayPersonName}的${gameTypeStr}生日剧本杀局即将开始！${party.needCake ? '有蛋糕🍰' : ''}${party.needPhoto ? '有拍照📷' : ''}${party.needHostBlessing ? '有惊喜环节🎁' : ''}`,
      arrivalTime,
      dressSuggestion,
      taboos,
      ceremonyFlow: [],
      storeAddress: party.storeAddress,
      countdown
    }
  ]
}

export const encodePartyForUrl = (party: Party): string => {
  try {
    const json = JSON.stringify(party)
    return encodeURIComponent(json)
  } catch {
    return ''
  }
}

export const decodePartyFromUrl = (encoded: string): Party | null => {
  try {
    const json = decodeURIComponent(encoded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

interface PartyState {
  parties: Party[]
  reminders: Reminder[]
  currentPartyId: string | null
  addParty: (party: Party) => { party: Party; reminders: Reminder[] }
  importParty: (party: Party) => void
  setCurrentParty: (id: string) => void
  updatePlayerStatus: (partyId: string, playerId: string, status: 'confirmed' | 'declined') => void
  addPlayer: (partyId: string, player: Player) => Player
  getPartyById: (id: string) => Party | undefined
  getCurrentParty: () => Party | undefined
  getRemindersForParty: (partyId: string) => Reminder[]
  getRemindersByRole: (role?: 'birthday' | 'player') => Reminder[]
  markReminded: (partyId: string, playerIds: string[]) => void
  syncFromStorage: () => void
  lastRemindedPlayers: { partyId: string; playerIds: string[]; timestamp: number } | null
}

const persistState = (state: PartyState) => {
  saveToStorage({ parties: state.parties, reminders: state.reminders })
}

export const usePartyStore = create<PartyState>((set, get) => ({
  parties: initialParties,
  reminders: initialReminders,
  currentPartyId: null,
  lastRemindedPlayers: null,

  addParty: (party) => {
    const newReminders = generateRemindersForParty(party)
    set((state) => {
      const newState = {
        parties: [party, ...state.parties],
        reminders: [...newReminders, ...state.reminders],
        currentPartyId: party.id
      }
      persistState({ ...state, ...newState } as PartyState)
      return newState
    })
    console.info('[PartyStore] New party created:', party.id)
    return { party, reminders: newReminders }
  },

  importParty: (party) => {
    const existing = get().parties.find(p => p.id === party.id)
    if (existing) {
      console.info('[PartyStore] Party already exists, skipping import:', party.id)
      return
    }
    const newReminders = generateRemindersForParty(party)
    set((state) => {
      const newState = {
        parties: [party, ...state.parties],
        reminders: [...newReminders, ...state.reminders],
        currentPartyId: party.id
      }
      persistState({ ...state, ...newState } as PartyState)
      return newState
    })
    console.info('[PartyStore] Party imported from share:', party.id)
  },

  setCurrentParty: (id) => set({ currentPartyId: id }),

  updatePlayerStatus: (partyId, playerId, status) => set((state) => {
    const newState = {
      parties: state.parties.map(p =>
        p.id === partyId
          ? { ...p, players: p.players.map(pl => pl.id === playerId ? { ...pl, status } : pl) }
          : p
      )
    }
    persistState({ ...state, ...newState } as PartyState)
    return newState
  }),

  addPlayer: (partyId, player) => {
    const newPlayer = { ...player, id: player.id || `u${Date.now()}` }
    set((state) => {
      const newState = {
        parties: state.parties.map(p =>
          p.id === partyId
            ? { ...p, players: [...p.players, newPlayer] }
            : p
        )
      }
      persistState({ ...state, ...newState } as PartyState)
      return newState
    })
    console.info('[PartyStore] Player added to party', partyId, ':', newPlayer.name)
    return newPlayer
  },

  getPartyById: (id) => get().parties.find(p => p.id === id),

  getCurrentParty: () => {
    const state = get()
    return state.parties.find(p => p.id === state.currentPartyId)
  },

  getRemindersForParty: (partyId) => get().reminders.filter(r => r.partyId === partyId),

  getRemindersByRole: (role) => {
    const all = get().reminders
    if (!role) return all
    return all.filter(r => r.role === role)
  },

  markReminded: (partyId, playerIds) => {
    set({ lastRemindedPlayers: { partyId, playerIds, timestamp: Date.now() } })
    console.info('[PartyStore] Marked reminded for', playerIds.length, 'players in party', partyId)
  },

  syncFromStorage: () => {
    const data = loadFromStorage()
    if (data) {
      set({ parties: data.parties, reminders: data.reminders })
      console.info('[PartyStore] Synced from storage')
    }
  }
}))

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue)
        if (data.parties) {
          usePartyStore.setState({ parties: data.parties, reminders: data.reminders || [] })
          console.info('[PartyStore] Synced from storage event (another tab)')
        }
      } catch {}
    }
  })
}
