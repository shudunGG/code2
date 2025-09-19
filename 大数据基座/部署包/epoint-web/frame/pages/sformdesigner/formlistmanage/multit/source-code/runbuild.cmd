REM set current_path="%cd%"
REM echo %current_path%

REM set current_path2=%current_path:\=/%
REM echo %current_path2%

REM REM C:\"Program Files"\Git\bin\bash.exe %current_path2%/runbuild.sh
REM C:\"Program Files"\Git\usr\bin\mintty.exe %current_path2%/runbuild.shbash 

set current_path="%cd%"
echo %current_path%

set current_path2=%current_path:\=/%
echo %current_path2%

bash %current_path2%/runbuild.sh

pause