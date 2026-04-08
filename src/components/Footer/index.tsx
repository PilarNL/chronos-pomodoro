import styles from './Styles.module.css';
import { RouterLink } from '../RouterLink';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <RouterLink href='/about-pomodoro'>
        Entenda como funciona a técnica Pomodoro 🍅
      </RouterLink>
      <span>
        <RouterLink href='/'>
          Chronos Pomodoro &copy; {new Date().getFullYear()}
        </RouterLink>{' '}
        -{' '}
        <a target='_blank' rel='noreferrer' href='https://devlp.com.br'>
          Feito com 💚 DevLP
        </a>
      </span>
    </footer>
  );
}
