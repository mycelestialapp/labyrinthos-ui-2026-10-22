/**
 * 神谕卡 · 问题大类目录（19 类主数据）
 * 全局 questionQuickPick 仍为 17 类；神谕卡在此基础上补全 心理疏导、人生建议。
 * 神谕第一幕 UI 排除：失物寻找、其他，以及西方点选不含的生育／风水／代问／官司。
 */
import { QUESTION_QUICK_PICK, type QuickPickCategory } from '@/lib/questionQuickPick';
import { ORACLE_DISPLAY_QUESTIONS } from '@/lib/oracleQuestionDisplay';

/** 神谕卡不展示的大类（序号对应 19 类主列表，不改动主数据） */
export const ORACLE_HIDDEN_CATEGORY_IDS = new Set([
  '失物寻找',
  '其他',
  '生育子女',
  '占风水',
  '代人问卜',
  '官司法律',
  '占梦境',
]);

/** 神谕卡专属补全（第 18、19 类） */
const ORACLE_EXTRA_CATEGORIES: QuickPickCategory[] = [
  {
    id: '心理疏导',
    label: '心理疏導',
    questions: [
      '我反复出现的焦虑情绪，其实在为哪一部分的自己发声？',
      '当我责备自己的时候，内心那个声音最害怕的是什么？',
      '我最常「装没事」的情绪是什么？如果让它说话，会说什么？',
      '过去的某个创伤或失望，现在还在怎样影响我？',
      '我现在最需要学会的，是设立界限，还是允许自己被支持？',
      '这段情绪低谷期，可以成为我重新认识自己的怎样一个契机？',
      '我最害怕的情绪是什么？这种害怕本身在告诉我什么？',
      '过去的某次伤害，我现在是否真正允许自己放下了？',
      '如果我可以对过去那个受伤的自己说一句话，我会说什么？',
      '我内心的批判声音，通常在我做什么事情时最响亮？',
      '我的自我价值感是否绑定了某些外在条件？',
      '当我犯错时，我如何对待自己？',
      '我目前最大的压力源是什么？它是在提醒我改变什么吗？',
      '面对压力时，我第一反应是战斗、逃跑还是僵住？',
      '我是否有减压的「紧急工具箱」？',
      '如何区分可应对的压力和需要求助的过载？',
      '我能否把情绪看作内在天气，接受它来，也接受它走？',
      '专业心理咨询对我是否有帮助？我是否愿意尝试？',
      '如果疗愈是一个旅程，我现在走到了哪一站？',
      '今天，我可以感谢哪种情绪带给我的信息？',
    ],
  },
  {
    id: '人生建议',
    label: '人生建議',
    questions: [
      '我人生当前阶段的主旋律是什么？',
      '如果把过去几年的人生视为一部电影，现在正处在怎样的章节？',
      '在「别人期待我成为谁」和「我真正想成为谁」之间，我目前站在什么位置？',
      '现在最需要被我认真对待的三个优先事项是什么？',
      '面对重大选择时，我如何让决定更贴近自己的价值观？',
      '有哪件一直想做却反复拖延的事，其实象征着更深的人生召唤？',
      '如果未来的「理想版自己」来给我提一个当下建议，他/她会说什么？',
      '在有限的生命时间里，我最不想留下的遗憾是什么？',
      '我的人生是否在朝着某个有意义的方向前进？',
      '我是否在活出自己想要的版本，还是活成了别人期待的样子？',
      '人生的这个十字路口，有哪些路是通往安全的，哪些是通往真实的？',
      '我如何知道自己已经准备好进入下一个人生阶段？',
      '如果我今天必须写下墓志铭，我希望上面写什么？',
      '我如何平衡「活在当下」和「规划未来」？',
      '如果生命只剩五年，我会如何重新安排生活？',
      '什么让我感到真正活着，而不是只是在过日子？',
      '我的人生中，什么比成功更重要？',
      '我是否在用忙碌逃避某个更深的人生问题？',
      '当下我最该放下的是什么？',
      '宇宙此刻最想让我看见的人生方向是什么？',
    ],
  },
];

/** 19 类主列表（神谕卡完整目录，勿删类） */
export const ORACLE_MASTER_CATEGORIES: QuickPickCategory[] = [
  ...QUESTION_QUICK_PICK,
  ...ORACLE_EXTRA_CATEGORIES,
];

