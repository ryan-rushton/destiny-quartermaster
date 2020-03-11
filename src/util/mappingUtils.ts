export const getFullImagePath = (relativePath: string): string =>
    `https://bungie.net${relativePath}`;

export const preloadImage = (relativePath: string): void => {
    const image = new Image();
    image.src = getFullImagePath(relativePath);
};
