import requests
from bs4 import BeautifulSoup

response = requests.get("https://store.sony.com.vn/collections/home-cinema")

soup = BeautifulSoup(response.content, "html.parser")

titles = soup.findAll('div', class_='aspect-ratio')

links = [("https:"+link.find('img').attrs["src"]) for link in titles]

names = []
for name in soup.findAll('h3', class_='product-item__title'):
    names.append(name.find('a').get_text())

prices = []
for price in soup.findAll('div', class_='product-content-bottom'):
    ls_text = price.find('span').get_text().split(' ')
    for text in ls_text:
        if (text == ''): continue
        if (text == '\n'): continue
        has_digits = any(c.isdigit() for c in text)
        
        if has_digits: prices.append(text)
    

des = []
for d in soup.findAll('div', class_='model-product'):
    des.append(d.get_text().split())

# print(len(des))

arr = []
for i in range(len(links)):
    tt = ''
    for t in des[i]:
        tt = tt + t + ' '
        
    arr.append({
        "name": names[i],
        "price": prices[i],
        "link_img": links[i],
        "describe": tt,
        "sale_id": 2
    })
    
print(arr)

import json

with open('products.json', 'w') as file:
    json.dump(arr, file, indent=4, ensure_ascii=False)
