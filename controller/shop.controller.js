import uploadOnCloudinary from "../utils/cloudinary";

export const createEditShop = async (req, res) => { 
    try {
        const{ name, city, state, address } = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }
        let show=await Shop.findOne({owner:req.user._id});
        if(!shop){
            shop = await Shop.create({
            name,
            city,
            state,
            address,
            ImageUrl: image,
            owner: req.user._id
        });
        }else{ 
            shop = await Shop.findByIdAndUpdate(shop._id, {
            name,
            city,
            state,
            address,
            ImageUrl: image,
            owner: req.user._id},
            { new: true });
            }
       
        await shop.populate('owner');
        res.status(201).json({ message: "Shop created successfully" , shop: newShop });
     
    } catch (error) {
        res.status(500).json({ message: "Error creating/updating shop", error });
    }
}


export const getShopById = async (req, res) => { 
    try {
        const shopId = req.params.id;
        // Logic to get a shop by ID
        res.status(200).json({ shop: { id: shopId } });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shop", error });
    }
};

export const updateShop = async (req, res) => { 
    try {
        const shopId = req.params.id;
        // Logic to update a shop by ID
        res.status(200).json({ message: "Shop updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating shop", error });
    }
};

export const deleteShop = async (req, res) => { 
    try {
        const shopId = req.params.id;
        // Logic to delete a shop by ID
        res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shop", error });
    }
};  