import { useAdminState } from "context";

export const getAccessToken = (): string => {
    const pingIdentityAud: string = useAdminState().userContext.pingIdentity.aud;
    const accessTokenKey: string = "PA." + pingIdentityAud;
    return getCookieByName(accessTokenKey)
}


const getCookieByName = (name: string): string => {
    const cookiesString: string = document.cookie;
    const cookiesList: string[] = cookiesString.split(";");
    const resultString: string[] = cookiesList.filter(item => item.split("=")[0] == name)
    return resultString[0].split("=")[1]
}