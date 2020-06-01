export const getImageUrl = (assetPath: string): string => `https://bungie.net${assetPath}`;

export const fetchAsset = async (assetPath: string): Promise<Blob> =>
    fetch(getImageUrl(assetPath), { method: 'GET' }).then((response) => {
        if (!response.ok) {
            const { status, statusText, url } = response;
            throw new Error(`Call to ${url} failed with status ${status}: ${statusText}`);
        }

        return response.blob();
    });
