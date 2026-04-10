export function canCheckForUpdates(input: {
  hasGitBinary: boolean;
  hasGitDirectory: boolean;
}): boolean;

export function shouldInstallDependencies(input: {
  gitUpdated: boolean;
  hasNodeModules: boolean;
  hasPackageJson: boolean;
}): boolean;

export function getOpenCommand(
  url: string,
  platform: NodeJS.Platform
): {
  command: string;
  args: string[];
};
