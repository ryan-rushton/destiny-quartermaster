/* eslint-disable @typescript-eslint/no-explicit-any */

export type JsonObject = Record<string, any>;

export const isString = (val): boolean => typeof val === "string";
export const isNumber = (val): boolean => typeof val === "number";
export const isObject = (val): boolean => typeof val === "object";
