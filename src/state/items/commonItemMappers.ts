import _ from 'lodash';
import {
  DestinyStatDefinition,
  DestinyDamageTypeDefinition,
  DamageType,
  DestinyItemInvestmentStatDefinition,
  DestinyInventoryItemDefinition,
  DestinyEnergyTypeDefinition,
  DestinyEnergyCostEntry,
  DestinyEnergyType,
} from 'bungie-api-ts/destiny2';

import { Damage, Stats, Mod, EnergyCost, EnergyType } from './commonItemTypes';
import { Manifest } from 'state/manifest/manifestTypes';

export const EmptyModSocketsToSeason = {
  3625698764: 4,
  720857: 5,
  4106547009: 7,
  2620967748: 8,
  2357307006: 9,
  2655746324: 10,
} as const;

export const mapInventoryStats = (
  statsManifest: Manifest<DestinyStatDefinition>,
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
          name: manifestEntry.displayProperties.name,
        };
      }
    }
  }

  return mappedStats;
};

export const mapDamageTypes = (
  damageTypeManifests: Manifest<DestinyDamageTypeDefinition>,
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

const mapEnergyType = (bungieType: DestinyEnergyType): EnergyType => {
  switch (bungieType) {
    case 1:
      return 'Arc';
    case 2:
      return 'Solar';
    case 3:
      return 'Void';
    case 0:
    default:
      return 'Any';
  }
};

const mapEnergyCost = (
  instance: DestinyEnergyCostEntry,
  energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>,
  statManifest: Manifest<DestinyStatDefinition>
): EnergyCost | undefined => {
  const manifest = energyTypeManifest[instance.energyTypeHash];
  const statCost = manifest && statManifest[manifest.costStatHash];
  if (!manifest) {
    return;
  }

  const { name, icon, description } = manifest.displayProperties;

  return {
    type: mapEnergyType(manifest.enumValue),
    name,
    iconPath: statCost?.displayProperties.icon || icon,
    description,
    cost: instance.energyCost,
  };
};

export const mapMod = (
  statsManifest: Manifest<DestinyStatDefinition>,
  energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>,
  plug: DestinyInventoryItemDefinition,
  enabled: boolean
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
    collectibleHash,
    energyType: plug?.plug?.energyCost && mapEnergyCost(plug.plug.energyCost, energyTypeManifest, statsManifest),
  };
};

/**
 * Figures out the season the item came out in from the empty mod sockets on the definition;
 * If a season is not found 0 is returned. These items have to seasonal mod socket.
 */
export const mapArmourSeason = (def: DestinyInventoryItemDefinition): number => {
  for (const socket of def.sockets?.socketEntries || []) {
    const season = EmptyModSocketsToSeason[socket.singleInitialItemHash] as unknown;
    if (_.isNumber(season)) {
      return season;
    }
  }

  return 0;
};
