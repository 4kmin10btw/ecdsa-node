@'
# ECDSA node

Учебный проект: перевод монет между адресами с подтверждением транзакции цифровой подписью ECDSA (secp256k1).

## Запуск

Сервер:

    cd server
    npm install
    node index

Клиент:

    cd client
    npm install
    npm run dev

Открыть http://localhost:5173/

## Ключи

    cd client
    node private/generate.cjs

Публичные ключи нужно вписать в balances в server/index.js.

## Проверка защиты

    cd server
    node test-send.cjs <приватный_ключ_1> <публичный_ключ_2>

Корректная транзакция проходит, подмена суммы, получателя и подпись чужим ключом отклоняются (Not signed!).
'@ | Set-Content -Path "$dst\README.md" -Encoding utf8