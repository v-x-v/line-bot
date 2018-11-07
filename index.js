// LINE用botのプロトタイプ

// ================================
// ライブラリインポート
const server = require('express')();
const line   = require('@line/bot-sdk');  // LINE Messaging-API用のSDK

// ================================
// LINE接続用パラメータ
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const bot = new line.Client(line_config);

// ================================
// Webサーバ設定
server.listen(process.env.PORT || 8080);


// ================================
// ルーティング設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
  // まずLINE側にステータスコード200 OKを返す
  res.sendStatus(200);
  console.log(req.body);

  // 全てのイベント処理のプロミスを格納する配列
  let events_processed = [];

  // イベントオブジェクトを順次処理
  req.body.events.forEach((event) => {
    // メッセージがテキストの時のみ
    if(event.type == 'message' && event.message.type == 'text') {
        events_processed.push(bot.replyMessage(event.replyToken, {
          type: 'text',
          text: event.message.text
        }));
    }
  });

  // すべてのイベント処理が終了されたら、処理数を出力
  Promise.all(events_processed).then(
    (response) => {
      console.log(`${response.length} event(s) processed.`)
    }
  );
});

