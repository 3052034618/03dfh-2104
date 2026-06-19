import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import ReminderCard from '@/components/ReminderCard'
import { usePartyStore } from '@/store/partyStore'
import type { PlayerRole } from '@/types/party'
import styles from './index.module.scss'

const RemindPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlayerRole | 'all'>('all')
  const getRemindersByRole = usePartyStore(state => state.getRemindersByRole)

  const filteredReminders = useMemo(() => {
    if (activeTab === 'all') return getRemindersByRole()
    return getRemindersByRole(activeTab)
  }, [activeTab, getRemindersByRole])

  const birthdayReminders = useMemo(
    () => getRemindersByRole('birthday'),
    [getRemindersByRole]
  )
  const playerReminders = useMemo(
    () => getRemindersByRole('player'),
    [getRemindersByRole]
  )

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>到店提醒</Text>
        <Text className={styles.headerDesc}>按角色发送不同提醒，避免当天反复问</Text>
      </View>

      <View className={styles.tabRow}>
        <View
          className={classnames(styles.tab, activeTab === 'all' && styles.tabActive)}
          onClick={() => setActiveTab('all')}
        >
          <Text>全部 {getRemindersByRole().length > 0 && `(${getRemindersByRole().length})`}</Text>
        </View>
        <View
          className={classnames(styles.tab, activeTab === 'birthday' && styles.tabAccentActive)}
          onClick={() => setActiveTab('birthday')}
        >
          <Text>寿星专属 {birthdayReminders.length > 0 && `(${birthdayReminders.length})`}</Text>
        </View>
        <View
          className={classnames(styles.tab, activeTab === 'player' && styles.tabActive)}
          onClick={() => setActiveTab('player')}
        >
          <Text>玩家提醒 {playerReminders.length > 0 && `(${playerReminders.length})`}</Text>
        </View>
      </View>

      {activeTab === 'all' && (
        <View className={styles.tipsCard}>
          <Text className={styles.tipsTitle}>💡 提醒说明</Text>
          <Text className={styles.tipsItem}>• 寿星收到仪式流程和惊喜提示</Text>
          <Text className={styles.tipsItem}>• 玩家收到到店时间、服装建议和禁忌</Text>
          <Text className={styles.tipsItem}>• 临近开场自动推送，无需群内反复问</Text>
        </View>
      )}

      {activeTab === 'birthday' && birthdayReminders.length > 0 && (
        <Text className={styles.sectionTitle}>👑 寿星仪式流程</Text>
      )}

      {activeTab === 'player' && playerReminders.length > 0 && (
        <Text className={styles.sectionTitle}>🎭 玩家到场提醒</Text>
      )}

      <View className={styles.reminderList}>
        {filteredReminders.length > 0 ? (
          filteredReminders.map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔔</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'birthday'
                ? '暂无寿星专属提醒，创建生日局后自动生成'
                : activeTab === 'player'
                  ? '暂无玩家提醒，创建生日局后自动生成'
                  : '暂无提醒，临近开场时自动推送'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default RemindPage
