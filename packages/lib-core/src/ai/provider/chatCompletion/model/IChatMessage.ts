// todo: need a typeorm type for this
// todo; need a mapper to map this to and from a db entity
export interface IChatMessage {
  /**
   * The role of the author of this message.
   */
  role: string;
  /**
   * The contents of the message
   */
  content: string;
  /**
   * The name of the user in a multi-user chat
   */
  name?: string;
}
