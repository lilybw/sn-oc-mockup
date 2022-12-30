import React from 'react';

export function getRefMap<Type>(objectArray: Type[]): Map<Type, React.RefObject<HTMLElement>>{
    const map = new Map<Type, React.RefObject<HTMLElement>>();
    objectArray.forEach((obj) => {
        map.set(obj, React.createRef<HTMLElement>());
    });
    return map;
};

export function wrapFunction(e: Function): {func: Function} {
    return {func: e};
}
