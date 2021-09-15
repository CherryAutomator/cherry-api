import { AbstractRepository, EntityRepository, FindOneOptions, getRepository, Repository } from "typeorm";
import { IReleaseConfigurationRepository, ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { QueryOptions } from "../../domain/shared/mapping";
import { PagingParams, Paged } from "../../domain/shared/pagination";
import { computeLimitAndOffset } from "../utils/pagination";

@EntityRepository(ReleaseConfiguration)
export class ReleaseConfigurationRepository extends AbstractRepository<ReleaseConfiguration> implements IReleaseConfigurationRepository {
  async findByProject(projectId: string, params: PagingParams, options?: QueryOptions): Promise<Paged<ReleaseConfiguration>> {
    const { limit, offset } = computeLimitAndOffset(params);

    const [data, total] = await this.repository.findAndCount({
      where: { projectId },
      take: limit,
      skip: offset,
      relations: options ? options.relations : [],
    });

    return { data, total };
  }

  store(releaseConfiguration: ReleaseConfiguration): Promise<ReleaseConfiguration> {
    return this.repository.save(releaseConfiguration);
  }

  findById(id: string, options: FindOneOptions): Promise<ReleaseConfiguration> {
    return this.repository.findOne(id, options);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}