/**
 * Will return a map of the specified object attributes and values
 * @param object 
 * @param attributes if undefined or length === 0, all attributes will be returned
 * @returns 
 */
export const asMap = (object: Object, attributes: string[]): Map<string,any> => {
    const entries = Object.entries(object);
    const toReturn = new Map<string,any>();

    for(let i = 0; i < entries.length; i++){
        if(attributes === undefined || attributes === null || attributes.length === 0 || attributes.includes(entries[i][0])){
            toReturn.set(entries[i][0], entries[i][1]);
        }
    }

    return toReturn;
}

export const keysFromValue = <T, R>(map: Map<T,R>, value: R): T[] => {
    const toReturn: T[] = [];
    map.forEach((v,k) => {
        if (v === value){
            toReturn.push(k);
        }
    });
    return toReturn;
}
/*
const testKeysFromValue = () => {
    const map = new Map<any,any>();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 1);
    map.set('d', 3);
    map.set('e', 1);
    expect(keysFromValue(map, 1)).toEqual(['a','c','e']);
    expect(keysFromValue(map, 2)).toEqual(['b']);
    expect(keysFromValue(map, 3)).toEqual(['d']);
    expect(keysFromValue(map, 4)).toEqual([]);
};
*/