import { Socket } from "net";

import { DEFAULT_NETWORK_REMOTE_PORT } from "./settings";

/**
 * Network remote.
 */
export class NetworkRemote {

    /**
     * Socket timeout.
     */
    protected SOCKET_TIMEOUT = 5000;

    /**
     * Follow TV.
     * @param host Host.
     * @param port Port.
     */
    constructor(public readonly host: string, public readonly port = DEFAULT_NETWORK_REMOTE_PORT) {}

    /**
     * Connect socket.
     * @param callback Callback.
     * @param timeout Timeout.
     */
    async connectSocket(callback?, timeout = this.SOCKET_TIMEOUT): Promise<unknown> {
        const promise = new Promise((resolve, reject) => {
            const socket = new Socket();
            socket.setTimeout(timeout);
            socket.connect(this.port, this.host);

            socket.on('connect', (error) => {
                if (error) return reject(error);

                let called = false;
                const callback2 = (error, data?): void => {
                    if (called) return;
                    called = true;

                    if (error) reject(error);

                    socket.end(() => {
                        resolve(data);
                    });
                };

                try {
                    const result = callback(socket, callback2, true);
                    if (result instanceof Promise) result.then(callback2, callback2);
                } catch (error) {
                    callback2(error);
                }
            });

            socket.on('error', (error) => {
                reject(error);
            });
        });

        return promise;
    }
}