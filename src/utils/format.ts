import dayjs from 'dayjs'

export const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format('M月D日')
}

export const formatDateFull = (dateStr: string): string => {
  return dayjs(dateStr).format('YYYY年M月D日')
}

export const getWeekday = (dateStr: string): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[dayjs(dateStr).day()]
}

export const getConfirmedCount = (players: { status: string }[]): number => {
  return players.filter(p => p.status === 'confirmed').length
}

export const getPendingCount = (players: { status: string }[]): number => {
  return players.filter(p => p.status === 'pending').length
}

export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    draft: '草稿',
    inviting: '邀请中',
    confirmed: '已确认',
    completed: '已完成'
  }
  return map[status] || status
}

export const getPlayerStatusText = (status: string): string => {
  const map: Record<string, string> = {
    confirmed: '已确认',
    pending: '待回复',
    declined: '已拒绝'
  }
  return map[status] || status
}

export const getRoleText = (role: string): string => {
  const map: Record<string, string> = {
    birthday: '寿星',
    player: '玩家'
  }
  return map[role] || role
}
