# Examples

TODO: validate this code

Includes everything from the simplistic usage, except the routes section.

```typescript
// src/constrollers/base-controller.ts
import express, { type Request, type Response, type NextFuction } from "express"

export class BaseController {
  construtor(public request: Request, public response: Response, public next: NextFunction) {}

  static index(request: Request, response: Response, next: NextFunction) {
    const controller = new this(request, response, next)
    return controller.index()
  }

  static show(request: Request, response: Response, next: NextFunction) {
    const controller = new this(request, response, next)
    return controller.show()
  }

  index() {
    throw new Error("Not implemented")
  }

  show() {
    throw new Error("Not implemented")
  }

  create() {
    throw new Error("Not implemented")
  }

  update() {
    throw new Error("Not implemented")
  }

  delete() {
    throw new Error("Not implemented")
  }
}
```

```typescript
// src/controllers/users-controller.ts
import { BaseController } from "@/controllers"
import { UserSerializer } from "@/serializers"
import { User } from "@/models"

export class UsersController extends BaseController {
  async index() {
    await const users = User.findAll() // Retrieval from database, using Sequelize in this example

    const serializedUsers = UserSerializer.serialize(users) // Data presentation/serialization

   return this.response.status(200).json({ users: serializedUsers }) // Return data
  }

  async show() {
    const user = await User.findByPk(this.params.id) // Retrieval from database, using Sequelize in this example

    if (user === null) return this.response.status(404).json({ message: "User not found" }) // Return 404 if user not found

    const serializedUser = UserSerializer.serialize(user) // Data presentation/serialization

    return this.response.status(200).json({ user: serialized }) // Return data
  }
}
```

```typescript
// src/routes.ts
export const router = express.Router()

// Just like with Rails -> https://guides.rubyonrails.org/routing.html
router.get("/users", UsersController.index)
router.get("/users/:id", UsersController.show)
```
