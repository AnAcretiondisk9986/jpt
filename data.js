window.TRIP_DATA = {
  locale: {
    city: {
      "义乌 · 上海 · 东京": "義烏・上海・東京",
      "东京": "東京",
      "秩父 · 长瀞": "秩父・長瀞",
      "镰仓": "鎌倉",
      "东京 · 京都": "東京・京都",
      "京都 · 大阪": "京都・大阪",
      "高槻 · 箕面 · 大阪": "高槻・箕面・大阪",
      "大阪 · 上海 · 义乌": "大阪・上海・義烏"
    },
    shortTitle: {
      "出发与抵达": "出発・東京へ",
      "东京 · 孤独摇滚": "東京・ぼっち・ざ・ろっく！",
      "秩父 · 上伊那牡丹": "秩父・上伊那ぼたん",
      "镰仓 · 海岸": "鎌倉・海岸",
      "移动日 · 京都": "移動日・京都",
      "岚山 → 大阪": "嵐山 → 大阪",
      "白色巨塔 · 箕面": "白い巨塔・箕面",
      "返程": "帰国"
    },
    title: {
      "一路向东，抵达东京": "東へ、東京に着く",
      "老东京与下北泽": "東京の下町と下北沢",
      "山间小城，冬日巡礼": "山の町、冬の聖地巡礼",
      "坐江之电，去看冬海": "江ノ電で冬の海へ",
      "从东山石阶到鸭川晚风": "東山の石段から鴨川へ",
      "竹林清晨，运河入夜": "竹林の朝、夜の大阪",
      "医学史、瀑布与都会夜色": "医学史、滝、都市の夜景",
      "沿海返航，回到义乌": "空路で帰国、義烏へ"
    }
  },
  days: [
    {
      id: 1,
      date: "01.19",
      weekday: "火",
      city: "义乌 · 上海 · 东京",
      title: "一路向东，抵达东京",
      shortTitle: "出发与抵达",
      color: "#d9694f",
      lodging: "东京 · 连续 4 晚",
      summary: "从义乌经上海前往东京。第一天留给城际转移与飞行，落地后只安排入住和附近散步。",
      transport: "高铁 · 市域机场线 · 飞机 · 京急",
      stops: [
        {
          name: "义乌站",
          jp: "Yiwu Railway Station",
          time: "09:30",
          category: "出发",
          coords: [120.0747, 29.3794],
          description: "预留到站与检票时间，乘高铁前往上海虹桥。建议购买中午前抵达的车次，与国际航班之间留足缓冲。",
          toNext: { mode: "rail", method: "高铁", detail: "义乌站 → 上海虹桥站", duration: "约 1.5–2 小时" }
        },
        {
          name: "上海虹桥站",
          jp: "Shanghai Hongqiao",
          time: "11:30",
          category: "换乘",
          coords: [121.327, 31.194],
          description: "抵达后按导向换乘上海轨道交通市域线机场联络线，直接前往浦东机场。",
          toNext: { mode: "rail", method: "市域机场线", detail: "虹桥 2 号航站楼 → 浦东 1、2 号航站楼", duration: "约 40 分钟 · ¥26" }
        },
        {
          name: "上海浦东国际机场",
          jp: "Shanghai Pudong · PVG",
          time: "17:25",
          category: "MU575 · T1",
          coords: [121.8083, 31.1443],
          description: "搭乘中国东方航空 MU575 前往东京羽田。截图时刻为 17:25 起飞、20:50 抵达，出行前复核航站楼与值机截止时间。",
          toNext: { mode: "flight", method: "东航 MU575", detail: "上海浦东 T1 → 东京羽田 T3", duration: "17:25 — 20:50" }
        },
        {
          name: "东京羽田机场",
          jp: "Tokyo Haneda · HND",
          time: "20:50",
          category: "抵达 · T3",
          coords: [139.7798, 35.5494],
          description: "入境后前往东京市区，不再安排正式景点。建议提前确认住宿最晚入住时间，并在机场补充 Suica 余额。",
          toNext: { mode: "rail", method: "京急机场线 / 东京单轨电车", detail: "羽田机场 → 东京市区住宿", duration: "约 30–50 分钟" }
        },
        {
          name: "东京市区",
          jp: "Tokyo",
          time: "22:00",
          category: "入住",
          coords: [139.7671, 35.6812],
          description: "办理入住，简单用餐后休息。后四天的东京、下北泽、秩父和镰仓行程都从这里出发。"
        }
      ]
    },
    {
      id: 2,
      date: "01.20",
      weekday: "水",
      city: "东京",
      title: "老东京与下北泽",
      shortTitle: "东京 · 孤独摇滚",
      color: "#d34e73",
      lodging: "东京",
      summary: "上午从浅草与隅田川开始，下午进入下北泽的唱片店和小巷，傍晚在涩谷看城市灯光亮起。",
      transport: "银座线 · 小田急线 · 步行",
      stops: [
        {
          name: "浅草寺与隅田川",
          jp: "浅草寺 · 隅田川",
          time: "09:00",
          category: "历史街区",
          coords: [139.7967, 35.7148],
          description: "从雷门进入浅草寺，保留约 2 小时参观本堂与仲见世周边。之后沿隅田川走一小段，把寺院街景和开阔水面放在一起看。",
          toNext: { mode: "rail", method: "银座线 → 小田急线", detail: "浅草 → 涩谷换乘 → 下北泽", duration: "约 45–55 分钟" }
        },
        {
          name: "下北泽街区",
          jp: "下北沢 · Shimokitazawa",
          time: "13:30",
          category: "城市漫游",
          coords: [139.6682, 35.6615],
          description: "沿站前小巷慢逛，留出时间给独立唱片店、古着店与咖啡馆。这里也是《孤独摇滚！》舞台氛围最集中的巡礼区域。",
          toNext: { mode: "walk", method: "步行", detail: "下北泽站 → SHELTER", duration: "约 5–8 分钟" }
        },
        {
          name: "SHELTER",
          jp: "下北沢 SHELTER",
          time: "15:00",
          category: "《孤独摇滚！》巡礼",
          coords: [139.6674, 35.6624],
          address: "東京都世田谷区北沢 2-6-10 仙田ビル B1",
          description: "Live house SHELTER 是作品中 STARRY 的外观参考。以外观巡礼为主，拍摄不阻塞通道、不影响居民与场地运营，内部拍摄先询问工作人员。",
          toNext: { mode: "rail", method: "小田急线 / 京王井之头线", detail: "下北泽 → 涩谷", duration: "约 10–20 分钟" }
        },
        {
          name: "涩谷十字路口",
          jp: "渋谷スクランブル交差点",
          time: "18:00",
          category: "城市夜景",
          coords: [139.7016, 35.6595],
          description: "傍晚抵达涩谷，在十字路口感受人流与霓虹，再选一处高层公共空间或观景台看夜景。展望台如需预约，提前在官网操作。"
        }
      ]
    },
    {
      id: 3,
      date: "01.21",
      weekday: "木",
      city: "秩父 · 长瀞",
      title: "山间小城，冬日巡礼",
      shortTitle: "秩父 · 上伊那牡丹",
      color: "#c59635",
      lodging: "东京",
      summary: "搭西武特急进入秩父山地，在《上伊那牡丹》的街巷场景之间加入武甲山与长瀞溪谷的冬季自然风光。",
      transport: "西武特急 Laview · 秩父铁道 · 步行",
      stops: [
        {
          name: "池袋站",
          jp: "池袋駅",
          time: "08:00",
          category: "特急出发",
          coords: [139.7109, 35.7295],
          description: "从池袋搭乘西武特急 Laview 前往西武秩父，最快约 77 分钟。除车票外需要特急券，建议提前预订并留意发车月台。",
          toNext: { mode: "rail", method: "西武特急 Laview", detail: "池袋 → 西武秩父", duration: "最快约 77 分钟" }
        },
        {
          name: "羊山公园",
          jp: "羊山公園 · 芝桜の丘",
          time: "10:00",
          category: "第 1 话场景 · 自然",
          coords: [139.0785, 35.9832],
          description: "从公园步道回望秩父市街与武甲山，是冬季行程的自然开场。这里出现过作品第 1 话场景；芝樱并非 1 月花况，不必为花期专程赶来。",
          toNext: { mode: "walk", method: "步行", detail: "羊山公园 → 秩父神社", duration: "约 20–25 分钟" }
        },
        {
          name: "秩父神社与番场町",
          jp: "秩父神社 · 番場町",
          time: "12:00",
          category: "历史街区",
          coords: [139.0846, 35.9974],
          description: "参观秩父神社后，沿番场通寻找保留至今的老商铺立面。午餐可安排在附近，给街区留出慢逛时间。",
          toNext: { mode: "walk", method: "步行", detail: "番场通 → あさひや", duration: "街区步行" }
        },
        {
          name: "あさひや",
          jp: "かえでやのモデル",
          time: "14:00",
          category: "第 2 话场景",
          coords: [139.0836, 35.9938],
          description: "这里是作品第 2 话酒店铺「かえでや」的参考场景。以街景与建筑外观为主，拍摄时尊重店铺经营和私人空间。",
          toNext: { mode: "walk", method: "步行", detail: "番场町 → 西武秩父站", duration: "约 15–20 分钟" }
        },
        {
          name: "西武秩父站与祭之汤",
          jp: "西武秩父駅 · 祭の湯",
          time: "15:00",
          category: "第 3 话场景",
          coords: [139.0943, 35.9907],
          description: "车站建筑与祭之汤入口对应作品中的秩父场景。可在这里休息，再根据体力与日照决定是否继续前往长瀞。",
          toNext: { mode: "rail", method: "步行 + 秩父铁道", detail: "御花畑站 → 长瀞站", duration: "步行 5 分钟 + 车程约 20 分钟" }
        },
        {
          name: "长瀞岩叠",
          jp: "長瀞 · 岩畳",
          time: "16:00",
          category: "可选 · 溪谷冬景",
          coords: [139.1127, 36.0964],
          description: "沿荒川走到岩叠，看层状岩石与冬季清澈水流。1 月日落较早，若离开西武秩父已偏晚，就把这里留到下次，直接返回东京。",
          toNext: { mode: "rail", method: "秩父铁道 → 西武线", detail: "长瀞 → 西武秩父 → 池袋", duration: "约 2–2.5 小时" }
        }
      ]
    },
    {
      id: 4,
      date: "01.22",
      weekday: "金",
      city: "镰仓",
      title: "坐江之电，去看冬海",
      shortTitle: "镰仓 · 海岸",
      color: "#3889a7",
      lodging: "东京",
      summary: "把节奏放慢，从镰仓老街走到寺院与海岸。日落前抵达稻村崎，等相模湾、江之岛和可能出现的富士山。",
      transport: "JR · 江之电 · 步行",
      stops: [
        {
          name: "小町通",
          jp: "鎌倉 · 小町通り",
          time: "09:30",
          category: "老街与早餐",
          coords: [139.5512, 35.3193],
          description: "从镰仓站进入小町通，早到可避开午间人流。以早餐和街巷散步为主，不必把上午耗在排队网红店。",
          toNext: { mode: "rail", method: "江之电", detail: "镰仓站 → 长谷站", duration: "约 5 分钟" }
        },
        {
          name: "长谷寺",
          jp: "長谷寺",
          time: "11:00",
          category: "寺院与眺望",
          coords: [139.5366, 35.3123],
          description: "沿寺院步道向上，在见晴台眺望由比滨与镰仓市街。冬季游客相对温和，庭院、海岸和城市层次都能在晴天看清。",
          toNext: { mode: "walk", method: "步行", detail: "长谷寺 → 由比滨海岸", duration: "约 10–15 分钟" }
        },
        {
          name: "由比滨",
          jp: "由比ヶ浜",
          time: "13:00",
          category: "海岸散步",
          coords: [139.5425, 35.3086],
          description: "沿海滩慢慢向东走一段，冬季海风较强，备好防风外套。午餐安排在长谷或镰仓站附近更从容。",
          toNext: { mode: "rail", method: "江之电", detail: "长谷 / 由比滨 → 稻村崎", duration: "约 10 分钟" }
        },
        {
          name: "稻村崎",
          jp: "稲村ヶ崎",
          time: "15:30",
          category: "相模湾日落",
          coords: [139.5219, 35.3043],
          description: "在日落前抵达海岸，向西眺望江之岛。空气通透时可以看到富士山，具体可见度取决于天气，不把雪山出现当成确定承诺。",
          toNext: { mode: "rail", method: "江之电 + JR", detail: "稻村崎 → 镰仓 → 东京", duration: "约 1–1.5 小时" }
        }
      ]
    },
    {
      id: 5,
      date: "01.23",
      weekday: "土",
      city: "东京 · 京都",
      title: "从东山石阶到鸭川晚风",
      shortTitle: "移动日 · 京都",
      color: "#6c78ad",
      lodging: "京都站附近 · 1 晚",
      summary: "上午乘新干线进入关西，下午只走一条连贯的东山路线，晚上在鸭川边结束移动日。",
      transport: "东海道新干线 · 巴士 · 步行",
      stops: [
        {
          name: "东京站",
          jp: "東京駅",
          time: "08:30",
          category: "前往关西",
          coords: [139.7671, 35.6812],
          description: "退房后前往东京站，搭乘东海道新干线至京都。普通车指定席按约 ¥700 人民币预留，以实际汇率与票价为准。",
          toNext: { mode: "rail", method: "东海道新干线", detail: "东京 → 京都", duration: "约 2 小时 15 分钟" }
        },
        {
          name: "清水寺",
          jp: "清水寺",
          time: "12:30",
          category: "古都景观",
          coords: [135.785, 34.9949],
          description: "在京都站寄存或先放行李后上山。清水舞台俯瞰冬季京都，视野开阔，下午顺光也更适合看城市层次。",
          toNext: { mode: "walk", method: "步行", detail: "清水寺 → 二年坂、三年坂", duration: "约 5–10 分钟" }
        },
        {
          name: "二年坂与三年坂",
          jp: "二年坂 · 三年坂",
          time: "14:00",
          category: "历史街景",
          coords: [135.7812, 34.9978],
          description: "沿石阶与传统町屋下坡，找一处安静角落休息。周末下午人流较多，保持单行游览方向即可，不必重复折返。",
          toNext: { mode: "walk", method: "步行", detail: "三年坂 → 八坂神社", duration: "约 15–20 分钟" }
        },
        {
          name: "八坂神社与祇园",
          jp: "八坂神社 · 祇園",
          time: "16:00",
          category: "神社与街巷",
          coords: [135.7785, 35.0037],
          description: "从八坂神社向西进入祇园，沿花见小路周边感受町屋街景。私人巷道有拍摄限制，遵循现场标识。",
          toNext: { mode: "walk", method: "步行", detail: "祇园 → 鸭川", duration: "约 10 分钟" }
        },
        {
          name: "鸭川",
          jp: "鴨川",
          time: "17:30",
          category: "河岸晚景",
          coords: [135.7713, 35.009],
          description: "在四条大桥附近沿河岸走一小段，看对岸灯光和水面。晚餐后返回京都站附近住宿，为次日岚山保留体力。"
        }
      ]
    },
    {
      id: 6,
      date: "01.24",
      weekday: "日",
      city: "京都 · 大阪",
      title: "竹林清晨，运河入夜",
      shortTitle: "岚山 → 大阪",
      color: "#5a8b68",
      lodging: "大阪 · 难波附近 2 晚",
      summary: "把岚山放在清晨，依次经过庭园、竹林与桂川。傍晚转场大阪，用心斋桥和道顿堀的城市夜色收尾。",
      transport: "JR · 阪急 / 地铁 · 步行",
      stops: [
        {
          name: "天龙寺",
          jp: "天龍寺",
          time: "09:00",
          category: "池泉庭园",
          coords: [135.6738, 35.0159],
          description: "尽早进入天龙寺庭园，曹源池借景岚山，即使冬季也有清晰的枝线与山形。参观结束从北门进入竹林。",
          toNext: { mode: "walk", method: "步行", detail: "天龙寺北门 → 竹林小径", duration: "约 2 分钟" }
        },
        {
          name: "竹林小径",
          jp: "竹林の小径",
          time: "10:00",
          category: "自然与街景",
          coords: [135.6714, 35.0172],
          description: "沿竹林步道向常寂光寺方向走一小段，避开只在主路拍照的人流。竹林无需长时间停留，把更多时间留给河边。",
          toNext: { mode: "walk", method: "步行", detail: "竹林 → 渡月桥", duration: "约 15–20 分钟" }
        },
        {
          name: "渡月桥与桂川",
          jp: "渡月橋 · 桂川",
          time: "11:30",
          category: "山河景观",
          coords: [135.6778, 35.0128],
          description: "过桥后沿河岸看岚山与桂川，冬季水位和植被呈现出更简洁的景色。午餐后返回京都站取行李。",
          toNext: { mode: "rail", method: "JR 嵯峨野线 + 新快速", detail: "岚山 → 京都站 → 大阪站", duration: "含取行李约 1.5 小时" }
        },
        {
          name: "心斋桥与道顿堀",
          jp: "心斎橋 · 道頓堀",
          time: "18:00",
          category: "大阪夜景",
          coords: [135.5013, 34.6687],
          description: "在难波住宿办理入住后，步行至道顿堀运河与心斋桥。这里的重点是运河反光、招牌与街巷，不额外安排商业游乐设施。"
        }
      ]
    },
    {
      id: 7,
      date: "01.25",
      weekday: "月",
      city: "高槻 · 箕面 · 大阪",
      title: "医学史、瀑布与都会夜色",
      shortTitle: "白色巨塔 · 箕面",
      color: "#89705d",
      lodging: "大阪",
      summary: "上午前往高槻的校园历史建筑，下午进入箕面山径，晚上回到梅田看城市夜景。雨天可缩短户外段。",
      transport: "阪急京都线 · 阪急箕面线 · 步行",
      stops: [
        {
          name: "大阪医科药科大学历史资料馆",
          jp: "大阪医科薬科大学 歴史資料館",
          time: "09:30",
          category: "《白色巨塔》主题参访",
          coords: [135.6224, 34.8453],
          address: "最近站：阪急高槻市站",
          description: "参观 1930 年旧别馆与 Vories 建筑，作为医学史主题巡礼。公开信息为工作日 09:30–16:00、免费、周末及假日闭馆，建议提前联系校方确认入馆。《白色巨塔》常见原型考证另涉及大阪大学医院旧址。",
          toNext: { mode: "rail", method: "阪急京都线 → 箕面线", detail: "高槻市 → 石桥阪大前换乘 → 箕面", duration: "约 40–50 分钟" }
        },
        {
          name: "箕面站与箕面山道",
          jp: "箕面駅 · 滝道",
          time: "13:00",
          category: "森林步道",
          coords: [135.4682, 34.8352],
          description: "从车站沿泷道向瀑布前进，单程约 2.8 公里、40–50 分钟。步道坡度总体平缓，但冬季仍应穿防滑鞋，并确认日落前返程。",
          toNext: { mode: "walk", method: "步行", detail: "箕面站 → 箕面大瀑布", duration: "单程约 40–50 分钟" }
        },
        {
          name: "箕面大瀑布",
          jp: "箕面大滝",
          time: "14:00",
          category: "自然 · 33 米瀑布",
          coords: [135.4686, 34.8529],
          description: "在瀑布前休息后原路返回。若上午参访时间延误、降雨或步道状态不佳，将本段改为大阪市区堂岛川与中之岛散步。",
          toNext: { mode: "rail", method: "步行 + 阪急线", detail: "瀑布 → 箕面站 → 梅田", duration: "约 1.5 小时" }
        },
        {
          name: "梅田",
          jp: "梅田",
          time: "17:30",
          category: "城市夜景",
          coords: [135.4983, 34.7024],
          description: "返回大阪站周边，在晚餐后选择一处城市高视点。展望设施根据天气和预算现场决定，把最后一晚留给大阪的灯海。"
        }
      ]
    },
    {
      id: 8,
      date: "01.26",
      weekday: "火",
      city: "大阪 · 上海 · 义乌",
      title: "沿海返航，回到义乌",
      shortTitle: "返程",
      color: "#637982",
      lodging: "返程",
      summary: "早班机回国，不安排额外景点。南海电铁前往关西机场，落地上海后按原路换乘高铁返回义乌。",
      transport: "南海电铁 · 飞机 · 市域机场线 · 高铁",
      stops: [
        {
          name: "难波站",
          jp: "南海 なんば駅",
          time: "05:45",
          category: "前往机场",
          coords: [135.4972, 34.6636],
          description: "从难波乘南海电铁前往关西机场。按 09:20 起飞倒推，前一晚再次核对首班与合适班次，并保留国际航班值机缓冲。",
          toNext: { mode: "rail", method: "南海电铁", detail: "难波 → 关西机场", duration: "约 45–50 分钟" }
        },
        {
          name: "关西国际机场",
          jp: "Kansai International · KIX",
          time: "09:20",
          category: "MU730 · T1",
          coords: [135.244, 34.432],
          description: "搭乘中国东方航空 MU730 返回上海。截图时刻为 09:20 起飞、11:00 抵达，实际航站楼与时刻以出票信息为准。",
          toNext: { mode: "flight", method: "东航 MU730", detail: "大阪关西 T1 → 上海浦东 T1", duration: "09:20 — 11:00" }
        },
        {
          name: "上海浦东国际机场",
          jp: "Shanghai Pudong · PVG",
          time: "11:00",
          category: "抵达 · T1",
          coords: [121.8083, 31.1443],
          description: "入境并取行李后，换乘市域机场线前往上海虹桥。返程高铁不要按落地时间卡点购票，应覆盖入境与行李时间。",
          toNext: { mode: "rail", method: "市域机场线 + 高铁", detail: "浦东机场 → 上海虹桥 → 义乌", duration: "按接续车次安排" }
        },
        {
          name: "义乌站",
          jp: "Yiwu Railway Station",
          time: "傍晚",
          category: "旅程结束",
          coords: [120.0747, 29.3794],
          description: "返回义乌，8 天行程结束。把返程交通和可能的延误缓冲留在计划里，不在当天衔接其他重要安排。"
        }
      ]
    }
  ]
};
