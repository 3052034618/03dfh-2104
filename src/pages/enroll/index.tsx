import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PlayerCard from '@/components/PlayerCard'
import { usePartyStore } from '@/store/partyStore'
import { getConfirmedCount, getPendingCount, formatDate, getWeekday } from '@/utils/format'
import styles from './index.module.scss'

const EnrollPage: React.FC = () => {
  const parties = usePartyStore(state => state.parties)
  const currentPartyId = usePartyStore(state => state.currentPartyId)
  const lastRemindedPlayers = usePartyStore(state => state.lastRemindedPlayers)
  const markReminded = usePartyStore(state => state.markReminded)
  const [selectedPartyIdx, setSelectedPartyIdx] = useState(0)
  const [showRemindedToast, setShowRemindedToast] = useState(false)
  const [recentlyRemindedNames, setRecentlyRemindedNames] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  const invitingParties = useMemo(
    () => parties.filter(p => p.status !== 'completed'),
    [parties]
  )

  const currentParty = invitingParties[selectedPartyIdx] || null

  useEffect(() => {
    if (!initialized && invitingParties.length > 0 && currentPartyId) {
      const idx = invitingParties.findIndex(p => p.id === currentPartyId)
      if (idx >= 0) {
        setSelectedPartyIdx(idx)
      }
      setInitialized(true)
    } else if (!initialized && invitingParties.length > 0) {
      setInitialized(true)
    }
  }, [invitingParties, currentPartyId, initialized])

  const confirmed = currentParty ? getConfirmedCount(currentParty.players) : 0
  const pending = currentParty ? getPendingCount(currentParty.players) : 0
  const declined = currentParty ? currentParty.players.filter(p => p.status === 'declined').length : 0
  const progressPercent = currentParty ? Math.round((confirmed / currentParty.totalSeats) * 100) : 0

  const pendingPlayers = currentParty
    ? currentParty.players.filter(p => p.status === 'pending')
    : []

  useEffect(() => {
    if (lastRemindedPlayers && currentParty && lastRemindedPlayers.partyId === currentParty.id) {
      const names = currentParty.players
        .filter(p => lastRemindedPlayers.playerIds.includes(p.id))
        .map(p => p.name)
      if (names.length > 0) {
        setRecentlyRemindedNames(names)
        setShowRemindedToast(true)
        const timer = setTimeout(() => {
          setShowRemindedToast(false)
        }, 4000)
        return () => clearTimeout(timer)
      }
    }
  }, [lastRemindedPlayers, currentParty])

  const handleRemind = (playerId: string) => {
    if (!currentParty) return
    const player = currentParty.players.find(p => p.id === playerId)
    if (!player || player.status !== 'pending') return

    markReminded(currentParty.id, [playerId])
    Taro.showToast({ title: `已催${player.name}确认`, icon: 'success' })
    console.info('[Enroll] Remind player:', player.name, playerId)
  }

  const handleRemindAll = () => {
    if (!currentParty) return
    const pendingPlayers = currentParty.players.filter(p => p.status === 'pending')
    if (pendingPlayers.length === 0) {
      Taro.showToast({ title: '没有待回复的玩家', icon: 'none' })
      return
    }

    const playerIds = pendingPlayers.map(p => p.id)
    const playerNames = pendingPlayers.map(p => p.name)

    markReminded(currentParty.id, playerIds)

    console.info('[Enroll] Remind all pending:', pendingPlayers.length, playerNames)
  }

  const handlePartyChange = (e) => {
    setSelectedPartyIdx(Number(e.detail.value))
    setShowRemindedToast(false)
    setRecentlyRemindedNames([])
  }

  const handleCreate = () => {
    Taro.switchTab({ url: '/pages/create/index' })
  }

  if (invitingParties.length === 0) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>报名管理</Text>
          <Text className={styles.headerDesc}>管理好友报名和座位进度</Text>
        </View>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyText}>还没有进行中的生日局</Text>
          <View className={styles.emptyBtn} onClick={handleCreate}>
            <Text>创建生日局</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>报名管理</Text>
        <Text className={styles.headerDesc}>管理好友报名和座位进度</Text>
      </View>

      <Picker mode="selector" range={invitingParties.map(p => `${p.birthdayPersonName}的生日局 - ${formatDate(p.birthdayDate)}`)} onChange={handlePartyChange} value={selectedPartyIdx}>
        <View className={styles.partySelector}>
          <View>
            <Text className={styles.partySelectorLabel}>当前局</Text>
            <Text className={styles.partySelectorValue}>
              {currentParty ? `${currentParty.birthdayPersonName}的生日局 - ${formatDate(currentParty.birthdayDate)} ${getWeekday(currentParty.birthdayDate)}` : '请选择'}
            </Text>
          </View>
          <Text className={styles.partySelectorArrow}>▼</Text>
        </View>
      </Picker>

      {currentParty && (
        <>
          <View className={styles.progressSection}>
            <Text className={styles.progressTitle}>座位进度</Text>
            <View className={styles.seatVisual}>
              {currentParty.players.map(player => (
                <View
                  key={player.id}
                  className={classnames(
                    styles.seatDot,
                    player.status === 'confirmed' && (player.role === 'birthday' ? styles.seatBirthday : styles.seatConfirmed),
                    player.status === 'pending' && styles.seatPending
                  )}
                >
                  <Text className={styles.seatDotText}>
                    {player.status === 'confirmed' ? '✓' : player.status === 'pending' ? '?' : '✗'}
                  </Text>
                </View>
              ))}
              {Array.from({ length: Math.max(0, currentParty.totalSeats - currentParty.players.length) }, (_, i) => (
                <View key={`empty-${i}`} className={classnames(styles.seatDot, styles.seatEmpty)}>
                  <Text className={styles.seatDotText}>-</Text>
                </View>
              ))}
            </View>
            <View className={styles.progressBarContainer}>
              <View className={styles.progressBar}>
                <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
              </View>
              <View className={styles.progressInfo}>
                <Text className={styles.progressText}>已确认 <Text className={styles.progressHighlight}>{confirmed}</Text>/{currentParty.totalSeats}人</Text>
                <Text className={styles.progressText}>
                  {confirmed >= currentParty.totalSeats ? '已满员 ✓' : `还缺${currentParty.totalSeats - confirmed}人`}
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.statConfirmed}`}>{confirmed}</Text>
              <Text className={styles.statLabel}>已确认</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.statPending}`}>{pending}</Text>
              <Text className={styles.statLabel}>待回复</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.statDeclined}`}>{declined}</Text>
              <Text className={styles.statLabel}>已拒绝</Text>
            </View>
          </View>

          <View className={styles.playersSection}>
            <View className={styles.playersHeader}>
              <Text className={styles.playersTitle}>玩家列表</Text>
              {pending > 0 && (
                <View className={styles.remindAllBtn} onClick={handleRemindAll}>
                  <Text>一键催{pending}人确认</Text>
                </View>
              )}
            </View>

            {pendingPlayers.length > 0 && (
              <View className={styles.pendingHint}>
                <Text className={styles.pendingHintText}>
                  ⏰ 还有{pendingPlayers.length}人待回复：{pendingPlayers.map(p => p.name).join('、')}
                </Text>
              </View>
            )}

            {currentParty.players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                showActions={player.status === 'pending'}
                onRemind={handleRemind}
              />
            ))}
          </View>
        </>
      )}

      {showRemindedToast && recentlyRemindedNames.length > 0 && (
        <View className={styles.remindedToast}>
          <Text className={styles.remindedToastTitle}>✅ 已发送催确认</Text>
          <Text className={styles.remindedToastText}>
            本次催了{recentlyRemindedNames.length}人：{recentlyRemindedNames.join('、')}
          </Text>
          <Text className={styles.remindedToastDesc}>
            （仅催待回复的人，已确认/已拒绝的不会被打扰）
          </Text>
        </View>
      )}
    </View>
  )
}

export default EnrollPage
