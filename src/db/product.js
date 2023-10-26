import * as SQLite from 'expo-sqlite';
const unidecode = require('unidecode');

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
        );
        CREATE INDEX IF NOT EXISTS idx_name ON products(name);
        CREATE INDEX IF NOT EXISTS idx_describe ON products(describe);
        `,
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

function preprocessVietnameseText(text) {
  const unidecodedText = unidecode(text);
  return unidecodedText.toLowerCase();
}

function levenshtein(s1, s2) {
  let s1_len = s1.length;
  let s2_len = s2.length;
  let i, j, c, c_temp, cost;
  let s1_char;
  let cv0 = new Array(s2_len + 1);
  let cv1 = new Array(s2_len + 1);

  for (let k = 0; k <= s2_len; k++) {
    cv0[k] = k;
    cv1[k] = 0;
  }

  if (s1 === s2) {
    return 0;
  } else if (s1_len === 0) {
    return s2_len;
  } else if (s2_len === 0) {
    return s1_len;
  } else {
    for (i = 0; i < s1_len; i++) {
      s1_char = s1.charAt(i);
      c = i;
      cv0[0] = i + 1;

      for (j = 0; j < s2_len; j++) {
        cost = s1_char === s2.charAt(j) ? 0 : 1;
        c_temp = cv1[j] + cost;
        if (c > c_temp) {
          c = c_temp;
        }
        c_temp = cv1[j + 1] + 1;
        if (c > c_temp) {
          c = c_temp;
        }
        cv0[j + 1] = c;
      }

      for (j = 0; j <= s2_len; j++) {
        cv1[j] = cv0[j];
      }
    }
  }
  return c;
}

const findProduct = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            if (input.length == 0) {
              resolve(result);
            }
            const closestProducts = [];
            input = preprocessVietnameseText(input);

            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              const productName = preprocessVietnameseText(productData.name);
              const productDescription = preprocessVietnameseText(productData.describe);

              const distance = Math.min(levenshtein(input, productName), levenshtein(input, productDescription))

              if (distance < 3) {
                closestProducts.push({
                  id: productData.id,
                  productName: productData.name,
                  describe: productData.describe,
                  link_img: productData.link_img,
                  price: productData.price,
                  sale_id: productData.sale_id,

                })
              }
            }

            closestProducts.sort((a, b) => a.distance - b.distance);

            resolve(closestProducts.slice(0, 10));
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

const findProductCombined = (input) => {
  const findProductTruePromise = findProductTrue(input).catch(() => null);
  const findProductPromise = findProduct(input).catch(() => []);

  return Promise.all([findProductTruePromise, findProductPromise]).then(([trueProduct, similarProducts]) => {
    if (trueProduct) {
      return trueProduct;
    } else {
      return similarProducts.slice(0, 10);
    }
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

export { createTableProduct, insertProduct, getAllProduct, findProductTrue, findProduct, findProductCombined, dropTableProduct };
