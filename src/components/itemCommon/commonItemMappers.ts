import {
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DamageType,
    DestinyItemInvestmentStatDefinition,
    DestinyInventoryItemDefinition
} from "bungie-api-ts/destiny2";

import { Damage, Stats, Mod } from "./commonItemTypes";

export const mapInventoryStats = (
    statsManifest: Record<string, DestinyStatDefinition>,
    stats?: DestinyItemInvestmentStatDefinition[]
): Stats => {
    const mappedStats: Stats = {};
    if (stats) {
        for (const stat of stats) {
            const { statTypeHash, value } = stat;
            const manifestEntry = statsManifest[statTypeHash];
            if (manifestEntry) {
                mappedStats[statTypeHash] = {
                    statHash: statTypeHash,
                    value,
                    name: manifestEntry.displayProperties.name
                };
            }
        }
    }

    return mappedStats;
};

export const mapDamageTypes = (
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    damageTypes: DamageType[]
): Damage[] => {
    const mappedDamages: Damage[] = [];

    for (const type of damageTypes) {
        const manifestEntry = damageTypeManifests[type];
        if (manifestEntry) {
            const { hash, displayProperties } = manifestEntry;
            const { name, icon } = displayProperties;
            mappedDamages.push({ hash, iconPath: icon, name });
        }
    }

    return mappedDamages;
};

export const mapMod = (
    statsManifest: Record<string, DestinyStatDefinition>,
    plug: DestinyInventoryItemDefinition,
    enabled
): Mod => {
    const { displayProperties, hash, itemCategoryHashes, collectibleHash } = plug;
    return {
        name: displayProperties.name,
        description: displayProperties.description,
        iconPath: displayProperties.icon,
        hash,
        enabled,
        categories: itemCategoryHashes,
        stats: mapInventoryStats(statsManifest, plug.investmentStats),
        collectibleHash
    };
};
