export function canCheckForUpdates(input: {
  hasGitBinary: boolean;
  hasGitDirectory: boolean;
}): boolean;

export function shouldInstallDependencies(input: {
  gitUpdated: boolean;
  hasNodeModules: boolean;
  hasPackageJson: boolean;
}): boolean;

export function didGitRevisionChange(input: {
  previousRevision: string | null;
  currentRevision: string | null;
}): boolean;

export function getGitUpdateCommands(input: {
  hasTrackedChanges: boolean;
}): {
  prePull: string[][];
  pull: string[];
  postPull: string[][];
};

export function getOpenCommand(
  url: string,
  platform: NodeJS.Platform
): {
  command: string;
  args: string[];
};

export function getNpmCommand(platform: NodeJS.Platform): {
  command: string;
  argsPrefix: string[];
  shell: boolean;
};
