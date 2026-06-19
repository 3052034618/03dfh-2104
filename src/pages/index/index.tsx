import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PartyCard from '@/components/PartyCard'
import { usePartyStore } from '@/store/partyStore'
import { getConfirmedCount, getPendingCount } from '@/utils/format'
import styles from './index.module.scss'

const IndexPage: React.FC = () => {
  const parties = usePartyStore(state => state.parties)
  const setCurrentParty = usePartyStore(state => state.setCurrentParty)

  const upcomingParties = parties.filter(p => p.status !== 'completed').slice(0, 3)

  const totalConfirmed = parties.reduce((acc, p) => acc + getConfirmedCount(p.players), 0)
  const totalPending = parties.reduce((acc, p) => acc + getPendingCount(p.players), 0)

  const handlePartyClick = (id: string) => {
    setCurrentParty(id)
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }

  const handleCreate = () => {
    Taro.switchTab({ url: '/pages/create/index' })
  }

  const handleViewAll = () => {
    Taro.switchTab({ url: '/pages/enroll/index' })
  }

  return (
    <View className={styles.container}>
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>🎂 生日剧本杀</Text>
        <Text className={styles.heroSubtitle}>包场不拉群，一键搞定生日局</Text>
      </View>

      <View className={styles.quickActions}>
        <View className={`${styles.actionCard} ${styles.actionPrimary}`} onClick={handleCreate}>
          <Text className={styles.actionIcon}>🎉</Text>
          <Text className={styles.actionTitle}>创建生日局</Text>
          <Text className={styles.actionDesc}>选门店 定剧本</Text>
        </View>
        <View className={`${styles.actionCard} ${styles.actionAccent}`} onClick={handleViewAll}>
          <Text className={styles.actionIcon}>📋</Text>
          <Text className={styles.actionTitle}>查看报名</Text>
          <Text className={styles.actionDesc}>座位进度</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{upcomingParties.length}</Text>
          <Text className={styles.statLabel}>进行中的局</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{totalConfirmed}</Text>
          <Text className={styles.statLabel}>已确认玩家</Text>
        </View>
        <View className={`${styles.statCard} ${styles.statAccent}`}>
          <Text className={styles.statNumber}>{totalPending}</Text>
          <Text className={styles.statLabel}>待回复</Text>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>近期生日局</Text>
        <Text className={styles.sectionMore} onClick={handleViewAll}>查看全部</Text>
      </View>

      <View className={styles.partyList}>
        {upcomingParties.length > 0 ? (
          upcomingParties.map(party => (
            <PartyCard
              key={party.id}
              party={party}
              onClick={handlePartyClick}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎈</Text>
            <Text className={styles.emptyText}>还没有生日局，快来创建一个吧</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default IndexPage
