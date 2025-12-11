import { useState, useEffect } from 'react';
import styles from '../styles/Board.module.css';
import Square from './Square';
import Modal from './Modal';

type Player = 'X' | 'O';
type Cell = Player | null;
const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const emptyBoard: Cell[] = Array(9).fill(null);

function checkWinner(board: Cell[]) {
  for (const combo of winningCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(Boolean)) return 'draw';
  return null;
}

// minimax
function bestMove(board: Cell[]): number {
  function minimax(b: Cell[], turn: Player): {score:number, idx:number} {
    const winner = checkWinner(b);
    if (winner === 'O') return {score: 10, idx: -1};
    if (winner === 'X') return {score: -10, idx: -1};
    if (winner === 'draw') return {score: 0, idx: -1};

    const moves: {score:number, idx:number}[] = [];
    b.forEach((cell, i) => {
      if (!cell) {
        const copy = b.slice();
        copy[i] = turn;
        const next = minimax(copy, turn === 'O' ? 'X' : 'O');
        moves.push({score: next.score, idx: i});
      }
    });

    if (turn === 'O') {
      return moves.reduce((acc, cur) => (cur.score > acc.score ? cur : acc));
    } else {
      return moves.reduce((acc, cur) => (cur.score < acc.score ? cur : acc));
    }
  }

  return minimax(board, 'O').idx;
}

export default function Board({ onNotify }: { onNotify: (s:string) => void }) {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState<Player>('X');
  const [modal, setModal] = useState<{type:'win'|'lose'|'draw', code?:string} | null>(null);

  // FIX — флаг чтобы юзер не мог кликать во время хода бота
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const winner = checkWinner(board);
    if (!winner) return;

    if (winner === 'X') {
      const promo = (Math.floor(10000 + Math.random()*90000)).toString();
      setModal({type: 'win', code: promo});
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/send-result`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ result: 'win', code: promo })
      }).then(()=> onNotify('Промокод отправлен в Telegram!'))
        .catch(()=> onNotify('Не удалось отправить сообщение в Telegram.'));
    } 
    else if (winner === 'O') {
      setModal({type: 'lose'});
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/send-result`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ result: 'lose' })
      }).then(()=> onNotify('Результат отправлен в Telegram'))
        .catch(()=> onNotify('Не удалось отправить сообщение в Telegram.'));
    } 
    else if (winner === 'draw') {
      setModal({type:'draw'});
    }
  }, [board]);

  useEffect(() => {
    if (playerTurn === 'O') {
      setIsLocked(true); // FIX — игрок временно не может кликать

      const idx = bestMove(board);
      if (idx >= 0) {
        setTimeout(() => {
          setBoard(prev => {
            const next = prev.slice();
            next[idx] = 'O';
            return next;
          });
          setPlayerTurn('X');
          setIsLocked(false); // FIX — снова можно кликать
        }, 450);
      }
    }
  }, [playerTurn]);

  function handleClick(i:number) {
    if (isLocked) return;           // FIX — запретить быстрые клики
    if (board[i]) return;
    if (checkWinner(board)) return;

    setBoard(prev => {
      const next = prev.slice();
      next[i] = 'X';
      return next;
    });

    setPlayerTurn('O');
  }

  function reset() {
    setBoard(emptyBoard.slice());
    setPlayerTurn('X');
    setIsLocked(false);
    setModal(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Игра — Крестики-нолики</h2>
        <p className={styles.subtitle}>Вы — X. Противник играет за O.</p>
        <div className={styles.board}>
          {board.map((cell,i) => (
            <Square key={i} value={cell} onClick={() => handleClick(i)} />
          ))}
        </div>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={reset}>Начать заново</button>
        </div>
      </div>

      {modal && (
        <Modal onClose={reset}>
          {modal.type === 'win' && (
            <div className={styles.result}>
              <h3>Поздравляем — Вы победили!</h3>
              <p>Ваш промокод: <strong className={styles.promo}>{modal.code}</strong></p>
              <p>Мы отправили код в Telegram.</p>
              <button className={styles.btn} onClick={reset}>Играть ещё</button>
            </div>
          )}
          {modal.type === 'lose' && (
            <div className={styles.result}>
              <h3>Увы — вы проиграли</h3>
              <p>Хотите попробовать снова?</p>
              <button className={styles.btn} onClick={reset}>Играть ещё</button>
            </div>
          )}
          {modal.type === 'draw' && (
            <div className={styles.result}>
              <h3>Ничья</h3>
              <button className={styles.btn} onClick={reset}>Играть ещё</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
