

拷贝如下

```bash
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\Directory\shell\OpenCmdHere]
@="CMD"
"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Directory\shell\OpenCmdHere\command]
@="PowerShell -windowstyle hidden -Command \"Start-Process cmd.exe -ArgumentList '/s,/k, pushd,%V' -Verb RunAs\""
[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCmdHere]
@="CMD"
"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCmdHere\command]
@="PowerShell -windowstyle hidden -Command \"Start-Process cmd.exe -ArgumentList '/s,/k, pushd,%V' -Verb RunAs\""
[HKEY_CLASSES_ROOT\Drive\shell\OpenCmdHere]
@="CMD"
"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\Drive\shell\OpenCmdHere\command]
@="PowerShell -windowstyle hidden -Command \"Start-Process cmd.exe -ArgumentList '/s,/k, pushd,%V' -Verb RunAs\""
[HKEY_CLASSES_ROOT\LibraryFolder\background\shell\OpenCmdHere]
@="CMD"
"Icon"="cmd.exe"
[HKEY_CLASSES_ROOT\LibraryFolder\background\shell\OpenCmdHere\command]
@="PowerShell -windowstyle hidden -Command \"Start-Process cmd.exe -ArgumentList '/s,/k, pushd,%V' -Verb RunAs\""
```

放到任何位置，将文件后缀名改为 reg（如果 `cmd` 需要改成中文的字符，如“在此处打开控制台”等，需要注意下文件的编码格式，建议不要修改），如图
![image.png](https://upload-images.jianshu.io/upload_images/12877063-0083a76af0564c7c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

双击运行，则可以在任何文件夹位置处打开 `cmd`

![image.png](https://upload-images.jianshu.io/upload_images/12877063-9cb3a057c7ce57f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
