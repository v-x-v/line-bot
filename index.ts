// LINE用botのプロトタイプ

// ================================
// ライブラリインポート
import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
let app = express();
import * as line from '@line/bot-sdk';

import * as template from './modules/message';
import { QnAMaker } from './modules/qna-maker';
let qnaMaker = new QnAMaker();

// ================================
// LINE接続用パラメータ
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const bot = new line.Client(line_config);

// ================================
// Webサーバ設定
app.listen(process.env.PORT || 8080);

// テスト接続時に使われるReplyToken
const testReplyTokenList = ['00000000000000000000000000000000', 'ffffffffffffffffffffffffffffffff']
// ================================
// ルーティング設定
app.post('/webhook', line.middleware(line_config), (req, res, next) => {
  // まずLINE側にステータスコード200 OKを返す
  res.sendStatus(200);
  console.log(req.body);

  // 全てのイベント処理のプロミスを格納する配列
  let events_processed = [];

  // イベントオブジェクトを順次処理
  req.body.events.forEach((event) => {

    // 管理画面のテスト接続時はトークンが固定。処理しない
    if (testReplyTokenList.indexOf(event.replyToken) != 0) {

      // メッセージがテキストの時のみ
      if (event.type == 'message' && event.message.type == 'text') {

        if (event.message.text == 'メニュー') {
          events_processed.push(bot.replyMessage(event.replyToken, template.QUICK_MESSAGE));
        } else {
          events_processed.push(
            qnaMaker.getAnswer(event.message.text, function (message) {
              console.log('### callback function called ###');
              return bot.replyMessage(event.replyToken, {
                type: 'text',
                text: message
              })
            })
          );
        }
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

