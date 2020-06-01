import _ from 'lodash';

export interface AuthToken {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
    membershipId: string;
}

export const isAuthToken = (val): val is AuthToken => {
    if (_.isObject(val)) {
        return (
            _.isString(val['accessToken']) &&
            _.isString(val['tokenType']) &&
            _.isNumber(val['expiresIn']) &&
            _.isString(val['refreshToken']) &&
            _.isNumber(val['refreshExpiresIn']) &&
            _.isString(val['membershipId'])
        );
    }
    return false;
};
