// import React from 'react'

// const isAuth =async(req,res,next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Unauthorized access" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// }

// export default isAuth