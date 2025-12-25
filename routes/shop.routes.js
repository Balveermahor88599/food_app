import express from 'express';
import isAuth from '../middlewares/isAuth';
import { createEditShop } from '../controller/shop.controller';



const shopRouter = express.Router();

shopRouter.get('/create-edit',isAuth,createEditShop);

export default shopRouter;