function msg(msg: string) {
    console.log(msg);
}

function msgs(...args: Array<any>) {
    console.log(args);
}

function warn(msg: string) {
    console.warn(msg);
}

function prompt(msg: string) {

}

export {msg, msgs, warn, prompt};