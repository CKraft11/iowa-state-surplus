#!/bin/bash
date=$(date)
git pull origin main
node app.js
node build-website.js
git add .
git commit -m "Compiled Changes - $date"
git config --global credential.helper store
git push -u origin main