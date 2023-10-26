import * as SQLite from 'expo-sqlite';
const levenshtein = require('fast-levenshtein');

const db = SQLite.openDatabase('Mobile.db');

const createTableProduct = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY NOT NULL,
          link_img TEXT NOT NULL,
          name TEXT DEFAULT 'Product name',
          sale_id INT NOT NULL,
          price DOUBLE NOT NULL DEFAULT 10.0,
          describe TEXT DEFAULT 'abc abc abc',
          FOREIGN KEY(sale_id) REFERENCES users(id)
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


const insertProduct = (name, price, describe, link_img, sale_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO products (name, price, describe, link_img, sale_id) VALUES (?, ?, ?, ?, ?)',
        [name, price, describe, link_img, sale_id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
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

const getAllProduct = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const products = [];
            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              products.push({
                productName: productData.name,
                describe: productData.describe,
                link_img: productData.link_img,
                price: productData.price,
                sale_id: productData.sale_id,
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

const findProductTrue = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products WHERE name LIKE ? OR describe LIKE ?',
        [`%${input}%`, `%${input}%`],
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

const minDistance = 3;

const findProduct = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const products = [];

            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              const productName = productData.name;
              const productDescription = productData.describe;

              const nameDistance = levenshtein.get(input, productName);
              const descriptionDistance = levenshtein.get(input, productDescription);

              if (nameDistance <= minDistance || descriptionDistance <= minDistance) {
                products.push(productData);
              }
            }

            if (products.length > 0) {
              resolve(products);
            } else {
              reject(new Error('No matching products found.'));
            }
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

const dropTableProduct = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE products`,
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

export { createTableProduct, insertProduct, getAllProduct, findProductTrue, findProduct, dropTableProduct };
