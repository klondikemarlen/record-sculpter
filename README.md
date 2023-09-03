# Record Sculptor

A flexible library for serializing records into customizable views written in TypeScript. Inspired by Blueprinter, Record Sculptor aims to provide a simple yet powerful way to present and manipulate data objects.

## Installation and Usage

TODO: actually published this package, but it will likely look something like this:

Using npm:

```
npm install --save record-sculptor
```

### Simplistic Usage

TODO: validate this code

```typescript
// src/serializers/user-serialiser.ts
import recordSculptor from "record-sculptor"

import { user } from "@/models"

class UserSerializer extends recordSculptor.Base<User> {
  constructor(userOrUsers: User | User[]) {
    super(userOrUsers)
  }

  protected registerDefaultView() {
    const defaultView = this.addView("default")
    defaultView.addfields("id", "email", "firstName", "lastName", "isAdmin", "createdAt")

    defaultView.addField(
      "displayName",
      (user: User): string => `${user.firstName} ${user.lastName}`,
    )
    return defaultView
  }
}
```

```typescript
// src/routes.ts
import express, { type Request, type Response } from "express"

import { User } from "@/models"
import { UserSerializer } from "@/serializers"

export const router = express.Router()

router.get("/users", (request: Request, response: Response) => {
  await const users = User.findAll() // Retrieval from database, using Sequelize in this example

  const serializedUsers = UserSerializer.serialize(users) // Data presentation/serialization

  return response.status(200).json({ data: serializedUsers }) // Send data and handle errors
})

router.get("/users/:id", (request: Request, response: Response) => {

})
```

```typescript
// src/models/user.ts
class User {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public isAdmin?: boolean,
    public createdAt?: Date,
    public roles?: Array<Role>,
  ) {}
}
```

### More Realistic Usage

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

## Development

1. Install `asdf` from https://asdf-vm.com/guide/getting-started.html

2. Install the `nodejs` plugin for asdf via `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`

3. Install the appropriate local `nodejs` version via `asdf install nodejs`

4. Install the project dependencies via `npm install`

5. Run the test suite via `npm run test`

## Future Development

TODO: move away from lodash after I've built the basics to keep the project light.
