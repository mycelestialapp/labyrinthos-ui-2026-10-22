/* 按题加载。不要把全库打进这一支。 */
(function () {
  var ALLOWED = {
    "感情婚姻": 1,
    "事业工作": 1,
    "财运投资": 1,
    "学业考试": 1,
    "身体健康": 1,
    "宠物": 1,
    "人际关系": 1,
    "出行迁居": 1,
    "失物寻找": 1,
    "选择决策": 1,
    "占梦境": 1,
    "灵性成长": 1,
    "心理疏导": 1,
    "人生建议": 1,
    "其他": 1
  };
  var cache = Object.create(null);
  var inflight = Object.create(null);
  var indexPromise = null;

  function canon(q) {
    return String(q || "").replace(/\s+/g, "").replace(/\//g, "／");
  }
  function allowed(categoryId) {
    return !categoryId || ALLOWED[categoryId] === 1;
  }
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch("/tarot-western-readings/index.json?v=74").then(function (res) {
        if (!res.ok) throw new Error("reading index");
        return res.json();
      });
    }
    return indexPromise;
  }
  function ensure(questionText) {
    var q = canon(questionText);
    if (!q) return Promise.resolve(false);
    if (Object.prototype.hasOwnProperty.call(cache, q)) return Promise.resolve(cache[q] != null);
    if (inflight[q]) return inflight[q];
    inflight[q] = loadIndex().then(function (index) {
      var file = index[q];
      if (!file) {
        cache[q] = null;
        return false;
      }
      return fetch("/tarot-western-readings/" + file + "?v=74").then(function (res) {
        if (!res.ok) {
          cache[q] = null;
          return false;
        }
        return res.json().then(function (data) {
          cache[q] = data;
          return true;
        });
      });
    }).then(function (ok) {
      delete inflight[q];
      return ok;
    }, function () {
      delete inflight[q];
      cache[q] = null;
      return false;
    });
    return inflight[q];
  }
  function pack(row) {
    if (!row) return null;
    var ori = row.upright ? "正位" : "逆位";
    return {
      lean: row.lean,
      verdict: row.verdict,
      speak: row.speak,
      soul: row.soul,
      doToday: row.doToday,
      nameZh: row.nameZh,
      upright: row.upright,
      text: "【判断】" + row.lean + "\n\n" + row.verdict + "\n\n【这张牌对你说】" + row.nameZh + "·" + ori + "\n" + row.speak + "\n\n【灵魂上】\n" + row.soul + "\n\n【今天就做这一步】\n" + row.doToday
    };
  }
  var api = {
    LOVE_Q01: "他／她现在到底怎么看我？",
    ensure: ensure,
    missing: function (categoryId, questionText) {
      if (!allowed(categoryId)) return true;
      var q = canon(questionText);
      return Object.prototype.hasOwnProperty.call(cache, q) && cache[q] == null;
    },
    get: function (categoryId, questionText, cardId, upright) {
      if (!allowed(categoryId)) return null;
      var deck = cache[canon(questionText)];
      if (!deck) return null;
      var row = deck[cardId + "|" + (upright ? "u" : "r")];
      if (!row) return null;
      return pack({
        nameZh: row[0],
        lean: row[1],
        verdict: row[2],
        speak: row[3],
        soul: row[4],
        doToday: row[5],
        upright: !!upright
      });
    }
  };
  globalThis.TarotWesternReading = api;
})();
