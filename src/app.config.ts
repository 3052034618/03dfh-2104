export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/create/index',
    'pages/enroll/index',
    'pages/remind/index',
    'pages/detail/index',
    'pages/invite/index',
    'pages/register/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F8F7FF',
    navigationBarTitleText: '生日剧本杀',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#7C5CFC',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/create/index',
        text: '创建'
      },
      {
        pagePath: 'pages/enroll/index',
        text: '报名'
      },
      {
        pagePath: 'pages/remind/index',
        text: '提醒'
      }
    ]
  }
})
