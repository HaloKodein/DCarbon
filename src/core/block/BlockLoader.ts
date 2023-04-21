import { basename } from 'path'
import { preload, walk } from '../../strategy/Loader'

import { Block } from './Block'

export interface BlockLoaderContext {
  name: string
  root: string
  skipExistingBlock?: boolean
}

export class BlockLoader extends Map<string, Block> {
  private name: string
  private root: string

  private skipExistingBlock: boolean

  constructor({ name, root, skipExistingBlock }: BlockLoaderContext) {
    super()

    this.name = name
    this.root = root

    this.skipExistingBlock = skipExistingBlock
      ?? true
  }

  private async insert(block: Block) {
    const alreadyHas = this.has(block.name)

    if (alreadyHas && this.skipExistingBlock) {
      return console.log(
        `[BlockLoader -> ${this.name}] Block ${block.name} has been skiped.`)
    } else if (alreadyHas && !this.skipExistingBlock) {
      this.unload(block)
    }

    this.set(block.name, block)

    console.log(
      `[BlockLoader -> ${this.name}] Block ${block.name} has been loaded.`)

    await block.onLoad()
  }

  private async unload(block: Block) {
    this.delete(block.name)

    console.log(
      `[BlockLoader -> ${this.name}] Block ${block.name} has been unloaded.`)

    await block.onUnload()
  }

  private async load(path: string) {
    const name = basename(path)

    for await (const ctor of preload(path))
      await this.insert(new ctor({ name, path }))
  }

  async loadAll() {
    for await (const path of walk(this.root))
      this.load(path)
  }
}

