import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { Party } from '@/types/party'
import { formatDate, getWeekday, getConfirmedCount, getStatusText } from '@/utils/format'
import styles from './index.module.scss'

interface PartyCardProps {
  party: Party
  onClick?: (id: string) => void
}

const PartyCard: React.FC<PartyCardProps> = ({ party, onClick }) => {
  const confirmed = getConfirmedCount(party.players)
  const isFull = confirmed >= party.totalSeats
  const statusClass = party.status === 'confirmed'
    ? styles.statusConfirmed
    : party.status === 'inviting'
      ? styles.statusInviting
      : styles.statusDraft

  return (
    <View
      className={styles.card}
      onClick={() => onClick?.(party.id)}
    >
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.birthdayIcon}>🎂</Text>
          <Text className={styles.title}>{party.birthdayPersonName}的生日局</Text>
        </View>
        <View className={classnames(styles.statusTag, statusClass)}>
          <Text className={styles.statusText}>{getStatusText(party.status)}</Text>
        </View>
      </View>

      <View className={styles.infoGrid}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>日期</Text>
          <Text className={styles.infoValue}>{formatDate(party.birthdayDate)} {getWeekday(party.birthdayDate)}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{party.birthdayTime}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>门店</Text>
          <Text className={styles.infoValue}>{party.storeName}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>人数</Text>
          <Text className={classnames(styles.infoValue, isFull && styles.fullText)}>
            {confirmed}/{party.totalSeats}
          </Text>
        </View>
      </View>

      <View className={styles.tags}>
        {party.gameTypes.map(type => (
          <View key={type} className={styles.tag}>
            <Text className={styles.tagText}>{type}</Text>
          </View>
        ))}
        {party.needCake && (
          <View className={classnames(styles.tag, styles.accentTag)}>
            <Text className={styles.accentTagText}>蛋糕</Text>
          </View>
        )}
        {party.needPhoto && (
          <View className={classnames(styles.tag, styles.accentTag)}>
            <Text className={styles.accentTagText}>拍照</Text>
          </View>
        )}
        {party.needHostBlessing && (
          <View className={classnames(styles.tag, styles.accentTag)}>
            <Text className={styles.accentTagText}>主持祝福</Text>
          </View>
        )}
      </View>

      <View className={styles.progressBar}>
        <View
          className={styles.progressFill}
          style={{ width: `${Math.min((confirmed / party.totalSeats) * 100, 100)}%` }}
        />
      </View>
      <Text className={styles.progressHint}>
        {isFull ? '已满员' : `还缺${party.totalSeats - confirmed}人`}
      </Text>
    </View>
  )
}

export default PartyCard
