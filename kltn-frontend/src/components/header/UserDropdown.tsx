import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage, getTokenFromSessionStorage, removeToken } from "@/services/useTokenService";
import { useAuthStore } from "@/stores/useAuthStore";
import { SignOutRequest } from "@/types/requests/authRequest";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function UserDropdown() {
  const { authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut} = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const token  = getTokenFromLocalStorage() || getTokenFromSessionStorage();
    const tokenRequest : SignOutRequest = {
      token : token ? token : ""
    }
    if(tokenRequest.token === ""){
      return;
    }
    removeToken();
    const isSignedOut = await signOut(tokenRequest);

    if(isSignedOut){
      toast.success("Logout successfully !");
    }else{
      toast.error("Loggout failed !");
    }

    navigate("/");
  }

  const handleSignIn = () => {
    closeDropdown();
    navigate("/signin");
  }

  const handleSignUp = () => {
    closeDropdown();
    navigate("/signup");
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img 
            src={authUser?.avatar_url || "/logo_v4.png"} 
            alt={authUser ? "User Avatar" : "Guest"} 
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {authUser?.username || "Guest"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {authUser ? (
          // Authenticated User Content
          <>
            <div>
              <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                {authUser.full_name || authUser.username}
              </span>
              <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                {authUser.email}
              </span>
            </div>

            <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
              <li>
                <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  to="/user/profile"
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <svg
                    className="stroke-gray-500 group-hover:stroke-gray-700 dark:stroke-gray-400 dark:group-hover:stroke-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="8" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  to="/orders"
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <svg
                    className="stroke-gray-500 group-hover:stroke-gray-700 dark:stroke-gray-400 dark:group-hover:stroke-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 7H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 15H12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  My Orders
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={closeDropdown}
                  tag="a"
                  to="/favorites"
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  <svg
                    className="stroke-gray-500 group-hover:stroke-gray-700 dark:stroke-gray-400 dark:group-hover:stroke-gray-300"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Favorites
                </DropdownItem>
              </li>
            </ul>
            <Button
              onClick={handleSignOut}
              className="bg-error-50 flex items-center gap-3 px-3 py-2 mt-3 font-medium rounded-lg group text-theme-sm dark:bg-error-500/15 hover:bg-red-600 dark:hover:bg-red-600"
            >
              <svg
                className="fill-error-600 group-hover:fill-white dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                  fill=""
                />
              </svg>
              <span className="text-error-600 group-hover:text-white dark:group-hover:text-white dark:text-error-500">
                Log out
              </span>
            </Button>
          </>
        ) : (
          // Non-Authenticated User Content
          <div className="flex flex-col gap-3">
            <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-800">
              <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400 mb-1">
                Welcome to our store!
              </span>
              <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                Sign in to access your account
              </span>
            </div>
            
            <Button
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </Button>
            
            <Button
              onClick={handleSignUp}
              className="bg-transparent hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Sign Up
            </Button>
          </div>
        )}
      </Dropdown>
    </div>
  );
}
