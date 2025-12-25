import express from 'express';
import isAuth from '../middlewares/isAuth';
import { createEditShop } from '../controller/shop.controller';
import upload from '../middlewares/multer';



const shopRouter = express.Router();

shopRouter.get('/create-edit',isAuth,upload.single("image"),createEditShop);

export default shopRouter;