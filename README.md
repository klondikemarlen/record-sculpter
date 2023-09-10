# Record Sculptor: WORK IN PROGRESS!!!

A flexible library for serializing records into customizable views written in TypeScript. Inspired by [Blueprinter](https://github.com/procore-oss/blueprinter), Record Sculptor aims to provide a simple yet powerful way to present and manipulate data objects.

## Installation and Usage

Using npm:

```
npm install --save record-sculptor
```

### Simplistic Usage

See [examples/README.md](./examples/README.md) for a more realistic example.

TODO: validate this code

```typescript
// src/serializers/user-serialiser.ts
import { Serializer } from "record-sculptor"

import { User, Role } from "@/models"

import { RoleSerializer } from "@/serializers"

class UserSerializer extends Serializer<User> {
  constructor(userOrUsers: User | Array<User>) {
    super(userOrUsers)

    // Default view, put common stuff here, but prefer named views for anything specific or complex
    this.addView((view) => {
      view.addFields("id", "email", "firstName", "lastName", "isAdmin", "createdAt")

      view.addField("displayName", (user: User): string => `${user.firstName} ${user.lastName}`)
    })

    this.addTableView()
    this.addDetailView()
  }

  // Reuses all the fields from the default view, and adds a new roles field
  // TODO: implement this fallback to default feature
  addTableView() {
    this.addView("table", (view) => {
      view.addField("roles", (user: User): string[] => user.roles.map((r) => r.name))
    })
  }

  // Reuses all the fields from the default view, and makes use of another serializer
  addDetailedView() {
    this.addView("detailed", (view) => {
      view.addField("roles", (user: User) => RoleSerializer.serialize(user.roles))
    })
  }
}
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
  const users = await User.findAll() // Retrieval from database, using Sequelize in this example

  const serializedUsers = UserSerializer.serialize(users, { view: "table" }) // Data presentation/serialization

  return response.status(200).json({ users: serializedUsers }) // Send data
})

router.post("/users", async (request: Request, response: Response) => {
  const newAttributes = request.body

  return User.create(newAttributes)
    .then((user) => {
      // Save to database, using Sequelize in this example
      const serializedUser = UserSerializer.serialize(user, { view: "detailed" }) // Data presentation/serialization

      return response.status(201).json({ user: serializedUser }) // Send data
    })
    .catch((error) => {
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

  return response.status(200).json({ user: serializedUser }) // Send data
})

router.put("/users/:id", async (request: Request, response: Response) => {
  const id = request.params.id
  const user = await User.findByPk(id) // Retrieval from database, using Sequelize in this example

  if (user === null) {
    return response.status(404).json({ message: "User not found" }) // Handle errors
  }

  const newAttributes = request.body
  return user
    .update(newAttributes)
    .then((updatedUser) => {
      const serializedUser = UserSerializer.serialize(updatedUser, { view: "detailed" }) // Data presentation/serialization

      return response.status(200).json({ user: serializedUser }) // Send data
    })
    .catch((error) => {
      return response.status(422).json({ error: error.message }) // Handle errors
    })
})

// Delete does use serializer as there is no point in returning anything
router.delete("/users/:id", async (request: Request, response: Response) => {
  const id = request.params.id
  // You _could_ peform a direct delete with Sequelize, but that makes the code harder to read,
  // and the optimization probably isn't worth it anyway.
  const user = await User.findByPk(id) // Retrieval from database, using Sequelize in this example

  if (user === null) {
    return response.status(404).json({ message: "User not found" }) // Handle errors
  }

  return user
    .destroy()
    .then(() => {
      return response.status(204).send() // Send empty response implies success
    })
    .catch((error) => {
      return response.status(422).json({ error: error.message }) // Handle errors
    })
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

## Publishing

### Testing Publishability

See https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/

1. Build this project via `npm run clean && npm run build`

2. Make a directory relative to the project directory called `test-record-sculptor-import`

3. Change into the new project directory.

4. Run `npm link ../record-sculptor`. Or if you are testing against a published version you can use `npm install record-sculptor`.

5. Create a `test-record-sculptor-import.ts` file in the new project with this code in it.

   ```typescript
   // test-record-sculptor-import/test-record-sculptor-import.ts

   import { Serializer } from "record-sculptor"

   class User {
     constructor(
       public id: number,
       public email: string,
       public firstName: string,
       public lastName: string,
       public isAdmin?: boolean,
       public createdAt?: Date, // public roles?: Array<Role>
     ) {}
   }

   const UserSerializer = Serializer.define<User>(({ addView }) => {
     addView((view) => {
       view.addFields("id", "email", "firstName", "lastName", "isAdmin", "createdAt")

       view.addField("displayName", (user: User): string => `${user.firstName} ${user.lastName}`)
     })
   })

   console.log(
     UserSerializer.serialize(
       new User(1, "john.doe@example.com", "John", "Doe", true, new Date("2021-01-01T12:00:00Z")),
     ),
   )
   ```

6. Run `npx ts-node test-record-sculpture-import.ts` and check that it prints the appropriate record info.

### Publishing the Repo

See https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/

> `npm pack` will generate the tar file that npm publish will publish, use it to test if you are publishing what you want to publish.

1. Run `npm login`

2. Run `npm publish` or `npm publish --tag alpha` (defaults to latest)

To update your version number:

1. `npm version patch` (see https://docs.npmjs.com/about-semantic-versioning)

2. `npm publish` (see https://docs.npmjs.com/adding-dist-tags-to-packages)

3. `git push --tags` to push release tags.

## Future Development

TODO: move away from lodash after I've built the basics, so as to keep this project light.
