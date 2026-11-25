# 冬日，向东。｜日本 8 日路线

2027 年 1 月 19 日至 26 日，义乌出发，东京进、大阪出。网页包含可筛选的矢量地图、逐日配色、景点介绍与转移方式。

## 在线访问

访问 `https://blog.acretiondisk.top/jpt/`。

## 本地预览

无需构建。在项目目录启动静态服务器：

```powershell
python -m http.server 4173
```

然后打开 `http://localhost:4173`。不要直接双击 HTML，以确保外部矢量地图资源按正常网页源加载。

## 文件

- `index.html`：页面结构与行前须知
- `styles.css`：桌面和移动端样式
- `data.js`：8 天行程、坐标、介绍和交通信息
- `app.js`：MapLibre 地图、逐日筛选与详情交互

地图使用 [MapLibre GL JS](https://maplibre.org/) 和 [OpenFreeMap](https://openfreemap.org/) 的 Libre 矢量样式，底图数据来自 OpenStreetMap。外部地图与脚本资源需要联网。彩色线路为行程顺序示意，不是实时导航或精确轨道。

## 部署

仓库的 GitHub Pages 使用 GitHub Actions 自动发布 `main` 分支。工作流位于 `.github/workflows/pages.yml`。

航班与票价来自旅行规划时的截图，铁路、开放时间及参观要求可能变化，预订前请复核官方信息。
