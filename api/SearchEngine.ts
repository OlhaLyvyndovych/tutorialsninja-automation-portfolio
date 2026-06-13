import { APIRequestContext } from '@playwright/test';

export class SearchEngine {
  private readonly request: APIRequestContext;
  private readonly endpoint: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.endpoint = 'https://tutorialsninja.com/demo/index.php?route=product/search';
  }

  async executeSearch(query: string) {
    return await this.request.get(this.endpoint, {
      params: { search: query },
    });
  }
}
