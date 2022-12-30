import React from 'react';
import './incidentStateSelect.css';

export interface PropsInterface<T>{
    options: T[];
    onSelectCallback: (option: T) => void;
    optionDisplayMethod: (option: T) => string;
    width?: number;
    height?: number;
    hidden?: boolean;
    title?: string;
}


const DropDownMenu = function<T>(props: PropsInterface<T>): JSX.Element {

    const [showBody, setShowBody] = React.useState<boolean>(false);

    const getBody = (): JSX.Element => {
        if(showBody){
            return ( 
                <div>
                {
                    props.options.map((option: T, index: number) => React.createElement("div", {
                            className: "DropDownMenuOption",
                            key: index,
                            onClick: () => props.onSelectCallback(option)
                        }, props.optionDisplayMethod(option))
                    )
                } 
                </div>
            )
        }
        return <></>;
    }

    return (
        <div className="DropDownMenu" style={{
                width: props.width === undefined ? 100 + "%" : props.width + "vh",
                height: props.height === undefined ? 100 + "%" : props.height + "vh",
                display: props.hidden === undefined || props.hidden === false ? "flex" : "none !important"
            }}>
            <div className="DropDownMenuTitle">{ props.title === undefined ? "Menu" : props.title }</div>
            {getBody()}
        </div>
    )
}
export default DropDownMenu;