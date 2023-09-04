import { Role } from "./role"

export class User {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public isAdmin?: boolean,
    public createdAt?: Date,
    public roles?: Array<Role>
  ) { }
}
