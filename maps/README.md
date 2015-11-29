

i) server folder contains a mock http server that returns dummy data for client
   to use

ii) web folder contains web client


Frontend dependencies
    - see web/bower.json for exact dependencies
    - mainly angularjs, jquery, underscore and bootstrap


To build, install npm for mock backend and bower for frontend dependencies 

To add dependenices, use command:
Frontend
    bower install
Backend
    npm install

To run:

type: npm run start_server to run the server
type: npm run start_client to run the angular app