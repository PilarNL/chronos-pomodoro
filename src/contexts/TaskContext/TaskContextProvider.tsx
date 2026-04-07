import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { TaskContext } from './TaskContext';
import { taskReducer } from './taskReducer';
import { TimerWorkerManager } from '../../workers/timerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadAudio } from '../../utils/loadAudio';

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

    if (activeTask && playAudioRef.current === null) {
      playAudioRef.current = loadAudio();
    }

    const worker = TimerWorkerManager.getInstance();

    worker.onmessage(e => {
      const countDownSeconds = e.data;
      console.log(countDownSeconds);

      if (countDownSeconds <= 0) {
        if (playAudioRef.current) {
          playAudioRef.current();
        }

        console.log('Worker Completed');
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
  }, [activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
