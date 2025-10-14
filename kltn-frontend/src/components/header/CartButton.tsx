import React from "react";

interface CartButtonProps {
  count: number;
}

const CartButton: React.FC<CartButtonProps> = ({ count }) => {
  return (
    <div className="flex flex-col cursor-pointer justify-center items-center group relative">
      <a href={'/cart'} className='flex items-center justify-center flex-col'>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect className="fill-none" width="24" height="24" />
            <circle className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" cx="2.098" cy="2.098" r="2.098" transform="translate(4.189 17.047)" />
            <circle className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" cx="2.098" cy="2.098" r="2.098" transform="translate(14.961 17.047)" />
            <path className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M17.018,17.019H6V3H4" transform="translate(-0.006 0.004)" />
            <path className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M6,5,20.019,6l-1,7.01H6" transform="translate(-0.011 -0.003)" />
          </svg>
          {count > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#C92127] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {count}
            </div>
          )}
        </div>
        <span className="text-[12px] text-white md:text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F] hidden md:block">Giỏ hàng</span>
      </a>
    </div>
  );
};

export default CartButton;
