import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { changePassword } from "@/services/useUserService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const validatedPasswordMessage = "Mật khẩu phải có ít nhất 8 ký tự !";
const changePasswordSchema = yup.object({
  current_password: yup
    .string()
    .nonNullable()
    .required()
    .trim(),
  new_password: yup
    .string()
    .nonNullable()
    .required()
    .min(8, validatedPasswordMessage),
  retype_new_password: yup
    .string()
    .nonNullable()
    .required()
    .oneOf([yup.ref("new_password")], "Mật khẩu phải trùng !"),
});

type ChangePasswordForm = yup.InferType<typeof changePasswordSchema>;
type TabType = "profile" | "security" | "preferences";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("security");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(changePasswordSchema) as any,
    defaultValues: {
      current_password: "",
      new_password: "",
      retype_new_password: "",
    },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setIsLoading(true);
      await changePassword(data);

      const response = await signOut();
      if (response) {
        navigate("/signin");
        toast.success("Đổi mật khẩu thành công vui lòng đăng nhập lại !");
      } else {
        toast.error("Đổi mật khẩu thất bại !");
      }
    } catch (error: any) {
      console.error("Change password failed:", error?.response?.data?.message);
      toast.error("Đổi mật khẩu thất bại !");
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: "profile" as TabType, label: "Profile", icon: "👤" },
    { id: "security" as TabType, label: "Security", icon: "🔒" },
    { id: "preferences" as TabType, label: "Preferences", icon: "⚙️" },
  ];

  const renderProfileTab = () => (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        Profile Information
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Profile settings coming soon...
      </p>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        Change Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="old_password">
            Current Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="old_password"
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter your current password"
              {...register("current_password", {
                required: "Current password is required",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              <FontAwesomeIcon
                icon={showOldPassword ? faEyeSlash : faEye}
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
              />
            </button>
          </div>
          {errors.current_password && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.current_password.message)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">
            New Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("new_password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
              />
            </button>
          </div>
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.new_password.message)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="retype_password">
            Confirm New Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative mt-2">
            <Input
              id="retype_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("retype_new_password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
              />
            </button>
          </div>
          {errors.retype_new_password && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.retype_new_password.message)}
            </p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800">
      <h2 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        Preferences
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Preference settings coming soon...
      </p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "security":
        return renderSecurityTab();
      case "preferences":
        return renderPreferencesTab();
      default:
        return renderSecurityTab();
    }
  };

  return (
    <div>
      <PageMeta
        title="Account Settings | Admin Dashboard"
        description="Manage your account settings and preferences"
      />
      <PageBreadcrumb pageTitle="Account Settings" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="w-full lg:w-64">
            <div className="p-4 border border-gray-200 rounded-xl dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === item.id
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
