import { EntityRepository, FindOneOptions } from "typeorm";
import { IReleaseConfigurationRepository, ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { QueryOptions } from "../../domain/shared/mapping";
import { PagingParams, Paged } from "../../domain/shared/pagination";
import { ReleaseConfigurationSchema } from "../database/schemas/ReleaseConfiguration";
import { computeLimitAndOffset } from "../utils/pagination";
import { TypeormRepository } from "./TypeormRepository";

@EntityRepository(ReleaseConfigurationSchema)
export class ReleaseConfigurationRepository extends TypeormRepository<ReleaseConfiguration> implements IReleaseConfigurationRepository {
  constructor() {
    super(ReleaseConfigurationSchema);
  }

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