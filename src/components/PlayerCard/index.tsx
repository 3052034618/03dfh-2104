import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import type { Player } from '@/types/party'
import { getPlayerStatusText, getRoleText } from '@/utils/format'
import styles from './index.module.scss'

interface PlayerCardProps {
  player: Player
  onRemind?: (id: string) => void
  showActions?: boolean
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemind, showActions = false }) => {
  const statusClass = player.status === 'confirmed'
    ? styles.confirmed
    : player.status === 'pending'
      ? styles.pending
      : styles.declined

  return (
    <View className={styles.card}>
      <Image
        className={styles.avatar}
        src={player.avatar}
        mode="aspectFill"
      />
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{player.name}</Text>
          {player.role === 'birthday' && (
            <View className={styles.roleTag}>
              <Text className={styles.roleText}>{getRoleText(player.role)}</Text>
            </View>
          )}
          {player.isNewbie && (
            <View className={styles.newbieTag}>
              <Text className={styles.newbieText}>新手</Text>
            </View>
          )}
        </View>
        {player.dietaryRestrictions && (
          <Text className={styles.dietary}>忌口: {player.dietaryRestrictions}</Text>
        )}
        {player.rejectedThemes.length > 0 && (
          <Text className={styles.rejected}>不接受: {player.rejectedThemes.join('、')}</Text>
        )}
      </View>
      <View className={classnames(styles.statusBadge, statusClass)}>
        <Text className={styles.statusText}>{getPlayerStatusText(player.status)}</Text>
      </View>
      {showActions && player.status === 'pending' && onRemind && (
        <View className={styles.remindBtn} onClick={() => onRemind(player.id)}>
          <Text className={styles.remindText}>催</Text>
        </View>
      )}
    </View>
  )
}

export default PlayerCard
