export interface IAiModelMetadata {
  /**
   * The name of the model.
   */
  name: string;
  /**
   * A description of the model.
   */
  description?: string;
  /**
   * Whether the model is installed.
   */
  installed: boolean;
}
