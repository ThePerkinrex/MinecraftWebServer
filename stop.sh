#! /bin/bash

screen -S MCWebServer -p 0 -X stuff "^C"

echo "SIGINT signal sent to webserver"