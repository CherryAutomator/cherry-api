import { IGitRepositoryHosting, ReleaseParams } from "../../application/interfaces/IGitRepositoryHosting";
import { Octokit } from "octokit";

export class Github implements IGitRepositoryHosting {
  newRelease(params: ReleaseParams): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getCloneURL(repositoryId: string): Promise<string> {
    const octokit = new Octokit();

    const { data } = await octokit.request(`GET /repositories/${repositoryId}`);
    
    return data.clone_url;
  }
}