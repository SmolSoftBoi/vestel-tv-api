import { URL } from 'url';

/**
 * Context.
 */
export interface Context {

    /**
     * UUID.
     */
    uuid: string;

    /**
     * Host.
     */
    host: string;

    /**
     * Mac address.
     */
    mac?: string;

    /**
     * Display name.
     */
    displayName?: string;

    /**
     * Manufacturer.
     */
    manufacturer?: string;

    /**
     * Model.
     */
    model?: string;

    /**
     * Serial number.
     */
    serialNumber?: string;

    /**
     * Is DIAL?
     */
    isDial?: boolean;

    /**
     * DIAL application URL.
     */
    dialApplicationUrl?: URL;

    /**
     * Is DIAL Smart Center app?
     */
    isDialSmartCenterApp?: boolean;

    /**
     * Is follow TV?
     */
    isFollowTv?: boolean;

    /**
     * Follow TV port.
     */
    followTvPort?: number;

    /**
     * Is wake on LAN?
     */
    isWakeOnLan?: boolean;

    /**
     * Wake on LAN timeout.
     */
    wakeOnLanTimeout?: number;
}