#!/bin/bash

touch test.txt
rm test.txt

echo "Now let's set up the connection to your Nightscout website."
read -p "What is your the MYNIGHTSCOUT part of your Nightscout site URL? (i.e. https://MYNIGHTSCOUT.herokuapp.com)? " -r
NIGHTSCOUT_HOST=$REPLY
echo

echo "Now let's set up your NS API_SECRET."
read -p "What is your Nightscout API_SECRET (i.e. myplaintextsecret; It should be at least 12 characters long)? " -r
APISECRET=$REPLY
echo

echo "The simulator needs a few details about the simulated subject."
read -p "What is your typical ISF:   " -r
  if [[ $REPLY =~ [0-9] ]]; then
    ISF="$REPLY"
    echo "Ok, $ISF units will be set as your ISF."
  else
    ISF=2
    echo "Ok, your ISF will be set to 2 for now."
  fi

echo NIGHTSCOUT_HOST="$NIGHTSCOUT_HOST" >> test.txt
echo NIGHTSCOUT_URL="https://$NIGHTSCOUT_HOST.herokuapp.com" >> test.txt
echo APISECRET="$APISECRET" >> test.txt
echo ISF="$ISF" >> test.txt

chmod +x ./bash2.sh
exit