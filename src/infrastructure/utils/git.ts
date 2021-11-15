import { Repository } from 'nodegit';
import Git from "nodegit";
import { IGitRepository, MergeParams, PushParams, VersionIncrementType } from '../../application/interfaces/IGitRepository';
import fs from "fs";
import simpleGit, { SimpleGit } from 'simple-git';

const getPath = (id: string) => `temp/${id}`;

export class NodeGit implements IGitRepository {
  private readonly git: SimpleGit;

  constructor() {
    this.git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 6,
   });
  }

  async clone(url: string, projectId: string): Promise<void> {
    await this.git.clone(url, getPath(projectId));
  }

  async merge(params: MergeParams): Promise<void> {
    const { committerEmail, committerName, from, projectId, to } = params;

    const repository = await Repository.open(getPath(projectId));

    const branches = await repository.getReferences();

    let branchTo = branches.find(branch => branch.shorthand() === `origin/${to}`);
    let branchFrom = branches.find(branch => branch.shorthand() === `origin/${from}`);

    const commitTo = await repository.getCommit(branchTo.target());
    const commitFrom = await repository.getCommit(branchFrom.target());

    const index = await Git.Merge.commits(repository, commitFrom, commitTo);

    if (index.hasConflicts()) {
      throw new Error("Cannot merge. Resolve the conflicts");
    }

    const oid = await index.writeTreeTo(repository);
    const parent = await repository.getHeadCommit();
    const author = Git.Signature.now(committerName, committerEmail);

    await repository.createCommit("HEAD", author, author, `[cherry]: merge ${from} into ${to}`, oid, [commitTo, commitFrom]);
  }

  incrementPackageJson(type: VersionIncrementType, projectId: string): void {
    const packageJson = JSON.parse(fs.readFileSync(`${getPath(projectId)}/package.json`, 'utf8')) as { version: string };

    const [major, minor, patch] = packageJson.version.split('.');

    // return {
    //   major: Number(major) + (type === "major" ? 1 : 0),
    //   minor: Number(minor) + (type === "minor" ? 1 : 0),
    //   patch: Number(patch) + (type === "patch" ? 1 : 0),
    // };
  }

  async tag(name: string, branchName: string, projectId: string, notes: string): Promise<void> {
    const repository = await Repository.open(getPath(projectId));
    const branch = await repository.getBranch(branchName);

    try {
      await repository.createTag(branch.target(), name, notes);
    } catch (error) {
      console.log("ERROR TAG", error);
      throw error;
    }
  }

  async push(params: PushParams): Promise<void> {
    const { branch, personalAccessToken, projectId, tagName } = params;

    const repository = await Repository.open(getPath(projectId));

    const remote = await repository.getRemote("origin");

    const references = [`refs/heads/${branch}:refs/heads/${branch}`];

    if (tagName) {
      references.push(`refs/tags/${tagName}`);
    }

    await remote.push(references,
      {
        callbacks: {
          certificateCheck: () => 1,
          credentials: () => Git.Cred.userpassPlaintextNew(personalAccessToken, "x-oauth-basic"),
        }
      }
    );
  }
}