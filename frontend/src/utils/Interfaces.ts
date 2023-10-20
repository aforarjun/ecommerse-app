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
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: {
    index: string;
    value: string;
  };
  tags: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  sellerId: string;
  seller: Seller;
  sold_out: number;
  createdAt: Date;
  reviews: {
    user: User;
    rating: number;
    comment: string;
    productId: string;
    createdAt: Date;
  }[];
  ratings: number;
}

export interface Event extends Product {
  startDate: Date;
  endDate: Date;
}

export interface Cart {
  cartItem: Product;
  qty: number;
}

export interface Order {
  _id: string;
  cart: Cart[];
  shippingAddress: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      country: string;
      city: string;
      address1: string;
      address2: string;
      zipCode: number;
      addressType: string;
    };
  };
  totalPrice: number;
  user: User;
  status: string;
  paymentInfo: {
    id: string;
    status: string;
    type: string;
  };
  paidAt: Date;
  createdAt: Date;
}
