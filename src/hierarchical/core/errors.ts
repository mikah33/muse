/**
 * Custom error classes for hierarchical coordination system
 */

export class HierarchicalError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'HierarchicalError';
  }
}

export class TaskAssignmentError extends HierarchicalError {
  constructor(message: string, details?: unknown) {
    super(message, 'TASK_ASSIGNMENT_ERROR', details);
    this.name = 'TaskAssignmentError';
  }
}

export class AgentNotFoundError extends HierarchicalError {
  constructor(agentId: string) {
    super(`Agent not found: ${agentId}`, 'AGENT_NOT_FOUND', { agentId });
    this.name = 'AgentNotFoundError';
  }
}

export class TaskNotFoundError extends HierarchicalError {
  constructor(taskId: string) {
    super(`Task not found: ${taskId}`, 'TASK_NOT_FOUND', { taskId });
    this.name = 'TaskNotFoundError';
  }
}

export class InsufficientCapacityError extends HierarchicalError {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_CAPACITY');
    this.name = 'InsufficientCapacityError';
  }
}

export class CommunicationError extends HierarchicalError {
  constructor(message: string, details?: unknown) {
    super(message, 'COMMUNICATION_ERROR', details);
    this.name = 'CommunicationError';
  }
}

export class MemorySyncError extends HierarchicalError {
  constructor(message: string, details?: unknown) {
    super(message, 'MEMORY_SYNC_ERROR', details);
    this.name = 'MemorySyncError';
  }
}
