@echo off
rem https://github.com/http-party/http-server
set scriptPath=%~dp0
set proxyUrl=http://localhost:8080

http-server %scriptPath%src\main\resources\webapp --port 8081 --proxy %proxyUrl% --cors -c-1
