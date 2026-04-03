import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles/Index';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';

import styles from './styles.module.css';

export function MainForm() {
  return (
    <form className={styles.form}>
      <div className={styles.formRow}>
        <DefaultInput
          labelText='Tarefa'
          id='input'
          type='text'
          placeholder='Digite sua tarefa'
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
