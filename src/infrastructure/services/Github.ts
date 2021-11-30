import { IGitRepositoryHosting, ReleaseParams, RemoteRepository } from "../../application/interfaces/IGitRepositoryHosting";
import { Octokit } from "octokit";

export class Github implements IGitRepositoryHosting {
  async newRelease(params: ReleaseParams): Promise<void> {
    const octokit = new Octokit({ auth: params.accessToken });

    await octokit.request("POST /repos/{owner}/{repo}/releases", {
      owner: params.owner,
      repo: params.repoName,
      tag_name: params.tag,
      body: params.notes,
    });
  }

  async getRemoteRepository(repositoryId: string, accessToken: string): Promise<RemoteRepository> {
    const octokit = new Octokit({ auth: accessToken });

    const { data } = await octokit.request(`GET /repositories/${repositoryId}`);

    return {
      url: data.ssh_url,
      name: data.name,
      owner: data.owner.login,
    };
  }
}