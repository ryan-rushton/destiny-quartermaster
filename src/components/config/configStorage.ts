import { JsonObject } from "../../lib/bungie_api/rest";

const MANIFEST_VERSION = "MANIFEST_VERSION";

export const putManifestVersionInLocalStorage = (version: string): void => {
    const { localStorage } = window;
    localStorage.setItem(MANIFEST_VERSION, version);
};

export const getManifestVersionInLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(MANIFEST_VERSION);
};

export const saveDefinitionManifestToIndexedDB = (defManifest: JsonObject): void => {
    console.log(defManifest);
};
