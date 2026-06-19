import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import TagSelector from '@/components/TagSelector'
import { usePartyStore } from '@/store/partyStore'
import { formatDate, getWeekday } from '@/utils/format'
import type { GameType, Player } from '@/types/party'
import styles from './index.module.scss'

const GAME_TYPES: GameType[] = ['本格', '欢乐', '情感', '恐怖']
const TIME_SLOTS = [
  '10:00-14:00',
  '13:00-17:00',
  '14:00-18:00',
  '15:00-19:00',
  '18:00-22:00',
  '19:00-23:00',
  '20:00-24:00'
]

const AVATARS = [
  'https://picsum.photos/id/64/200/200',
  'https://picsum.photos/id/91/200/200',
  'https://picsum.photos/id/177/200/200',
  'https://picsum.photos/id/338/200/200',
  'https://picsum.photos/id/1027/200/200'
]

const RegisterPage: React.FC = () => {
  const router = useRouter()
  const partyId = router.params.id
  const getPartyById = usePartyStore(state => state.getPartyById)
  const addPlayer = usePartyStore(state => state.addPlayer)
  const setCurrentParty = usePartyStore(state => state.setCurrentParty)

  const [party, setParty] = useState(partyId ? getPartyById(partyId) : undefined)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [isNewbie, setIsNewbie] = useState(false)
  const [rejectedThemes, setRejectedThemes] = useState<GameType[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (partyId) {
      const p = getPartyById(partyId)
      if (p) setParty(p)
    }
  }, [partyId, getPartyById])

  const canSubmit = useMemo(() => {
    if (isAttending === null) return false
    if (!name.trim()) return false
    if (isAttending && timeSlots.length === 0) return false
    return true
  }, [isAttending, name, timeSlots])

  const handleSubmit = () => {
    if (!canSubmit || !partyId) return

    const status = isAttending ? 'confirmed' : 'declined'

    const newPlayer: Player = {
      id: '',
      name: name.trim(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      status,
      role: 'player',
      timeSlots: isAttending ? timeSlots : [],
      dietaryRestrictions: dietaryRestrictions.trim(),
      isNewbie,
      rejectedThemes,
      phone: phone.trim()
    }

    addPlayer(partyId, newPlayer)
    setShowSuccess(true)
    console.info('[Register] Player submitted:', newPlayer.name, 'status:', status)
  }

  const handleDone = () => {
    setShowSuccess(false)
    if (partyId) setCurrentParty(partyId)
    Taro.switchTab({ url: '/pages/enroll/index' })
  }

  const handleBack = () => {
    setShowSuccess(false)
    Taro.navigateBack()
  }

  const handleGoHome = () => {
    setShowSuccess(false)
    Taro.switchTab({ url: '/pages/index/index' })
  }

  if (!party) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✍️</Text>
          <Text className={styles.emptyText}>报名链接不存在或已过期</Text>
          <View className={styles.emptyBtn} onClick={handleGoHome}>
            <Text>返回首页</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>✍️ 填写报名信息</Text>
        <Text className={styles.headerSubtitle}>请如实填写，方便我们做好准备工作</Text>
      </View>

      <View className={styles.partyInfo}>
        <Text className={styles.partyName}>🎂 {party.birthdayPersonName}的生日局</Text>
        <View className={styles.partyMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>📅</Text>
            <Text className={styles.metaText}>{formatDate(party.birthdayDate)} {getWeekday(party.birthdayDate)}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>⏰</Text>
            <Text className={styles.metaText}>{party.birthdayTime}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🏠</Text>
            <Text className={styles.metaText}>{party.storeName}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>是否参加</Text>
        <View className={styles.attendOptions}>
          <View
            className={classnames(
              styles.attendOption,
              isAttending === true && styles.attendOptionYes
            )}
            onClick={() => setIsAttending(true)}
          >
            <Text className={styles.attendIcon}>🎉</Text>
            <Text className={styles.attendText}>我要参加</Text>
          </View>
          <View
            className={classnames(
              styles.attendOption,
              isAttending === false && styles.attendOptionNo
            )}
            onClick={() => setIsAttending(false)}
          >
            <Text className={styles.attendIcon}>😔</Text>
            <Text className={styles.attendText}>遗憾缺席</Text>
          </View>
        </View>

        {isAttending === false && (
          <Text className={styles.regretText}>
            好遗憾，期待下次一起玩！😘
          </Text>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>昵称 *</Text>
          <Input
            className={styles.inputField}
            placeholder="请输入你的昵称"
            value={name}
            onInput={(e) => setName(e.detail.value)}
            maxlength={20}
          />
        </View>

        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>手机号（可选）</Text>
          <Input
            className={styles.inputField}
            type="number"
            placeholder="方便紧急联系"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>
      </View>

      {isAttending === true && (
        <>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>可接受时间段</Text>
            <Text className={styles.fieldLabel}>选择你能参加的时间段（可多选）*</Text>
            <View className={styles.timeSlots}>
              {TIME_SLOTS.map(slot => (
                <View
                  key={slot}
                  className={classnames(
                    styles.timeSlot,
                    timeSlots.includes(slot) && styles.timeSlotSelected
                  )}
                  onClick={() => {
                    if (timeSlots.includes(slot)) {
                      setTimeSlots(timeSlots.filter(s => s !== slot))
                    } else {
                      setTimeSlots([...timeSlots, slot])
                    }
                  }}
                >
                  <Text>{slot}</Text>
                </View>
              ))}
            </View>
            <Text className={styles.tagsHint}>
              当前局开场时间为{party.birthdayTime}，请确保包含该时段
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>饮食禁忌</Text>
            <Textarea
              className={styles.inputField}
              placeholder="有什么忌口的吗？比如不吃辣、海鲜过敏、素食等..."
              value={dietaryRestrictions}
              onInput={(e) => setDietaryRestrictions(e.detail.value)}
              maxlength={100}
            />
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>剧本经验</Text>
            <View className={styles.switchRow}>
              <View>
                <Text className={styles.switchLabel}>我是新手</Text>
                <Text className={styles.switchDesc}>第一次玩剧本杀，需要主持人多照顾</Text>
              </View>
              <View
                className={classnames(styles.switchToggle, isNewbie && styles.switchActive)}
                onClick={() => setIsNewbie(!isNewbie)}
              >
                <View className={classnames(styles.switchKnob, isNewbie && styles.switchKnobActive)} />
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>不能接受的题材</Text>
            <Text className={styles.fieldLabel}>选择你不能接受的剧本类型（可多选）</Text>
            <TagSelector
              options={GAME_TYPES}
              selected={rejectedThemes}
              onChange={(vals) => setRejectedThemes(vals as GameType[])}
              accent={true}
            />
            <Text className={styles.tagsHint}>我们会尽量避开你选的题材安排角色</Text>
          </View>
        </>
      )}

      <View className={styles.submitSection}>
        <View
          className={classnames(
            canSubmit ? styles.btnSubmit : styles.btnSubmitDisabled
          )}
          onClick={canSubmit ? handleSubmit : undefined}
        >
          <Text>提交报名</Text>
        </View>
      </View>

      {showSuccess && (
        <View className={styles.successOverlay}>
          <View className={styles.successCard}>
            <Text className={styles.successIcon}>
              {isAttending ? '🎉' : '❤️'}
            </Text>
            <Text className={styles.successTitle}>
              {isAttending ? '报名成功！' : '已记录'}
            </Text>
            <Text className={styles.successDesc}>
              {isAttending
                ? `我们已记录你的报名信息，${party.birthdayPersonName}会在报名管理页看到你的状态，开场前会有提醒哦！`
                : `虽然这次不能一起来，但心意我们收到了，${party.birthdayPersonName}会看到你的留言的！`}
            </Text>
            <View className={styles.successBtn} onClick={handleDone}>
              <Text>查看报名管理</Text>
            </View>
            <View className={styles.successBtnSecondary} onClick={handleBack}>
              <Text>返回邀请卡</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default RegisterPage
