import { isFunction } from "lodash"

export type Extractor<Model> = (model: Model) => any | undefined
export type FieldConstructorOptions<Model> = { name?: string; extractor?: Extractor<Model> }

export class Field<Model> {
  method: string
  name: string | undefined
  extractor: Extractor<Model> | undefined

  constructor(method: string)
  constructor(method: string, extractor: Extractor<Model>)
  constructor(method: string, options: FieldConstructorOptions<Model>)
  constructor(method: string, extractor: Extractor<Model>, options: FieldConstructorOptions<Model>)
  constructor(
    method: string,
    optionsOrExtractor?: Extractor<Model> | FieldConstructorOptions<Model>,
    options?: FieldConstructorOptions<Model>
  )
  constructor(
    method: string,
    optionsOrExtractor?: Extractor<Model> | FieldConstructorOptions<Model>,
    options?: FieldConstructorOptions<Model>
  ) {
    if (isFunction(optionsOrExtractor)) {
      this.method = method
      this.extractor = optionsOrExtractor
      this.name = options?.name
    } else {
      this.method = method
      this.extractor = options?.extractor
      this.name = options?.name
    }
  }
}
