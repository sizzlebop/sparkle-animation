@echo off
:: Convert WebM to GIF using ffmpeg
:: Usage: Just drop the demo.webm file on this batch file

ffmpeg -i "%~1" -vf "fps=20,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 demo.gif
pause