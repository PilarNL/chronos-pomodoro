import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useRef } from 'react';
import { useTaskContent } from '../../contexts/TaskContext/useTaskContext';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function Settings() {
  const { state, dispatch } = useTaskContent();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSettings(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();
    const formErrors = [];
    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    if (isNaN(workTime)) formErrors.push('Use apenas números para o Foco');
    if (isNaN(shortBreakTime))
      formErrors.push('Use apenas números para o Descacnso Curto');
    if (isNaN(longBreakTime))
      formErrors.push('Use apenas números para o Descacnso Longo');

    if (workTime < 1 || workTime > 99 || workTime === null) {
      formErrors.push('Digite valores entre 1 e 99 para Foco');
    }
    if (shortBreakTime < 1 || shortBreakTime > 99 || shortBreakTime === null) {
      formErrors.push('Digite valores entre 1 e 99 para Descacnso Curto');
    }
    if (longBreakTime < 1 || longBreakTime > 99 || longBreakTime === null) {
      formErrors.push('Digite valores entre 1 e 99 para Descanso Longo');
    }

    if (formErrors.length > 0) {
      formErrors.forEach(error => {
        showMessage.warning(error);
      });
      return;
    }

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: { workTime, shortBreakTime, longBreakTime },
    });
    showMessage.success('Configurações salvas');
  }

  return (
    <MainTemplate>
      <Container>
        <h1 className={styles.title}>Configurações</h1>
      </Container>
      <Container>
        <p className={styles.paragraph}>
          Modifique as configurações para tempo de Foco, Descanso Curto e
          Descanso Longo.
        </p>
      </Container>
      <Container>
        <form onSubmit={handleSaveSettings} className={styles.form}>
          <div className={styles.formRow}>
            <DefaultInput
              id='workTime'
              labelText='Foco'
              ref={workTimeInput}
              defaultValue={state.config.workTime}
              type='number'
            />
          </div>
          <div className={styles.formRow}>
            <DefaultInput
              id='shortBreakTime'
              labelText='Descanso Curto'
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
              type='number'
            />
          </div>
          <div className={styles.formRow}>
            <DefaultInput
              id='longBreakTime'
              labelText='Descanso Longo'
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
              type='number'
            />
          </div>
          <div className={styles.formRow}>
            <DefaultButton
              icon={<SaveIcon />}
              aria-label='Salvar Configurações'
              title='Salvar Configurações'
            />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
}
