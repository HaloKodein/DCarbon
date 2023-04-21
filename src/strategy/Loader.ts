import { readdir } from 'fs/promises'
import { Block, BlockContext } from '../core/block/Block'
import { join } from 'path'

type Ctor<T, R> = new (param: T) => R

export async function* preload<T extends Block>(path: string) {
  const module = await require(path)

  delete require.cache[require.resolve(path)]

  for (const ctor of Object.values(module))
    yield ctor as Ctor<BlockContext, T>
}

export async function* walk(root: string) {
  const items = await readdir(root)

  for (const item of items)
    yield join(root, item)
}

