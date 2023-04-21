import { Listener } from '../../src/structures/Listener'
import { BlockContext } from '../../src/core/block/'
import { Client } from 'discord.js'

export class Ready extends Listener<'ready'> {
  constructor(context: BlockContext) {
    super(context, {
      once: true,
      event: 'ready'
    })
  }

  invoke(client: Client) {
    console.log(client.user?.username)
  }
}

