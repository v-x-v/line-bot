import * as request from "request-promise";
import * as message from "./message";
import { UriOptions } from "request";
import { Luis } from "./luis";
import { promises } from "fs";

/**
 * QnA Maker操作クラス
 */
export class QnAMaker {
  private endpoint_url: string;
  private access_key: string;
  private luis: Luis;

  constructor() {
    this.endpoint_url = process.env.QNA_ENDPOINT_URL;
    this.access_key = process.env.QNA_ACCESS_KEY;
    this.luis = new Luis();
  }
  /**
   * 質問文をQnA Makerに投げるためのJSON形式に変換
   * @param {string} question 質問文
   * @returns {any} JSON形式の文字列
   */
  private convertQuestion(question: string): any {
    let content: any = {
      "question": question
    };

    return content;
  }

  /**
   * 質問文をQnA Makerに投げ、回答を取得する
   * @param {string}  question 質問文
   * @param {function} コールバック関数
   * @returns {Promise<any>} 質問に対応した、登録済みの回答
   */
  async getAnswer(question: string, callback?: (body: any) => void): Promise<any> {
    // 質問内容をJSONに変換
    let content: any = this.convertQuestion(question);
    // request設定
    let options: UriOptions & request.RequestPromiseOptions = {
      "method": "POST",
      "uri": this.endpoint_url,
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "EndpointKey " + this.access_key,
      },
      "body": content,
      "json": true
    };
    // 回答をQnAMakerからJSON形式で得る
    // 参考： https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9ba9
    return request(options)
      .then((response) => {
        // 回答が見つかって、スコアが90%を超えていたら返答する
        let top_answer: any = response.answers[0];
        console.log("get answer: ", JSON.stringify(top_answer));
        if (top_answer.score >= 90) {
          callback(top_answer.answer);
          return;
        } else {
          // 回答がない場合は、LUISをコール、インテントを取得して
          // 再度QnAに問い合わせ
          this.luis.detect(question)
          .then((intents) => {
            this.getAnswerWithLuis(intents)
            .then((answer: string) => {
              callback(answer);
              return;
            });

          });
        }
      }).catch((err) => {
        switch (err.statusCode) {
          case 404:
            callback(message.QnA.NO_ANSWER);
            return;
          case 401:
            // 認証エラー
            console.log("QnA apiで認証エラーが発生しました。", err.response.message);
            callback(message.QnA.UNAUTHORIZED);
            return;
          case 429:
          case 403:
            // API上限エラー
            console.log("QnA apiがリクエスト上限に達しています。", err.response.message);
            callback(message.QnA.LIMIT_QUOTA);
            return;
          case 408:
            // タイムアウト
            console.log("QnA apiでタイムアウトが発生しました。");
            callback(message.QnA.TIMEOUT);
            return;
          default:
            // その他のエラー
            console.log("予期せぬエラーが発生しました", err);
            return;
        }
      });
  }
  /**
   * LUISから得られた結果を用いて、QnA Makerから結果を得る
   * @param intents LUISから得られたインテントの配列
   */
  private async getAnswerWithLuis(intents: Array<any>): Promise<any> {
    console.log("2nd QnA called.");
    intents.map((v, i) => {
      console.log("intent" + i + ": " + v);
    })
  }

}
