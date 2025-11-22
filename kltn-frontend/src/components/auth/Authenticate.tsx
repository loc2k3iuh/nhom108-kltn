import { oauth2Login } from "@/services/useAuthService";
import { setAccessTokenToLocalStorage, setAccessTokenToSessionStorage } from "@/services/useTokenService";
import { useAuthStore } from "@/stores/useAuthStore";
import { Oauth2LoginRequest } from "@/types/requests/authRequest";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Authenticate = () => {
  const { checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const isRemembered = urlParams.get("is_remembered");

    if (!authCode || !isRemembered) {
      toast.error("Đăng nhập thất bại!");
      navigate("/login");
      return;
    }

    const validateLoginByOauth2 = async (): Promise<string | undefined> => {
      try {
        const dataString = decodeURIComponent(atob(authCode));
        const oauth2LoginRequest: Oauth2LoginRequest = JSON.parse(dataString);
        const response = await oauth2Login(oauth2LoginRequest);
        return response.access_token;
      } catch (error: any) {
        console.error(
          "Error in logging in by OAuth2:",
          error?.response?.data?.message || error.message
        );
        return undefined;
      }
    };

    const handleOAuth2Login = async () => {
      const token = await validateLoginByOauth2();
      
      if (!isMounted) return;

      if (!token) {
        toast.error("Không thể đăng nhập!");
        navigate("/login");
        return;
      }

      if (isRemembered === "true") {
        setAccessTokenToLocalStorage(token);
      } else {
        setAccessTokenToSessionStorage(token);
      }

      await checkAuth();
      navigate("/");
    };

    handleOAuth2Login();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography>Authenticating...</Typography>
    </Box>
  );
};

export default Authenticate;
