/**
 * 三级联动界面文案（简体中文）。
 * 与真实数据对齐：中国/美国为三级行政区；多数国家为「一级区划 → 库内城镇 → 坐标确认」。
 */

/** 说明条（卡片内灰色小字） */
export function birthplaceCascadeIntro(): string {
  return "地点分步：中国为省→地级市→区县；美国为州→县（含教区）→城镇或县域近似；英国等为库内一级分区→城镇；城邦或库内无下级城镇时，二级为地区中心点，三级确认坐标。国家列表为站内白名单；仍不对请用地名搜索或手输经纬度。";
}

export function birthplaceTier1Label(country: string): string {
  switch (country) {
    case "CN":
      return "① 省 / 直辖市 / 自治区";
    case "US":
      return "① 州 / 特区";
    case "CA":
      return "① 省 / 地区";
    case "AU":
      return "① 州 / 领地";
    case "GB":
      return "① 郡 / 区（库内一级分区）";
    case "FR":
      return "① 省（Département）";
    case "DE":
      return "① 联邦州（Land）";
    case "ES":
      return "① 自治区 / 省";
    case "IT":
      return "① 省（Provincia）";
    case "JP":
      return "① 都 / 道 / 府 / 县";
    case "KR":
      return "① 广域市 / 道 / 特别市等";
    case "IN":
      return "① 邦 / 联邦属地";
    case "BR":
    case "MX":
    case "AR":
    case "CO":
      return "① 州 / 省";
    case "RU":
      return "① 联邦主体";
    case "TH":
      return "① 府";
    case "VN":
    case "PH":
    case "ID":
    case "MY":
    case "EG":
    case "SA":
    case "ZA":
      return "① 省 / 州";
    case "TW":
      return "① 县 / 市（库内）";
    case "HK":
      return "① 区（十八区）";
    case "SG":
      return "① 社区发展理事会（规划区）";
    case "NL":
    case "BE":
      return "① 省 / 大区";
    case "CH":
    case "AT":
      return "① 州（邦）";
    case "PL":
    case "SE":
    case "FI":
    case "NO":
    case "IE":
    case "PT":
    case "NZ":
    case "TR":
    case "GR":
    case "CL":
    case "PE":
    case "CZ":
    case "RO":
    case "HU":
    case "UA":
      return "① 省 / 州 / 大区";
    case "AE":
      return "① 酋长国";
    case "IL":
      return "① 区";
    default:
      return "① 州 / 省 / 一级区划";
  }
}

export function birthplaceTier2Label(country: string): string {
  switch (country) {
    case "CN":
      return "② 地级市 / 州 / 盟";
    case "US":
      return "② 县（County / Parish 等）";
    case "GB":
      return "② 城镇（本区内，库内数据）";
    case "FR":
      return "② 市镇（省内，库内）";
    case "DE":
      return "② 市 / 镇（联邦州内）";
    case "JP":
      return "② 市・町村（都道府县内）";
    case "KR":
      return "② 市 / 郡（道/广域市内）";
    case "IN":
      return "② 城镇（邦内，库内）";
    case "HK":
      return "② 分区中心（库内无细分城镇时）";
    case "TW":
      return "② 乡镇市（县市内，库内）";
    case "SG":
      return "② 规划区内城镇（库内）";
    case "IT":
      return "② 市镇（省内，库内）";
    case "ES":
      return "② 市镇（自治区/省内）";
    case "CA":
    case "AU":
    case "BR":
    case "MX":
    case "NL":
    case "CH":
    case "AT":
    case "PL":
    case "SE":
    case "NO":
    case "FI":
    case "IE":
    case "PT":
    case "NZ":
    case "TH":
    case "VN":
    case "PH":
    case "MY":
    case "ID":
    case "AE":
    case "SA":
    case "EG":
    case "ZA":
    case "AR":
    case "CL":
    case "CO":
    case "PE":
    case "TR":
    case "IL":
    case "GR":
    case "CZ":
    case "RO":
    case "HU":
    case "UA":
    case "RU":
      return "② 城市 / 城镇（一级区划内）";
    default:
      return "② 城市 / 城镇（库内）";
  }
}

export function birthplaceTier3Label(country: string): string {
  switch (country) {
    case "CN":
      return "③ 区 / 县 / 县级市";
    case "US":
      return "③ 城镇、县界质心或县域近似";
    case "JP":
    case "KR":
    case "DE":
    case "FR":
    case "IT":
    case "ES":
    case "GB":
      return "③ 坐标：默认点或地理编码精化";
    default:
      return "③ 坐标：默认点或地理编码精化";
  }
}
