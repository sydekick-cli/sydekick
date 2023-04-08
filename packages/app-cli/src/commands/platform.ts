import { AiPlatformProviderManager } from "@sydekick/lib-ai-provider";
import { Command } from "commander";
import debugLog from "debug";

import { CliCommand } from "./CliCommand.js";

type PlatformListOptions = {
  all?: boolean;
  enabled?: boolean;
  disabled?: boolean;
  installed?: boolean;
};
class CommandPlatformList extends CliCommand<PlatformListOptions> {
  protected _buildCommanderCommand(program: Command): Command {
    return program
      .command("list")
      .description("List all platforms")
      .option("-a, --all", "List all platforms")
      .option("-d, --disabled", "List installed but disabled platforms")
      .option("-e, --enabled", "List enabled and installed platforms")
      .option("-i, --installed", "List installed platforms");
  }
  public async run(options: PlatformListOptions): Promise<void> {
    // todo: print default platform
    const { all, enabled, disabled } = options;

    const aiPlatformProviderManager = new AiPlatformProviderManager();
    const platforms = aiPlatformProviderManager.builtInAiPlatformProviders;

    if (enabled) {
      // list enabled platforms
      console.log("Enabled platforms:");
      for (const [name, platform] of Object.entries(platforms)) {
        if (platform.enabled) {
          console.log(`${name}: ${platform.description}`);
        }
      }
      return;
    }

    if (disabled) {
      // list disabled platforms
      console.log("Disabled platforms:");
      for (const [name, platform] of Object.entries(platforms)) {
        if (!platform.enabled) {
          console.log(`${name}: ${platform.description}`);
        }
      }
      return;
    }

    if (all) {
      // list all platforms
      console.log("All platforms:");
      for (const [name, platform] of Object.entries(platforms)) {
        console.log(
          `${name}: ${platform.description} (${platform.enabled ? "enabled" : "disabled"}, ${
            platform.installed ? "installed" : "not installed"
          }})`
        );
      }
      return;
    }

    // list installed platforms
    console.log("Installed platforms:");
    for (const [name, platform] of Object.entries(platforms)) {
      if (platform.installed) {
        console.log(
          `${name}: ${platform.description} (${platform.enabled ? "enabled" : "disabled"})`
        );
      }
    }
  }
  public parseArgs<T extends any[]>(...args: T): PlatformListOptions {
    const [options] = args;
    return {
      all: options.all,
      enabled: options.enabled,
      disabled: options.disabled,
    };
  }
}

type PlatformInstallOptions = {
  /**
   * The name of the platform to install.
   */
  platform: string;
  /**
   * Force install the platform even if it is already installed.
   */
  force?: boolean;
};
class CommandPlatformInstall extends CliCommand<PlatformInstallOptions> {
  protected _buildCommanderCommand(program: Command): Command {
    return program.command("install <platform>").description("Install a platform");
  }
  public async run(options: PlatformInstallOptions): Promise<void> {
    const debug = debugLog("@sydekick/app-cli:CommandPlatformInstall::run");
    debug("options", options);
    const platformManager = new AiPlatformProviderManager();
    if (!options.force) {
      let isInstalled = false;
      try {
        isInstalled = await platformManager.getIsInstalled(options.platform);
      } catch (error) {
        debug(error);
        console.error(error);
        process.exit(1);
      }
      if (isInstalled) {
        console.log(`Platform ${options.platform} is already installed.`);
        process.exit(0);
      }
    }
    try {
      await platformManager.installProvider(options.platform, options.force || false);
    } catch (error) {
      debug(error);
      console.error(error);
      process.exit(1);
    }
    console.log(`Platform ${options.platform} installed.`);
  }
  public parseArgs<T extends any[]>(...args: T): PlatformInstallOptions {
    return {
      platform: args[0],
      force: args[1].force,
    };
  }
}

export class CommandPlatform extends CliCommand<undefined> {
  constructor() {
    super();
    this.addSubCommand(new CommandPlatformList());
    this.addSubCommand(new CommandPlatformInstall());
  }

  protected _buildCommanderCommand(program: Command): Command {
    return program.command("platform").description("Manage Sidekick ai platforms.");
  }
  public async run(options: undefined): Promise<void> {
    this._commanderCommand?.outputHelp();
  }
  public parseArgs<T extends unknown[]>(...args: T) {
    return undefined;
  }
}
