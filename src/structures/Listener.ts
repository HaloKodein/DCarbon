import type { Client, ClientEvents } from 'discord.js'
import { Block, BlockContext } from '../core/block'

interface ListenerOptions {
  event?: string
  once?: boolean
}

type InvokeEvents<E> = E extends keyof ClientEvents ? ClientEvents[E] : unknown[]

export abstract class Listener<E extends keyof ClientEvents> extends Block {
  event: string
  once: boolean

  emitter: Client
  _listener: (...args: any[]) => void

  constructor(
    context: BlockContext,
    options: ListenerOptions
  ) {
    super(context)

    this.event = options.event ?? 'ready'
    this.once = options.once ?? false

    this.emitter = this.container.client as Client

    this._listener = this.once
      ? this._invokeOnce.bind(this)
      : this._invoke.bind(this)
  }
  
  abstract invoke(...args: InvokeEvents<E>): unknown

  override async onLoad() {
    const maxListeners = this.emitter.getMaxListeners()

    this.emitter.setMaxListeners(maxListeners + 1)
    this.emitter[this.once ? 'once' : 'on'](
      this.event, this._listener)

    await super.onLoad()
  }

  override async onUnload() {
    const maxListeners = this.emitter.getMaxListeners()

    this.emitter.setMaxListeners(maxListeners - 1)
    this.emitter.off(this.event, this._listener)

    await super.onUnload()
  }

  async _invoke(...args: unknown[]) {
    try {
      await this.invoke(...(args as InvokeEvents<E>))
    } catch(err) {
      this.emitter.emit('ListenerError',
        { block: this, error: err })
    }
  }

  async _invokeOnce(...args: unknown[]) {
    await this._invoke(...args)
    await this.unload()
  }
}

