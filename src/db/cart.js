import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Mobile.db');

const createTableCart = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY NOT NULL,
          link_img TEXT NOT NULL,
          name TEXT DEFAULT 'Product name',
          sale_id INT NOT NULL,
          user_id INT NOT NULL,
          price DOUBLE NOT NULL DEFAULT 10.0,
          describe TEXT DEFAULT 'abc abc abc',
          quantity INT NOT NULL,
          FOREIGN KEY (sale_id) REFERENCES users(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );`,
        [],
        (_, result) => {
          // TODO
          resolve();
        },
        (_, error) => {
          console.error('Error creating database:', error);
          // TODO
          reject(error);
        }
      );
    });
  });
};


const insertCart = (name, price, describe, link_img, quantity, sale_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO cart (name, price, describe, link_img, quantity, sale_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, price, describe, link_img, quantity, sale_id, user_id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(result);
          } else {
            reject(new Error('Insertion failed'));
          }
        },
        (_, error) => {
          console.error('Error inserting user:', error);
          reject(error);
        }
      );
    });
  });
};

const getCart = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM cart',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const products = [];
            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              products.push({
                id: productData.id,
                productName: productData.name,
                describe: productData.describe,
                link_img: productData.link_img,
                price: productData.price,
                sale_id: productData.sale_id,
                quantity: productData.quantity,
              });
            }
            resolve(products);
          } else {
            reject(new Error('No products found.'));
          }
        },
        (_, error) => {
          console.error('Error querying products:', error);
          reject(error);
        }
      );
    });
  });
};

const dropTableCart = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE cart`,
        [],
        (_, result) => {
          // TODO
          resolve(true);
        },
        (_, error) => {
          console.error('Error creating database:', error);
          // TODO
          reject(error);
        }
      );
    });
  });
};

export { createTableCart, insertCart, getCart, dropTableCart };