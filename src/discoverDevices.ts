import { EventEmitter } from 'events';
import { RemoteInfo } from 'dgram';
import { URL } from 'url';

import { USER_AGENT } from './settings';
import { DIAL_URN, TV_DEVICE_URN } from './urns';
import { VestelTv } from '.';
import { Context } from './context';

import { fromPairs } from 'lodash';
import { Client as SsdpClient, SsdpHeaders } from 'node-ssdp';
import { HttpClient } from 'typed-rest-client/HttpClient';
import { xml2js, ElementCompact } from 'xml-js';

/**
 * Discover devices.
 */
export class DiscoverDevices extends EventEmitter {

    /**
     * HTTP client.
     */
    protected httpClient: HttpClient;

    /**
     * SSDP client.
     */
    protected ssdpClient: SsdpClient;

    /**
     * Addresses.
     */
    protected addresses: string[] = [];

    /**
     * Discover devices.
     * @param userAgent User agent.
     */
    constructor(userAgent = USER_AGENT) {
        super();

        this.httpClient = new HttpClient(userAgent);
        this.ssdpClient = new SsdpClient();

        this.ssdpClient.on('response', this.ssdpClientResponse.bind(this));
    }

    /**
     * Search.
     */
    search(): void {
        this.ssdpClient.search(DIAL_URN);
    }

    async ssdpClientResponse(headers: SsdpHeaders, statusCode: number, rinfo: RemoteInfo): Promise<void> {
        if (this.addresses.includes(rinfo.address)) return;
        this.addresses.push(rinfo.address);

        console.log('Got a response to an m-search:', statusCode, JSON.stringify(headers), JSON.stringify(rinfo));

        if (statusCode !== 200) return;
        if (!headers.LOCATION) return;

        try {
            const response = await this.httpClient.get(headers.LOCATION);
            const body = await response.readBody();
            const result: ElementCompact = xml2js(body, { compact: true })

            if (!result.root && !result.root.device
                && !result.root.device.deviceType
                && !result.root.device.UDN) return;
            if (result.root.device.deviceType !== TV_DEVICE_URN) return;

            const uuid: string = result.root.device.UDN.split(':')[0];
            if (!uuid) return;

            const context: Context = {
                uuid: uuid,
                host: rinfo.address,
                isDial: true,
                isWakeOnLan: false
            }

            if (headers.WAKEUP) {
                const wakeupHeader: string = headers.WAKEUP.toString();
                const wakeup: Record<string, string> = fromPairs(wakeupHeader.split(';').map(record => record.split('=')));

                context.isWakeOnLan = true;
                context.mac = wakeup.MAC;
                context.wakeOnLanTimeout = parseInt(wakeup.Timeout);
            }

            if (response.message.headers['application-url']) {
                context.isDial = false;
                context.dialApplicationUrl = new URL(response.message.headers['application-url'].toString());
            }

            if (result.root.device.frienlyName) context.displayName = result.root.device.frienlyName;
            if (result.root.device.manufacturer) context.manufacturer = result.root.device.manufacturer;
            if (result.root.device.modelName) context.model = result.root.device.modelName;

            const tv = new VestelTv(context);

            this.emit('contextResponse', context);
            this.emit('tvResponse', tv);
        } catch (error) {
            throw new Error('Error getting DIAL.');
        }
    }
}