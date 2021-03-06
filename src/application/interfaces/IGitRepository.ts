export interface MergeParams {
  from: string;
  to: string;
  projectId: string;
  committerName: string;
  committerEmail: string;
}

export interface PushParams {
  branch: string;
  projectId: string;
  personalAccessToken: string; 
  tagName?: string;
}

export interface IGitRepository {
  clone(url: string, projectId: string): Promise<void>;
  merge(params: MergeParams, tagName?: string): Promise<void>;
  tag(name: string, branchName: string, projectId: string, notes: string): Promise<void>;
  push(params: PushParams): Promise<void>;
  deleteRepo(projectId: string): Promise<void>;
}