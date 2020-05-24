import { URL } from "url";

import { USER_AGENT } from "./settings";
import { DialApp } from "./dialApps/dialApp";

import { RestClient } from 'typed-rest-client';
import { getUrl } from 'typed-rest-client/Util';
import { SmartCenterDialApp } from "./dialApps/smartCenterDialApp";

/**
 * DIAL.
 */
export class Dial {

    /**
     * Rest client.
     */
    protected restClient: RestClient

    /**
     * Apps.
     */
    public apps: Record<string, DialApp | boolean> = {};

    /**
     * DIAL.
     * @param applicationUrl Application URL.
     */
    constructor(public readonly applicationUrl: URL) {
        this.restClient = new RestClient(USER_AGENT, this.applicationUrl.href);
    }

    /**
     * Check for app.
     * @param app App.
     */
    async checkForApp(app: string): Promise<boolean> {
        if (this.apps[app]) return Promise.resolve(this.apps[app] instanceof DialApp);

        try {
            const response = await this.restClient.get(app);

            if (response.statusCode === 200) {
                const appUrl = new URL(getUrl(app, this.applicationUrl.href));

                switch (app) {
                    case 'SmartCenter':
                        this.apps[app] = new SmartCenterDialApp(appUrl);
                        break;
                    default:
                        this.apps[app] = new DialApp(appUrl);
                        break;
                }
            } else {
                this.apps[app] = false;
            }

            return Promise.resolve(false);
        } catch (error) {
            this.apps[app] = false;
            return Promise.resolve(false);
        }
    }
}