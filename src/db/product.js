import * as SQLite from 'expo-sqlite';
import { getAddressBySaleId } from './user';

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
          const tableCreated = result.insertId !== undefined;
          resolve(tableCreated);
        },
        (_, error) => {
          console.log('Error creating database:', error);
          reject(error);
        }
      );
    });
  });
};

const createTableAndLoadData = async () => {
    try {
      let product = await getAllProduct();
      if (product != null) {
        return;
      }
      const jsonData = require('./products.json');

      for (const product of jsonData) {
        let name = product['name']
        let price = product['price']
        let describe = product['describe']
        let link_img = product['link_img']
        let sale_id = product['sale_id']
        await insertProduct(name, price, describe, link_img, sale_id);
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
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
          console.error('Error inserting product:', error);
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
        async (_, result) => {
          if (result.rows.length > 0) {
            const products = [];
            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              // const address = await getAddressBySaleId(1);

              products.push({
                id: productData.id,
                productName: productData.name,
                describe: productData.describe,
                link_img: productData.link_img,
                price: productData.price,
                sale_id: productData.sale_id,
                address_sale: "Ho Chi Minh, Viet Nam",
              });
            }
            resolve(products);
          } else {
            resolve(null);
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

const findComment = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM reviews WHERE productID = ?', [id],
        async (_, result) => {
          const resultsArray = [];
          for (let i = 0; i < result.rows.length; i++) {
            resultsArray.push(result.rows.item(i));
          }
          resolve(resultsArray);
        },
        (_, error) => {
          console.error('Error querying products:', error);
          reject(error);
        }
      );
    })
  })  
}

const findProductTrue = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products WHERE name LIKE ? OR describe LIKE ?',
        [`%${input}%`, `%${input}%`],
        async (_, result) => {
          if (result.rows.length > 0) {
            const products = [];
            for (let i = 0; i < result.rows.length; i++) {
              const productData = result.rows.item(i);
              // const address = await getAddressBySaleId(productData.sale_id);

              products.push({
                id: productData.id,
                productName: productData.name,
                describe: productData.describe,
                link_img: productData.link_img,
                price: productData.price,
                sale_id: productData.sale_id,
                address_sale: "Ho Chi Minh, Viet Nam",
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

const findProduct = (input, maxDistance) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products',
        [],
        async (_, result) => {
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

              let distance = Math.min(
                levenshtein(input, productName),
                levenshtein(input, productDescription)
              );
              distance = Math.min(distance, levenshtein(input, productName + productDescription));

              if (distance < maxDistance) {
                // const address = await getAddressBySaleId(productData.sale_id);
                closestProducts.push({
                  id: productData.id,
                  productName: productData.name,
                  describe: productData.describe,
                  link_img: productData.link_img,
                  price: productData.price,
                  sale_id: productData.sale_id,
                  distance: distance,
                  address_sale: "Ho Chi Minh, Viet Nam",
                });
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
  const findProductPromise = findProduct(input, 5).catch(() => []);

  return Promise.all([findProductTruePromise, findProductPromise]).then(([trueProduct, similarProducts]) => {
    if (trueProduct) {
      return trueProduct;
    } else {
      return similarProducts.slice(0, 10);
    }
  });
};

const getBySale = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products WHERE sale_id = ?',
        [input],
        async (_, result) => {
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
            resolve([]);
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

const deleteProduct = (input) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM products WHERE id = ?',
        [input],
        (_, result) => {
          resolve(); // Đổi từ `resolve()` thành `resolve(result)` nếu bạn muốn trả về thông tin về số hàng đã bị xóa
        },
        (_, error) => {
          console.error('Error deleting product:', error);
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
        'DROP TABLE IF EXISTS products',
        [],
        (_, result) => {
          resolve(true);
        },
        (_, error) => {
          console.error('Error dropping table:', error);
          reject(error);
        }
      );
    });
  });
};

export { createTableProduct, createTableAndLoadData, insertProduct, getAllProduct, findComment, findProductTrue, findProduct, findProductCombined, getBySale, deleteProduct, dropTableProduct };
