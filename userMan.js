const users = [];

function addUser({ id, name }) {
  const user = { id, name };
  users.push(user);
  return { user };
};

// remove user by their socket ID.
// declare a new index number that will contain a number
// from user, that is found inside of users array by matching
// their id with existing ids inside it.
// check for found index number is not below zero, then
// remove 1 entry based on index number inside the array.
// had no idea what [0] is, they say it's for:
// normalize the array to prevent null cluster.
function removeUser(id) {
  const indexNo = users.findIndex((user) =>
  user.id === id);

  if (indexNo !== -1) {
    return users.splice(indexNo, 1)[0];
  }
};

module.exports = { addUser, removeUser };
