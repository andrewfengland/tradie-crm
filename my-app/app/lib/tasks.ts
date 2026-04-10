export type RelatedType = 'contact' | 'opportunity' | 'quote' | 'job';

export type Task = {
  id: string;
  title: string;
  status: 'Todo' | 'Done';
  dueDate?: string;
  relatedType: RelatedType;
  relatedId: string;
};

let nextId = 1;

export const tasks: Task[] = [];

export function getTasksByRelated(relatedType: RelatedType, relatedId: string): Task[] {
  return tasks.filter((t) => t.relatedType === relatedType && t.relatedId === relatedId);
}

export function createTask(input: Omit<Task, 'id'>): Task {
  const newTask: Task = { ...input, id: String(nextId++) };
  tasks.push(newTask);
  return newTask;
}

export function toggleTaskStatus(id: string): void {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = task.status === 'Todo' ? 'Done' : 'Todo';
  }
}
