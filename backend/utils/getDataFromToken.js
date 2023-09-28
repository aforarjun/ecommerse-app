import jwt from "jsonwebtoken";

export const getDataFromToken = async (request, token_name) => {
  try {
    const token = request.cookies.get(`${token_name}`)?.value || "";

    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    return decodedToken.id;
  } catch (error) {
    throw new Error(error.message);
  }
};
