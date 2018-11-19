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
   * LUISを通じて、入力文章を解析する
   * @param {string} req 入力文章
   * @returns {any} JSON形式の要素一覧
   */
  detect(req: string):any {
    let url = this.endpointUrl;
    let options = {
      'method': 'POST',
      'uri': url,
      'headers': {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.accessKey
      },
      'body': req
    }
    request(options)
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