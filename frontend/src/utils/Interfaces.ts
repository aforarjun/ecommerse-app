export interface User {
  name: String;
  email: String;
  password: String;
  phoneNumber: Number;
  addresses: {
    country: String;
    city: String;
    address1: String;
    address2: String;
    zipCode: Number;
    addressType: String;
  }[];
  role: String;
  avatar: {
    public_id: String;
    url: String;
  };
  createdAt: Date;
  verifyToken: String;
  verifyTokenExpiry: Date;
  resetPasswordToken: String;
  resetPasswordExpiry: Date;
}
