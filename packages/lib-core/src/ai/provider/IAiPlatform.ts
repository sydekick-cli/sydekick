// todo: move
export interface IAiPlatform {
  /**
   * The id of the ai provider.
   */
  id: string;
  /**
   * The name of the ai provider.
   */
  name: string;
  /**
   * A description of the ai provider.
   */
  description: string;
  /**
   * Whether the ai provider is builtin.
   */
  builtin: boolean;
  /**
   * Whether the ai provider is installed.
   * If a ai provider is not installed, it will not be used.
   */
  installed: boolean;
  /**
   * Whether the ai provider is enabled.
   * If a ai provider is not enabled, it will not be used.
   */
  enabled: boolean;
}
