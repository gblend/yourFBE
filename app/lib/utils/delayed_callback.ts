export const triggerCallback = (fn: (...args: any) => any, args: any, timeout: number = 2000): any => {
    setTimeout(() => {
        fn(args);
    }, timeout);
}