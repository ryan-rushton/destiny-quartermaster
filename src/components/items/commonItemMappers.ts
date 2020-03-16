import {
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DamageType,
    DestinyItemInvestmentStatDefinition,
    DestinyInventoryItemDefinition,
    DestinyEnergyTypeDefinition,
    DestinyEnergyCostEntry
} from "bungie-api-ts/destiny2";

import { Damage, Stats, Mod, EnergyCost } from "./commonItemTypes";
import { preloadImage } from "util/imageUtils";

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

const mapEnergyCost = (
    instance: DestinyEnergyCostEntry,
    energyTypeManifest: Record<string, DestinyEnergyTypeDefinition>
): EnergyCost | undefined => {
    const manifest = energyTypeManifest[instance.energyTypeHash];

    if (!manifest) {
        return;
    }

    const { name, icon, description } = manifest.displayProperties;

    return {
        name,
        iconPath: icon,
        description,
        cost: instance.energyCost
    };
};

export const mapMod = (
    statsManifest: Record<string, DestinyStatDefinition>,
    energyTypeManifest: Record<string, DestinyEnergyTypeDefinition>,
    plug: DestinyInventoryItemDefinition,
    enabled
): Mod => {
    const { displayProperties, hash, itemCategoryHashes, collectibleHash } = plug;
    if (displayProperties.icon) {
        preloadImage(displayProperties.icon);
    }
    return {
        name: displayProperties.name,
        description: displayProperties.description,
        iconPath: displayProperties.icon,
        hash,
        enabled,
        categories: itemCategoryHashes,
        stats: mapInventoryStats(statsManifest, plug.investmentStats),
        collectibleHash,
        energyType:
            plug?.plug?.energyCost && mapEnergyCost(plug.plug.energyCost, energyTypeManifest)
    };
};
