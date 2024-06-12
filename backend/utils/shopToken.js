// create token and saving that in cookies
const sendShopToken = (seller, res, statusCode) => {
  const token = seller.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/"
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller,
    seller_token: token,
  });
};

export default sendShopToken;
