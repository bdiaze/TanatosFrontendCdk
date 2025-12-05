export interface AuthClaims {
    sub: string;
    'cognito:groups': string[] | undefined;
    iss: string;
    version: number;
    client_id: string;
    origin_jti: string;
    event_id: string;
    token_use: string;
    scope: string;
    auth_time: number;
    exp: number;
    iat: number;
    jti: string;
    username: string;
}
