import { URL } from "url";

import { DialApp } from "./dialApp";
import { SmartCenterKeyCodes } from "./smartCenterKeyCodes";

import { js2xml, ElementCompact } from "xml-js";

/**
 * Smart center DIAL app.
 */
export class SmartCenterDialApp extends DialApp {

    /**
     * Remote queue.
     */
    protected remoteQueue: SmartCenterKeyCodes[] = [];

    /**
     * Queue interval.
     */
    protected QUEUE_INTERVAL = 100;

    /**
     * Smart center DIAL app.
     * @param appUrl App URL.
     */
    constructor(public readonly appUrl: URL) {
        super(appUrl);

        setInterval(this.shiftRemoteQueue, this.QUEUE_INTERVAL);
    }

    /**
     * Remote.
     * @param keyCodes Key codes.
     */
    remote(...keyCodes: SmartCenterKeyCodes[]): void {
        this.remoteQueue.push(...keyCodes);
    }

    protected async shiftRemoteQueue(): Promise<void> {
        const keyCode = this.remoteQueue.shift();

        if (!keyCode) return;

        const remote: ElementCompact = {
            remote: {
                key: {
                    _attributes: {
                        code: keyCode
                    }
                }
            }
        };
        const result = js2xml(remote, { compact: true });

        await this.launch(result);
    }
}