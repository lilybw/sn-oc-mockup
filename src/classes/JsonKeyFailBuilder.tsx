export const onFail = (keyFails: string[], key: string, defaultingTo: any) => {
    keyFails.push(key);
    return defaultingTo;
}
export const log = (keyFails: string[], origin: string, expectedSuccess: number, loggingFunction: Function, logOnSuccess: boolean) => {
    let toBeLogged = "";
    if(keyFails.length === 0 && logOnSuccess){
        toBeLogged = "No key fails in " + origin;
        console.log(toBeLogged);
    }else if(keyFails.length !== 0){
        toBeLogged = "Failed to parse " + keyFails.length + "/" + expectedSuccess + " keys in " + origin + ". Failed keys: \n\t" + keyFails.join("\n\t");
        loggingFunction(toBeLogged);
    }
}