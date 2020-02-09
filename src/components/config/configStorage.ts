import Dexie from "dexie";

import { JsonObject } from "./../../lib/bungie_api/rest";

const MANIFEST_VERSION = "MANIFEST_VERSION";

export const putManifestVersionInLocalStorage = (version: string): void => {
    const { localStorage } = window;
    localStorage.setItem(MANIFEST_VERSION, version);
};

export const getManifestVersionInLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(MANIFEST_VERSION);
};

export const getDefinitionManifestFromIndexDB = async (
    manifestName: string,
    hashes: number[]
): Promise<JsonObject[]> => {
    const db = new Dexie("Quartermaster");
    const result = await db
        .table(manifestName)
        .where("id")
        .anyOf(hashes)
        .toArray();

    return result.map((dbObject: ManifestEntry) => dbObject.data);
};

export const saveDefinitionManifestToIndexedDB = (
    manifestResponseWrappers: ManifestResponseWrapper[]
): boolean => {
    if (!window.indexedDB) {
        console.error("This browser does not support indexedDB your manifests will not be cached.");
        return false;
    }

    try {
        const dbName = "Quartermaster";
        Dexie.delete(dbName).then(() => {
            const db = new Dexie(dbName);
            const schema: Record<string, string> = {};

            for (const manifestWrapper of manifestResponseWrappers) {
                schema[manifestWrapper.name] = "++id, &hash, data";
            }

            db.version(1).stores(schema);

            for (const manifestWrapper of manifestResponseWrappers) {
                const entries: ManifestEntry[] = Object.values(manifestWrapper.data).map(data => ({
                    hash: data.hash,
                    data
                }));

                db.table(manifestWrapper.name).bulkAdd(entries);
            }
        });

        return true;
    } catch (error) {
        console.error(`Failed to save manifest to DB: ${error}`);
        return false;
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
