import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Props = {
  onSubmit?: (email: string) => void;
};

const NewsletterSignup = ({ onSubmit }: Props) => {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-gray-600 text-white p-4 flex flex-col md:flex-row justify-center items-center gap-5 md:gap-20 mx-auto rounded-lg mt-[50px] container lg:max-w-7xl">
      <div className="flex justify-center items-center gap-3">
        <FontAwesomeIcon icon={faMailBulk} className="text-lg" />
        <div className="text-2xl font-bold">ĐĂNG KÝ NHẬN BẢN TIN</div>
      </div>
      <div className="flex items-center bg-white rounded p-1 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        />
        <button
          onClick={() => onSubmit?.(email)}
          className="bg-orange-500 text-white rounded w-100 h-9 ml-2 flex items-center justify-center cursor-pointer"
        >
          <p className="text-sm font-bold">Đăng ký</p>
        </button>
      </div>
    </div>
  );
};

export default NewsletterSignup;
