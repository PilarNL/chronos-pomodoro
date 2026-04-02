import styles from './Styles.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href='#'>Entenda como funciona a técnica Pomodoro 🍅</a>
      <a href='#'>
        Chronos Pomodoro &copy; {new Date().getFullYear()} - Feito com 💚 DevLP
      </a>
    </footer>
  );
}
