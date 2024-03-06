#!/bin/bash
date=$(date)
cd /home/iowa-state-surplus/
git pull origin main
node app.js
node build-website.js
git add .
git commit -m "Updates to Surplus Inventory! - $date"
git config --global credential.helper store
git push -u origin main

