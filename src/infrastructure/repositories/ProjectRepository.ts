import { AbstractRepository, EntityRepository, FindOneOptions, getRepository, Repository } from "typeorm";
import { IProjectRepository, Project } from "../../domain/model/Project";
import { QueryOptions } from "../../domain/shared/mapping";
import { PagingParams, Paged } from "../../domain/shared/pagination";
import { computeLimitAndOffset } from "../utils/pagination";

@EntityRepository(Project)
export class ProjectRepository extends AbstractRepository<Project> implements IProjectRepository {

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