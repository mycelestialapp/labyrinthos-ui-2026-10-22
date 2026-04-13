import fs from "fs";

const s = fs.readFileSync("D:/Dmy-projects/src/lib/questionQuickPick.ts", "utf8");
const western = [
  "感情婚姻",
  "事业工作",
  "财运投资",
  "学业考试",
  "身体健康",
  "人际关系",
  "生育子女",
  "选择决策",
  "宠物",
  "灵性成长",
];
const map = {
  感情婚姻: "love",
  事业工作: "career",
  财运投资: "money",
  学业考试: "study",
  身体健康: "health",
  人际关系: "relation",
  生育子女: "child",
  选择决策: "choice",
  宠物: "pet",
  灵性成长: "spirit",
};

function extractQuestions(id) {
  const marker = `id: '${id}'`;
  const i = s.indexOf(marker);
  if (i < 0) throw new Error("missing " + id);
  const j = s.indexOf("questions: [", i);
  if (j < 0) throw new Error("no questions " + id);
  let pos = j + "questions: [".length;
  const out = [];
  while (pos < s.length) {
    while (/\s/.test(s[pos])) pos++;
    if (s[pos] === "]") break;
    if (s.slice(pos, pos + 2) === "//") {
      while (s[pos] !== "\n" && pos < s.length) pos++;
      continue;
    }
    if (s[pos] !== "'") {
      pos++;
      continue;
    }
    pos++;
    let chunk = "";
    while (pos < s.length) {
      const c = s[pos];
      if (c === "\\") {
        chunk += s[pos + 1] === "'" ? "'" : c + s[pos + 1];
        pos += 2;
        continue;
      }
      if (c === "'") {
        pos++;
        break;
      }
      chunk += c;
      pos++;
    }
    if (chunk.trim()) out.push(chunk);
  }
  return out;
}

