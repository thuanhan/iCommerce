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
  products: [
    {
      name: "Nike Slim Shirt",
      category: "Shirts",
      image: "/images/p1.jpg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "high quality product",
    },
    {
      name: "Adidas Fit Shirt",
      category: "Shirts",
      image: "/images/p2.jpg",
      price: 100,
      countInStock: 20,
      brand: "Adidas",
      rating: 4.0,
      numReviews: 10,
      description: "high quality product",
    },
    {
      name: "Lacoste Free Shirt",
      category: "Shirts",
      image: "/images/p3.jpg",
      price: 220,
      countInStock: 0,
      brand: "Lacoste",
      rating: 4.8,
      numReviews: 17,
      description: "high quality product",
    },
  ],
};

export default data;
