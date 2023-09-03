import { isArray, isNil } from "lodash"

import { View } from "./view"

type SerializationOptions = { view?: string }

export default class BaseSerializer<Model extends Record<string, any>> {
  protected views: Record<string, View<Model>>
  protected models: Model[]
  protected model: Model
  protected singular: boolean

  constructor(model: Model)
  constructor(models: Model[])
  constructor(modelOrModels: Model | Model[])
  constructor(modelOrModels: Model | Model[]) {
    if (isArray(modelOrModels)) {
      this.models = modelOrModels
      this.model = modelOrModels[0] // or maybe should be undefined?
      this.singular = false
    } else {
      this.models = [modelOrModels] // or maybe should be undefined?
      this.model = modelOrModels
      this.singular = true
    }

    this.views = {}
    this.registerDefaultView()
  }

  public static serialize<Model extends Record<string, any>>(
    modelOrModels: Model | Model[],
    options: SerializationOptions = {},
  ): Record<string, any>[] | Record<string, any> {
    const instance = new this(modelOrModels)
    return instance.serialize(options)
  }

  public serialize({ view }: SerializationOptions = {}):
    | Record<string, any>[]
    | Record<string, any> {
    return this.callView(view)
  }

  protected callView(viewName: string = "default") {
    const view = this.views[viewName]
    if (isNil("view")) throw new Error(`View ${viewName} has not been declared on serializer.`)

    if (this.singular) {
      return view.serialize(this.model)
    } else {
      return this.models.map((model) => {
        return view.serialize(model)
      })
    }
  }

  protected addView(name: string): View<Model> {
    const view = new View<Model>(name)
    this.views[name] = view
    return view
  }

  protected registerDefaultView() {
    throw new Error("Not implemented")
  }
}
