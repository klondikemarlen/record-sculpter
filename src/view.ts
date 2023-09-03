import { isNil, reduce } from "lodash"

import { Field } from "./field"

export class View<Model extends Record<string, any>> {
  name: string
  fields: Record<string, Field<Model>>

  constructor(name: string) {
    this.name = name
    this.fields = {}
  }

  serialize(model: Model) {
    return reduce(
      this.fields,
      (result: Record<string, any>, field: Field<Model>) => {
        const { method, name, extractor } = field
        if (name !== undefined && extractor !== undefined) {
          result[name] = extractor(model)
        } else if (!isNil(extractor)) {
          result[method] = extractor(model)
        } else {
          result[method] = model[method]
        }
        return result
      },
      {},
    )
  }

  addfields(...methods: string[]): Field<Model>[] {
    return methods.map((method) => {
      return this.addField(method)
    })
  }

  addField(...args: ConstructorParameters<typeof Field<Model>>): Field<Model> {
    const method = args[0]
    const field = new Field<Model>(...args)
    this.fields[method] = field
    return field
  }
}
