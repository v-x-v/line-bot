// LINE用botのプロトタイプ

// ================================
// ライブラリインポート
require('dotenv').config(); // .envファイルから環境変数を読み込む
const server = require('express')();
const line   = require('@line/bot-sdk');  // LINE Messaging-API用のSDK

// ================================
// LINE接続用パラメータ
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const bot = new line.Client(line_config);

// リッチメニュー設定
const richObject = {
  size: {
    width: 2500,
    height: 1686
  },
  selected: true,
  name: 'Sample',
  chatBarText: 'ひらけごま',
  areas: [
    {
      bounds: { x: 0, y: 0, width: 1250, height: 1686},
      action: {
        type: 'postback',
        data: 'action=1',
        label: '1番',
        displayText: '1番を選びます'
      }
    },
    {
      bounds: { x: 1250, y: 0, width: 1250, height: 1686},
      action: {
        type: 'postback',
        data: 'action=1',
        label: '1番',
        displayText: '1番を選びます'
      }
    }
  ]
};
let richMenuId;
bot.createRichMenu(richObject)
.then((id) => {
  richMenuId = id;
  console.log('rich menu id: ' + id);
});


// ================================
// Webサーバ設定
server.listen(process.env.PORT || 8080);

// テスト接続時に使われるReplyToken
const testReplyTokenList = ['00000000000000000000000000000000', 'ffffffffffffffffffffffffffffffff']
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
    // 管理画面のテスト接続時はトークンが固定。処理しない
    if(testReplyTokenList.indexOf(event.replyToken) >= 0) {
      // メッセージがテキストの時のみ
      if(event.type == 'message' && event.message.type == 'text') {
        if(event.message.text == 'メニュー') {
          events_processed.push(bot.getRichMenu(richMenuId));
        }
        events_processed.push(bot.replyMessage(event.replyToken, {
          type: 'text',
          text: event.message.text
        }));
    }

    }
  });

  // すべてのイベント処理が終了されたら、処理数を出力
  Promise.all(events_processed)
  .then(
    (response) => {
      console.log(`${response.length} event(s) processed.`)
    }
  )
  .catch((err) => {
    // 途中でエラーが発生した場合は内容を表示
    console.log(err);
  });
});

