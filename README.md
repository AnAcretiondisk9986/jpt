# 冬、東へ。｜日本 8 日路线

2027 年 1 月 19 日至 26 日，义乌出发，东京进、大阪出。网页包含可筛选的矢量地图、逐日配色、景点介绍与转移方式。

## 在线访问

访问 `https://blog.acretiondisk.top/jpt/`。

## 本地预览

无需构建。在项目目录启动静态服务器：

```powershell
python -m http.server 4173
```

然后打开 `http://localhost:4173`。不要直接双击 HTML，以确保地图按正常网页源加载。

## 文件

- `index.html`：页面结构与行前须知
- `styles.css`：桌面和移动端样式
- `editorial.css`：圆角、纸纹、日轮与日式装饰
- `data.js`：8 天行程、坐标、介绍和交通信息
- `app.js`：MapLibre 地图、逐日筛选与详情交互
- `assets/`：地图引擎、区域瓦片、标注字形和本地字体

地图使用 [MapLibre GL JS](https://maplibre.org/) 和 [OpenFreeMap](https://openfreemap.org/) 的 Positron 矢量样式，底图数据来自 OpenStreetMap。东京、秩父、镰仓、京都、大阪及总览范围的常用瓦片随仓库提供，区域外或更高细节在联网时加载。彩色线路为行程顺序示意，不是实时导航或精确轨道。

鼠标在地图上滚动滚轮即可缩放，不会带动页面滚动。触屏支持拖动与双指缩放。英文采用用户提供的 Anthropic Serif Italic，日文采用 BIZ UDPMincho，中文正文采用 Noto Sans SC Black。

## 更新本地资源

以下脚本会联网下载开放数据，日常浏览不需要运行。地图构建使用 Python 标准库。字体裁剪需要安装 `fonttools[woff]`。

```powershell
python scripts/build-local-map.py
python scripts/build-local-fonts.py
```

地图数据与样式的归属见 `assets/map/ATTRIBUTION.txt`。本地字体只包含页面当前用字，修改文案后重新运行字体脚本。日文字体的 SIL OFL 许可证随字体保存。

## 部署

仓库的 GitHub Pages 使用 GitHub Actions 自动发布 `main` 分支。工作流位于 `.github/workflows/pages.yml`。

航班与票价来自旅行规划时的截图，铁路、开放时间及参观要求可能变化，预订前请复核官方信息。
