import { useContext } from 'react';
import { TaskContext } from './TaskContext';

export function useTaskContent() {
  return useContext(TaskContext);
}
