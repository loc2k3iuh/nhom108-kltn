import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserRequest } from "@/types/requests/authRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface NameParts {
  firstname: string;
  lastname: string;
}

const updateSchema = yup.object({
  firstName: yup
    .string()
    .nullable()
    .notRequired()
    .min(3, "First name must be at least 3 characters !")
    .max(50, "First name must not exceed 50 characters !"),
  lastName: yup
    .string()
    .nullable()
    .notRequired()
    .min(2, "Last name must be at least 3 characters !")
    .max(50, "Last name must not exceed 50 characters !"),

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
    .notRequired()
    .min(10, "Address must be at least 10 characters !")
    .max(100, "Address must not exceed 100 character !"),

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
});

type UpdateUserForm = yup.InferType<typeof updateSchema>;

export default function UserInfoCard() {
  const { authUser, updateUser } = useAuthStore();
  const { isOpen, openModal, closeModal } = useModal();
  const [avatarPreview, setAvaterPreview] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: yupResolver(updateSchema) as any,
    defaultValues: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      file: null,
    },
  });

  useEffect(() => {
    setAvaterPreview(authUser?.avatar_url || "");
  }, [authUser]);

  useEffect(() => {
    // Prefill form when opening modal or when user data changes
    if (authUser) {
      const { firstname, lastname } = getFirstNameAndLastName(
        authUser.full_name
      );
      reset({
        firstName: firstname || "",
        lastName: lastname || "",
        phoneNumber: authUser.phone_number || "",
        dateOfBirth: authUser.date_of_birth || "",
        address: authUser.address || "",
        file: null,
      });
    }
  }, [authUser, isOpen, reset]);

  const handleSave = async (data: UpdateUserForm) => {
    const updateData: UpdateUserRequest = {
      fullName:
        `${data.firstName || ""} ${data.lastName || ""}`.trim() || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      file: data.file || undefined,
    };

    const success = await updateUser(updateData);
    if (success) {
      toast.success("User information updated successfully!");
    }
    closeModal();
  };

  const getFirstNameAndLastName = (
    fullName: string | null | undefined
  ): NameParts => {
    if (!fullName || fullName.trim().length === 0) {
      return { firstname: "", lastname: "" };
    }

    const parts = fullName.trim().split(/\s+/);
    const firstname = parts[0];
    const lastname = parts.length > 1 ? parts.slice(1).join(" ") : "";

    return {
      firstname,
      lastname,
    };
  };

  const formatPhoneNumber = (
    phoneNumber: string | null | undefined
  ): string => {
    if (!phoneNumber) return "";
    const pattern = /^(\d{2})(\d{3})(\d{3})(\d{2})$/;
    return phoneNumber.replace(pattern, "$1 $2 $3 $4");
  };

  const convertDate = (dateStr: string | null | undefined) => {
    if (dateStr == null) {
      return "";
    }
    const [year, month, date] = dateStr.split("-");
    return `${date}-${month}-${year}`;
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getFirstNameAndLastName(authUser?.full_name).firstname}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getFirstNameAndLastName(authUser?.full_name).lastname}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {authUser?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                +{formatPhoneNumber(authUser?.phone_number)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {authUser?.roles[0]?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of Birth
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {convertDate(authUser?.date_of_birth)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit(handleSave)}>
            <div className="custom-scrollbar h-[510px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" {...register("firstName")} />
                      {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" {...register("lastName")} />
                     {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone Number</Label>
                    <Input type="text" {...register("phoneNumber")} />
                      {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Date Of Birth</Label>
                    <Input type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Input type="text" {...register("address")} />
                      {errors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>Image</Label>
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
                            setAvaterPreview(f ? URL.createObjectURL(f) : "");
                          }}
                        />
                      );
                    })()}
                     {errors.file && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.file.message}
                      </p>
                    )}
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="mt-2 h-24 rounded-full border border-gray-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-5 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
