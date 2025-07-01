import { aj } from "../config/arcjet.js";


export const arcjectMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });


        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({error: 'Too many requests', message: 'You have made too many requests. Please try again later.'});
            }else if (decision.reason.isBot()) {
                return res.status(403).json({error: 'Bot detected', message: 'Automated requests are not allowed.'});
            }else{
                return res.status(403).json({error: 'Access denied', message: 'Access denied by secret policy.'});
            }
        }


        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({error: 'Spoofed bot detected', message: 'Malicious bot activity detected.'});
        }

        next();


    } catch (error) {
        console.log("Error in arcjet middleware", error);
        next();
    }
}