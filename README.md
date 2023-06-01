## Description

Fullstack приложение, сделанное в ходе выполнения тестового задания.
Представляет из себя низкофункциональный чат, позволяющий производить авторизацию или залогинивание клиента, обмен абстрактными текстовыми сообщениями, сгруппированными в общие темы.
После прохождения процедуры аутентификации, клменту предоставляется токен, позволяющий заходить на свою страницу без повторной процедуры аутентификации в течение суток.
При входе в приложение при действующем токене клиент оказывается на странице с темами, где он может выбрать существующую тему или создать новую.
Новые темы другие клиенты могут увидеть только при перзагрузке своей страницы, т.к. компонент "Темы" взаимодействует с сервером только по REST API.
При выборе темы клиент попадает на страницу с сообщениями по этой теме, где он может обмениваться сообщениями с другими клиентами, находящимися на странице с этой же темой в режиме реального времени, т.к. сообщения передаются на сервер и рассылаются с него клиентам через websocket-соединение. В случае отсутствия каких-либо действий на страницы сообщений в течение 3 минут, клиент автоматически перебрасывается на страницу с темами.
По окончании срока действия токена, клиент при любом его действии перебрасывается на страницу авторизации.

Приложение состоит из 2 частей - клиентской и серверной.
Клиентская часть написана на фреймворке Vue.js 3 с применением Composition Api и Pinia в качестве глобального хранилища. Для передачи запросов использовалась библиотека Axios, для организации websocket-соединения - socket.io-client.
Серверная часть написана на фреймворке Nest.js. Для организации websocket-соединения использовалась библиотека socket.io.
Данные храняться в базе данных SQLite, взаимодействие Nest.js с базой данных производится с помощью ORM Prisma.
Приложение готово к использованию только на стадии development. Подготовка к переводу на production не проводилась.

## Installation

Для первичной установки приложения необходимо произвести следующие манипуляции:

1. После скачивания файлов с репозитория, перейти в каталог "server":

```bash
cd ./server
```

2. Выполнить установку зависимостей командой:

```bash
npm install
```

3. Выполнить миграцию схем prisma в файл dev.db SQLite

```bash
npx prisma migrate dev --name init
```

4. Открыть еще один терминал. Перейти в каталог "client"

```bash
cd ./client
```

5. Выполнить установку зависимостей командой:

```bash
npm install
```

## Running the app

1. В каталоге "server" запустить команду:

```bash
# development
npm run start

# watch mode
npm run dev
```

2. В каталоге "client" запустить команду:

```bash
# development
npm run dev
```

3. В браузере в поисковой строке ввести: http://localhost:5173
