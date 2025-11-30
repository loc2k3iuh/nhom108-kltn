import  { useState, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";
import UserProfile from "../components/user/UserProfile";
import DashboardSummary from "@/components/user/DashboardSummary";
import NewsletterSignup from "@/components/user/NewsletterSignup";
import { useAuthStore } from "@/stores/useAuthStore";

interface ValidationErrors {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
}

const UserPage = () => {
    const { authUser } = useAuthStore();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // Static user data
    const staticUserData = {
        id: 1,
        username: "user123",
        full_name: "Nguyễn Văn A",
        fullName: "Nguyễn Văn A",
        email: "user@example.com",
        phone_number: "0912345678",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        date_of_birth: "1990-05-15",
        avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
        roles: [{ name: "USER" }]
    };


    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    
 
    
    
    
    // Function to fetch user data (now uses static data)
   
    
   
   

   

  
  
    const products = [
        { id: 1, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36366.jpg", name: "Chiến binh cầu vòng", price: "79.000 đ" },
        { id: 2, img: "https://cdn0.fahasa.com/media/catalog/product/n/g/nghigiaulamgiau_110k-01_bia-1.jpg", name: "Nghĩ giàu làm giàu", price: "73.000 đ" },
        { id: 3, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935236432832.jpg", name: "Thép Đã Tôi Thế Đấy (Tái Bản 2023)", price: "81.000 đ" },
        { id: 4, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_19743.jpg", name: "Everything I Know About Love", price: "98.000 đ" }
    ];
    
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

            {/* Product Suggestions */}
    

            {/* Newsletter */}
            <NewsletterSignup />
        </div>
    );
};

export default UserPage;