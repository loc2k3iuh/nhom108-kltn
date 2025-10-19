import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import { UserResponse } from "@/types/responses/authResponse";
import { UpdateClientRequest } from "@/types/requests/authRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../ui/button";
import Label from "../../form/Label";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { updateClient } from "@/services/useUserService";


interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

const updateSchema = yup.object({
  fullName: yup
    .string()
    .nullable()
    .trim()
    .notRequired()
    .min(3, "Full name must be at least 3 characters !")
    .max(100, "Full name must not exceed 100 characters !"),
  phoneNumber: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(09|03|02|07)\d{8}$/,
      "Phone must start with 09, 03, 02, or 07 and have 10 digits !"
    ),
  address: yup
    .string()
    .nullable()
    .trim()
    .notRequired()
    .min(5, "Address must be at least 5 characters !")
    .max(100, "Address must not exceed 100 characters !"),
  dateOfBirth: yup
    .string()
    .nullable()
    .notRequired()
    .test("is-date", "Invalid date format!", (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    })
    .test("is-18", "You must be over 18 years old !", (value) => {
      if (!value) return true;
      const dob = new Date(value);
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return dob <= minDate;
    }),
  file: yup
    .mixed<File>()
    .nullable()
    .transform((value: FileList) =>
      value && value.length > 0 ? value[0] : null
    )
    .test("fileSize", "Image must be less than 5MB !", (file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only .png, .jpg, .jpeg, .jfif are allowed", (file) => {
      if (!file) return true;
      return ["image/png", "image/jpg", "image/jpeg", "image/jfif"].includes(
        file.type
      );
    }),
  isActive: yup.boolean().notRequired().nullable()
});

type UpdateUserForm = yup.InferType<typeof updateSchema>;

export default function EditUserModal({
  isOpen,
  onClose,
  user,
}: EditUserModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: yupResolver(updateSchema) as any,
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      file: null,
      isActive: true,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: (data: { userId: number; updateData: UpdateClientRequest }) =>
      updateClient(data.userId, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      reset({
        fullName: user.full_name || "",
        phoneNumber: user.phone_number || "",
        address: user.address || "",
        dateOfBirth: user.date_of_birth || "",
        isActive: user.is_active,
        file: null,
      });
      setAvatarPreview(user.avatar_url);
    }
  }, [user, isOpen, reset]);



  const handleSave = async (data: UpdateUserForm) => {
    if (!user) return;

    const updateData: UpdateClientRequest = {
      fullName: data.fullName?.trim() || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      file: data.file || undefined,
      isActive: data.isActive,
    };

    updateUserMutation({ userId: user.id, updateData });
  };



  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit User
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update user information for @{user.username}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  {(user.full_name || user.username)?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              {(() => {
                const { ref, onChange, ...rest } = register("file");
                return (
                  <Input
                    type="file"
                    accept="image/*"
                    {...rest}
                    ref={ref}
                    onChange={(e) => {
                      onChange(e);
                      const f = e.target.files?.[0];
                      setAvatarPreview(f ? URL.createObjectURL(f) : user.avatar_url || "");
                    }}
                    className="mt-1"
                  />
                );
              })()}
              {errors.file && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <Label>Email</Label>
              <Input
                value={user.email || "N/A"}
                disabled
                className="mt-1 bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={user.username}
                disabled
                className="mt-1 bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="md:col-span-1">
              <Label>Full Name</Label>
              <Input
                type="text"
                {...register("fullName")}
                placeholder="Enter full name"
                className="mt-1"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                {...register("phoneNumber")}
                placeholder="Enter phone number"
                className="mt-1"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                {...register("dateOfBirth")}
                className="mt-1"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

               <div>
              <Label>Status</Label>
              <select
                {...register("isActive")}
                className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errors.isActive && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.isActive.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                type="text"
                {...register("address")}
                placeholder="Enter address"
                className="mt-1"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

         
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
