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
    defaultView.addfields(
      "id",
      "email",
      "firstName",
      "lastName",
      "isAdmin",
      "createdAt"
    )

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

  return response.status(200).json({ data: serializedUsers }) // Send data
})

router.get("/users/:id", (request: Request, response: Response) => {
  const user = User.findByPk(request.params.id) // Retrieval from database, using Sequelize in this example

  if (user === null) {
    return response.status(404).json({ message: "User not found" }) // Handle errors
  }

  const serializedUser = UserSerializer.serialize(user) // Data presentation/serialization

  response.status(200).json({ data: serializedUser }) // Send data
})
```

```typescript
// src/models/user.ts
import { Role } from "@/models"

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

```typescript
class Role {
  constructor(
    public id: number,
    public userId: number,
    public name: string,
  ) {}
}
```

### More Realistic Usage

See [examples/REAMDME.md](./examples/REAMDME.md)

## Development

1. Install `asdf` from https://asdf-vm.com/guide/getting-started.html

2. Install the `nodejs` plugin for asdf via `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`

3. Install the appropriate local `nodejs` version via `asdf install nodejs`

4. Install the project dependencies via `npm install`

5. Run the test suite via `npm run test`

## Future Development

TODO: move away from lodash after I've built the basics to keep the project light.
