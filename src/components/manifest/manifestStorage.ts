import _ from "lodash";
import Dexie from "dexie";
import {
    DestinyClassDefinition,
    DestinyGenderDefinition,
    DestinyInventoryItemDefinition,
    DestinyItemCategoryDefinition,
    DestinyRaceDefinition,
    DestinySandboxPerkDefinition,
    DestinyStatDefinition,
    DestinyStatGroupDefinition,
    DestinyDamageTypeDefinition,
    DestinySocketTypeDefinition,
    DestinyPlugSetDefinition
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

const getCompleteDefinitionManifestFromIndexDB = async (
    manifestName: string
): Promise<Record<string, any>> => {
    const result = await DB.table(manifestName).toArray();

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

export const getCompleteInventoryItemManifest = async (): Promise<Record<
    string,
    DestinyInventoryItemDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyInventoryItemDefinition
    );
};

export const getCompleteStatManifest = async (): Promise<Record<string, DestinyStatDefinition>> => {
    return getCompleteDefinitionManifestFromIndexDB(DefinitionManifestsEnum.DestinyStatDefinition);
};

export const getCompletePerkManifest = async (): Promise<Record<
    string,
    DestinySandboxPerkDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinySandboxPerkDefinition
    );
};

export const getCompleteDamageTypeManifest = async (): Promise<Record<
    string,
    DestinyDamageTypeDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyDamageTypeDefinition
    );
};

export const getCompleteSocketTypeManifest = async (): Promise<Record<
    string,
    DestinySocketTypeDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinySocketTypeDefinition
    );
};

export const getCompletePlugSetManifest = async (): Promise<Record<
    string,
    DestinyPlugSetDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyPlugSetDefinition
    );
};

export const getCompleteStatGroupManifest = async (): Promise<Record<
    string,
    DestinyStatGroupDefinition
>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyStatGroupDefinition
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
