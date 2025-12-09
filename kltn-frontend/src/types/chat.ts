export interface Product {
  id: number;
  name: string;
  primaryImageUrl: string; // Changed from 'thumbnail' to match API response
  basePrice: number;
  discountedPrice: number;
}

export interface ChatResponse {
  responseMessage: string;
  products: {
    content: Product[];
  } | null;
  filterPayload: any | null; 
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  products?: Product[];
}
