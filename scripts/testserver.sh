#!/bin/bash

# Start up the server in a way that won't block Travis.
cd testapp
npm run start &
sleep 1
echo Test application started
