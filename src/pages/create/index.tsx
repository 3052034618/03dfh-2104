import React, { useState } from 'react'
import { View, Text, Input, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import TagSelector from '@/components/TagSelector'
import { usePartyStore } from '@/store/partyStore'
import { cities } from '@/data/cities'
import { stores } from '@/data/stores'
import type { GameType, Party } from '@/types/party'
import styles from './index.module.scss'

const GAME_TYPES: GameType[] = ['本格', '欢乐', '情感', '恐怖']
const TIME_SLOTS = ['10:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00']

const CreatePage: React.FC = () => {
  const [step, setStep] = useState(0)
  const [cityIndex, setCityIndex] = useState(-1)
  const [storeIndex, setStoreIndex] = useState(-1)
  const [seatCount, setSeatCount] = useState(6)
  const [dateIndex, setDateIndex] = useState(-1)
  const [timeIndex, setTimeIndex] = useState(-1)
  const [gameTypes, setGameTypes] = useState<GameType[]>([])
  const [needCake, setNeedCake] = useState(false)
  const [needPhoto, setNeedPhoto] = useState(false)
  const [needHostBlessing, setNeedHostBlessing] = useState(false)
  const [birthdayName, setBirthdayName] = useState('')

  const addParty = usePartyStore(state => state.addParty)

  const filteredStores = cityIndex >= 0
    ? stores.filter(s => s.city === cities[cityIndex].id)
    : []

  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = () => {
    const selectedCity = cityIndex >= 0 ? cities[cityIndex] : { id: '', name: '' }
    const selectedStore = storeIndex >= 0 ? filteredStores[storeIndex] : { id: '', name: '', address: '' }
    const selectedDate = dateIndex >= 0
      ? `${dateOptions[dateIndex].getFullYear()}-${String(dateOptions[dateIndex].getMonth() + 1).padStart(2, '0')}-${String(dateOptions[dateIndex].getDate()).padStart(2, '0')}`
      : ''
    const selectedTime = timeIndex >= 0 ? TIME_SLOTS[timeIndex] : ''

    const newParty: Party = {
      id: `p${Date.now()}`,
      city: selectedCity.id,
      storeId: selectedStore.id,
      storeName: selectedStore.name,
      storeAddress: selectedStore.address,
      totalSeats: seatCount,
      birthdayDate: selectedDate,
      birthdayTime: selectedTime,
      gameTypes,
      needCake,
      needPhoto,
      needHostBlessing,
      birthdayPersonName: birthdayName,
      birthdayPersonAvatar: 'https://picsum.photos/id/64/200/200',
      players: [{
        id: `u${Date.now()}`,
        name: birthdayName,
        avatar: 'https://picsum.photos/id/64/200/200',
        status: 'confirmed',
        role: 'birthday',
        timeSlots: [`${selectedTime}-${String(Number(selectedTime.split(':')[0]) + 4).padStart(2, '0')}:00`],
        dietaryRestrictions: '',
        isNewbie: false,
        rejectedThemes: [],
        phone: ''
      }],
      status: 'inviting',
      createdAt: new Date().toISOString().slice(0, 10)
    }

    const result = addParty(newParty)
    console.info('[Create] Party created:', newParty.id, 'reminders:', result.reminders.length)

    Taro.redirectTo({
      url: `/pages/invite/index?id=${newParty.id}&from=create`
    })
  }

  const handleCityChange = (e) => {
    setCityIndex(Number(e.detail.value))
    setStoreIndex(-1)
  }

  const handleStoreChange = (e) => {
    setStoreIndex(Number(e.detail.value))
  }

  const handleDateChange = (e) => {
    setDateIndex(Number(e.detail.value))
  }

  const handleTimeChange = (e) => {
    setTimeIndex(Number(e.detail.value))
  }

  const canNext = () => {
    if (step === 0) return cityIndex >= 0 && storeIndex >= 0
    if (step === 1) return dateIndex >= 0 && timeIndex >= 0 && gameTypes.length > 0
    if (step === 2) return birthdayName.length > 0
    return true
  }

  const renderStepIndicator = () => (
    <View className={styles.steps}>
      {[0, 1, 2, 3].map(i => (
        <React.Fragment key={i}>
          {i > 0 && <View className={classnames(styles.stepLine, i <= step && styles.stepLineDone)} />}
          <View className={classnames(
            styles.stepDot,
            i === step && styles.stepActive,
            i < step && styles.stepDone
          )} />
        </React.Fragment>
      ))}
    </View>
  )

  const renderStep0 = () => (
    <>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择门店</Text>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>城市</Text>
          <Picker mode="selector" range={cities.map(c => c.name)} onChange={handleCityChange} value={cityIndex}>
            <View className={classnames(styles.pickerBtn, cityIndex >= 0 && styles.pickerBtnHasValue)}>
              <Text>{cityIndex >= 0 ? cities[cityIndex].name : '请选择城市'}</Text>
            </View>
          </Picker>
        </View>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>门店</Text>
          <Picker
            mode="selector"
            range={filteredStores.map(s => s.name)}
            onChange={handleStoreChange}
            value={storeIndex}
          >
            <View className={classnames(styles.pickerBtn, storeIndex >= 0 && styles.pickerBtnHasValue)}>
              <Text>{storeIndex >= 0 ? filteredStores[storeIndex].name : (cityIndex >= 0 ? '请选择门店' : '请先选择城市')}</Text>
            </View>
          </Picker>
        </View>
      </View>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>人数设定</Text>
        <View className={styles.seatRow}>
          <View className={styles.seatBtn} onClick={() => setSeatCount(Math.max(3, seatCount - 1))}>
            <Text>-</Text>
          </View>
          <Text className={styles.seatNumber}>{seatCount}</Text>
          <Text className={styles.seatUnit}>人</Text>
          <View className={styles.seatBtn} onClick={() => setSeatCount(Math.min(12, seatCount + 1))}>
            <Text>+</Text>
          </View>
        </View>
      </View>
    </>
  )

  const renderStep1 = () => (
    <>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择日期时间</Text>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>生日日期</Text>
          <Picker mode="selector" range={dateOptions.map(d => `${d.getMonth() + 1}月${d.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][d.getDay()]}`)} onChange={handleDateChange} value={dateIndex}>
            <View className={classnames(styles.pickerBtn, dateIndex >= 0 && styles.pickerBtnHasValue)}>
              <Text>{dateIndex >= 0 ? `${dateOptions[dateIndex].getMonth() + 1}月${dateOptions[dateIndex].getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][dateOptions[dateIndex].getDay()]}` : '请选择日期'}</Text>
            </View>
          </Picker>
        </View>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>开场时间</Text>
          <Picker mode="selector" range={TIME_SLOTS} onChange={handleTimeChange} value={timeIndex}>
            <View className={classnames(styles.pickerBtn, timeIndex >= 0 && styles.pickerBtnHasValue)}>
              <Text>{timeIndex >= 0 ? TIME_SLOTS[timeIndex] : '请选择时间'}</Text>
            </View>
          </Picker>
        </View>
      </View>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>想玩的类型</Text>
        <TagSelector
          options={GAME_TYPES}
          selected={gameTypes}
          onChange={(vals) => setGameTypes(vals as GameType[])}
        />
      </View>
    </>
  )

  const renderStep2 = () => (
    <>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>寿星信息</Text>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldLabel}>寿星昵称</Text>
          <Input
            className={styles.inputField}
            placeholder="请输入寿星昵称"
            value={birthdayName}
            onInput={(e) => setBirthdayName(e.detail.value)}
          />
        </View>
      </View>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>附加服务</Text>
        <View className={styles.optionRow}>
          <View>
            <Text className={styles.optionLabel}>生日蛋糕</Text>
            <Text className={styles.optionDesc}>门店代订精美蛋糕</Text>
          </View>
          <View className={classnames(styles.switchToggle, needCake && styles.switchActive)} onClick={() => setNeedCake(!needCake)}>
            <View className={classnames(styles.switchKnob, needCake && styles.switchKnobActive)} />
          </View>
        </View>
        <View className={styles.optionRow}>
          <View>
            <Text className={styles.optionLabel}>拍照留念</Text>
            <Text className={styles.optionDesc}>专业跟拍记录精彩瞬间</Text>
          </View>
          <View className={classnames(styles.switchToggle, needPhoto && styles.switchActive)} onClick={() => setNeedPhoto(!needPhoto)}>
            <View className={classnames(styles.switchKnob, needPhoto && styles.switchKnobActive)} />
          </View>
        </View>
        <View className={styles.optionRow}>
          <View>
            <Text className={styles.optionLabel}>主持带祝福环节</Text>
            <Text className={styles.optionDesc}>DM在剧本中融入生日祝福</Text>
          </View>
          <View className={classnames(styles.switchToggle, needHostBlessing && styles.switchActive)} onClick={() => setNeedHostBlessing(!needHostBlessing)}>
            <View className={classnames(styles.switchKnob, needHostBlessing && styles.switchKnobActive)} />
          </View>
        </View>
      </View>
    </>
  )

  const renderStep3 = () => {
    const selectedCity = cityIndex >= 0 ? cities[cityIndex].name : '-'
    const selectedStore = storeIndex >= 0 ? filteredStores[storeIndex].name : '-'
    const selectedDate = dateIndex >= 0 ? `${dateOptions[dateIndex].getMonth() + 1}月${dateOptions[dateIndex].getDate()}日` : '-'
    const selectedTime = timeIndex >= 0 ? TIME_SLOTS[timeIndex] : '-'

    return (
      <>
        <View className={styles.previewCard}>
          <Text className={styles.previewTitle}>🎂 {birthdayName}的生日局</Text>
          <View className={styles.previewInfo}>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>城市</Text>
              <Text className={styles.previewValue}>{selectedCity}</Text>
            </View>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>门店</Text>
              <Text className={styles.previewValue}>{selectedStore}</Text>
            </View>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>日期</Text>
              <Text className={styles.previewValue}>{selectedDate}</Text>
            </View>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>时间</Text>
              <Text className={styles.previewValue}>{selectedTime}</Text>
            </View>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>人数</Text>
              <Text className={styles.previewValue}>{seatCount}人</Text>
            </View>
            <View className={styles.previewItem}>
              <Text className={styles.previewLabel}>类型</Text>
              <Text className={styles.previewValue}>{gameTypes.join(' / ') || '-'}</Text>
            </View>
          </View>
        </View>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>附加服务确认</Text>
          {needCake && <Text className={styles.fieldLabel}>🎂 生日蛋糕 - 已选</Text>}
          {needPhoto && <Text className={styles.fieldLabel}>📷 拍照留念 - 已选</Text>}
          {needHostBlessing && <Text className={styles.fieldLabel}>🎁 主持带祝福环节 - 已选</Text>}
          {!needCake && !needPhoto && !needHostBlessing && (
            <Text className={styles.fieldLabel}>未选择附加服务</Text>
          )}
        </View>
      </>
    )
  }

  return (
    <View className={styles.container}>
      {renderStepIndicator()}
      <View className={styles.stepLabels}>
        {['选门店', '定剧本', '加服务', '确认'].map((label, i) => (
          <Text key={i} className={classnames(styles.stepLabel, i === step && styles.stepLabelActive)}>{label}</Text>
        ))}
      </View>

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <View className={styles.footer}>
        {step > 0 && (
          <View className={styles.btnPrev} onClick={handlePrev}>
            <Text>上一步</Text>
          </View>
        )}
        {step < 3 ? (
          <View className={classnames(styles.btnNext, !canNext() && styles.btnPrev)} onClick={canNext() ? handleNext : undefined}>
            <Text>下一步</Text>
          </View>
        ) : (
          <View className={styles.btnSubmit} onClick={handleSubmit}>
            <Text>生成邀请卡</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default CreatePage
