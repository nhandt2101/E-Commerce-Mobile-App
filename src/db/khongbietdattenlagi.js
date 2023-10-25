import { createTableProduct, insertProduct } from './product';

const fs = require('fs');
const data = fs.readFileSync('./products.json');
const jsonData = JSON.parse(data);

async function importData() {
  try {
    await createTableProduct();

    for (const product of jsonData) {
      const { name, price, describe, sale_id } = product;
      await insertProduct(name, price, describe, sale_id);
    }

    console.log('Dữ liệu đã được nhập vào thư viện thành công.');
  } catch (error) {
    console.error('Lỗi khi nhập dữ liệu:', error);
  }
}