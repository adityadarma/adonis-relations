import type { ApplicationService } from '@adonisjs/core/types'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { Relations } from '../src/types.js'

export default class RelationsProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { extendModelQueryBuilder } = await import('../src/bindings/model_query_builder.js')

    extendModelQueryBuilder(ModelQueryBuilder)
  }
}

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    relations(relations: any): this
  }
}

declare module '@adonisjs/lucid/types/model' {
  export interface ModelQueryBuilderContract<Model extends LucidModel> {
    relations: <Relation extends Relations<InstanceType<Model>>>(relations: Relation) => this
  }
}
