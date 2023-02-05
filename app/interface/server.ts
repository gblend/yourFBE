interface IServerOptions {
    cors: {
        origin: string[],
        methods: string[],
        credentials: boolean,
        cookie: {
            name: string,
            secure: boolean,
            httpOnly: boolean,
            sameSite: string,
            maxAge: Date
        }
    }
}

interface IAppStatus {
    node_version: string;
    dep_versions: any;
    name: string;
    platform: string;
    memory_usage: any;
    uptime_min: number;
    app_version: string;
}

export {
    IAppStatus,
    IServerOptions
}
