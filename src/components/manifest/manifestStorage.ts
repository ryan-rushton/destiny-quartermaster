import _ from "lodash";
import Dexie from "dexie";
import {
    DestinyClassDefinition,
    DestinyGenderDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyRaceDefinition
} from "bungie-api-ts/destiny2";

import { JsonObject } from "../../lib/bungie_api/rest";
import { DefinitionManifests, DefinitionManifestsEnum } from "./manifestTypes";

// DB Setup ---------------

const MANIFEST_VERSION = "MANIFEST_VERSION";
const DB_NAME = "Quartermaster";
const DB = new Dexie(DB_NAME);

const schema: Record<string, string> = {};

for (const tableName of DefinitionManifests) {
    schema[tableName] = "&hash, data";
}

DB.version(1).stores(schema);

// -------------------------

export const putManifestVersionInLocalStorage = (version: string): void => {
    const { localStorage } = window;
    localStorage.setItem(MANIFEST_VERSION, version);
};

export const getManifestVersionInLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(MANIFEST_VERSION);
};

const getDefinitionManifestFromIndexDB = async (
    manifestName: string,
    hashes: number[]
): Promise<Record<string, any>> => {
    const result = await DB.table(manifestName)
        .where("hash")
        .anyOf(hashes)
        .toArray();

    return _.chain(result)
        .keyBy(item => item.hash)
        .mapValues(item => item.data)
        .value();
};

export const getClassManifest = async (
    hashes: number[]
): Promise<Record<string, DestinyClassDefinition>> => {
    return getDefinitionManifestFromIndexDB(DefinitionManifestsEnum.DestinyClassDefinition, hashes);
};

export const getGenderManifest = async (
    hashes: number[]
): Promise<Record<string, DestinyGenderDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyGenderDefinition,
        hashes
    );
};

export const getRaceManifest = async (
    hashes: number[]
): Promise<Record<string, DestinyRaceDefinition>> => {
    return getDefinitionManifestFromIndexDB(DefinitionManifestsEnum.DestinyRaceDefinition, hashes);
};

export const getInventoryItemManifest = async (
    hashes: number[]
): Promise<Record<string, DestinyInventoryItemDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyInventoryItemDefinition,
        hashes
    );
};

export const getItemCategoryManifest = async (
    hashes: number[]
): Promise<Record<string, DestinyItemCategoryDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyItemCategoryDefinition,
        hashes
    );
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
            const entries = Object.values(manifestWrapper.data).map(data => ({
                hash: data.hash,
                data
            }));

            await DB.table(manifestWrapper.name).bulkAdd(entries);
        }
    } catch (error) {
        console.error(`Failed to save manifest to DB: ${error}`);
    }
};

export interface ManifestResponseWrapper {
    name: string;
    data: JsonObject;
}
