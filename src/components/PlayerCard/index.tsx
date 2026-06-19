import React, { useState } from 'react'
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
  const [expanded, setExpanded] = useState(false)
  const hasDetails = player.timeSlots.length > 0
    || player.dietaryRestrictions
    || player.rejectedThemes.length > 0
    || player.phone
    || player.isNewbie
    || player.status === 'declined'

  const statusClass = player.status === 'confirmed'
    ? styles.confirmed
    : player.status === 'pending'
      ? styles.pending
      : styles.declined

  return (
    <View className={styles.card}>
      <View className={styles.mainRow}>
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
          {player.status === 'declined' && (
            <Text className={styles.declinedHint}>已婉拒，点击查看报名资料</Text>
          )}
          {player.status === 'pending' && (
            <Text className={styles.pendingHint}>待回复中</Text>
          )}
          {player.status === 'confirmed' && player.dietaryRestrictions && (
            <Text className={styles.dietary}>忌口: {player.dietaryRestrictions}</Text>
          )}
          {player.status === 'confirmed' && player.rejectedThemes.length > 0 && !expanded && (
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

      {hasDetails && (
        <View className={styles.expandRow} onClick={() => setExpanded(!expanded)}>
          <Text className={styles.expandText}>
            {expanded ? '收起详情 ▲' : `查看详情 ▼`}
          </Text>
        </View>
      )}

      {expanded && (
        <View className={styles.detailSection}>
          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>📋 参与状态</Text>
            <View className={classnames(styles.statusPill, statusClass)}>
              <Text className={styles.statusPillText}>{getPlayerStatusText(player.status)}</Text>
            </View>
          </View>
          {player.timeSlots.length > 0 && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>🕐 可接受时间</Text>
              <View className={styles.detailTags}>
                {player.timeSlots.map(slot => (
                  <View key={slot} className={styles.detailTag}>
                    <Text className={styles.detailTagText}>{slot}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {player.dietaryRestrictions && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>🍽 饮食禁忌</Text>
              <Text className={styles.detailValue}>{player.dietaryRestrictions}</Text>
            </View>
          )}
          {player.isNewbie && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>📖 剧本经验</Text>
              <View className={styles.newbieBadge}>
                <Text className={styles.newbieBadgeText}>第一次玩，需要多照顾</Text>
              </View>
            </View>
          )}
          {player.rejectedThemes.length > 0 && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>🚫 不能接受的题材</Text>
              <View className={styles.detailTags}>
                {player.rejectedThemes.map(theme => (
                  <View key={theme} className={styles.rejectedTag}>
                    <Text className={styles.rejectedTagText}>{theme}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {player.phone && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>📱 联系方式</Text>
              <Text className={styles.detailValue}>{player.phone}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default PlayerCard
