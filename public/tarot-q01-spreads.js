/* 第一题牌阵。格子用成稿。回答怎么看我的那一格是定稿全文。 */
(function () {
  function title(face) {
    var ori = String(face.ori || "").indexOf("逆") !== -1 ? "逆位" : "正位";
    return (face.pos ? face.pos + "，" : "") + face.name + ori + "。";
  }

  function line(face, field) {
    var book = window.Q01SpreadHand;
    var row = book && face.key ? book[face.key] : null;
    if (!row || !row[field]) return "";
    return row[field];
  }

  function pack(open, action, faces, fields) {
    var sections = [];
    for (var i = 0; i < faces.length; i++) {
      var text = line(faces[i], fields[i]);
      if (!text) return null;
      sections.push({ nameLine: title(faces[i]), text: text });
    }
    if (!open || !action) return null;
    return {
      single: false,
      spreadEssay: true,
      finalOnly: false,
      free: open,
      open: open,
      chain: "",
      action: action,
      sections: sections
    };
  }

  function celticLine(face, field) {
    var book = window.Q01CelticHand;
    var row = book && face.key ? book[face.key] : null;
    if (!row || !row[field]) return "";
    return row[field];
  }

  function celtic(faces) {
    var fields = ["now", "block", "hidden", "past", "ahead", "self", "scene", "fear", "crowd", "end"];
    var sections = [];
    for (var i = 0; i < faces.length; i++) {
      var text = celticLine(faces[i], fields[i]);
      if (!text) return null;
      sections.push({ nameLine: title(faces[i]), text: text });
    }
    var open = celticLine(faces[0], "now");
    var action = celticLine(faces[0], "action");
    if (!open || !action) return null;
    return {
      single: false,
      spreadEssay: true,
      finalOnly: false,
      free: open,
      open: open,
      chain: "",
      action: action,
      sections: sections
    };
  }

  function triangle(faces) {
    return pack(line(faces[1], "open"), line(faces[1], "action"), faces, ["past", "open", "later"]);
  }

  function choice(faces) {
    var open = "人在A。\n\n" + line(faces[1], "stuckA") + "\n\n人在B。\n\n" + line(faces[4], "stuckB");
    var action = "人在A。" + line(faces[1], "action") + "人在B。" + line(faces[4], "action");
    return pack(open, action, faces, ["advA", "stuckA", "later", "advB", "stuckB", "later"]);
  }

  function hexagram(faces) {
    return pack(line(faces[1], "open"), line(faces[1], "action"), faces, [
      "past", "open", "later", "act", "scene", "fear"
    ]);
  }

  function trinity(faces) {
    return pack(line(faces[1], "open"), line(faces[1], "action"), faces, ["body", "open", "spirit"]);
  }

  function venus(faces) {
    return pack(line(faces[1], "open"), line(faces[1], "action"), faces, [
      "guess", "open", "bond", "problem", "advise", "later", "latent"
    ]);
  }

  var book = {
    celtic: celtic,
    triangle: triangle,
    choice: choice,
    hexagram: hexagram,
    trinity: trinity,
    venus: venus
  };

  function article(spread, faces) {
    var fn = book[spread];
    if (!fn || !faces || !faces.length) return null;
    return fn(faces);
  }

  window.Q01Spreads = { article: article };
})();
