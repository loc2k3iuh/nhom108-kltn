import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface ProductCategoriesProps {
  handleClose: () => void;
  isOpen: boolean;
}

const categories = [
  { title: "Thời trang nam", subCategories: ["T-shirt", "Polo", "Shirt", "Quần"] },
  { title: "Thời trang nữ", subCategories: ["T-shirt", "Polo", "Shirt", "Quần"] },
  { title: "Phụ kiện thể thao", subCategories: ["Túi thể thao", "Băng đô", "Băng cổ tay", "Mũ thể thao"] },
  { title: "Giày thể thao", subCategories: ["Giày chạy bộ", "Giày tập gym", "Giày tennis", "Giày cầu lông"] },
  { title: "Dụng cụ thể thao", subCategories: ["Vợt tennis", "Vợt cầu lông", "Bóng tennis", "Bóng đá"] },
  { title: "Đồ tập gym", subCategories: ["Găng tay tập gym", "Dây kháng lực", "Bình nước", "Thảm tập yoga"] },
  { title: "Đồ bơi", subCategories: ["Đồ bơi nam", "Đồ bơi nữ", "Kính bơi", "Mũ bơi"] },
  { title: "Dinh dưỡng thể thao", subCategories: ["Protein", "BCAA", "Pre-workout", "Vitamin & khoáng chất"] },
];

const ProductCategories: React.FC<ProductCategoriesProps> = ({ handleClose, isOpen }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`, { state: { categories } });
    handleClose();
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => handleClose(), 300);
  };
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  };

  useEffect(() => () => { if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current); }, []);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="border border-gray-200 p-3 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{category.title}</h3>
            <ul className="space-y-1">
              {category.subCategories.map((sub, subIndex) => (
                <li
                  key={subIndex}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick(sub); }}
                  className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
                >
                  {sub}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
