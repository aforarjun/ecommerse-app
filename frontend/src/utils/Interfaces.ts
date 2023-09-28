export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  addresses: {
    country: string;
    city: string;
    address1: string;
    address2: string;
    zipCode: number;
    addressType: string;
  }[];
  role: string;
  avatar: string;
  createdAt: Date;
  verifyToken: string;
  verifyTokenExpiry: Date;
  resetPasswordToken: string;
  resetPasswordExpiry: Date;
}

export interface Seller {
  _id: string;
  name: string;
  shopName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: {
    country: {
      index: string;
      value: string;
    };
    city: {
      index: string;
      value: string;
    };
    address1: string;
    address2: string;
    zipCode: number;
  };
  role: string;
  avatar: string;
  description: string;

  withdrawMethod: {
    bankName: any;
    bankAccountNumber: any;
  };
  availableBalance: any;

  createdAt: Date;

  verifyToken: string;
  verifyTokenExpiry: Date;
  resetPasswordToken: string;
  resetPasswordExpiry: Date;
}

export interface Product {
  _id: String;
  name: String;
  description: String;
  images: {
    url: String;
  }[];
  category: {
    index: Number;
    value: String;
  };
  tags: String;
  originalPrice: Number;
  discountPrice: Number;
  stock: Number;
  sellerId: String;
  seller: Seller;
  sold_out: Number;
  createdAt: Date;
  reviews: {
    user: User;
    rating: Number;
    comment: String;
    productId: String;
    createdAt: Date;
  }[];
  ratings: Number;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: {
    index: number;
    value: string;
  };
  tags: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  sellerId: string;
  seller: Seller;
  sold_out: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface Cart {
  cartItem: Product;
  qty: number;
}
