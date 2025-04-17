import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { WithRelation } from './types.js'
import { LucidRow } from '@adonisjs/lucid/types/model'
import {
  ChainableContract,
  ExcutableQueryBuilderContract,
} from '@adonisjs/lucid/types/querybuilder'

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    withRelation(relations: WithRelation<LucidRow>): this
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
    extends ChainableContract,
      ExcutableQueryBuilderContract<Result[]> {
    withRelation: <Relation extends WithRelation<InstanceType<Model>>>(relations: Relation) => this
  }
}

ModelQueryBuilder.macro('withRelation', function <
  T extends LucidRow,
>(this: ModelQueryBuilder, relations: WithRelation<T>) {
  const listRelations = Array.isArray(relations) ? relations : [relations]

  function preloadRecursiveWithColumn(
    query: ModelQueryBuilder,
    relationPath: string[],
    columns: string[]
  ) {
    const [current, ...rest] = relationPath

    query.preload(current, (nestedQuery: any) => {
      if (rest.length > 0) {
        preloadRecursiveWithColumn(nestedQuery, rest, columns)
      } else if (columns.length > 0) {
        nestedQuery.select(columns)
      }
    })
  }

  function preloadRecursiveWithCallback(
    query: ModelQueryBuilder,
    relationPath: string[],
    callback: any
  ) {
    const [current, ...rest] = relationPath

    if (rest.length > 0) {
      query.preload(current, (nestedQuery: any) => {
        preloadRecursiveWithCallback(nestedQuery, rest, callback)
      })
    } else {
      query.preload(current, callback)
    }
  }

  for (const relation of listRelations) {
    // If string
    if (typeof relation === 'string') {
      const [modelRelation, columnString] = relation.split(':')
      const modelRelations = modelRelation.split('.')
      const columns = columnString?.split(',') ?? ['*']

      preloadRecursiveWithColumn(this, modelRelations, columns)
    }

    // If object { relation: callback }
    else if (typeof relation === 'object' && !Array.isArray(relation)) {
      for (const key in relation as Record<string, any>) {
        const modelRelations = key.split('.')

        preloadRecursiveWithCallback(this, modelRelations, relation[key as keyof typeof relation])
      }
    }
  }

  return this
})
