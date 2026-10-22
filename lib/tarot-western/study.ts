import { makeWesternDir, wg } from "./types";

const C = "学业考试";

const Q = {
  pass: "这门课／这场考试，还能过吗？",
  fail: "要是没过，下一步该补考还是换条路？",
  major: "现在这个专业，选对了吗？",
  change: "该不该换专业？",
  grad: "该读研，还是先工作？",
  phd: "这条学术路，还要不要走下去？",
  thesis: "论文／大作业卡在哪，今晚先动哪一块？",
  advisor: "导师／教授这层，还处得下去吗？",
  intern: "这份实习，接不接、能不能转正？",
  abroad: "留学这条，现在申还来得及吗？",
  visa: "学生签证／入学材料，过得去吗？",
  money: "学费贷／奖学金，这笔还押不押？",
  burnout: "学不进去是累了，还是这条根本不对？",
  focus: "拖延和分心，今晚最该砍哪一件？",
  group: "小组作业里我是在扛，还是该开口分工？",
  classmate: "同学这层关系，会不会影响我过关？",
  language: "语言考试这次，还要不要再报？",
  transfer: "转学／换学校，值得吗？",
  gap: "空一学期／间隔年，对现在的我有没有用？",
  career: "这个学位，真能接到我想要的工作吗？",
  parent: "家里要我读这个，我自己想读那个，听谁的？",
  online: "网课这门，还能不能救？",
  present: "答辩／展示，我过得去吗？",
  rec: "推荐信该找谁、现在开口会不会晚？",
  waitlist: "候补名单上的学校，还等不等？",
  cheatSheet: "我是没准备好，还是考试焦虑把我锁住了？",
  curve: "这门曲线很难，我该不该 drop？",
  gpa: "GPA 这口，还要不要为它把别的砍掉？",
  officeHour: "该不该去办公室找教授谈一次？",
  plagiarism: "引用／合作这层，我有没有踩线的风险？",
  lab: "实验室／项目组这层，还待得下去吗？",
  stipend: "助教／奖学金被砍，这条还读得起吗？",
  adhd: "注意力这层，今晚用工具管，还是先睡？",
  allnighter: "再熬一晚，是救命还是在伤自己？",
  dropClass: "这门该不该退，以免把 GPA 和心态一起砸了？",
  campus: "校园这层让我窒息，转网课／走读还来得及吗？",
};

export const WESTERN_STUDY_GROUPS = [
  wg(C, "考试过关", ["过", "考试", "补考", "语言"], [
    Q.pass, Q.fail, Q.language, Q.present, Q.online, Q.cheatSheet, Q.curve, Q.gpa, Q.allnighter, Q.dropClass,
  ]),
  wg(C, "专业与方向", ["专业", "换", "学位", "工作"], [
    Q.major, Q.change, Q.grad, Q.phd, Q.career, Q.parent, Q.stipend,
  ]),
  wg(C, "论文实习", ["论文", "导师", "实习", "小组"], [
    Q.thesis, Q.advisor, Q.intern, Q.group, Q.classmate, Q.rec, Q.officeHour, Q.plagiarism, Q.lab,
  ]),
  wg(C, "留学转学", ["留学", "签证", "转学", "间隔年"], [
    Q.abroad, Q.visa, Q.transfer, Q.gap, Q.waitlist, Q.money,
  ]),
  wg(C, "节奏与状态", ["拖延", "学不进", "累"], [
    Q.burnout, Q.focus, Q.adhd, Q.allnighter, Q.campus,
  ]),
];

export const WESTERN_STUDY_DIR = makeWesternDir(
  [
    Q.pass, Q.major, Q.grad, Q.thesis, Q.intern, Q.abroad,
    Q.change, Q.burnout, Q.advisor, Q.focus, Q.career, Q.fail,
  ],
  WESTERN_STUDY_GROUPS,
  [
    { id: "exam", label: "考试/过关", groupLabels: ["考试过关"] },
    { id: "major", label: "专业/读研", groupLabels: ["专业与方向"] },
    { id: "work", label: "论文/实习", groupLabels: ["论文实习"] },
    { id: "move", label: "留学/转学", groupLabels: ["留学转学"] },
    { id: "pace", label: "状态/拖延", groupLabels: ["节奏与状态"] },
  ],
  "西方人问学业，多半是：这门过不过、专业对不对、读研还是工作、论文卡在哪。牌面看节奏，不报分数。",
);
