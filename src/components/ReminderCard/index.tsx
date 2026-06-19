import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { Reminder } from '@/types/party'
import styles from './index.module.scss'

interface ReminderCardProps {
  reminder: Reminder
  onClick?: (id: string) => void
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onClick }) => {
  const isBirthday = reminder.role === 'birthday'

  return (
    <View
      className={classnames(styles.card, isBirthday && styles.birthdayCard)}
      onClick={() => onClick?.(reminder.partyId)}
    >
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.icon}>{isBirthday ? '👑' : '🎭'}</Text>
          <Text className={styles.title}>{reminder.partyName}</Text>
        </View>
        <View className={styles.countdown}>
          <Text className={styles.countdownText}>{reminder.countdown}</Text>
        </View>
      </View>

      <Text className={styles.content}>{reminder.content}</Text>

      <View className={styles.detailGrid}>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>到店时间</Text>
          <Text className={styles.detailValue}>{reminder.arrivalTime}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>服装建议</Text>
          <Text className={styles.detailValue}>{reminder.dressSuggestion}</Text>
        </View>
      </View>

      {reminder.taboos.length > 0 && (
        <View className={styles.tabooSection}>
          <Text className={styles.sectionTitle}>禁忌提示</Text>
          <View className={styles.tabooList}>
            {reminder.taboos.map((taboo, idx) => (
              <View key={idx} className={styles.tabooItem}>
                <Text className={styles.tabooText}>⚠️ {taboo}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {isBirthday && reminder.ceremonyFlow.length > 0 && (
        <View className={styles.ceremonySection}>
          <Text className={styles.sectionTitle}>仪式流程</Text>
          <View className={styles.flowList}>
            {reminder.ceremonyFlow.map((step, idx) => (
              <View key={idx} className={styles.flowItem}>
                <View className={styles.flowDot} />
                <Text className={styles.flowText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.address}>
        <Text className={styles.addressIcon}>📍</Text>
        <Text className={styles.addressText}>{reminder.storeAddress}</Text>
      </View>
    </View>
  )
}

export default ReminderCard
