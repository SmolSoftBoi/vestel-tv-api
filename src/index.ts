import { EventEmitter } from "events";
import { isArray } from "util";

import { DEFAULT_WAKE_ON_LAN_TIMEOUT, DEFAULT_FOLLOW_TV_PORT, DIAL_SMART_CENTER_APP, DEFAULT_NETWORK_REMOTE_PORT } from "./settings";
import { Context } from "./context";
import { Dial } from "./dial";
import { SmartCenterDialApp } from "./dialApps/smartCenterDialApp";
import { SmartCenterKeyCodes } from "./dialApps/SmartCenterKeyCodes";
import { FollowTv } from "./followtv";
import { NetworkRemote } from "./networkRemote";

import find from 'local-devices';
import { wake } from 'wol';

/**
 * Vestel TV.
 */
export class VestelTv extends EventEmitter {

    /**
     * DIAL.
     */
    protected dial?: Dial;

    /**
     * Follow TV.
     */
    protected followTv?: FollowTv;

    /**
     * Network remote.
     */
    protected networkRemote?: NetworkRemote;

    /**
     * Vestel TV.
     * @param context Context.
     */
    constructor(public context: Context) {

        super();

        if (this.context.uuid === '') throw new Error('UUID must be set.');

        if (!this.context.mac) {
            this.findMac();
        }

        if (this.context.isDial && this.context.dialApplicationUrl) {
            this.dial = new Dial(this.context.dialApplicationUrl);
        }

        if (!this.context.isDialSmartCenterApp) {
            this.checkForDialSmartCenterApp();
        }

        if (this.context.isFollowTv) {
            if (!this.context.followTvPort) {
                this.context.followTvPort = DEFAULT_FOLLOW_TV_PORT;
            }

            this.followTv = new FollowTv(this.context.host, this.context.followTvPort);
        }

        if (this.context.isNetworkRemote) {
            if (!this.context.networkRemotePort) {
                this.context.networkRemotePort = DEFAULT_NETWORK_REMOTE_PORT;
            }

            this.networkRemote = new NetworkRemote(this.context.host, this.context.networkRemotePort);
        }

        if (this.context.isWakeOnLan && !this.context.wakeOnLanTimeout) {
            this.context.wakeOnLanTimeout = DEFAULT_WAKE_ON_LAN_TIMEOUT;
        }
    }

    /**
     * Get active.
     */
    async getActive(): Promise<boolean> {
        if (!this.context.isNetworkRemote) throw new Error('Network remote is not enabled.');
        if (!this.networkRemote) throw new Error('Network remote is not initialised.');

        try {
            await Promise.race([
                this.networkRemote.connectSocket(),
                new Promise((resolve, reject) => {
                    setTimeout(reject, 2000);
                })
            ]);

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Set active.
     * @param forceTry Force try?
     */
    async setActive(forceTry = true): Promise<void> {
        if (!this.context.isWakeOnLan && !forceTry) throw new Error('Wake on LAN is not enabled.');

        if (!this.context.mac) {
            try {
                await this.findMac();
            } catch (error) {
                throw new Error('Error finding Mac address.');
            }
        }

        try {
            wake(this.context.mac);
        } catch (error) {
            throw new Error('Error waking TV.');
        }
    }

    /**
     * Set inactive.
     */
    async setInactive(): Promise<void> {
        if (!this.context.isDialSmartCenterApp) throw new Error('DIAL smart center app is not enabled.');
        if (!this.dial) throw new Error('DIAL not initiated.');
        if (!this.dial.checkForApp(DIAL_SMART_CENTER_APP)) throw new Error('DIAL smart center app not available.');
        if (!(this.dial.apps.SmartCenter instanceof SmartCenterDialApp)) throw new Error('DIAL smart center app not initialised.');

        try {
            this.dial.apps.SmartCenter.remote(SmartCenterKeyCodes.ACTIVE);
        } catch (error) {
            throw new Error('Error sending remote key code.');
        }
    }

    /**
     * Set active identifier.
     */
    async setActiveIdentifier(identifier: number): Promise<void> {
        if (!this.context.isDialSmartCenterApp) throw new Error('DIAL smart center app is not enabled.');
        if (!this.dial) throw new Error('DIAL not initiated.');
        if (!this.dial.checkForApp(DIAL_SMART_CENTER_APP)) throw new Error('DIAL smart center app not available.');
        if (!(this.dial.apps.SmartCenter instanceof SmartCenterDialApp)) throw new Error('DIAL smart center app not initialised.');

        try {
            this.dial.apps.SmartCenter.remote(SmartCenterKeyCodes.ACTIVE_IDENTIFIER, identifier);
        } catch (error) {
            throw new Error('Error sending remote key code.');
        }
    }

    /**
     * Get volume.
     */
    async getVolume(): Promise<number> {
        if (!this.context.isFollowTv) throw new Error('Follow TV is not enabled.');
        if (!this.followTv) throw new Error('Follow TV not initiated.');

        try {
            return await this.followTv.getVolume();
        } catch (error) {
            throw new Error('Error getting volume.');
        }
    }

    /**
     * Set volume selector increment.
     */
    async setVolumeSelectorIncrement(): Promise<void> {
        if (!this.context.isDialSmartCenterApp) throw new Error('DIAL smart center app is not enabled.');
        if (!this.dial) throw new Error('DIAL not initiated.');
        if (!this.dial.checkForApp(DIAL_SMART_CENTER_APP)) throw new Error('DIAL smart center app not available.');
        if (!(this.dial.apps.SmartCenter instanceof SmartCenterDialApp)) throw new Error('DIAL smart center app not initialised.');

        try {
            this.dial.apps.SmartCenter.remote(SmartCenterKeyCodes.VOLUME_SELECTOR_INCREMENT);
        } catch (error) {
            throw new Error('Error sending remote key code.');
        }
    }

    /**
     * Set volume selector decrement.
     */
    async setVolumeSelectorDecrement(): Promise<void> {
        if (!this.context.isDialSmartCenterApp) throw new Error('DIAL smart center app is not enabled.');
        if (!this.dial) throw new Error('DIAL not initiated.');
        if (!this.dial.checkForApp(DIAL_SMART_CENTER_APP)) throw new Error('DIAL smart center app not available.');
        if (!(this.dial.apps.SmartCenter instanceof SmartCenterDialApp)) throw new Error('DIAL smart center app not initialised.');

        try {
            this.dial.apps.SmartCenter.remote(SmartCenterKeyCodes.VOLUME_SELECTOR_DECREMENT);
        } catch (error) {
            throw new Error('Error sending remote key code.');
        }
    }

    /**
     * Find Mac adddress.
     */
    protected async findMac(): Promise<string> {
        try {
            let device = await find(this.context.host);
            if (!isArray(device)) device = [device];
            this.context.mac = device[0].mac;
            return Promise.resolve(this.context.mac);
        } catch (error) {
            throw new Error('Error finding device.');
        }
    }

    /**
     * Check for DIAL smart center app.
     */
    protected async checkForDialSmartCenterApp(): Promise<boolean> {
        if (!this.context.isDial) throw new Error('DIAL is not enabled.');
        if (!this.dial) throw new Error('DIAL not initiated.');

        try {
            const isDialSmartCenterApp = await this.dial.checkForApp(DIAL_SMART_CENTER_APP);
            this.context.isDialSmartCenterApp = isDialSmartCenterApp;
            return Promise.resolve(this.context.isDialSmartCenterApp);
        } catch (error) {
            throw new Error('Error checcing for DIAL app.')
        }
    }
}
