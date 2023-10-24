import requests
from bs4 import BeautifulSoup

response = requests.get("https://store.sony.com.vn/collections/tvs")
# print(response)
# print(response.content)
soup = BeautifulSoup(response.content, "html.parser")
# print(soup)
titles = soup.findAll('div', class_='aspect-ratio')
# print(titles)
links = [("https:"+link.find('img').attrs["src"]) for link in titles]
print(links)
