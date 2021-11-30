export interface ReleaseParams {
  tag: string;
  notes: string;
  owner: string;
  repoName: string;
  accessToken: string;
}

export interface RemoteRepository {
  url: string;
  name: string;
  owner: string
}

export interface IGitRepositoryHosting {
  newRelease(params: ReleaseParams): Promise<void>;
  getRemoteRepository(repositoryId: string, accessToken: string): Promise<RemoteRepository>;
}