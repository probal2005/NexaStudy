import {
  TaskCard,
  type Task,
} from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (
    task: Task,
    status: Task['status'],
  ) => void;
  onSubtaskToggle?: (
    task: Task,
    subtask: NonNullable<Task['subtasks']>[number],
  ) => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onSubtaskToggle,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onSubtaskToggle={onSubtaskToggle}
        />
      ))}
    </div>
  );
}