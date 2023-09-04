import recordSculptor from "../src/index"
import { User, Role } from "./support/index"


class UserSerializer extends recordSculptor.Base<User> {
  constructor(userOrUsers: User | User[]) {
    super(userOrUsers)
    // this.#registerTableView()
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

  // #registerTableView() {}
}

const users = [
  new User(1, "john.doe@example.com", "John", "Doe", true, new Date("2021-01-01T12:00:00Z"), [
    new Role(1, 1, "Admin"),
    new Role(2, 1, "Editor"),
  ]),
  new User(2, "jane.doe@example.com", "Jane", "Doe", false, new Date("2021-02-01T12:00:00Z"), [
    new Role(3, 2, "User"),
  ]),
  new User(3, "mike.smith@example.com", "Mike", "Smith", false, new Date("2021-03-01T12:00:00Z"), [
    new Role(4, 3, "User"),
    new Role(5, 3, "Contributor"),
  ]),
]

describe("#serialize", () => {
  test("serializes an array", () => {
    expect(UserSerializer.serialize(users)).toEqual([
      {
        createdAt: new Date("2021-01-01T12:00:00Z"),
        displayName: "John Doe",
        email: "john.doe@example.com",
        firstName: "John",
        id: 1,
        isAdmin: true,
        lastName: "Doe",
      },
      {
        createdAt: new Date("2021-02-01T12:00:00Z"),
        displayName: "Jane Doe",
        email: "jane.doe@example.com",
        firstName: "Jane",
        id: 2,
        isAdmin: false,
        lastName: "Doe",
      },
      {
        createdAt: new Date("2021-03-01T12:00:00Z"),
        displayName: "Mike Smith",
        email: "mike.smith@example.com",
        firstName: "Mike",
        id: 3,
        isAdmin: false,
        lastName: "Smith",
      },
    ])
  })

  test("serializes single objects", () => {
    expect(UserSerializer.serialize(users[0])).toEqual({
      createdAt: new Date("2021-01-01T12:00:00Z"),
      displayName: "John Doe",
      email: "john.doe@example.com",
      firstName: "John",
      id: 1,
      isAdmin: true,
      lastName: "Doe",
    },)
  })
})

// Until I get a test suite spun up, these are the tests :cry:
// import { User } from "@/models"
// import UserSerializer from "@/serializers/user-serializer"

// User.findAll().then((users) => {
//   const serializedUsers1 = UserSerializer.serialize(users)
//   const serializedUsers2 = UserSerializer.serialize(users, { view: "default" })
//   const userSerializerInstance = new UserSerializer(users)
//   const serializedUsers3 = userSerializerInstance.serialize()
//   const serializedUsers4 = userSerializerInstance.serialize({ view: "default" })
//   // const serializedUsers4 = usersSerializer.defaultView()
//   // const serializedUsers5 = UserSerializer.defaultView(users)

//   const serializedUser1 = UserSerializer.serialize(users[0])
//   const serializedUser2 = UserSerializer.serialize(users[0], { view: "default" })
//   const userSerializerInstance2 = new UserSerializer(users[0])
//   const serializedUser3 = userSerializerInstance2.serialize()
//   const serializedUser4 = userSerializerInstance2.serialize({ view: "default" })
//   // const serializedUser = userSerializerInstance2.defaultView()
//   // const serializedUser4 = UserSerializer.dufaultView(users[0])

//   console.log([
//     serializedUsers1,
//     serializedUsers2,
//     serializedUsers3,
//     serializedUsers4,
//     serializedUser1,
//     serializedUser2,
//     serializedUser3,
//     serializedUser4
//   ])
//   return true
// })
