import _ from "lodash";
import Dexie from "dexie";

import { JsonObject } from "./../../lib/bungie_api/rest";
import { DefinitionManifests } from "./configTypes";

const MANIFEST_VERSION = "MANIFEST_VERSION";
const DB_NAME = "Quartermaster";

export const putManifestVersionInLocalStorage = (version: string): void => {
    const { localStorage } = window;
    localStorage.setItem(MANIFEST_VERSION, version);
};

export const getManifestVersionInLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(MANIFEST_VERSION);
};

export const isManifestDBPresent = () => {
    const db = new Dexie("Quartermaster");
    return _.difference(DefinitionManifests, db.tables).length === 0;
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

export const freshSaveOfAllDefinitionManifests = (
    manifestResponseWrappers: ManifestResponseWrapper[]
): boolean => {
    if (!window.indexedDB) {
        console.error("This browser does not support indexedDB your manifests will not be cached.");
        return false;
    }

    if (manifestResponseWrappers.length !== DefinitionManifests.length) {
        console.error("Not all definition manifests are present please reload");
    }

    try {
        Dexie.delete(DB_NAME).then(() => {
            const db = new Dexie(DB_NAME);
            const schema: Record<string, string> = {};

            for (const manifestWrapper of manifestResponseWrappers) {
                schema[manifestWrapper.name] = "&hash, data";
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
