import type { Reminder } from '@/types/party'

export const reminders: Reminder[] = [
  {
    id: 'r1',
    partyId: 'p1',
    partyName: '小明生日局',
    role: 'birthday',
    content: '你是今天的寿星！请查看仪式流程，准备好迎接惊喜',
    arrivalTime: '13:30',
    dressSuggestion: '可穿便装，建议浅色系服装，拍照效果更好',
    taboos: ['不要提前看剧本', '不要透露生日惊喜内容'],
    ceremonyFlow: ['13:30 到店签到', '14:00 主持人开场介绍', '14:15 分发角色剧本', '17:30 剧本复盘', '17:45 蛋糕环节', '18:00 合影留念', '18:15 自由交流'],
    storeAddress: '朝阳区建国路88号SOHO现代城B座3层',
    countdown: '3天后'
  },
  {
    id: 'r2',
    partyId: 'p1',
    partyName: '小明生日局',
    role: 'player',
    content: '小明生日局即将开始，请准时到场，准备一份好心情！',
    arrivalTime: '13:45',
    dressSuggestion: '休闲装即可，避免红色（与剧情冲突）',
    taboos: ['不要迟到', '不要提前剧透', '不要穿红色衣服'],
    ceremonyFlow: [],
    storeAddress: '朝阳区建国路88号SOHO现代城B座3层',
    countdown: '3天后'
  },
  {
    id: 'r3',
    partyId: 'p2',
    partyName: '阿杰生日局',
    role: 'birthday',
    content: '你是今天的寿星！准备好迎接惊喜了吗？',
    arrivalTime: '18:30',
    dressSuggestion: '可穿便装，夜晚局建议深色系更有氛围',
    taboos: ['不要提前看剧本', '恐怖本注意心态调节'],
    ceremonyFlow: ['18:30 到店签到', '19:00 主持人开场', '19:15 分发角色', '22:30 复盘', '22:45 蛋糕环节', '23:00 结束'],
    storeAddress: '徐汇区漕溪北路398号5层',
    countdown: '10天后'
  },
  {
    id: 'r4',
    partyId: 'p2',
    partyName: '阿杰生日局',
    role: 'player',
    content: '阿杰的生日恐怖局即将开始！胆小者做好心理准备',
    arrivalTime: '18:45',
    dressSuggestion: '深色休闲装，增强恐怖沉浸感',
    taboos: ['不要迟到', '不要玩手机', '不要提前搜剧本攻略'],
    ceremonyFlow: [],
    storeAddress: '徐汇区漕溪北路398号5层',
    countdown: '10天后'
  },
  {
    id: 'r5',
    partyId: 'p3',
    partyName: '小雨生日局',
    role: 'player',
    content: '小雨的欢乐生日局即将开始！准备好欢笑吧',
    arrivalTime: '12:45',
    dressSuggestion: '休闲装，建议亮色系，配合欢乐主题',
    taboos: ['不要迟到', '注意忌口通知'],
    ceremonyFlow: [],
    storeAddress: '天河区体育西路191号4层',
    countdown: '24天后'
  },
  {
    id: 'r6',
    partyId: 'p4',
    partyName: '小凯生日局',
    role: 'player',
    content: '小凯生日局明天就要开始啦！请查看详情',
    arrivalTime: '14:45',
    dressSuggestion: '休闲舒适即可',
    taboos: ['不要迟到', '不要提前剧透'],
    ceremonyFlow: [],
    storeAddress: '海淀区中关村大街28号5层',
    countdown: '明天'
  }
]
