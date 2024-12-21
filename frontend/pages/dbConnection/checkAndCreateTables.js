const {getConnection, connectionConfig} = require('./dbConnection');

const collections = [
    {
        name: 'Product_type',
        schema: {
            id: 'int',
            name: 'string',
            description: 'string'
        }
    },
    {
        name: 'Product',
        schema: {
            id: 'int',
            name: 'string',
            description: 'string',
            price: 'decimal',
            image: 'string',
            product_type_id: 'int',
            is_alcoholic: 'boolean',
            quantity_available: 'int'
        }
    },
    {
        name: 'Product_quantity',
        schema: {
            id: 'int',
            product_id: 'int',
            quantity: 'int'
        }
    },
    {
        name: 'Role',
        schema: {
            id: 'int',
            name: 'string',
            description: 'string'
        }
    },
    {
        name: 'User',
        schema: {
            id: 'int',
            FirstName: 'string',
            LastName: 'string',
            Email: 'string',
            Password: 'string',
            image: 'string',
            role_id: 'int'
        }
    },
    {
        name: 'Transactions',
        schema: {
            id: 'int',
            sku: 'string',
            user_id: 'int',
            price_bucket: 'decimal',
            date_buy: 'datetime'
        }
    },
    {
        name: 'Transactions_bucket',
        schema: {
            id: 'int',
            transaction_id: 'int',
            product_id: 'int',
            quantity: 'int'
        }
    },
    {
        name: 'Predicted_Orders',
        schema: {
            id: 'int',
            user_id: 'int',
            predicted_date: 'date',
            predicted_time: 'time',
            products: 'json',
            status: 'string',
            created_at: 'datetime'
        }
    },
];

async function checkAndCreateCollections() {
    try {
        const db = await getConnection();

        for (const collection of collections) {
            // Check if the collection exists
            const collectionExists = await db.listCollections({name: collection.name}).hasNext();

            if (!collectionExists) {
                console.log(`Создаю коллекцию: ${collection.name}`);
                // Inserting a dummy document to create the collection
                await db.createCollection(collection.name);
                // Optionally, you can insert a sample document to start populating the collection
                await db.collection(collection.name).insertOne({dummy: 'data'});
            } else {
                console.log(`Коллекция ${collection.name} уже существует`);
            }
        }

        console.log('Проверка коллекций завершена.');
    } catch (error) {
        console.error('Ошибка при проверке или создании коллекций:', error);
    }
}

checkAndCreateCollections();
