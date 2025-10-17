/**
 * Core types for the hierarchical coordination system
 */

export enum AgentRole {
  COORDINATOR = 'coordinator',
  TEAM_LEAD = 'team_lead',
  WORKER = 'worker',
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ERROR = 'error',
}

export enum MessageType {
  TASK_ASSIGNMENT = 'task_assignment',
  STATUS_UPDATE = 'status_update',
  RESULT_REPORT = 'result_report',
  HEALTH_CHECK = 'health_check',
  ERROR_REPORT = 'error_report',
  MEMORY_SYNC = 'memory_sync',
}

export interface AgentConfig {
  id: string;
  role: AgentRole;
  capabilities: string[];
  maxConcurrentTasks: number;
  memoryCapacity: number;
  healthCheckInterval: number;
}

export interface Task {
  id: string;
  parentTaskId?: string;
  name: string;
  description: string;
  priority: number;
  status: TaskStatus;
  assignedTo?: string;
  requiredCapabilities: string[];
  dependencies: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  result?: TaskResult;
}

export interface TaskResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metrics?: TaskMetrics;
}

export interface TaskMetrics {
  executionTime: number;
  memoryUsed: number;
  retries: number;
}

export interface Message {
  id: string;
  type: MessageType;
  from: string;
  to: string;
  payload: unknown;
  timestamp: Date;
}

export interface AgentHealth {
  agentId: string;
  status: AgentStatus;
  currentLoad: number;
  availableCapacity: number;
  memoryUsage: number;
  lastHeartbeat: Date;
  errorCount: number;
}

export interface MemoryEntry {
  key: string;
  value: unknown;
  scope: 'global' | 'team' | 'agent';
  owner: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DelegationStrategy {
  name: string;
  selectAgent: (task: Task, agents: AgentHealth[]) => string | null;
}

export interface HierarchyConfig {
  maxDepth: number;
  maxAgentsPerLevel: number;
  taskTimeout: number;
  healthCheckInterval: number;
  memoryRetentionDays: number;
}
