import { LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

type InferRelationModel<T, K extends keyof T> = T[K] extends LucidRow[]
  ? T[K][number]
  : T[K] extends LucidRow
    ? T[K]
    : never

type HasRelation<T extends LucidRow> = ExtractModelRelations<T> extends never ? false : true

type Prev = [never, 0, 1, 2, 3, 4]

type NestedRelationCallback<T extends LucidRow, D extends number> = [D] extends [never]
  ? never
  : {
      [K in ExtractModelRelations<T> & string]:
        | `${K}`
        | (HasRelation<InferRelationModel<T, K>> extends true
            ? `${K}.${NestedRelationCallback<InferRelationModel<T, K>, Prev[D]> & string}`
            : never)
    }[ExtractModelRelations<T> & string]

type RelationObject<T extends LucidRow, D extends number> = {
  [K in NestedRelationCallback<T, D> & string]?: (query: ModelQueryBuilderContract<any>) => void
}

type NestedRelation<T extends LucidRow, D extends number> = [D] extends [never]
  ? never
  : {
      [K in ExtractModelRelations<T> & string]:
        | `${K}`
        | `${K}:${string}`
        | (HasRelation<InferRelationModel<T, K>> extends true
            ? `${K}.${NestedRelation<InferRelationModel<T, K>, Prev[D]> & string}`
            : never)
        | RelationObject<T, D>
    }[ExtractModelRelations<T> & string]

export type Relations<T extends LucidRow, D extends number = 4> = NestedRelation<T, D>[]
