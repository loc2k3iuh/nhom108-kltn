import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const updateSchema = yup.object({
  fullName: yup
    .string()
    .nullable()
    .notRequired()
    .min(5, "Tên phải chứa ít nhất 5 ký tự !"),
  phoneNumber: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^(09|03|02|07)\d{8}$/, {
      message: "Số điện thoại phải bắt đầu với 09, 03, 02, 07 và có 10 ký tự !",
      skipEmptyString: true,
    }),
  address: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .notRequired()
    .min(5, "Địa chỉ phải ít nhất 5 ký tự !")
    .max(100, "Địa chỉ tối đa 100 ký tự !"),

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

const convertDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const [year, month, date] = dateStr.split("-");
  return `${date}-${month}-${year}`;
};

const UserProfile = () => {
  const { authUser, updateUser } = useAuthStore();
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: yupResolver(updateSchema) as any,
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      file: null,
    },
  });

  useEffect(() => {
    if (authUser) {
      setAvatarPreview(authUser?.avatar_url || "");
      reset({
        fullName: authUser.full_name || "",
        phoneNumber: authUser.phone_number || "",
        dateOfBirth: authUser.date_of_birth || "",
        address: authUser.address || "",
        file: null,
      });
    }
  }, [authUser, isEditing, reset]);

  const onSubmit = async (data: UpdateUserForm) => {
    setIsLoading(true);
    const isSuccess = await updateUser(data);
    setIsLoading(false);
    if (isSuccess) {
      toast.success("Cập nhật thành công !");
      setEditing(false);
      if (authUser?.avatar_url) setAvatarPreview(authUser.avatar_url);
    } else {
      toast.error("Cập nhật thất bại !");
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (authUser) {
      reset({
        fullName: authUser.full_name || "",
        phoneNumber: authUser.phone_number || "",
        dateOfBirth: authUser.date_of_birth || "",
        address: authUser.address || "",
        file: null,
      });
      setAvatarPreview(authUser.avatar_url || "");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("file", file ?? null, { shouldValidate: true });
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    } else {
      setAvatarPreview(authUser?.avatar_url || "");
    }
  };

  return (
    <article className="bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hồ sơ cá nhân</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded cursor-pointer"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            <span>Chỉnh sửa</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
              <span>Hủy</span>
            </button>
            <button
              form="user-update-form"
              type="submit"
              disabled={isLoading}
              className="flex items-center bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-1 px-3 rounded cursor-pointer"
            >
              <FontAwesomeIcon icon={faSave} className="mr-1" />
              <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C92127]"></div>
        </div>
      ) : isEditing ? (
        <form
          id="user-update-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-400 text-4xl"
                  />
                </div>
              )}
            </div>

            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm">
              Chọn ảnh đại diện
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.fullName ? "border-red-500 ring-red-200" : ""
                }`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.phoneNumber ? "border-red-500 ring-red-200" : ""
                }`}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.address ? "border-red-500 ring-red-200" : ""
                }`}
                {...register("address")}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className={`w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 ${
                  errors.dateOfBirth ? "border-red-500 ring-red-200" : ""
                }`}
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                value={authUser?.email || ""}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email không thể chỉnh sửa
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 text-sm text-red-500 rounded-md">
            <h3 className="font-semibold">Lưu ý:</h3>
            <ul className="list-disc ml-5 mt-1">
              <li>Bạn phải đủ 18 tuổi để đăng ký.</li>
              <li>Địa chỉ phải có ít nhất 5 ký tự và tối đa 100 ký tự.</li>
              <li>
                Số điện thoại phải bắt đầu bằng 09, 03, 02 hoặc 07 và có 10 số.
              </li>
              <li>
                Họ và tên phải có ít nhất 10 ký tự và chỉ chứa ký tự tiếng Việt
                hợp lệ.
              </li>
            </ul>
          </div>
        </form>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {authUser?.full_name || "Chưa cập nhật"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {authUser?.phone_number || "Chưa cập nhật"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {authUser?.email || "Chưa cập nhật"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {authUser?.date_of_birth
                ? convertDate(authUser.date_of_birth)
                : "Chưa cập nhật"}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <div className="w-full p-2 border rounded bg-gray-50">
              {authUser?.address || "Chưa cập nhật"}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default UserProfile;
