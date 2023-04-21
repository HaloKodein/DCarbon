import { basename, join } from 'path'
import { preload, walk } from '../../strategy/Loader'

import { Block } from './Block'
import { container } from '../Container'
import { Client } from 'discord.js'

export interface BlockStoreContext {
  name: string
  root: string
  skipExistingBlock?: boolean
}

export class BlockStore extends Map<string, Block> {
  private name: string
  private root: string

  private skipExistingBlock: boolean

  static parseRoot(...rest: string[]): string {
    return join(process.cwd(), ...rest)
  }

  constructor({ name, root, skipExistingBlock }: BlockStoreContext) {
    super()

    this.name = name
    this.root = root

    this.skipExistingBlock = skipExistingBlock
      ?? true
  }

  registerContainerClient(client: Client): BlockStore {
    container.client = client

    return this
  }

  private async insert(block: Block) {
    const alreadyHas = this.has(block.name)

    if (alreadyHas && this.skipExistingBlock) {
      return console.log(
        `[BlockStore -> ${this.name}] Block ${block.name} has been skiped.`)
    } else if (alreadyHas && !this.skipExistingBlock) {
      this.unload(block)
    }

    this.set(block.name, block)

    console.log(
      `[BlockStore -> ${this.name}] Block ${block.name} has been loaded.`)

    await block.onLoad()
  }

  async unload(block: Block) {
    this.delete(block.name)

    console.log(
      `[BlockStore -> ${this.name}] Block ${block.name} has been unloaded.`)

    await block.onUnload()
  }

  async load(path: string) {
    const name = basename(path)

    const store = this

    for await (const ctor of preload(path))
      await this.insert(
        new ctor({ name, path, store }))
  }

  async loadAll(root?: string) {
    for await (const path of walk(root ?? this.root))
      this.load(path)
  }
}

