import { Socket } from "net";

import { DEFAULT_FOLLOW_TV_PORT } from "./settings";

import { xml2js, ElementCompact } from "xml-js";

/**
 * Follow TV.
 */
export class FollowTv {

    /**
     * Socket timeout.
     */
    protected SOCKET_TIMEOUT = 5000;

    /**
     * Follow TV.
     * @param host Host.
     * @param port Port.
     */
    constructor(public readonly host: string, public readonly port = DEFAULT_FOLLOW_TV_PORT) {}

    /**
     * Get volume.
     */
    async getVolume(): Promise<number> {
        try {
            const response = await this.sendCommand('GETINFO VOLUME');
            const result: ElementCompact = xml2js(response);
            const volume: number = result.volume._attributtes.level;
            return volume;
        } catch (error) {
            throw new Error('Error getting volume.');
        }
    }

    /**
     * Connect socket.
     * @param callback Callback.
     */
    protected async connectSocket(callback): Promise<unknown> {
        const promise = new Promise((resolve, reject) => {
            const socket = new Socket();
            socket.setTimeout(this.SOCKET_TIMEOUT);
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

    /**
     * Send command.
     * @param commands Commands.
     */
    protected async sendCommand(...commands: string[]): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            this.connectSocket(async (socket, callback, endSocket) => {
                for (const command of commands) {
                    await new Promise((r) => {
                        socket.write(command.trim() + '\n', r);
                    });

                    if (endSocket) socket.end();
                }

                let buffer = '';

                socket.on('data', (data) => {
                    buffer += data.toString();
                });

                await new Promise((resolve, reject) => {
                    socket.on('end', (error) => {
                        if (error) reject(error);
                        resolve();
                    })
                }).then(() => {
                    resolve(buffer);
                }, reject);
            });
        });

        return promise;
    }
}