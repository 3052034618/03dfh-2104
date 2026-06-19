import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { usePartyStore, encodePartyForUrl, decodePartyFromUrl } from '@/store/partyStore'
import { getConfirmedCount, formatDate, getWeekday } from '@/utils/format'
import type { Party } from '@/types/party'
import styles from './index.module.scss'

const isH5 = typeof window !== 'undefined' && Taro.getEnv() === 'WEB'

const InvitePage: React.FC = () => {
  const router = useRouter()
  const partyId = router.params.id
  const dataParam = router.params.data
  const from = router.params.from
  const getPartyById = usePartyStore(state => state.getPartyById)
  const setCurrentParty = usePartyStore(state => state.setCurrentParty)
  const importParty = usePartyStore(state => state.importParty)

  const [party, setParty] = useState<Party | undefined>(() => {
    if (!partyId) return undefined
    const existing = getPartyById(partyId)
    if (existing) return existing
    if (dataParam) {
      const decoded = decodePartyFromUrl(dataParam)
      if (decoded && decoded.id === partyId) {
        importParty(decoded)
        return decoded
      }
    }
    return undefined
  })

  useEffect(() => {
    if (partyId) {
      const existing = getPartyById(partyId)
      if (existing) {
        setParty(existing)
        setCurrentParty(partyId)
        return
      }
      if (dataParam) {
        const decoded = decodePartyFromUrl(dataParam)
        if (decoded && decoded.id === partyId) {
          importParty(decoded)
          setParty(decoded)
          setCurrentParty(partyId)
        }
      }
    }
  }, [partyId, dataParam, getPartyById, setCurrentParty, importParty])

  const confirmed = useMemo(() => party ? getConfirmedCount(party.players) : 0, [party])
  const progressPercent = useMemo(() => party ? Math.round((confirmed / party.totalSeats) * 100) : 0, [party, confirmed])

  const sharePath = useMemo(() => {
    if (!party || !partyId) return '/pages/index/index'
    const encoded = encodePartyForUrl(party)
    return `/pages/invite/index?id=${partyId}&data=${encoded}`
  }, [party, partyId])

  useShareAppMessage(() => {
    if (!party) return { title: '生日剧本杀邀请', path: '/pages/index/index' }
    return {
      title: `🎂 ${party.birthdayPersonName}邀请你参加生日剧本杀！`,
      path: sharePath
    }
  })

  const handleShareH5 = () => {
    if (!party || !partyId) return
    const encoded = encodePartyForUrl(party)
    const url = `${window.location.origin}${window.location.pathname}#/pages/invite/index?id=${partyId}&data=${encoded}`
    Taro.setClipboardData({
      data: url,
      success: () => {
        Taro.showToast({ title: '链接已复制，发给好友吧', icon: 'success' })
      }
    })
  }

  const handleEnroll = () => {
    if (!partyId) return
    Taro.navigateTo({
      url: `/pages/register/index?id=${partyId}`
    })
  }

  const handleBackToEnroll = () => {
    Taro.switchTab({ url: '/pages/enroll/index' })
  }

  const handleGoCreate = () => {
    Taro.switchTab({ url: '/pages/create/index' })
  }

  if (!party) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📨</Text>
          <Text className={styles.emptyText}>邀请卡不存在或已过期</Text>
          <View className={styles.emptyBtn} onClick={handleGoCreate}>
            <Text>去创建生日局</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.inviteCard}>
        <Text className={styles.decoration}>🎉</Text>

        <View className={styles.header}>
          <Text className={styles.inviteTitle}>🎂 {party.birthdayPersonName}的生日局</Text>
          <Text className={styles.inviteSubtitle}>诚邀你参加这场剧本杀派对</Text>
        </View>

        <View className={styles.birthdaySection}>
          <Image
            className={styles.avatar}
            src={party.birthdayPersonAvatar}
            mode="aspectFill"
          />
          <View className={styles.birthdayInfo}>
            <Text className={styles.birthdayName}>
              {party.birthdayPersonName}
              <Text className={styles.birthdayCrown}>👑</Text>
            </Text>
            <Text className={styles.birthdayLabel}>今日寿星</Text>
          </View>
        </View>

        <View className={styles.infoGrid}>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>🏙</Text>
            <Text className={styles.infoLabel}>城市</Text>
            <Text className={styles.infoValue}>
              {party.city === 'bj' ? '北京' : party.city === 'sh' ? '上海' : party.city === 'gz' ? '广州' : party.city === 'sz' ? '深圳' : party.city === 'cd' ? '成都' : party.city === 'hz' ? '杭州' : party.city === 'nj' ? '南京' : party.city === 'wh' ? '武汉' : party.city === 'cq' ? '重庆' : party.city === 'xa' ? '西安' : party.city}
            </Text>
          </View>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>🏠</Text>
            <Text className={styles.infoLabel}>门店</Text>
            <Text className={styles.infoValue}>{party.storeName}</Text>
          </View>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>📅</Text>
            <Text className={styles.infoLabel}>日期</Text>
            <Text className={styles.infoValue}>{formatDate(party.birthdayDate)} {getWeekday(party.birthdayDate)}</Text>
          </View>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>⏰</Text>
            <Text className={styles.infoLabel}>时间</Text>
            <Text className={styles.infoValue}>{party.birthdayTime}</Text>
          </View>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>👥</Text>
            <Text className={styles.infoLabel}>人数</Text>
            <Text className={styles.infoValue}>{confirmed}/{party.totalSeats}人</Text>
          </View>
          <View className={styles.infoCard}>
            <Text className={styles.infoIcon}>🎭</Text>
            <Text className={styles.infoLabel}>状态</Text>
            <Text className={styles.infoValue}>
              {confirmed >= party.totalSeats ? '已满员' : '报名中'}
            </Text>
          </View>
        </View>

        <View className={styles.gameTypesSection}>
          <Text className={styles.sectionLabel}>想玩的剧本类型</Text>
          <View className={styles.tags}>
            {party.gameTypes.map(type => (
              <View key={type} className={styles.tag}>
                <Text className={styles.tagText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.servicesSection}>
          <Text className={styles.sectionLabel}>附加服务</Text>
          {(party.needCake || party.needPhoto || party.needHostBlessing) ? (
            <View className={styles.servicesList}>
              {party.needCake && (
                <View className={styles.serviceItem}>
                  <Text className={styles.serviceIcon}>🎂</Text>
                  <Text className={styles.serviceText}>生日蛋糕</Text>
                </View>
              )}
              {party.needPhoto && (
                <View className={styles.serviceItem}>
                  <Text className={styles.serviceIcon}>📷</Text>
                  <Text className={styles.serviceText}>拍照留念</Text>
                </View>
              )}
              {party.needHostBlessing && (
                <View className={styles.serviceItem}>
                  <Text className={styles.serviceIcon}>🎁</Text>
                  <Text className={styles.serviceText}>主持祝福</Text>
                </View>
              )}
            </View>
          ) : (
            <Text className={styles.noServices}>未选择附加服务</Text>
          )}
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>报名进度</Text>
            <Text className={styles.progressValue}>{confirmed}/{party.totalSeats}人</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </View>
          <Text className={styles.progressHint}>
            {confirmed >= party.totalSeats
              ? '🎉 已满员！'
              : `还缺${party.totalSeats - confirmed}人，快转发邀请好友吧！`}
          </Text>
        </View>
      </View>

      <View className={styles.footer}>
        {from === 'create' ? (
          <>
            <View className={styles.btnBack} onClick={handleBackToEnroll}>
              <Text>查看报名管理</Text>
            </View>
            {isH5 ? (
              <View className={styles.btnShare} onClick={handleShareH5}>
                <Text>复制链接给好友</Text>
              </View>
            ) : (
              <Button className={styles.btnShare} openType="share">
                转发给好友
              </Button>
            )}
          </>
        ) : (
          <>
            {isH5 ? (
              <View className={styles.btnShare} onClick={handleShareH5}>
                <Text>复制链接邀请</Text>
              </View>
            ) : (
              <Button className={styles.btnShare} openType="share">
                转发邀请
              </Button>
            )}
            <View className={styles.btnEnroll} onClick={handleEnroll}>
              <Text>我要报名</Text>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default InvitePage
