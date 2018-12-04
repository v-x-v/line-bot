// プロトタイプ(LINE用bot)

// ================================
// ライブラリインポート
import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
const app: express.Application = express();
import * as line from "@line/bot-sdk";

import * as Keyword from "./modules/keyword";
import * as MyMessage from "./modules/message";
import { QnAMaker } from "./modules/qna-maker";
const qnaMaker: QnAMaker = new QnAMaker();

// ================================
// lINE接続用パラメータ
const line_config: line.MiddlewareConfig & line.ClientConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const bot: line.Client = new line.Client(line_config);

// ================================
// webサーバ設定
app.listen(process.env.PORT || 8080);

// テスト接続時に使われるReplyToken
const testReplyTokenList: string[] = ["00000000000000000000000000000000", "ffffffffffffffffffffffffffffffff"];
// ================================
// ルーティング設定
app.post("/webhook", line.middleware(line_config), (req, res, next) => {
  // まずLINE側にステータスコード200 OKを返す
  res.sendStatus(200);
  console.log(req.body);

  // 全てのイベント処理のプロミスを格納する配列
  const events_processed: Promise<any>[] = processMessage(req.body.events);

  // すべてのイベント処理が終了されたら、処理数を出力
  Promise.all(events_processed)
    .then((response) => {
        console.log(`${response.length} event(s) processed.`);
      }
    )
    .catch((err) => {
      // 途中でエラーが発生した場合は内容を表示
      console.log("error caused in resolve promise.");
      console.log(err);
    });
});


/**
 * 届いたメッセージ（イベント）を、内容によって適切に処理する
 * @param events 届いたメッセージ（イベント）リスト
 * @returns {Array<Promise<any>>} メッセージの処理をスタックした配列
 */
function processMessage(events: any): Array<Promise<any>> {
  const event_stack: Array<Promise<any>> = [];
  // イベントオブジェクトを順次処理
  events.forEach((event) => {
    // 管理画面のテスト接続時はトークンが固定。処理しない
    if (testReplyTokenList.indexOf(event.replyToken) !== 0) {
      // メッセージがテキストの時のみ
      if (event.type === "message" && event.message.type === "text") {
        switch (event.message.text) {
          case "メニュー":
            event_stack.push(bot.replyMessage(event.replyToken, MyMessage.Template.QUICK_MESSAGE));
            break;
          case Keyword.SELECT_EVENT_DATE:
            event_stack.push(bot.replyMessage(event.replyToken, MyMessage.Template.DATEPICKER_MESSAGE));
            break;
          default:
            event_stack.push(
              qnaMaker.getAnswer(event.message.text, function (message: string): Promise<any> {
                console.log("### callback function called ###");
                return bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: message
                });
              })
            );
        }
      }
    }
  });
  return event_stack;
}