/** OpenCC 台湾正体 → 大陆简体（本文件高频字 + 通用字） */
function toHans(t) {
  return t
    .replace(/臺灣|台灣/g, "台湾")
    .replace(/這/g, "这")
    .replace(/們/g, "们")
    .replace(/關/g, "关")
    .replace(/係/g, "系")
    .replace(/麼/g, "么")
    .replace(/為/g, "为")
    .replace(/與/g, "与")
    .replace(/該/g, "该")
    .replace(/會/g, "会")
    .replace(/來/g, "来")
    .replace(/個/g, "个")
    .replace(/時/g, "时")
    .replace(/間/g, "间")
    .replace(/還/g, "还")
    .replace(/對/g, "对")
    .replace(/應/g, "应")
    .replace(/從/g, "从")
    .replace(/無/g, "无")
    .replace(/愛/g, "爱")
    .replace(/復/g, "复")
    .replace(/複/g, "复")
    .replace(/療/g, "疗")
    .replace(/癒/g, "愈")
    .replace(/擇/g, "择")
    .replace(/擧/g, "举")
    .replace(/夥/g, "伙")
    .replace(/處/g, "处")
    .replace(/職/g, "职")
    .replace(/場/g, "场")
    .replace(/題/g, "题")
    .replace(/導/g, "导")
    .replace(/師/g, "师")
    .replace(/證/g, "证")
    .replace(/壓/g, "压")
    .replace(/緩/g, "缓")
    .replace(/選/g, "选")
    .replace(/轉/g, "转")
    .replace(/學/g, "学")
    .replace(/藥/g, "药")
    .replace(/醫/g, "医")
    .replace(/檢/g, "检")
    .replace(/養/g, "养")
    .replace(/寵/g, "宠")
    .replace(/牠/g, "它")
    .replace(/領/g, "领")
    .replace(/隻/g, "只")
    .replace(/緣/g, "缘")
    .replace(/問/g, "问")
    .replace(/際/g, "际")
    .replace(/擠/g, "挤")
    .replace(/誤/g, "误")
    .replace(/禮/g, "礼")
    .replace(/餘/g, "余")
    .replace(/習/g, "习")
    .replace(/進/g, "进")
    .replace(/報/g, "报")
    .replace(/錄/g, "录")
    .replace(/順/g, "顺")
    .replace(/調/g, "调")
    .replace(/態/g, "态")
    .replace(/樣/g, "样")
    .replace(/獲/g, "获")
    .replace(/現/g, "现")
    .replace(/讓/g, "让")
    .replace(/願/g, "愿")
    .replace(/認/g, "认")
    .replace(/於/g, "于")
    .replace(/體/g, "体")
    .replace(/適/g, "适")
    .replace(/險/g, "险")
    .replace(/風/g, "风")
    .replace(/產/g, "产")
    .replace(/買/g, "买")
    .replace(/賣/g, "卖")
    .replace(/錢/g, "钱")
    .replace(/豐/g, "丰")
    .replace(/預/g, "预")
    .replace(/備/g, "备")
    .replace(/護/g, "护")
    .replace(/驅/g, "驱")
    .replace(/蟲/g, "虫")
    .replace(/齡/g, "龄")
    .replace(/異/g, "异")
    .replace(/連/g, "连")
    .replace(/爭/g, "争")
    .replace(/談/g, "谈")
    .replace(/權/g, "权")
    .replace(/監/g, "监")
    .replace(/償/g, "偿")
    .replace(/夢/g, "梦")
    .replace(/親/g, "亲")
    .replace(/級/g, "级")
    .replace(/專/g, "专")
    .replace(/業/g, "业")
    .replace(/補/g, "补")
    .replace(/躍/g, "跃")
    .replace(/運/g, "运")
    .replace(/勢/g, "势")
    .replace(/陰/g, "阴")
    .replace(/靈/g, "灵")
    .replace(/訴/g, "诉")
    .replace(/訟/g, "讼")
    .replace(/舉/g, "举")
    .replace(/採/g, "采")
    .replace(/歡/g, "欢")
    .replace(/將/g, "将")
    .replace(/點/g, "点")
    .replace(/課/g, "课")
    .replace(/麵/g, "面")
    .replace(/嚮/g, "向")
    .replace(/著/g, "着")
    .replace(/質/g, "质")
    .replace(/礙/g, "碍")
    .replace(/響/g, "响")
    .replace(/變/g, "变")
    .replace(/準/g, "准")
    .replace(/驟/g, "骤")
    .replace(/達/g, "达")
    .replace(/別/g, "别")
    .replace(/侶/g, "侣")
    .replace(/實/g, "实")
    .replace(/說/g, "说")
    .replace(/斷/g, "断")
    .replace(/總/g, "总")
    .replace(/類/g, "类")
    .replace(/發/g, "发")
    .replace(/優/g, "优")
    .replace(/嗎/g, "吗")
    .replace(/換/g, "换")
    .replace(/辭/g, "辞")
    .replace(/漲/g, "涨")
    .replace(/帶/g, "带")
    .replace(/團/g, "团")
    .replace(/闆/g, "板")
    .replace(/機/g, "机")
    .replace(/財/g, "财")
    .replace(/獎/g, "奖")
    .replace(/紅/g, "红")
    .replace(/筆/g, "笔")
    .replace(/虧/g, "亏")
    .replace(/損/g, "损")
    .replace(/債/g, "债")
    .replace(/給/g, "给")
    .replace(/過/g, "过")
    .replace(/讀/g, "读")
    .replace(/辦/g, "办")
    .replace(/術/g, "术")
    .replace(/邊/g, "边")
    .replace(/誼/g, "谊")
    .replace(/難/g, "难")
    .replace(/誰/g, "谁")
    .replace(/懷/g, "怀")
    .replace(/後/g, "后")
    .replace(/試/g, "试")
    .replace(/兒/g, "儿")
    .replace(/兩/g, "两")
    .replace(/啟/g, "启")
    .replace(/決/g, "决")
    .replace(/撿/g, "捡")
    .replace(/動/g, "动")
    .replace(/裡/g, "里")
    .replace(/當/g, "当")
    .replace(/歷/g, "历")
    .replace(/頸/g, "颈")
    .replace(/懼/g, "惧")
    .replace(/練/g, "练")
    .replace(/長/g, "长")
    .replace(/賦/g, "赋")
    .replace(/納/g, "纳")
    .replace(/溝/g, "沟")
    .replace(/邊/g, "边")
    .replace(/開/g, "开")
    .replace(/長輩/g, "长辈")
    .replace(/隊/g, "队")
    .replace(/資/g, "资")
    .replace(/務/g, "务")
    .replace(/績/g, "绩")
    .replace(/狀/g, "状")
    .replace(/讀書/g, "读书")
    .replace(/脈/g, "脉")
    .replace(/聯/g, "联")
    .replace(/內/g, "内")
    .replace(/經/g, "经")
    .replace(/堅/g, "坚")
    .replace(/棄/g, "弃")
    .replace(/飯/g, "饭")
    .replace(/緒/g, "绪")
    .replace(/紀/g, "纪")
    .replace(/創/g, "创")
    .replace(/結/g, "结")
    .replace(/書/g, "书")
    .replace(/貴/g, "贵")
    .replace(/輩/g, "辈")
    .replace(/麼/g, "么");
}

const bank = {};
for (const id of western) {
  const all = extractQuestions(id);
  let top = all.slice(0, 20).map(toHans);
  if (map[id] === "study" && top.length < 20) {
    top = top.concat([
      "这个专业对我意味着什么？",
      "我的学习天赋在哪里？",
    ]).slice(0, 20);
  }
  bank[map[id]] = top;
  process.stderr.write(`${id} total ${all.length} -> ${top.length}\n`);
}

const out = JSON.stringify(bank, null, 2);
fs.writeFileSync(new URL("./_bank-out.json", import.meta.url), out, "utf8");
console.log(out);
