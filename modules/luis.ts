import * as request from "request-promise";
import * as message from "./message";
import { UriOptions } from "request";

/**
 * LUIS操作クラス
 */
export class Luis {
  private endpoint_url: string;
  private access_key: string;

  constructor() {
    this.endpoint_url = process.env.LUIS_ENDPOINT_URL;
    this.access_key = process.env.LUIS_ACCESS_KEY;
  }
  /**
   * 質問文をLUISに投げるためのJSON形式に変換
   * @param {string} question 質問文
   * @returns {any} JSON形式の文字列
   */
  private convertQuestion(question: string): any {
    return question;
  }

  /**
   * LUISを通じて、入力文章を解析する
   * @param {string} question 入力文章
   * @returns {Array<any>} JSON形式の要素一覧
   */
  async detect(question: string):Promise<any> {
    let url:string = this.endpoint_url;
    let content:string = this.convertQuestion(question);
    let options:UriOptions & request.Options = {
      "method": "POST",
      "uri": url,
      "headers": {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": this.access_key
      },
      "body": content,
      "json": true
    };
    console.log("luis-detect called. content: " + content);
    return request(options)
    .then((response) => {
      console.log("luis-api returned.", JSON.stringify(response));
      let intent_list = response.intents.filter(function(element: any) {
        // 関連するインテントがあり、スコアが閾値を超えた結果のみを取得する
        return (element.intent !== message.LUIS.INTENT_NONE && element.score < new Number(process.env.SCORE_THRESHOLD));
      });
      return intent_list;
    })
    .catch((err) => {
      switch (err.statusCode) {
        default:
          console.log("error status code: ", err.statusCode);
      }
      return message.LUIS.NOTFOUND;
    });

  }

}