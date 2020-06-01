import _ from 'lodash';
import Dexie from 'dexie';
import {
    DestinyClassDefinition,
    DestinyGenderDefinition,
    DestinyInventoryItemDefinition,
    DestinyRaceDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DestinyPlugSetDefinition,
    DestinyEnergyTypeDefinition,
} from 'bungie-api-ts/destiny2';

import { JsonObject } from 'lib/bungie_api/rest';
import { DefinitionManifests, DefinitionManifestsEnum, Manifest } from './manifestTypes';

// DB Setup ---------------

const MANIFEST_VERSION = 'MANIFEST_VERSION';
const DB_NAME = 'Quartermaster';
const DB = new Dexie(DB_NAME);

const schema: Record<string, string> = {};

for (const tableName of DefinitionManifests) {
    if (tableName === DefinitionManifestsEnum.DestinyInventoryItemDefinition) {
        schema[tableName] = '&hash, data, *itemCategoryHashes';
    } else {
        schema[tableName] = '&hash, data';
    }
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

interface SavedManifest {
    hash: number;
    data: unknown;
}

interface SavedManifestWithCategoryHashes {
    hash: number;
    data: unknown;
    itemCategoryHashes: number[];
}

const isSavedManifest = (item: unknown): item is SavedManifest => {
    return _.isObject(item) && _.isNumber(item['hash']);
};

const getDefinitionManifestFromIndexDB = async (
    manifestName: string,
    hashes: number[]
): Promise<Manifest<unknown>> => {
    const result = await DB.table(manifestName).where('hash').anyOf(hashes).toArray();

    return _.chain(result)
        .filter(isSavedManifest)
        .keyBy((item: SavedManifest) => item.hash)
        .mapValues((item: SavedManifest) => item.data)
        .value();
};

const getCompleteDefinitionManifestFromIndexDB = async (
    manifestName: string
): Promise<Manifest<unknown>> => {
    const result = await DB.table(manifestName).toArray();

    return _.chain(result)
        .filter(isSavedManifest)
        .keyBy((item: SavedManifest) => item.hash)
        .mapValues((item: SavedManifest) => item.data)
        .value();
};

export const getClassManifest = async (
    hashes: number[]
): Promise<Manifest<DestinyClassDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyClassDefinition,
        hashes
    ) as Promise<Manifest<DestinyClassDefinition>>;
};

export const getGenderManifest = async (
    hashes: number[]
): Promise<Manifest<DestinyGenderDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyGenderDefinition,
        hashes
    ) as Promise<Manifest<DestinyGenderDefinition>>;
};

export const getRaceManifest = async (
    hashes: number[]
): Promise<Manifest<DestinyRaceDefinition>> => {
    return getDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyRaceDefinition,
        hashes
    ) as Promise<Manifest<DestinyRaceDefinition>>;
};

export const getInventoryItemManifestByCategory = async (
    categories: number[]
): Promise<Manifest<DestinyInventoryItemDefinition>> => {
    const result = await DB.table(DefinitionManifestsEnum.DestinyInventoryItemDefinition)
        .where('itemCategoryHashes')
        .anyOf(categories)
        .and((item: unknown) => {
            if (_.isObject(item)) {
                const itemCategoryHashes = item['itemCategoryHashes'] as unknown;
                if (_.isArray(itemCategoryHashes)) {
                    return !itemCategoryHashes.includes(3109687656);
                }
            }

            return false;
        })
        .toArray();

    return _.chain(result)
        .filter(isSavedManifest)
        .keyBy((item: SavedManifest) => item.hash)
        .mapValues((item: SavedManifest) => item.data)
        .value() as Manifest<DestinyInventoryItemDefinition>;
};

export const getCompleteInventoryItemManifest = async (): Promise<
    Manifest<DestinyInventoryItemDefinition>
> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyInventoryItemDefinition
    ) as Promise<Manifest<DestinyInventoryItemDefinition>>;
};

export const getCompleteStatManifest = async (): Promise<Manifest<DestinyStatDefinition>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyStatDefinition
    ) as Promise<Manifest<DestinyStatDefinition>>;
};

export const getCompleteDamageTypeManifest = async (): Promise<
    Manifest<DestinyDamageTypeDefinition>
> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyDamageTypeDefinition
    ) as Promise<Manifest<DestinyDamageTypeDefinition>>;
};

export const getCompletePlugSetManifest = async (): Promise<Manifest<DestinyPlugSetDefinition>> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyPlugSetDefinition
    ) as Promise<Manifest<DestinyPlugSetDefinition>>;
};

export const getCompleteEnergyTypeManifest = async (): Promise<
    Manifest<DestinyEnergyTypeDefinition>
> => {
    return getCompleteDefinitionManifestFromIndexDB(
        DefinitionManifestsEnum.DestinyEnergyTypeDefinition
    ) as Promise<Manifest<DestinyEnergyTypeDefinition>>;
};

export const freshSaveOfAllDefinitionManifests = async (
    manifestResponseWrappers: ManifestResponseWrapper[]
): Promise<void> => {
    if (!window.indexedDB) {
        console.error('This browser does not support indexedDB your manifests will not be cached.');
    }

    if (manifestResponseWrappers.length !== DefinitionManifests.length) {
        console.error('Not all definition manifests are present please reload');
    }

    try {
        for (const manifestWrapper of manifestResponseWrappers) {
            DB.table(manifestWrapper.name).clear();
            const entries: (SavedManifest | SavedManifestWithCategoryHashes)[] = [];

            for (const data of Object.values(manifestWrapper.data)) {
                if (_.isObject(data)) {
                    const hash = data['hash'] as unknown;
                    const itemCategoryHashes = data['itemCategoryHashes'] as unknown;
                    if (_.isNumber(hash)) {
                        if (
                            manifestWrapper.name ===
                                DefinitionManifestsEnum.DestinyInventoryItemDefinition &&
                            (_.isArray(itemCategoryHashes) || _.isUndefined(itemCategoryHashes))
                        ) {
                            entries.push({
                                hash,
                                data,
                                itemCategoryHashes,
                            });
                        }

                        entries.push({
                            hash,
                            data,
                        });
                    }
                }

                await DB.table(manifestWrapper.name).bulkAdd(entries);
            }
        }
    } catch (error) {
        console.error(`Failed to save manifest to DB: ${error}`);
    }
};

export interface ManifestResponseWrapper {
    name: string;
    data: JsonObject;
}
