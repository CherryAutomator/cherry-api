import { EntityRepository, FindOneOptions } from "typeorm";
import { IProjectRepository, Project } from "../../domain/model/Project";
import { QueryOptions } from "../../domain/shared/mapping";
import { PagingParams, Paged } from "../../domain/shared/pagination";
import { ProjectSchema } from "../database/schemas/Project";
import { computeLimitAndOffset } from "../utils/pagination";
import { TypeormRepository } from "./TypeormRepository";

@EntityRepository(ProjectSchema)
export class ProjectRepository extends TypeormRepository<Project> implements IProjectRepository {
  constructor() {
    super(ProjectSchema);
  }

  async findByUser(ownerId: string, params: PagingParams, options?: QueryOptions): Promise<Paged<Project>> {
    const { limit, offset } = computeLimitAndOffset(params);

    const [data, total] = await this.repository.findAndCount({
      where: { ownerId },
      take: limit,
      skip: offset,
      relations: options ? options.relations : [],
    });

    return { data, total };
  }

  store(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  findById(id: string, options: FindOneOptions): Promise<Project> {
    return this.repository.findOne(id, options);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}