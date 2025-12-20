// import jwt from 'jsonwebtoken';



// const genToken = async (userID) => {
//     try {
//         const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
//         return token;
        
//     } catch (error) {
//         console.log(error)
//     }
    
// }

// export default genToken;

import jwt from "jsonwebtoken";

const genToken = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default genToken;
