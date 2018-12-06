import * as dotenv from "dotenv";
dotenv.config();
import { UriOptions } from "request";
import * as request from "request-promise";
import { Luis } from "./luis";
import * as message from "./message";

/**
 * QnA Maker操作クラス
 */
export class QnAMaker {
  private endpointUrl: string;
  private accessKey: string;
  private luis: Luis;
  private threshold: number;
  private options: UriOptions & request.RequestPromiseOptions;

  constructor() {
    this.endpointUrl = process.env.QNA_ENDPOINT_URL;
    this.accessKey = process.env.QNA_ACCESS_KEY;
    this.luis = new Luis();
    this.threshold = Number(process.env.QNA_SCORE_THRESHOLD) || 0;
    this.options = {
      headers: {
        "Authorization": "EndpointKey " + this.accessKey,
        "Content-Type": "application/json",
      },
      json: true,
      method: "POST",
      uri: this.endpointUrl,
    };
  }

  /**
   * 質問文をQnA Makerに投げ、回答を取得する
   * @param {string}  question 質問文
   * @param {function} コールバック関数
   * @returns {Promise<any>} 質問に対応した、登録済みの回答
   */
  public async getAnswer(question: string, callback?: (body: any) => void): Promise<any> {
    // 質問内容をJSONに変換
    const content: any = this.convertRequestBody(question);
    // request設定
    this.options.body = content;
    // 回答をQnAMakerからJSON形式で得る
    // tslint:disable-next-line:max-line-length
    // 参考： https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9ba9
    return request(this.options)
      .then((response) => {
        // 回答が見つかって、スコアが90%を超えていたら返答する
        const topAnswer: any = response.answers[0];
        console.log("get answer: ", JSON.stringify(topAnswer));
        if (topAnswer.score >= this.threshold) {
          return callback(topAnswer.answer);
        } else {
          // 回答がない場合は、LUISをコール、インテントを取得して
          // 再度QnAに問い合わせ
          this.luis.detect(question)
          .then((result) => {
            if (result.intent === {}) {
              // インテント（文脈）が見つからなかった場合は、エンティティ（要素）から候補を表示
              if (result.entities.length === 0) {
                // エンティティも見つからなかった場合は、未実装回答を表示
                return callback(message.QnA.NO_ANSWER);
              }
              // TODO: エンティティによって、メニューボタンでサジェストする
              return callback(message.QnA.NO_ANSWER);
            }
            this.getAnswerWithLuis(result.intent)
            .then((qnaResponse) => {
              return callback(qnaResponse.answers[0].answer);
            })
            .catch((err) => {
              console.log("getAnsweWithLuis occured error. ", err);
              return callback(message.LUIS.NOTFOUND);
            });
          });
        }
      }).catch((err) => {
        switch (err.statusCode) {
          case 404:
           return callback(message.QnA.NO_ANSWER);
          case 401:
            // 認証エラー
            console.log("QnA apiで認証エラーが発生しました。", err.response.message);
            return callback(message.QnA.UNAUTHORIZED);
          case 429:
          case 403:
            // API上限エラー
            console.log("QnA apiがリクエスト上限に達しています。", err.response.message);
            return callback(message.QnA.LIMIT_QUOTA);
          case 408:
            // タイムアウト
            console.log("QnA apiでタイムアウトが発生しました。");
            return callback(message.QnA.TIMEOUT);
          default:
            // その他のエラー
            console.log("予期せぬエラーが発生しました", err);
            return;
        }
      });
  }
  /**
   * 質問文をQnA Makerに投げるためのJSON形式に変換
   * @param {string} body 質問文
   * @returns {any} JSON形式の文字列
   */
  private convertRequestBody(body: string): any {
    const content: any = {
      question: body,
    };

    return content;
  }
  /**
   * LUISから得られた結果を用いて、QnA Makerから結果を得る
   * @param intent LUISから得られたインテントの配列
   */
  private async getAnswerWithLuis(intent: any): Promise<any> {
    const content = this.convertRequestBody(intent.intent);
    this.options.body = content;
    console.log("2nd QnA called.", "content: " + content);
    return request(this.options);
  }

}
