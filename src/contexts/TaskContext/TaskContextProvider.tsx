import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { TaskContext } from './TaskContext';
import { taskReducer } from './taskReducer';
import { TimerWorkerManager } from '../../workers/timerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadAudio } from '../../utils/loadAudio';
import { showMessage } from '../../adapters/showMessage';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const { activeTask } = state;
  const playAudioRef = useRef<ReturnType<typeof loadAudio> | null>(null);

  useEffect(() => {
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
  }, [activeTask, state.formattedSecondsRemaining]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
