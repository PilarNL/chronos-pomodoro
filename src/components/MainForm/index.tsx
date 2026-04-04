import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles/Index';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useRef } from 'react';

import styles from './styles.module.css';

export function MainForm() {
  const TaskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(TaskNameInput.current?.value);
  }

  return (
    <form onSubmit={handleCreateNewTask} className={styles.form}>
      <div className={styles.formRow}>
        <DefaultInput
          labelText='Tarefa'
          id='input'
          type='text'
          placeholder='O que você vai fazer?'
          ref={TaskNameInput}
        />
      </div>
      <div className={styles.formRow}>
        <p>Lorem ipsum dolor sit amet consectetur.</p>
      </div>
      <div className={styles.formRow}>
        <Cycles />
      </div>
      <div className={styles.formRow}>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}
