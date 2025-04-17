import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

declare module '@adonisjs/lucid/types/model' {
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

  type WithRelationObject<T extends LucidRow, D extends number> = {
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
        | WithRelationObject<T, D>
    }[ExtractModelRelations<T> & string]

  export type WithRelation<T extends LucidRow, D extends number = 4> = NestedRelation<T, D>[]
  
  export interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>,
  > {
    withRelation: <Relation extends WithRelation<InstanceType<Model>>>(relations: Relation) => this
  }
}
