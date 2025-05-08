import { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import { ExtractModelRelations, ModelRelations } from '@adonisjs/lucid/types/relations'

type InferRelationModel<T, K extends keyof T> = T[K] extends LucidRow[]
  ? T[K][number]
  : T[K] extends LucidRow
    ? T[K]
    : never

type HasRelation<T extends LucidRow> = ExtractModelRelations<T> extends never ? false : true

type RelationObject<T extends LucidRow> = {
  [K in ExtractModelRelations<T> & string & string]?: (
    query: T[K] extends ModelRelations<LucidModel, LucidModel> ? T[K]['builder'] : never
  ) => void | undefined
}

type NestedRelation<T extends LucidRow, D extends number> = [D] extends [never]
  ? never
  : {
      [K in ExtractModelRelations<T> & string]:
        | K
        | `${K}:${string}`
        | (HasRelation<InferRelationModel<T, K>> extends true
            ? `${K}.${NestedRelation<InferRelationModel<T, K>, [never, 0, 1, 2, 3, 4][D]> & string}`
            : never)
        | RelationObject<T>
    }[ExtractModelRelations<T> & string]

export type Relations<T extends LucidRow, D extends number = 4> = NestedRelation<T, D>[]
