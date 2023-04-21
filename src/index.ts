import { join } from 'path'
import { BlockLoader } from './core/block'

const loader = new BlockLoader({
  name: 'Events',
  root: join(__dirname, '..', 'tests', 'events')
})

;(async () => {
  await loader.loadAll()
})()

