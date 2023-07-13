import Post from "../models/Post.js"



//create:
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            //this is the picture path for user profile
            userPicturePath: user.picturePath,
            //this is the picture path for post
            picturePath,
            //{} mean empty Object because it starts with zero likes
            likes: {},
            //[] empty Array/Object ?
            //https://youtu.be/K8YELRmUb5o?t=5218
            comments: []
            //good comment on real world practice on API handling
            //https://youtu.be/K8YELRmUb5o?t=5308
        });
        //This to save into MongoDB
        await newPost.save();

        //Grasping the all the posts because there Post.find() seems to returns a big results
        //because there is no Id or any value to pass in as it query: it kinda like 'select *'
        const post = await Post.find();
        res.status(201).json(post);


    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

//Read:

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Update:
export const likePost = async (req, res) => {
    try {
        //grasping relevant post
        //Note: 'id' comes from QUERY STRING
        const { id } = req.params;
        //grasping User from req.body because that how the FrontEnd will be sending it
        //again, it is API practice thing
        //https://youtu.be/K8YELRmUb5o?t=5496
        //Note: 'userId' comes from Request'Body
        const { userId } = req.body;

        const post = await Post.findById(id);
        //check in the 'like': if the userId exist: if it exist that means the post is 'liked'
        //https://youtu.be/K8YELRmUb5o?t=5540
        const isLiked = post.likes.get(userId);

        //Delete the 'userId' if it is already exist; otherwise, set it in if it does not
        //https://youtu.be/K8YELRmUb5o?t=5569
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.like.set(userId, true);
        }

        //this is where Post is query and updated
        //to update the FrontEnd everytime when the 'like button' is hit
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            //new list of likes that is just motified
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}