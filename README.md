## Tic-Tac-Toe Promo Game

Игра «Крестики-нолики» с генерацией промокодов и Telegram-ботом.
Игрок играет против компьютера. При победе отображается уникальный 5-значный промокод и отправляется уведомление в Telegram.

Проект состоит из двух частей:

* Frontend — React + TypeScript + CSS Modules
* Backend — Node.js + Express + Telegram Bot API
* Фронтенд отправляет запросы на локальный сервер по адресу `http://localhost:4000/api/send-result`

---

## Как запустить Backend (Node.js + Express)

### 1. Перейдите в директорию backend:

```bash
cd backend
```

### 2. Установите зависимости:

```bash
npm install
```

### 3. Создайте файл `.env`:

```
BOT_TOKEN=ВАШ_ТОКЕН_БОТА
CHAT_ID=ВАШ_CHAT_ID
PORT=4000
```

Описание переменных:

* BOT_TOKEN – токен Telegram-бота (от BotFather)
* CHAT_ID – чат ID, куда отправляются уведомления
* PORT – порт сервера (по умолчанию 4000)

### 4. Запустите сервер:

```bash
npm start
```

После запуска сервер будет доступен по адресу:

```
http://localhost:4000
```

---

## Как работает Backend

Сервер принимает POST-запрос:

```
POST /api/send-result
```

Пример содержимого:

```json
{
  "result": "win",
  "code": "12345"
}
```

Backend отправляет сообщение в Telegram через:

```
https://api.telegram.org/bot<TOKEN>/sendMessage
```

Важно: сервер работает локально. Для продакшена требуется VPS, туннель или прокси.

---

## Как запустить Frontend (React + TS)

Перейдите в папку:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Создайте файл `.env`:

```
VITE_BACKEND_URL=http://localhost:4000
```

Запуск:

```bash
npm run dev
```

Игра откроется по адресу:

```
http://localhost:5173
```

---

## Как работает игра

Пользователь играет за X, компьютер за O.
Используется алгоритм minimax.

Основные особенности:

* Игрок делает ход → AI отвечает
* Пока AI «думает», игрок не может кликать
* Победа → показ промокода + отправка в Telegram
* Проигрыш → модальное окно + отправка результата
* Ничья → предложение сыграть снова

---

## Структура проекта

```
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── backend/
    ├── index.js
    ├── .env
    ├── package.json
```

---

## Требования

* Node.js версии 18 или выше
* npm или yarn
* Telegram-бот
* Запуск backend на localhost

---

Если потребуется:

* деплой на Beget
* Docker
* SSL
* интеграция с админкой

---


Сказать?
