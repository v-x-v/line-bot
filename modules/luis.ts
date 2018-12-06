import * as dotenv from "dotenv";
dotenv.config();
import { UriOptions } from "request";
import * as request from "request-promise";
import * as message from "./message";

/**
 * LUIS操作クラス
 */
export class Luis {
  private endpointUrl: string;
  private accessKey: string;
  private threshold: number;

  constructor() {
    this.endpointUrl = process.env.LUIS_ENDPOINT_URL;
    this.accessKey = process.env.LUIS_ACCESS_KEY;
    this.threshold = Number(process.env.LUIS_SCORE_THRESHOLD) || 0;
  }

  /**
   * LUISを通じて、入力文章を解析する
   * @param {string} question 入力文章
   * @returns {any} {intent: Array<any>, entity: Array<any>}の配列
   */
  public async detect(question: string): Promise<any> {
    const url: string = this.endpointUrl;
    const content: string = this.convertRequestBody(question);
    const options: UriOptions & request.Options = {
      body: content,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": this.accessKey,
        "bing-spell-check-subscription-key": "3fdbf40d60ba44759b8b532c877ffe5c",
      },
      json: true,
      method: "POST",
      uri: url,
    };
    console.log("luis-detect called. content: " + content);
    return request(options)
      .then((response) => {
        // LUISの回答から、確度の高いインテント(文脈)とエンティティ(要素)のみを抜き出す
        console.log("luis-api returned.", JSON.stringify(response));
        let intentHash: any = response.topScoringIntent;
        if (!this.intent_filter(intentHash.intent)) {
          intentHash = {};
        }
        const entityList: any[] = response.entities.filter(function(element: any) {
          return element.score >= this.threshold;
        });
        return {intent: intentHash, entities: entityList};
      })
      .catch((err) => {
        switch (err.statusCode) {
          default:
            console.log("luis-detect occured error: ", err.statusCode, err);
        }
        throw err;
      });
  }
  /**
   * 質問文をLUISに投げるためのJSON形式に変換
   * @param {string} body 質問文
   * @returns {any} JSON形式の文字列
   */
  private convertRequestBody(body: string): any {
    return body;
  }
  /**
   * 関連するインテントがあり、スコアが閾値を超えた結果のみを取得するフィルタ関数
   * @param element 判定するインテント要素
   */
  private intent_filter(element: any): boolean {
    return (element.intent !== message.LUIS.INTENT_NONE && element.score >= this.threshold);
  }
}
