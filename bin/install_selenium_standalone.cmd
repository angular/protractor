@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\install_selenium_standalone" %*
) ELSE (
  node  "%~dp0\install_selenium_standalone" %*
)
