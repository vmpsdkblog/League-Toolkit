import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import NaiveUIProviderApp from './NaiveUIProviderApp.vue'
import './assets/css/styles.less'
import { setupLeagueToolkitFeatures } from './features'
import { router } from './routes'

dayjs.extend(relativeTime)
dayjs.extend(duration)

const app = createApp(NaiveUIProviderApp)
app.use(router)
app.use(createPinia())

try {
  await setupLeagueToolkitFeatures()
} catch (err) {
  console.error('League Toolkit 无法正确加载：', err)
} finally {
  app.mount('#app')
}
