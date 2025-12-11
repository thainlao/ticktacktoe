import { useState } from 'react';
import styles from './styles/App.module.css';
import Board from './components/Board';

function App() {
  const [message, setMessage] = useState('');
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Мой нежный Тик-Так</h1>
        <p className={styles.subtitle}>Короткая игра на настроение — играй и получай промокод!</p>
      </header>

      <main className={styles.main}>
        <Board onNotify={(msg) => setMessage(msg)} />
        {message && <div className={styles.toast}>{message}</div>}
      </main>

      <footer className={styles.footer}>
        <small>© Нежные игры</small>
      </footer>
    </div>
  );
}

export default App;
