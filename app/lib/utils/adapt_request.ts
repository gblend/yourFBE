import {Request} from '../../types/index';

const adaptRequest = (req: Request | any) => {
    return Object.freeze({
        path: req.path as string,
        method: req.method as string,
        body: req.body,
        queryParams: req.query as any,
        pathParams: req.params as any,
        headers: req.headers,
        ip: req.ip as string,
        signedCookies: req.signedCookies,
        user: req.user as any,
        cookies: req.cookies,
        files: req.files,
        socialProfile: req.socialProfile,
        fields: req.fields,
    })
}

export {
    adaptRequest
}