/** 神谕卡第一幕展示的大类（16 类） */
export function getOracleVisibleCategories(): QuickPickCategory[] {
  return ORACLE_MASTER_CATEGORIES.filter(cat => !ORACLE_HIDDEN_CATEGORY_IDS.has(cat.id));
}

/** 神谕 UI 展示用：简体固化题库（oracleQuestionDisplay，与定稿主数据一一对应） */
export function getOracleDisplayCategory(category: QuickPickCategory): QuickPickCategory {
  const display = ORACLE_DISPLAY_QUESTIONS[category.id];
  if (display) {
    return { ...category, label: display.label, questions: display.questions };
  }
  return category;
}

export type OracleCategoryTheme =
  | 'blue'
  | 'gold'
  | 'purple'
  | 'rose'
  | 'teal'
  | 'coral'
  | 'amber'
  | 'silver';

export interface OracleCategoryCardMeta {
  num: string;
  emoji: string;
  symbol: string;
  verticalLabel: string;
  whisper: string;
  theme: OracleCategoryTheme;
}

/** 16 类牌子视觉配置（与三门同款结构） */
export const ORACLE_CATEGORY_CARDS: Record<string, OracleCategoryCardMeta> = {
  感情婚姻: { num: '壹', emoji: '💕', symbol: '♡', verticalLabel: '感情 · 婚姻', whisper: '照见心之羁绊', theme: 'rose' },
  事业工作: { num: '贰', emoji: '💼', symbol: '▲', verticalLabel: '事业 · 工作', whisper: '权衡前程之路', theme: 'gold' },
  财运投资: { num: '叁', emoji: '💰', symbol: '◈', verticalLabel: '财运 · 投资', whisper: '聆听丰盛流向', theme: 'amber' },
  学业考试: { num: '肆', emoji: '📚', symbol: '✎', verticalLabel: '学业 · 考试', whisper: '点亮求知之灯', theme: 'blue' },
  身体健康: { num: '伍', emoji: '🌿', symbol: '☤', verticalLabel: '身体 · 健康', whisper: '守护肉身圣殿', theme: 'teal' },
  宠物: { num: '陆', emoji: '🐾', symbol: '◎', verticalLabel: '宠物 · 毛孩', whisper: '听懂无声之语', theme: 'coral' },
  人际关系: { num: '柒', emoji: '🤝', symbol: '∞', verticalLabel: '人际 · 关系', whisper: '照见缘分经纬', theme: 'silver' },
  出行迁居: { num: '捌', emoji: '✈️', symbol: '➤', verticalLabel: '出行 · 迁居', whisper: '踏准流转之时', theme: 'blue' },
  官司法律: { num: '玖', emoji: '⚖️', symbol: '⚖', verticalLabel: '官司 · 法律', whisper: '明辨是非天平', theme: 'gold' },
  生育子女: { num: '拾', emoji: '👶', symbol: '❀', verticalLabel: '生育 · 子女', whisper: '守护生命延续', theme: 'rose' },
  选择决策: { num: '拾壹', emoji: '🔀', symbol: '△', verticalLabel: '选择 · 决策', whisper: '权衡心中天平', theme: 'gold' },
  占梦境: { num: '拾贰', emoji: '🌙', symbol: '☽', verticalLabel: '占梦 · 梦境', whisper: '解读夜之密语', theme: 'purple' },
  占风水: { num: '拾叁', emoji: '🏠', symbol: '⌂', verticalLabel: '占风 · 风水', whisper: '感应空间气场', theme: 'teal' },
  灵性成长: { num: '拾肆', emoji: '✨', symbol: '✦', verticalLabel: '灵性 · 成长', whisper: '唤醒内在神性', theme: 'purple' },
  心理疏导: { num: '拾伍', emoji: '🕯️', symbol: '◐', verticalLabel: '心理 · 疏导', whisper: '抚平内在褶皱', theme: 'purple' },
  人生建议: { num: '拾陆', emoji: '🧭', symbol: '●', verticalLabel: '人生 · 建议', whisper: '照见未行之路', theme: 'blue' },
};

export function getOracleCategoryCardMeta(categoryId: string): OracleCategoryCardMeta {
  return (
    ORACLE_CATEGORY_CARDS[categoryId] ?? {
      num: '✦',
      emoji: '✦',
      symbol: '✦',
      verticalLabel: categoryId,
      whisper: '静心选择',
      theme: 'gold',
    }
  );
}
