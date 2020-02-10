import _ from "lodash";
import Dexie from "dexie";

import { JsonObject } from "./../../lib/bungie_api/rest";
import { DefinitionManifests } from "./configTypes";

const MANIFEST_VERSION = "MANIFEST_VERSION";
const DB_NAME = "Quartermaster";
const DB = new Dexie(DB_NAME);

const schema: Record<string, string> = {};

for (const tableName of DefinitionManifests) {
    schema[tableName] = "&hash, data";
}

DB.version(1).stores(schema);

export const putManifestVersionInLocalStorage = (version: string): void => {
    const { localStorage } = window;
    localStorage.setItem(MANIFEST_VERSION, version);
};

export const getManifestVersionInLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(MANIFEST_VERSION);
};

export const isManifestDBPresent = (): boolean => {
    const tableDiff = _.difference(
        DefinitionManifests,
        DB.tables.map(table => table.name)
    );
    return tableDiff.length === 0;
};

export const getDefinitionManifestFromIndexDB = async (
    manifestName: string,
    hashes: number[]
): Promise<JsonObject> => {
    const result: ManifestEntry[] = await DB.table(manifestName)
        .where("hash")
        .anyOf(hashes)
        .toArray();

    return _.chain(result)
        .keyBy(item => item.hash)
        .mapValues(item => item.data)
        .value();
};

export const freshSaveOfAllDefinitionManifests = async (
    manifestResponseWrappers: ManifestResponseWrapper[]
): Promise<void> => {
    if (!window.indexedDB) {
        console.error("This browser does not support indexedDB your manifests will not be cached.");
    }

    if (manifestResponseWrappers.length !== DefinitionManifests.length) {
        console.error("Not all definition manifests are present please reload");
    }

    try {
        for (const manifestWrapper of manifestResponseWrappers) {
            DB.table(manifestWrapper.name).clear();
            const entries: ManifestEntry[] = Object.values(manifestWrapper.data).map(data => ({
                hash: data.hash,
                data
            }));

            await DB.table(manifestWrapper.name).bulkAdd(entries);
        }
    } catch (error) {
        console.error(`Failed to save manifest to DB: ${error}`);
    }
};

interface ManifestEntry {
    hash: number;
    data: JsonObject;
}

export interface ManifestResponseWrapper {
    name: string;
    data: JsonObject;
}
