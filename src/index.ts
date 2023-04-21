import { BlockStore } from './core/block'
import { Client } from 'discord.js'

const TOKEN = 'MTA1MzcyMzQxMjUxOTk4MTE4Ng.G_qcTs.aryhuURwMYF05kfBwhY9HccK_BkjuxBVUJqRzo'

const loader = new BlockStore({
  name: 'Events',
  root: BlockStore.parseRoot('tests', 'events')
})

const client = new Client({
  intents: []
})

async function bootstrap() {
  await loader
    .registerContainerClient(client)
    .loadAll()

  client.login(TOKEN)
}

bootstrap()

