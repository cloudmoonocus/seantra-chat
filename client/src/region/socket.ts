import { createRegion } from 'region-core';
import { Socket } from 'socket.io-client';

const socketRegion = createRegion<Socket | null>(null);
export const useSocket = socketRegion.useValue;
export const setSocket = socketRegion.set;
export const getSocket = socketRegion.getValue;
export const resetSocket = socketRegion.reset;
