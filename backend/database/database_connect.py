#TODO
# 1. сделай подключение к бд для MYSQL PHPmyADMIN.
# 2. в MODELS сделай таблицы, чтобы можно было использовать данные из бд в коде
# 3. Напиши для начало пару endpoints (создание user, product, type_product, transactions) во всех должны быть Create, Delete, Edit (Кроме transactions в нем должен быть только Create. Изменять и удалять его нельзя)
# 4. Нужны к ним schemas так что можно будет видеть пользователю, а что можно будет видеть админу при изменение товара
# DEADLINE 25.11.2024

Таблица Product

{
        name: 'Капучино',
        description: 'Ароматный кофе с молочной пенкой.',
        quantity: "222",
        price: 3.99,
        image: 'https://via.placeholder.com/400'
 },

Таблица Product_type

{
        name: 'Капучино',
        image: 'https://via.placeholder.com/400'
 },


Таблица User

{
        FirstName: 'Капучино',
        LastName:  'Капучино2'
        Email: "example@example.com"
        Password: "Example" (hash) (Varchar255)
        image: 'https://via.placeholder.com/400'
 },

Таблица Transactions

{
        SKU: 'SKU-1244',
        User_id: '1',
        Product_id: '1'
        Price_Bucket: '123.35'
 },

вот тебе полноценное ТЗ
