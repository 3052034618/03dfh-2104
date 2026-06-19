import React, { useState, useMemo } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import PlayerCard from '@/components/PlayerCard'
import { usePartyStore } from '@/store/partyStore'
import { getConfirmedCount, getPendingCount, formatDate, getWeekday } from '@/utils/format'
import styles from './index.module.scss'

const EnrollPage: React.FC = () => {
  const parties = usePartyStore(state => state.parties)
  const updatePlayerStatus = usePartyStore(state => state.updatePlayerStatus)
  const [selectedPartyIdx, setSelectedPartyIdx] = useState(0)

  const invitingParties = useMemo(
    () => parties.filter(p => p.status !== 'completed'),
    [parties]
  )

  const currentParty = invitingParties[selectedPartyIdx] || null

  const confirmed = currentParty ? getConfirmedCount(currentParty.players) : 0
  const pending = currentParty ? getPendingCount(currentParty.players) : 0
  const declined = currentParty ? currentParty.players.filter(p => p.status === 'declined').length : 0
  const progressPercent = currentParty ? Math.round((confirmed / currentParty.totalSeats) * 100) : 0

  const handleRemind = (playerId: string) => {
    if (!currentParty) return
    Taro.showToast({ title: '已发送催确认消息', icon: 'success' })
    console.info('[Enroll] Remind player:', playerId)
  }

  const handleRemindAll = () => {
    if (!currentParty) return
    const pendingPlayers = currentParty.players.filter(p => p.status === 'pending')
    Taro.showToast({ title: `已催${pendingPlayers.length}人确认`, icon: 'success' })
    console.info('[Enroll] Remind all pending:', pendingPlayers.length)
  }

  const handlePartyChange = (e) => {
    setSelectedPartyIdx(Number(e.detail.value))
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
                  <Text>一键催确认</Text>
                </View>
              )}
            </View>
            {currentParty.players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                showActions={true}
                onRemind={handleRemind}
              />
            ))}
          </View>
        </>
      )}
    </View>
  )
}

export default EnrollPage
