import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Thuan",
      email: "admin@email.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
    {
      name: "John",
      email: "user@email.com",
      password: bcrypt.hashSync("12345", 8),
      isAdmin: false,
    },
  ],
};

export default data;