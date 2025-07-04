import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjectMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(cors())
app.use(clerkMiddleware());
app.use(express.json());
app.use(arcjectMiddleware);


app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);


app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message: "Internal server error"});
})

const startServer = async () => {
    try {
        await connectDB();
        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT, () => {
                console.log("Server is running on port",ENV.PORT);
            });
        }

    } catch (error) {
        console.log("Error starting server",error);
        process.exit(1);
    }
}



startServer();



// export for vercel
export default app;


