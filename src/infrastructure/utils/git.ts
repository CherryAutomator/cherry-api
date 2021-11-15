import { Repository } from 'nodegit';
import Git from "nodegit";
import { IGitRepository, VersionIncrementType } from '../../application/interfaces/IGitRepository';
import fs from "fs";
import { Tag } from '../../application/interfaces/IGitRepositoryHosting';
import simpleGit, { SimpleGit } from 'simple-git';

const getPath = (id: string) => `temp/${id}`;

const token = "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";

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
    console.log("STARTING TO CLONE");

    await this.git.clone(url, getPath(projectId));
    
    console.log("CLONE FINISHED");
  }

  async merge(from: string, to: string, projectId: string): Promise<void> {
    const repository = await Repository.open(getPath(projectId));

    const branches = await repository.getReferences();

    let branchTo = branches.find(branch => branch.shorthand() === `origin/${to}`);
    let branchFrom = branches.find(branch => branch.shorthand() === `origin/${from}`);

    console.log(branches.map(branch => ({
      name: branch.shorthand(),
    })));

    console.log({ branchTo, branchFrom })

    // if (!branchTo) {
    //   const branchToRef = branches.find(branch => branch.shorthand() === `origin/${to}`);

    //   console.log({ branchToRef: branchToRef.shorthand() });

    //   branchTo = await repository.createBranch(to, branchToRef.target());
    // }

    // if (!branchFrom) {
    //   const branchFromRef = branches.find(branch => branch.shorthand() === `origin/${from}`);

    //   console.log({ branchFromRef: branchFromRef.shorthand() });

    //   const commit = await repository.getCommit(branchFromRef.target());

    //   console.log("TESTE", commit.message());

    //   branchFrom = await repository.createBranch(from, branchFromRef.target());
    // }

    console.log({ branchTo, branchFrom });

    const commitTo = await repository.getCommit(branchTo.target());
    const commitFrom = await repository.getCommit(branchFrom.target());

    console.log("TO COMMIT \n", commitTo.message(), "\n");
    console.log("FROM COMMIT", commitFrom.message());

    const index = await Git.Merge.commits(repository, commitFrom, commitTo);

    if (index.hasConflicts()) {
      throw new Error("Cannot merge. Resolve the conflicts");
    }
  }

  incrementPackageJson(type: VersionIncrementType, projectId: string): Tag {
    const packageJson = JSON.parse(fs.readFileSync(`${getPath(projectId)}/package.json`, 'utf8')) as { version: string };

    const [major, minor, patch] = packageJson.version.split('.');

    return {
      major: Number(major) + (type === "major" ? 1 : 0),
      minor: Number(minor) + (type === "minor" ? 1 : 0),
      patch: Number(patch) + (type === "patch" ? 1 : 0),
    };
  }

  async tag(name: string, branchName: string, projectId: string, notes: string): Promise<void> {
    const repository = await Repository.open(getPath(projectId));
    const branch = await repository.getBranch(branchName);

    try {
      await repository.createTag(branch.target(), name, notes);
    } catch (error) {
      console.log("ERROR TAG", error);
    }
  }

  async push(branch: string, projectId: string, tagName: string): Promise<void> {
    const repository = await Repository.open(getPath(projectId));

    const remote = await repository.getRemote("origin");

    console.log("PUSHING TO", branch);

    await remote.push(
      [
        `refs/heads/${branch}:refs/heads/${branch}`,
        `refs/tags/${tagName}`,
      ],
      {
        callbacks: {
          certificateCheck: () => 1,
          credentials: () => Git.Cred.userpassPlaintextNew(token, "x-oauth-basic"),
          transferProgress: (progress) => {
            console.log('progress: ', progress)
          }
        }
      }
    );
  }
}