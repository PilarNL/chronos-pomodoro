import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { MainTemplate } from '../../templates/MainTemplate';
import { useTaskContent } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { useEffect, useMemo, useState } from 'react';
import { sortTasks } from '../../utils/sortTasks';
import type { SortTasksOptions } from '../../utils/sortTasks';

import styles from './styles.module.css';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

type SortTaskState = {
  field: NonNullable<SortTasksOptions['field']>;
  direction: NonNullable<SortTasksOptions['direction']>;
};

export function History() {
  const { state, dispatch } = useTaskContent();
  const hasTasks = state.tasks.length > 0;

  const [sortTaskOptions, setSortTaskOptions] = useState<SortTaskState>({
    field: 'startDate',
    direction: 'desc',
  });

  const sortedTasks = useMemo(() => {
    return sortTasks({
      tasks: state.tasks,
      direction: sortTaskOptions.direction,
      field: sortTaskOptions.field,
    });
  }, [state.tasks, sortTaskOptions.direction, sortTaskOptions.field]);

  function handleSortTasks({ field }: Pick<SortTaskState, 'field'>) {
    const newDirection = sortTaskOptions.direction === 'desc' ? 'asc' : 'desc';
    setSortTaskOptions({
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm(
      'Tem certeza que quer limpar o histórico?',
      confirmation => {
        if (!confirmation) return;

        dispatch({ type: TaskActionTypes.RESET_STATE });
      },
    );
  }

  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <div className={styles.heading}>
          <h1>Histórico</h1>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </div>
      </Container>
      <Container>
        {hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortTasks({ field: 'name' })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'duration' })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'startDate' })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {sortedTasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!hasTasks && (
          <p style={{ textAlign: 'center' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
