import { parse } from "query-string";
import { getValidToken } from "./authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";

const getCodeFromQueryParam = (): string | null => {
    const { location } = window;
    const { code } = parse(location.search);
    const extractedCode = Array.isArray(code) ? code[0] : code;
    return extractedCode || null;
};

/**
 * This HOC will check authentication tokens for a page and refresh them if need be or in the event
 * Authorisation code is present as a query parameter it will extract it, request a token and save
 * it in both local storage and the store.
 *
 * @param WrappedComponent The component to wrap.
 */
const authenticate = <T,>(WrappedComponent: T): T => {
    const authCode = getCodeFromQueryParam();

    getValidToken().then(token => {
        if (token && authCode) {
            window.location.replace(window.location.pathname);
        } else if (token) {
            getMembershipDataForCurrentUser(token.accessToken).then(data => console.log(data));
        }
    });

    return WrappedComponent;
};

export default authenticate;
