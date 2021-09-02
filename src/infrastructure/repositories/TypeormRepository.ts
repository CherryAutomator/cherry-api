import { EntityTarget, getRepository, Repository } from "typeorm";

export class TypeormRepository<T> {
  protected readonly repository: Repository<T>

  constructor(entityClass: EntityTarget<T>) {
    this.repository = getRepository<T>(entityClass);
  }
}