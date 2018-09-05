cd server
start /B "" "cmd /c yarn r"
cd ..
cd client
start /B "" "cmd /c yarn w"
start "" "http://localhost:1234/"
