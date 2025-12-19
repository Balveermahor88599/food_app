import jwt from 'jsonwebtoken';



const genToken = async (userID) => {
    try {
        const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;
        
    } catch (error) {
        console.log(error)
    }
    
}

export default genToken;