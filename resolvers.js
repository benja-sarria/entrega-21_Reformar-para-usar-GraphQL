const { uuid } = require("uuid");
const UsersDao = require("./models/daos/Users.dao");

const getUser = async ({ id }) => {
    const userInstance = new UsersDao();
    const selectedUser = await userInstance.getById(id);
    if (!selectedUser) {
        throw new Error("User not found");
    }
    return selectedUser;
};

const createUser = async ({ data }) => {
    const userInstance = new UsersDao();
    const createdUser = await userInstance.createItem(data);
    return createdUser;
};

const updateUser = async ({ id, data }) => {
    const userInstance = new UsersDao();
    const selectedUser = await userInstance.getById(id);
    if (!selectedUser) {
        throw new Error("User not found");
    }
    const updatedUser = await userInstance.updateUser(id, data);
    return updatedUser;
};

const deleteUser = async ({ id }) => {
    const userInstance = new UsersDao();
    const selectedUser = await userInstance.getById(id);
    if (!selectedUser) {
        throw new Error("User not found");
    }
    const deletedUser = selectedUser;
    const success = await userInstance.deleteUser(id);
    if (success.acknowledged) {
        return deletedUser;
    } else {
        return {
            error: "User couldn't be eliminated",
        };
    }
};

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
