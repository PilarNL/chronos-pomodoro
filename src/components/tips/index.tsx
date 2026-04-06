import { useTaskContent } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';

export function Tips() {
  const { state } = useTaskContent();
  const nextCycle = getNextCycle(state.currentCycle);
  const nextCycleType = getNextCycleType(nextCycle);

  const tipsForWhenNoActiveTask = {
    workTime: <span>Próximo ciclo de foco de {state.config.workTime}min.</span>,
    shortBreakTime: (
      <span>Próximo descanso rápido de {state.config.shortBreakTime}min.</span>
    ),
    longBreakTime: (
      <span>Próximo descanso longo de {state.config.longBreakTime}min.</span>
    ),
  };

  const tipsForWhenActiveTask = {
    workTime: <span>Fique focado por {state.config.workTime}min.</span>,
    shortBreakTime: (
      <span>Pausa, {state.config.shortBreakTime}min de descanso.</span>
    ),
    longBreakTime: (
      <span>Relaxa, {state.config.longBreakTime}min de descanso.</span>
    ),
  };
  return (
    <>
      {!!state.activeTask && tipsForWhenActiveTask[state.activeTask.type]}
      {!state.activeTask && tipsForWhenNoActiveTask[nextCycleType]}
    </>
  );
}
