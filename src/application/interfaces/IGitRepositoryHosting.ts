export interface Tag {
  major: number;
  minor: number;
  patch: number;
  toString(): string;
}

export interface ReleaseParams {
  tag: Tag;
  notes: string;
  branch: string;
}

export interface IGitRepositoryHosting {
  newRelease(params: ReleaseParams): Promise<void>;
  getCloneURL(repositoryId: string): Promise<string>;
}