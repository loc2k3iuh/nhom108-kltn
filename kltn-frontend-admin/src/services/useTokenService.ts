import { jwtDecode } from "jwt-decode";
const ACCESS_TOKEN_KEY = "access_token";

export const getTokenFromLocalStorage = (): string => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
};

export const getTokenFromSessionStorage = (): string => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
};

export const setAccessTokenToLocalStorage = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const setAccessTokenToSessionStorage = (accessToken: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getUserIdFromToken = (): number | null => {
  const token = getTokenFromLocalStorage() || getTokenFromSessionStorage();

  if (!token) {
    return null;
  }
  try{
  const userObject: any = jwtDecode(token);
  const id  =Number(userObject?.userId);
  return Number.isNaN(id) ? null : id;
  }catch(err){
    console.log("Invalid token", err);
    return null;
  }
 
};
