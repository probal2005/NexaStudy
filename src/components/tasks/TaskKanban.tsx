import {
  TaskKanbanColumn,
} from './TaskKanbanColumn';

import type {
  Task,
  TaskStatus,
} from './TaskCard';

interface TaskKanbanProps {
  tasks: Task[];
  onAdd?: (status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (
    task: Task,
    status: TaskStatus,
  ) => void;
}

const columns: {
  status: TaskStatus;
  title: string;
}[] = [
  {
    status: 'todo',
    title: 'To Do',
  },
  {
    status: 'in-progress',
    title: 'In Progress',
  },
  {
    status: 'completed',
    title: 'Completed',
  },
  {
    status: 'cancelled',
    title: 'Cancelled',
  },
];

export function TaskKanban({
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <TaskKanbanColumn
          key={column.status}
          status={column.status}
          title={column.title}
          tasks={tasks.filter(
            (task) => task.status === column.status,
          )}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}