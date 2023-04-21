export interface BlockContext {
  path: string
  name: string
}

export abstract class Block {
  path: string
  name: string

  constructor({ path, name }: BlockContext) {
    this.path = path
    this.name = name ?? 'Unknown Block'
  }

  abstract onLoad(): unknown
  abstract onUnload(): unknown
}

