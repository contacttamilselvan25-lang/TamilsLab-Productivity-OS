$desktopPath = [System.Environment]::GetFolderPath('Desktop')

# 1. Start App Shortcut
$shortcutPath = Join-Path -Path $desktopPath -ChildPath "Tamil'slab Productivity.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)\start_app.bat"
$Shortcut.WorkingDirectory = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)"
$Shortcut.IconLocation = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)\app_logo.ico"
$Shortcut.Description = "Launch Tamil'slab Productivity App"
$Shortcut.Save()

# 2. Stop App Shortcut
$stopShortcutPath = Join-Path -Path $desktopPath -ChildPath "Stop Tamil'slab Productivity.lnk"
$StopShortcut = $WScriptShell.CreateShortcut($stopShortcutPath)
$StopShortcut.TargetPath = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)\stop_app.bat"
$StopShortcut.WorkingDirectory = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)"
$StopShortcut.IconLocation = "C:\Tamil's lab\Antigravity\Tamil'slab(productivity)\app_logo.ico"
$StopShortcut.Description = "Stop Tamil'slab Productivity App Server"
$StopShortcut.Save()

Write-Host "Desktop shortcuts created successfully!"
