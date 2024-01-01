import {describe, expect, test} from '@jest/globals';
import { VestelTv } from '../src/index';
import { Context } from '../src/context';
import { randomUUID } from 'crypto';

jest.mock('local-devices');
jest.mock('wol');

describe('VestelTv', () => {
    let context: Context;
    let vestelTv: VestelTv;

    beforeEach(() => {
        context = {
            uuid: '',
            host: '',
        };
    });

    test('constructor should initialize correctly', () => {
        context.uuid = randomUUID();
        vestelTv = new VestelTv(context);
        expect(vestelTv).toBeInstanceOf(VestelTv);
    });

    test('constructor should throw error if uuid is not set', () => {
        expect(() => new VestelTv(context)).toThrow('UUID must be set.');
    });

    test('getActive should throw error if network remote is not enabled', async () => {
        await expect(vestelTv.getActive()).rejects.toThrow('Network remote is not enabled.');
    });

    test('setActive should throw error if Wake on LAN is not enabled and forceTry is false', async () => {
        await expect(vestelTv.setActive(false)).rejects.toThrow('Wake on LAN is not enabled.');
    });

    test('setInactive should throw error if DIAL smart center app is not enabled', async () => {
        await expect(vestelTv.setInactive()).rejects.toThrow('DIAL smart center app is not enabled.');
    });

    test('setActiveIdentifier should throw error if DIAL smart center app is not enabled', async () => {
        await expect(vestelTv.setActiveIdentifier(1)).rejects.toThrow('DIAL smart center app is not enabled.');
    });

    test('getVolume should throw error if Follow TV is not enabled', async () => {
        await expect(vestelTv.getVolume()).rejects.toThrow('Follow TV is not enabled.');
    });
});