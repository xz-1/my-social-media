import User from "../models/User.js";


//Read
export const getUser = async (req, res,) => {
    try {
        const { id } = req.param;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.param;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //format for the FrontEnd
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Update:
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.param;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        //if the friendId(s) is already 'included' in the main 'user's friendId
        //they are needed to be removed
        if (user.friends.includes(friendId)) {
            //https://youtu.be/K8YELRmUb5o?t=4213
            user.friends = user.friends.filter((id) => id !== friendId);
            //this is line make sure that the main user is already in the friend's friends list
            //if so, then the main user's id should also be removed
            //note: because the friends' relationship go both ways
            //so one of them got added/removed, it will affect both sides
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        //formatted:
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //format for the FrontEnd
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}