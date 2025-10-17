/**
 * ID generation utilities
 */

export class IdGenerator {
  private static counter = 0;

  static generate(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    this.counter = (this.counter + 1) % 10000;
    return `${prefix}-${timestamp}-${random}-${this.counter}`;
  }

  static generateTaskId(): string {
    return this.generate('task');
  }

  static generateAgentId(role: string): string {
    return this.generate(role);
  }

  static generateMessageId(): string {
    return this.generate('msg');
  }

  static generateMemoryKey(scope: string, key: string): string {
    return `${scope}:${key}`;
  }
}
