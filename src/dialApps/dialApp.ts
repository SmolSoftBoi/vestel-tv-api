import { URL } from "url";

import { USER_AGENT } from "../settings";

import { RestClient, IRestResponse } from "typed-rest-client";

/**
 * DIAL app.
 */
export class DialApp {

    protected restClient: RestClient;

    /**
     * DIAL app.
     * @param appUrl App URL.
     */
    constructor(public readonly appUrl: URL) {
        this.restClient = new RestClient(USER_AGENT, appUrl.href);
    }

    async launch<T>(resources: any): Promise<IRestResponse<T>> {
        return this.restClient.create<T>('', resources);
    }
}