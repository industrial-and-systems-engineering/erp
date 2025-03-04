const express = require("express");
const router = express.Router();
const passport = require("passport");
const { srfForms, Product } = require("../models/db");
//const { isLoggedIn } = require('../middleware');

function preprocessing(products) {
  for (let i = 0; i < products.length; i++) {
    products[i].tolerance = parseFloat(products[i].parameter) * 0.05;
  }
  return products;
}

router.post("/", async (req, res) => {
  try {
    let { form, products } = req.body;
    console.log("Received form data:", req.body);
    
    if (!form || !products) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    
    const userId = req.user.id;
    const userNumber = req.user.userNumber;
    const urlno = `CC373125${userNumber}F`;
    const newForm = new srfForms({
      ...form,
      user: userId,
      products: [], // We'll add product IDs later
      URL_NO: urlno,
    });
    
    // Save the products one by one to ensure the pre-save hook runs
    const productIds = [];
    for (const productData of products) {
      // Make sure the user field is set properly
      const product = new Product({
        ...productData,
        user: userId,
      });
      
      try {
        const savedProduct = await product.save();
        productIds.push(savedProduct._id);
      } catch (productError) {
        console.error("Error saving product:", productError);
        return res.status(400).json({ 
          success: false, 
          error: `Error saving product: ${productError.message}` 
        });
      }
    }
    newForm.products = productIds;
    await newForm.save();
    
    return res
      .status(201)
      .json({ success: true, data: newForm, redirectURL: "/user" });
  } catch (error) {
    console.error("Error saving form data:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const userId = req.user.id;
    const completedForms = await srfForms
      .find({
        user: userId,
        requestStatus: true,
      })
      .populate("products");

    return res.status(200).json({ success: true, data: completedForms });
  } catch (error) {
    console.error("Error fetching completed error forms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const userId = req.user.id;
    const pendingForms = await srfForms
      .find({
        user: userId,
        requestStatus: false,
      })
      .populate("products");

    return res.status(200).json({ success: true, data: pendingForms });
  } catch (error) {
    console.error("Error fetching pending error forms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// router.get("/calibrated", async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const errorForms = await srfForms.find({ user: userId }).populate(
//       "products"
//     );

//     const calibratedForms = errorForms
//       .map((form) => ({
//         ...form.toObject(),
//         products: form.products.filter((product) => product.isCalibrated),
//       }))
//       .filter((form) => form.products.length > 0);

//     res.status(200).json(calibratedForms);
//   } catch (error) {
//     console.error("Error fetching calibrated error forms:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get("/calibrated/pending", async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const errorForms = await srfForms.find({ user: userId }).populate(
//       "products"
//     );

//     const pendingForms = errorForms
//       .map((form) => ({
//         ...form.toObject(),
//         products: form.products.filter((product) => !product.isCalibrated),
//       }))
//       .filter((form) => form.products.length > 0);

//     res.status(200).json(pendingForms);
//   } catch (error) {
//     console.error("Error fetching calibrated error forms:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.put("/technician/updateEquipment/:id", async (req, res) => {
//   const { id } = req.params;
//   const { isCalibrated } = req.body;

//   if (typeof isCalibrated === "undefined") {
//     return res
//       .status(400)
//       .json({ success: false, message: "isCalibrated field is required" });
//   }

//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { isCalibrated }, // Allow true/false values
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     res.status(200).json({ success: true, data: updatedProduct });
//   } catch (error) {
//     console.error("Error updating product:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

module.exports = router;
