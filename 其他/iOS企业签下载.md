iOS企业签下载

**需要3个文件**

- app logo：icon.png
- iOS企业签安装包：xxx.ipa
- plist文件：ipa.plist

`app logo` 和 `iOS企业签安装包` 需要ui和终端提供，`plist文件` 格式如下：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>items</key>
	<array>
		<dict>
			<key>assets</key>
			<array>
				<dict>
					<key>kind</key>
					<string>software-package</string>
					<key>url</key>
					<string>https://xxx-play.oss-cn-hangzhou.aliyuncs.com/app/ios/xxx.ipa</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>display-image</string>
					<key>url</key>
					<string>https://xxx-play.oss-cn-hangzhou.aliyuncs.com/app/ios/icon.png</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>full-size-image</string>
					<key>url</key>
					<string>https://xxx-play.oss-cn-hangzhou.aliyuncs.com/app/ios/icon.png</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>com.xxx.xxx.www</string>
				<key>bundle-version</key>
				<string>1.1.0</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>软件名</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>

```

对应修改成自己企业签信息即可

**使用方式**：`window.location.href = 'itms-services://?action=download-manifest&amp;url=https://xxx.xxx.com/app/ios/ipa.plist'`

**其中**：`url`  后面对应的就是 `plist` 对应的地址

**设置信任**：设置 - 通用 - 设备管理 - 点进去 - 信任