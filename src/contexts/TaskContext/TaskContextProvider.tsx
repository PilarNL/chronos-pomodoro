import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { TaskContext } from './TaskContext';
import { taskReducer } from './taskReducer';
import { TimerWorkerManager } from '../../workers/timerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadAudio } from '../../utils/loadAudio';
import { showMessage } from '../../adapters/showMessage';
import type { TaskStateModel } from '../../models/TaskStateModel';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');

    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });
  const { activeTask } = state;
  const playAudioRef = useRef<ReturnType<typeof loadAudio> | null>(null);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));

    if (!activeTask) {
      return;
    }

    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;

    if (activeTask && playAudioRef.current === null) {
      playAudioRef.current = loadAudio();
    }

    const worker = TimerWorkerManager.getInstance();

    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playAudioRef.current) {
          playAudioRef.current();
        }

        showMessage.success('Tarefa Concluída!');
        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        });
        worker.terminate();
        return;
      }

      dispatch({
        type: TaskActionTypes.COUNT_DOWN,
        payload: { secondsRemaining: countDownSeconds },
      });
    });

    worker.postMessage({
      activeTask,
      secondsRemaining: activeTask.duration * 60,
    });

    return () => {
      worker.terminate();
    };
  }, [activeTask, state.formattedSecondsRemaining, state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
