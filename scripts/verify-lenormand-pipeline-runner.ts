import { detectQuestionCategory } from "../lib/question-classification";
import { matchMotherTopicDetailed } from "../lib/lenormand-mother-topics-13x500-zh";
import type { QuestionCategory } from "../lib/question-category-keywords";

type CaseItem = {
  id: string;
  question: string;
  expectCategory: QuestionCategory;
  expectMotherTopic: boolean;
};

const CASES: CaseItem[] = [
  { id: "love-1", question: "他最近对我到底什么想法，会不会回头？", expectCategory: "感情婚姻", expectMotherTopic: true },
  { id: "work-1", question: "我现在这份工作该不该跳槽，还是先稳住？", expectCategory: "事业工作", expectMotherTopic: true },
  { id: "money-1", question: "这笔基金现在要不要止损，后面还有机会吗？", expectCategory: "财运投资", expectMotherTopic: true },
  { id: "study-1", question: "我考研复习节奏全乱了，接下来怎么提分？", expectCategory: "学业考试", expectMotherTopic: true },
  { id: "pet-1", question: "我家猫最近半夜总叫，是焦虑还是身体不舒服？", expectCategory: "宠物", expectMotherTopic: true },
  { id: "health-1", question: "我这个指标反复异常，要不要尽快手术？", expectCategory: "身体健康", expectMotherTopic: true },
  { id: "social-1", question: "我和同事最近误会越来越深，还有机会修复吗？", expectCategory: "人际关系", expectMotherTopic: true },
  { id: "travel-1", question: "这周自驾出远门车况不稳，要不要改期？", expectCategory: "出行迁居", expectMotherTopic: true },
  { id: "law-1", question: "这次劳动纠纷证据够不够，走仲裁胜算大吗？", expectCategory: "官司法律", expectMotherTopic: true },
  { id: "child-1", question: "备孕半年了还没动静，接下来该怎么安排？", expectCategory: "生育子女", expectMotherTopic: true },
  { id: "lost-1", question: "钱包可能落在地铁上了，优先从哪里找回？", expectCategory: "失物寻找", expectMotherTopic: true },
  { id: "choice-1", question: "A 城机会更大但压力高，我该怎么做选择？", expectCategory: "选择决策", expectMotherTopic: true },
  { id: "proxy-1", question: "我替我弟问，他最近状态很差我该怎么转述建议？", expectCategory: "代人问卜", expectMotherTopic: true },
  { id: "spirit-1", question: "我最近总觉得很空，灵性练习该如何落地？", expectCategory: "灵性成长", expectMotherTopic: true },
  { id: "fengshui-1", question: "新租的房子动线很别扭，风水上先调整哪里？", expectCategory: "占风水", expectMotherTopic: true },
  { id: "other-1", question: "最近老是梦到同一个场景，这到底代表什么？", expectCategory: "其他", expectMotherTopic: false },
];

function run(): number {
  let failed = 0;
  console.log("=== Lenormand Pipeline Smoke Check ===");
  for (const c of CASES) {
    const detect = detectQuestionCategory(c.question);
    const matched = matchMotherTopicDetailed(c.question, detect.category);
    const gotMother = Boolean(matched);
    const categoryOk = detect.category === c.expectCategory;
    const motherOk = gotMother === c.expectMotherTopic;
    const ok = categoryOk && motherOk;

    if (!ok) failed += 1;

    const topicLabel = matched ? `${matched.topic.id}/${matched.topic.primary}/${matched.topic.angle}` : "-";
    console.log(
      [
        ok ? "PASS" : "FAIL",
        c.id,
        `expectCat=${c.expectCategory}`,
        `gotCat=${detect.category}`,
        `expectMother=${c.expectMotherTopic ? "Y" : "N"}`,
        `gotMother=${gotMother ? "Y" : "N"}`,
        `topic=${topicLabel}`,
      ].join(" | "),
    );
  }

  console.log(`\nTotal: ${CASES.length}, Failed: ${failed}`);
  return failed === 0 ? 0 : 1;
}

process.exit(run());

