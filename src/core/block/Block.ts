import { BlockStore } from './BlockLoader'
import { Container, container } from '../Container'

export interface BlockContext {
  path: string
  name: string
  store: BlockStore
}

export abstract class Block {
  path: string
  name: string
  store: BlockStore 
  container: Container

  constructor({ path, name, store }: BlockContext) {
    this.path = path
    this.name = name ?? 'Unknown Block'
    this.container = container
    this.store = store
  }

  async unload() {
    await this.store
      .unload(this)
  }

  onLoad(): unknown {
    return null
  }

  onUnload(): unknown {
    return null
  }
}

