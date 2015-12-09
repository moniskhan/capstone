import urllib
from xml.dom import minidom

huluUrl = urllib.urlopen('http://m.hulu.com/search?query=sherlock').read()
hulu = minidom.parseString(huluUrl)
videos = hulu.getElementsByTagName("video")

for video in videos:
    titleList = video.getElementsByTagName("title")
    for title in titleList:
    	print title.firstChild.data