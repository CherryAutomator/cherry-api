import { Project } from "../../domain/model/Project";
import { User } from "../../domain/model/User";

export const format = {
  project(project: Project) {
    const mapped = { ...project };

    delete mapped.user;

    return mapped;
  },
  user(user: User) {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    }
  }
}