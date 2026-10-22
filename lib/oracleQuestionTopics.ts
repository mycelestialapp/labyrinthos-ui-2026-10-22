import type { OracleTopic } from '@/lib/oracleCards';

export function categoryToOracleTopic(categoryId: string): OracleTopic {
  switch (categoryId) {
    case '感情婚姻':
      return 'love';
    case '事业工作':
      return 'career';
    case '灵性成长':
    case '心理疏导':
    case '人生建议':
      return 'self';
    default:
      return 'general';
  }
}
