/**
 * Coloca la primera letra de un texto en mayúscula.
 * @param {string} texto String a convertir.
 * @returns {string} Texto convertido.
 */
export const FirstCapitalLetter = (text: string): string => {
    let texts = text.split(" ");
    texts = texts.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
    return texts.join(" ");
};
