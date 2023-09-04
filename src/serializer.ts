import { isArray, isNil } from "lodash"

import { View } from "./view"

type SerializationOptions = { view?: string }
type ViewSetupFunction<Model extends Record<string, any>> = (view: View<Model>) => void

export class Serializer<Model extends Record<string, any>> {
  public static serialize<Model extends Record<string, any>>(
    modelOrModels: Model | Model[],
    options: SerializationOptions = {},
  ): Record<string, any>[] | Record<string, any> {
    const instance = new this(modelOrModels)
    return instance.serialize(options)
  }

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
  }

  public serialize({ view }: SerializationOptions = {}):
    | Record<string, any>[]
    | Record<string, any> {
    return this.callView(view)
  }

  public addView(setupFunction: ViewSetupFunction<Model>): View<Model>
  public addView(viewName: string, setupFunction: ViewSetupFunction<Model>): View<Model>
  public addView(viewNameOrSetupFunction: string | ViewSetupFunction<Model>, setupFunction?: ViewSetupFunction<Model>): View<Model>
  public addView(viewNameOrSetupFunction: string | ViewSetupFunction<Model>, setupFunction?: ViewSetupFunction<Model>): View<Model> {
    let viewName;
    let definiteSetupFunction;
    if (typeof viewNameOrSetupFunction === "function") {
      definiteSetupFunction = viewNameOrSetupFunction
      viewName = "default"
    } else if (typeof viewNameOrSetupFunction === "string" && typeof setupFunction === "function") {
      viewName = viewNameOrSetupFunction
      definiteSetupFunction = setupFunction
    } else {
      throw new Error("Invalid view name or setup function")
    }

    const view = new View<Model>(viewName)
    this.views[viewName] = view
    definiteSetupFunction(view)
    return view
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
}
