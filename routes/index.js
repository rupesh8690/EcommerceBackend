const express = require("express");

const router = express.Router();

const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require("../controller/user/userSignIn");
const userForgotPasswordController = require("../controller/user/userForgotPassword");
const userDetailsController = require("../controller/user/userDetails");
const authToken = require("../middleware/authToken");
const userLogout = require("../controller/user/userLogout");
const allUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const UploadProductController = require("../controller/product/uploadProduct");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetails = require("../controller/product/getProductDetails");
const addToCartController = require("../controller/user/addToCartController");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const addToCartViewProduct = require("../controller/user/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");
const deleteProductController = require("../controller/product/deleteProduct");
const userPassowordResetController = require("../controller/user/userPassowordReset");
const AllOrders = require("../controller/order/allOrder");
const reviewProduct= require("../controller/product/reviewProduct");
const {
  paymentController,
  checkoutSuccess,
} = require("../controller/payment/paymentController");
const userCartDelete = require("../controller/user/userCartDelete");
const updateUserProfile = require("../controller/user/userUpdateProfile");
const getUserPurchaseHistory = require("../controller/user/userPurchaseHistory");
const {
  getAnalyticsData,
  getDailySalesData,
} = require("../controller/product/totalSales");

const getReview = require("../controller/review/getReview");

router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);
router.post("/forgot-password", userForgotPasswordController);
router.post("/reset-password", userPassowordResetController);

//admin panel
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);

//product
router.post("/upload-product", authToken, UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.delete("/delete-product", authToken, deleteProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);

//all orders
router.get("/all-orders", authToken, AllOrders);

//user add to cart
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

//users payment
router.post("/create-checkout-session", authToken, paymentController);
router.post("/checkout-success", authToken, checkoutSuccess);
router.post("/delete-cart-after-purchase", authToken, userCartDelete); //delte cart after payment success
router.get("/user-purchase-history", authToken, getUserPurchaseHistory);

//users profile update
router.put("/update-user-profile", authToken, updateUserProfile);

//sales analytics
router.get("/sales-analytics", authToken, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const fs = require("fs");
const allOrders = require("../controller/order/allOrder");
const updateOrderStatus = require("../controller/order/updateOrderStatus");

//recommended products route(frequently bought together) can be added later
router.get("/frequently-bought-together/:productId", (req, res) => {
  const productId = req.params.productId;
  const data = JSON.parse(fs.readFileSync("./ml/recommendations.json", "utf-8"));
  const result = data.filter((r) => r.base === productId);
  res.json(result);
});

//update order status route
router.post("/change-order-status", authToken, updateOrderStatus);


//review
router.post("/add-review", authToken, reviewProduct);
router.get("/get-review/:id", getReview);

module.exports = router;
