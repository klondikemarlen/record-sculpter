# Record Sculptor

A flexible library for serializing records into customizable views written in TypeScript. Inspired by Blueprinter, Record Sculptor aims to provide a simple yet powerful way to present and manipulate data objects.

## Installation and Usage

TODO: actually published this package, but it will likely look something like this:

Using npm:

```
npm install --save record-sculptor
```

### Simplistic Usage

See [examples/README.md](./examples/README.md) for a more realistic example.

TODO: validate this code

```typescript
// src/serializers/user-serialiser.ts
import recordSculptor from "record-sculptor"

import { User, Role } from "@/models"

import { RoleSerializer } from "@/serializers"

class UserSerializer extends recordSculptor.Base<User> {}

 // Default view, put common stuff here, but prefer named views for anything specific or complex
UserSerializer.addView((view) => {
  view.addFields("id", "email", "firstName", "lastName" "isAdmin", "createdAt")

  view.addField("displayName", (user: User): string => `${user.firstName} ${user.lastName}`)
})

// Reuses all the fields from the default view, and adds a new roles field
UserSerializer.addView("table", (view) => {
  view.addField("roles", (roles: Role): string[] => roles.map((r) => r.name))
})

// Reuses all the fields from the default view, and makes use of another serializer
UserSerializer.addView("detailed", (view) => {
  view.addField("roles", (roles: Role) => RoleSerializer.serialize(roles))
})
```

```typescript
// src/serializers/role-serializer.ts
import recordSculptor from "record-sculptor"

import { Role } from "@/models"

class RoleSerializer extends recordSculptor.Base<Role> {}

UserSerializer.addView((view) => {
  view.addFields("id", "userId", "name")
})
```

```typescript
// src/routes.ts
import express, { type Request, type Response } from "express"

import { User } from "@/models"
import { UserSerializer } from "@/serializers"

export const router = express.Router()

router.get("/users", async (request: Request, response: Response) => {
  await const users = await User.findAll() // Retrieval from database, using Sequelize in this example

  const serializedUsers = UserSerializer.serialize(users, { view: "table" }) // Data presentation/serialization

  return response.status(200).json({ data: serializedUsers }) // Send data
})

router.post("/users", async (request: Request, response: Response) => {
  const newAttributes = request.body

  return User.create(newAttributes).then(user => { // Save to database, using Sequelize in this example
    const serializedUsers = UserSerializer.serialize(users, { view: "detailed" }) // Data presentation/serialization

    return response.status(201).json({ user: serializedUser }) // Send data
  }).catch(error => {
    return response.status(422).json({ error: error.message }) // Handle errors
  })
})

router.get("/users/:id", async (request: Request, response: Response) => {
  const id = request.params.id
  const user = await User.findByPk(id) // Retrieval from database, using Sequelize in this example

  if (user === null) {
    return response.status(404).json({ message: "User not found" }) // Handle errors
  }

  const serializedUser = UserSerializer.serialize(user, { view: "detailed" }) // Data presentation/serialization

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
// src/modles/role.ts
class Role {
  constructor(
    public id: number,
    public userId: number,
    public name: string,
  ) {}
}
```

## Development

1. Install `asdf` from https://asdf-vm.com/guide/getting-started.html

2. Install the `nodejs` plugin for asdf via `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`

3. Install the appropriate local `nodejs` version via `asdf install nodejs`

4. Install the project dependencies via `npm install`

5. Run the test suite via `npm run test`

## Future Development

TODO: move away from lodash after I've built the basics, so as to keep this project light.
