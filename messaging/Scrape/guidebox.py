import urllib
import json
api_version = '1.43'
api_key = 'F2amlCxCjYRV3WNMBTZ0WYB2A5HZkO'
response = urllib.urlopen('https://api-public.guidebox.com/v'+api_version+'/US/'+api_key+'/shows/all/50/25/all/all').read()
data = json.loads(response)

for result in data['results']:
	print result['title']