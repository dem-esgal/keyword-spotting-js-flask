### Flask based in-browser command recognition with music serving
### This is a prototype (not even alfa-version). Be careful, please.

This project is based on https://github.com/castorini/honkling

It's a flask server that can understand several commands
Left - to start playing music
Stop - to pause
Go - to resume
Right - no action
Down - no action

Also on "Left" command the next voice activity is recorded.
So you can say
"Left.. Please do something"
"Please do something" will be saved to the file output/command.wav (16KHz Wav file)


run main.py to start
open http://localhost:8081/ ib chrome or firefox

Please change SECRET_KEY in server.cfg
