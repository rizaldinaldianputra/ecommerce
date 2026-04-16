export interface WorkflowTask {
  id: string;
  name: string;
  processInstanceId: string;
  createTime: string;
  variables: Record<string, any>;
}
