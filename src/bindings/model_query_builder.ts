import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import { Relations } from '../types.js'

export function extendModelQueryBuilder(builder: any) {
  builder.macro('relations', function <
    T extends LucidRow,
  >(this: ModelQueryBuilderContract<LucidModel>, relations: Relations<T>) {
    const listRelations = Array.isArray(relations) ? relations : [relations]

    for (const relation of listRelations) {
      // If string relation in array
      if (typeof relation === 'string') {
        const [modelRelation, columnSelected] = relation.split(':')
        const modelRelations: string[] = modelRelation.split('.')
        const columns = columnSelected?.split(',') ?? ['*']

        preloadRecursiveWithColumn(this, modelRelations, columns)
      }

      // If object { relation: callback } in array
      else if (typeof relation === 'object' && !Array.isArray(relation)) {
        for (const key in relation as Record<string, any>) {
          const modelRelations = key.split('.')

          preloadRecursiveWithCallback(this, modelRelations, relation[key as keyof typeof relation])
        }
      }
    }

    return this
  })
}

function preloadRecursiveWithColumn(
  query: ModelQueryBuilderContract<LucidModel>,
  relationPath: string[],
  columns: string[]
) {
  const [current, ...rest] = relationPath
  const relationship = current as unknown as ExtractModelRelations<LucidRow>

  query.preload(relationship, (nestedQuery: any) => {
    if (rest.length > 0) {
      preloadRecursiveWithColumn(nestedQuery, rest, columns)
    } else if (columns.length > 0) {
      nestedQuery.select(
        columns.map((column) => string.condenseWhitespace(string.snakeCase(column)))
      )
    }
  })
}

function preloadRecursiveWithCallback(
  query: ModelQueryBuilderContract<LucidModel>,
  relationPath: string[],
  callback: any
) {
  const [current, ...rest] = relationPath
  const relationship = current as unknown as ExtractModelRelations<LucidRow>

  if (rest.length > 0) {
    query.preload(relationship, (nestedQuery: any) => {
      preloadRecursiveWithCallback(nestedQuery, rest, callback)
    })
  } else {
    query.preload(relationship, callback)
  }
}
