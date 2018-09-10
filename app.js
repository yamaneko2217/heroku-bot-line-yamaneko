const path = require("path");
const express = require("express");
const line = require("@line/bot-sdk");

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const lineClient = new line.Client(lineConfig);

const prev = {
  user: null,
  bot: null,
};

function createReplyMessage(input) {
  // 3. 条件分岐（じゃんけん）
  const hands = ["グー", "チョキ", "パー"];
  // 返信メッセージを入れる変数
  let text;
  let result;

  // 配列.indexOf(引数) =>
  //   引数が配列の何番目（0始まり）にあるかを返す
  //   引数が配列にない場合、-1を返す
  if (input === '判定'){

    if(user === 'グー'){
      if(bot === 'グー'){text = "あいこ";}
      if(bot === 'チョキ'){text = "勝利";}
      if(bot === 'パー'){text = "負け";}
    
    }else if(user === 'チョキ'){
      if(bot === 'グー'){text = "負";}
      if(bot === 'チョキ'){text ="あいこ";}
      if(bot === 'パー'){text = "勝利";}
    
    }else if(user === 'パー'){
      if(bot === 'グー'){text = "勝利";}
      if(bot === 'チョキ'){text = "負け";}
      if(bot === 'パー'){text = "あいこ";}
    }

  } else if (hands.indexOf(input) === -1) {
    // ユーザーが入力した内容が「グー、チョキ、パー」以外だった場合
    text = "グー・チョキ・パーのどれかを入力してね";

  } else {
    // 手からランダムに一つ選択
    text = hands[Math.floor(hands.length * Math.random())];
    if(input === 'グー'){
      if(text === 'グー'){ result = "あいこ";}
      if(text === 'チョキ'){ result = "勝ち";}
      if(text === 'パー'){ result = "負け";}
    
    }else if(input === 'チョキ'){
      if(text === 'グー'){ result = "負け";}
      if(text === 'チョキ'){ result = "あいこ";}
      if(text === 'パー'){ result = "勝ち";}
    
    }else if(input ==='パー'){
      if(text === 'グー'){ result = "勝ち";}
      if(text === 'チョキ'){ result = "負け";}
      if(text === 'パー'){ result = "あいこ";}

    }
  }

  prev.user = input;
  prev.bot = text;
  
  return {
    type: "text",
    // 「text: text」のようにキー名と変数名が同じ場合、以下のように省略可能
    // Object Shorthandという文法です
    text
  };
}

const server = express();

server.use("/images", express.static(path.join(__dirname, "images")));

server.post("/webhook", line.middleware(lineConfig), (req, res) => {
  // LINEのサーバーに200を返す
  res.sendStatus(200);

  for (const event of req.body.events) {
    if (event.type === "message" && event.message.type === "text") {
      const message = createReplyMessage(event.message.text);
      lineClient.replyMessage(event.replyToken, message);
    }
  }
});

server.listen(process.env.PORT || 8080);
