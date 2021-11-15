import { QueryOptions } from "../shared/mapping";
import { v4 } from "uuid";
import { Project } from "./Project";

export interface IUserRepository {
  store(user: User): Promise<User>;
  findById(id: string, options?: QueryOptions): Promise<User | undefined>;
  findByEmail(email: string, options?: QueryOptions): Promise<User | undefined>;
  remove(id: string): Promise<void>;
}

export class User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  accessToken: string | null;
  createdAt: Date;
  projects: Project[];

  isConfigurated() {
    return Boolean(this.accessToken);
  }

  constructor(firstname: string, lastname: string, email: string, password: string) {
    this.id = v4();
    this.createdAt = new Date();
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }
}