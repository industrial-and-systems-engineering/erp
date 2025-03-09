const express = require("express");
const router = express.Router();
const passport = require("passport");
const { srfForms, Product } = require("../models/db");
const  {isLoggedIn} = require('../middleware1');

function preprocessing(products) {
  for (let i = 0; i < products.length; i++) {
    products[i].tolerance = parseFloat(products[i].parameter) * 0.05;
  }
  return products;
}

router.post("/", isLoggedIn, async (req, res) => {
  try {
    let { form, products } = req.body;
    if (!form || !products) {return res.status(400).json({ success: false, message: "All fields are required" }) ;}
    const userId = req.user.id;
    const newForm = new srfForms({
      ...form,
      user: userId,
      products: [],
      URL_NO: 'hello',
    });
    const savedForm = await newForm.save();
    if (savedForm.formNumber) {
      savedForm.URL_NO = `CC373125${savedForm.formNumber}`;
      await savedForm.save();
    }
    const productIds = [];
    for (const productData of products) {
      const product = new Product({
        ...productData,
        user: userId,
        form: savedForm._id,
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
    savedForm.products = productIds;
    await savedForm.save();
    
    return res
      .status(201)
      .json({ success: true, data: savedForm, redirectURL: "/user" });
  } catch (error) {
    console.error("Error saving form data:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});
router.get("/completed", async (req, res) => {
  try {
    const userId = req.user._id;
    const PartiallyCompletedForms = await srfForms
    .find({ user: userId,requestStatus: false })
    .populate({
      path: "products",
      match: { isCalibrated: true }
    });
  const completedForms = await srfForms
    .find({  user: userId,requestStatus: true })
    .populate("products");

  const forms = [...PartiallyCompletedForms, ...completedForms];

    return res.status(200).json({ success: true, data: forms});
  } catch (error) {
    console.error("Error fetching completed error forms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/pending", async (req, res) => { 
  try { 
    const userId = req.user._id;
    const pendingForms = await srfForms
      .find({ 
        user: userId, 
        requestStatus: false, 
      })
      .populate({
        path: "products",
        match: { isCalibrated: false }
      }); 
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
