import { AiPlatformProviderManager } from "@sydekick/lib-ai-provider";
import { Command } from "commander";
import debugLog from "debug";

import { CliCommand } from "./CliCommand.js";

type ProviderListOptions = {
  all?: boolean;
  enabled?: boolean;
  disabled?: boolean;
  installed?: boolean;
};
class CommandProviderList extends CliCommand<ProviderListOptions> {
  protected _buildCommanderCommand(program: Command): Command {
    return program
      .command("list")
      .description("List all providers")
      .option("-a, --all", "List all providers")
      .option("-d, --disabled", "List installed but disabled providers")
      .option("-e, --enabled", "List enabled and installed providers")
      .option("-i, --installed", "List installed providers");
  }
  public async run(options: ProviderListOptions): Promise<void> {
    // todo: print default provider
    const { all, enabled, disabled } = options;

    const aiPlatformProviderManager = new AiPlatformProviderManager();
    const providers = aiPlatformProviderManager.builtInAiPlatformProviders;

    if (enabled) {
      // list enabled providers
      console.log("Enabled providers:");
      for (const [name, provider] of Object.entries(providers)) {
        if (provider.enabled) {
          console.log(`${name}: ${provider.description}`);
        }
      }
      return;
    }

    if (disabled) {
      // list disabled providers
      console.log("Disabled providers:");
      for (const [name, provider] of Object.entries(providers)) {
        if (!provider.enabled) {
          console.log(`${name}: ${provider.description}`);
        }
      }
      return;
    }

    if (all) {
      // list all providers
      console.log("All providers:");
      for (const [name, provider] of Object.entries(providers)) {
        console.log(
          `${name}: ${provider.description} (${provider.enabled ? "enabled" : "disabled"}, ${
            provider.installed ? "installed" : "not installed"
          }})`
        );
      }
      return;
    }

    // list installed providers
    console.log("Installed providers:");
    for (const [name, provider] of Object.entries(providers)) {
      if (provider.installed) {
        console.log(
          `${name}: ${provider.description} (${provider.enabled ? "enabled" : "disabled"})`
        );
      }
    }
  }
  public parseArgs<T extends any[]>(...args: T): ProviderListOptions {
    const [options] = args;
    return {
      all: options.all,
      enabled: options.enabled,
      disabled: options.disabled,
    };
  }
}

type ProviderInstallOptions = {
  /**
   * The name of the provider to install.
   */
  provider: string;
  /**
   * Force install the provider even if it is already installed.
   */
  force?: boolean;
};
class CommandProviderInstall extends CliCommand<ProviderInstallOptions> {
  protected _buildCommanderCommand(program: Command): Command {
    return program.command("install <provider>").description("Install a provider");
  }
  public async run(options: ProviderInstallOptions): Promise<void> {
    const debug = debugLog("@sydekick/app-cli:CommandProviderInstall::run");
    debug("options", options);
    const providerManager = new AiPlatformProviderManager();
    if (!options.force) {
      let isInstalled = false;
      try {
        isInstalled = await providerManager.getIsInstalled(options.provider);
      } catch (error) {
        debug(error);
        console.error(error);
        process.exit(1);
      }
      if (isInstalled) {
        console.log(`Provider ${options.provider} is already installed.`);
        process.exit(0);
      }
    }
    try {
      await providerManager.installProvider(options.provider, options.force || false);
    } catch (error) {
      debug(error);
      console.error(error);
      process.exit(1);
    }
    console.log(`Provider ${options.provider} installed.`);
  }
  public parseArgs<T extends any[]>(...args: T): ProviderInstallOptions {
    return {
      provider: args[0],
      force: args[1].force,
    };
  }
}

export class CommandProvider extends CliCommand {
  constructor() {
    super();
    this.addSubCommand(new CommandProviderList());
    this.addSubCommand(new CommandProviderInstall());
  }

  protected _buildCommanderCommand(program: Command): Command {
    return program.command("provider").description("Manage Sidekick ai providers.");
  }
  public run(options: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public parseArgs<T extends any[]>(...args: T) {
    return {};
  }
}
