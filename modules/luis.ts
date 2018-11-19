import * as request from 'request-promise';
import * as message from './message';

/**
 * LUIS操作クラス
 */
export class Luis{
  private endpointUrl: string;
  private accessKey: string;

  constructor() {
    this.endpointUrl = process.env.LUIS_ENDPOINT_URL;
    this.accessKey = process.env.LUIS_ACCESS_KEY;
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
   * @returns {Primise<any>} JSON形式の要素一覧
   */
  async detect(question: string):Promise<any> {
    let url = this.endpointUrl;
    let content = this.convertQuestion(question);
    let options = {
      'method': 'POST',
      'uri': url,
      'headers': {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.accessKey
      },
      'body': content,
      'json': true
    }
    return await request(options)
    .then((response) => {
      console.log(JSON.stringify(response));
      return response.topScoringIntent.intent;
    })
    .catch((err) => {
      switch (err.statusCode) {
        default:
          console.log('error status code: ', err.statusCode);
      }
      return message.STR_LUIS_ERROR;
    });
  }
};