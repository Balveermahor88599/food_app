

const shopSchema=new mongoose.Schema({
    name:{type:String,required:true},
    ImageUrl:{type:String,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    address:{type:String,required:true},
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'Item'}],
    city:{type:String,required:true}
    
},{timestamps:true});

const Shop=mongoose.model('Shop',shopSchema);


export default Shop;    