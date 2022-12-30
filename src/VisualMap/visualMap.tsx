import React from 'react';
import './visualMap.css';

const isString = (value: any) => {
    return typeof value === 'string' || value instanceof String;
}

/**
 * Index based display of keys and values
 * @param keys: string[]
 * @param values: string[]
 * @returns jsx
 */
export const VisualMap = (props: { map: Map<string,any>, percentAvailableWidth?: number, omitKeys?: boolean }) => {
    
    const getKey = (key: string): JSX.Element => {
        if(props.omitKeys !== undefined || props.omitKeys){
            return <></>;
        }
        return (
            <div className="VisualMap-Key">{key}:</div>
        );
    }

    return (
        <div className="VisualMap" style={{ width: props.percentAvailableWidth === undefined ? 100 + "%" : props.percentAvailableWidth + "%"}}>
            {[...props.map.keys()].map((key, index) => {
                return (
                    <div className="VisualMap-Row" key={index} data-valuesonly={props.omitKeys === true}>
                        {getKey(key)}
                        <div className="VisualMap-Value">{isString(props.map.get(key)) ? props.map.get(key) : JSON.stringify(props.map.get(key))}</div>
                    </div>
                );
            })}
        </div>
    )
}
