import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Mobile.db');

const createTableUser = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            async (tx) => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY NOT NULL,
                        name TEXT DEFAULT 'abc abc',
                        age INTEGER DEFAULT 18,
                        email TEXT NOT NULL,
                        password TEXT NOT NULL,
                        isSale INTEGER DEFAULT 0 NOT NULL,
                        address TEXT NOT NULL DEFAULT 'Cau Giay, Ha Noi'
                    );`,
                    [],
                    (_, result) => {
                        resolve(result);
                    },
                    (_, error) => {
                        console.error('Error creating database:', error);
                        reject(error);
                    }
                );
            }
        );
    });
};

const insertUser = async (email, password, isSelected) => {
    return new Promise((resolve, reject) => {
        db.transaction(
            async (tx) => {
                tx.executeSql(
                    'INSERT INTO users (email, password, isSale) VALUES (?, ?, ?)',
                    [email, password, isSelected],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            resolve(result);
                        } else {
                            reject(new Error('User not inserted'));
                        }
                    },
                    (_, error) => {
                        console.error('Error inserting user:', error);
                        reject(error);
                    }
                );
            }
        );
    });
};

const updateUser = async (id, name, age, email, password, isSale, address) => {
    return new Promise((resolve, reject) => {
        db.transaction(
            async (tx) => {
                tx.executeSql(
                    `UPDATE users SET name = ?, age = ?, email = ?, password = ?, isSale = ?, address = ? WHERE id = ?`,
                    [name, age, email, password, isSale, address, id],
                    (_, result) => {
                        resolve(result);
                    },
                    (_, error) => {
                        console.error('Error updating user:', error);
                        reject(error);
                    }
                );
            }
        );
    });
};

const getUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        db.transaction(
            async (tx) => {
                tx.executeSql(
                    'SELECT * FROM users WHERE email = ? AND password = ?',
                    [email, password],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            const user = result.rows.item(0);
                            resolve(user);
                        } else {
                            reject(new Error('User not found'));
                        }
                    },
                    (_, error) => {
                        console.error('Error querying user:', error);
                        reject(error);
                    }
                );
            }
        );
    });
};

const dropTableUser = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            async (tx) => {
                tx.executeSql(
                    `DROP TABLE users`,
                    [],
                    (_, result) => {
                        resolve(result);
                    },
                    (_, error) => {
                        console.error('Error dropping table:', error);
                        reject(error);
                    }
                );
            }
        );
    });
};

export { createTableUser, insertUser, updateUser, getUser, dropTableUser };