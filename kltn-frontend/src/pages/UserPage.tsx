import UserSidebar from "../components/UserSidebar";
import UserProfile from "../components/user/UserProfile";
import DashboardSummary from "@/components/user/DashboardSummary";
import NewsletterSignup from "@/components/user/NewsletterSignup";
import { useAuthStore } from "@/stores/useAuthStore";

const UserPage = () => {
    const { authUser } = useAuthStore();
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar />

                {/* Main Content */}
                <div className="w-full md:w-3/4 space-y-4 ml-0 mt-3 md:mt-0 md:ml-6">
                    <DashboardSummary userId={authUser?.id} />
                    
                    {/* User Profile Section */}
                    <UserProfile
                    />
                </div>
            </div>

            {/* Newsletter */}
            <NewsletterSignup />
        </div>
    );
};

export default UserPage;