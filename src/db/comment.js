import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Mobile.db');


const addComment = async (productId, currentComment, username) => {
    try {
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql('INSERT INTO reviews (comment, productID, username) values (?, ?, ?)', [currentComment, productId, username],
              (txObj, resultSet) => {
                
                console.log("ok");
                resolve();
              },
              (txObj, error) => reject(error)
            );
          });
        console.log("success", currentComment);
        })
      } catch (error) {
        console.log(error);
      }
  }

export {addComment};