import type { Party } from '@/types/party'

export const parties: Party[] = [
  {
    id: 'p1',
    city: 'bj',
    storeId: 's1',
    storeName: '迷雾推理馆(朝阳店)',
    storeAddress: '朝阳区建国路88号SOHO现代城B座3层',
    totalSeats: 7,
    birthdayDate: '2026-07-15',
    birthdayTime: '14:00',
    gameTypes: ['欢乐', '情感'],
    needCake: true,
    needPhoto: true,
    needHostBlessing: true,
    birthdayPersonName: '小明',
    birthdayPersonAvatar: 'https://picsum.photos/id/64/200/200',
    players: [
      { id: 'u1', name: '小明', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', role: 'birthday', timeSlots: ['14:00-18:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800001111' },
      { id: 'u2', name: '小红', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', role: 'player', timeSlots: ['14:00-18:00', '14:00-20:00'], dietaryRestrictions: '不吃辣', isNewbie: false, rejectedThemes: ['恐怖'], phone: '13800002222' },
      { id: 'u3', name: '阿强', avatar: 'https://picsum.photos/id/177/200/200', status: 'confirmed', role: 'player', timeSlots: ['14:00-18:00'], dietaryRestrictions: '', isNewbie: true, rejectedThemes: ['恐怖'], phone: '13800003333' },
      { id: 'u4', name: '小芳', avatar: 'https://picsum.photos/id/338/200/200', status: 'pending', role: 'player', timeSlots: [], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800004444' },
      { id: 'u5', name: '大伟', avatar: 'https://picsum.photos/id/1027/200/200', status: 'pending', role: 'player', timeSlots: [], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800005555' },
      { id: 'u6', name: '晓晓', avatar: 'https://picsum.photos/id/64/200/200', status: 'declined', role: 'player', timeSlots: [], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800006666' }
    ],
    status: 'inviting',
    createdAt: '2026-06-18'
  },
  {
    id: 'p2',
    city: 'sh',
    storeId: 's4',
    storeName: '迷雾推理馆(徐汇店)',
    storeAddress: '徐汇区漕溪北路398号5层',
    totalSeats: 6,
    birthdayDate: '2026-07-22',
    birthdayTime: '19:00',
    gameTypes: ['本格', '恐怖'],
    needCake: true,
    needPhoto: false,
    needHostBlessing: false,
    birthdayPersonName: '阿杰',
    birthdayPersonAvatar: 'https://picsum.photos/id/177/200/200',
    players: [
      { id: 'u7', name: '阿杰', avatar: 'https://picsum.photos/id/177/200/200', status: 'confirmed', role: 'birthday', timeSlots: ['19:00-23:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800007777' },
      { id: 'u8', name: '小美', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', role: 'player', timeSlots: ['19:00-23:00'], dietaryRestrictions: '海鲜过敏', isNewbie: false, rejectedThemes: [], phone: '13800008888' },
      { id: 'u9', name: '老王', avatar: 'https://picsum.photos/id/338/200/200', status: 'confirmed', role: 'player', timeSlots: ['19:00-23:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: ['情感'], phone: '13800009999' },
      { id: 'u10', name: '小李', avatar: 'https://picsum.photos/id/1027/200/200', status: 'pending', role: 'player', timeSlots: [], dietaryRestrictions: '', isNewbie: true, rejectedThemes: ['恐怖'], phone: '13800001010' }
    ],
    status: 'inviting',
    createdAt: '2026-06-19'
  },
  {
    id: 'p3',
    city: 'gz',
    storeId: 's7',
    storeName: '迷雾推理馆(天河店)',
    storeAddress: '天河区体育西路191号4层',
    totalSeats: 8,
    birthdayDate: '2026-08-05',
    birthdayTime: '13:00',
    gameTypes: ['欢乐'],
    needCake: true,
    needPhoto: true,
    needHostBlessing: true,
    birthdayPersonName: '小雨',
    birthdayPersonAvatar: 'https://picsum.photos/id/91/200/200',
    players: [
      { id: 'u11', name: '小雨', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', role: 'birthday', timeSlots: ['13:00-17:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800001112' },
      { id: 'u12', name: '小雪', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', role: 'player', timeSlots: ['13:00-17:00'], dietaryRestrictions: '素食', isNewbie: false, rejectedThemes: ['恐怖'], phone: '13800001212' }
    ],
    status: 'inviting',
    createdAt: '2026-06-20'
  },
  {
    id: 'p4',
    city: 'bj',
    storeId: 's2',
    storeName: '黑暗童话剧本杀(海淀店)',
    storeAddress: '海淀区中关村大街28号5层',
    totalSeats: 6,
    birthdayDate: '2026-06-28',
    birthdayTime: '15:00',
    gameTypes: ['情感', '本格'],
    needCake: false,
    needPhoto: true,
    needHostBlessing: true,
    birthdayPersonName: '小凯',
    birthdayPersonAvatar: 'https://picsum.photos/id/338/200/200',
    players: [
      { id: 'u13', name: '小凯', avatar: 'https://picsum.photos/id/338/200/200', status: 'confirmed', role: 'birthday', timeSlots: ['15:00-19:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800001313' },
      { id: 'u14', name: '小琳', avatar: 'https://picsum.photos/id/91/200/200', status: 'confirmed', role: 'player', timeSlots: ['15:00-19:00'], dietaryRestrictions: '花生过敏', isNewbie: false, rejectedThemes: [], phone: '13800001414' },
      { id: 'u15', name: '阿东', avatar: 'https://picsum.photos/id/177/200/200', status: 'confirmed', role: 'player', timeSlots: ['15:00-19:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: ['恐怖'], phone: '13800001515' },
      { id: 'u16', name: '小敏', avatar: 'https://picsum.photos/id/1027/200/200', status: 'confirmed', role: 'player', timeSlots: ['15:00-19:00'], dietaryRestrictions: '', isNewbie: true, rejectedThemes: ['恐怖'], phone: '13800001616' },
      { id: 'u17', name: '大壮', avatar: 'https://picsum.photos/id/64/200/200', status: 'confirmed', role: 'player', timeSlots: ['15:00-19:00'], dietaryRestrictions: '不吃葱', isNewbie: false, rejectedThemes: [], phone: '13800001717' },
      { id: 'u18', name: '小慧', avatar: 'https://picsum.photos/id/338/200/200', status: 'confirmed', role: 'player', timeSlots: ['15:00-19:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: ['情感'], phone: '13800001818' }
    ],
    status: 'confirmed',
    createdAt: '2026-06-10'
  },
  {
    id: 'p5',
    city: 'cd',
    storeId: 's9',
    storeName: '梦境研究所(锦江店)',
    storeAddress: '锦江区红星路三段1号5层',
    totalSeats: 7,
    birthdayDate: '2026-07-30',
    birthdayTime: '18:00',
    gameTypes: ['恐怖', '本格'],
    needCake: true,
    needPhoto: false,
    needHostBlessing: false,
    birthdayPersonName: '阿豪',
    birthdayPersonAvatar: 'https://picsum.photos/id/177/200/200',
    players: [
      { id: 'u19', name: '阿豪', avatar: 'https://picsum.photos/id/177/200/200', status: 'confirmed', role: 'birthday', timeSlots: ['18:00-22:00'], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800001919' },
      { id: 'u20', name: '小凤', avatar: 'https://picsum.photos/id/91/200/200', status: 'pending', role: 'player', timeSlots: [], dietaryRestrictions: '', isNewbie: false, rejectedThemes: [], phone: '13800002020' }
    ],
    status: 'inviting',
    createdAt: '2026-06-20'
  }
]
