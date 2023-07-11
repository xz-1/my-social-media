import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    try {
        //Front end setting this
        //Back end just grasping it (here)
        //it is kinda like key
        let token = req.header("Authorization");
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        //if token is exist
        //token will be started with "Bearer " (that will be set in the front end)
        if (token.startsWith("Bearer ")) {
            //this is just like Java subString method
            //in this case, it ignored 'Bearer ' and trim it off and grasp the actual token
            token = token.slice(7, token.length).trimLeft();
        }

        //and verify it here with the JWT_SECRET in .env file
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        //this is so that middleware can process to the next step of the function
        //good explaination for this next(): https://youtu.be/K8YELRmUb5o?t=3474
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}