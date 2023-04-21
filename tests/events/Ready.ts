import { Block, BlockContext } from '../../src/core/block/'

export class Ready extends Block {
  constructor(context: BlockContext) {
    super(context)
  }

  override async onLoad() {
    console.log('Eu fui realmente carregado!!')
  }

  override async onUnload() {
    console.log('Eu fui realmente descarregado!!')
  }
}

