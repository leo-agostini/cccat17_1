import axios from "axios";

export default interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {
  get(url: string): Promise<any> {
    return axios.get(url);
  }

  post(url: string, body: any): Promise<any> {
    return axios.post(url, body);
  }
}
