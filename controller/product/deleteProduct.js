const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')
async function deleteProductController(req,res){
    try{    
        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

      const deleteProduct = await productModel.findByIdAndDelete(req.body.productId);

        
        res.json({
            message : "Product delete successfully",
            data : deleteProduct,
            success : true,
            error : false
        })
    }
    catch(error){
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
module.exports = deleteProductController;
