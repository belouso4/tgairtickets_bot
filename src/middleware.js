import { LIST_OF_ADMINS } from "./utils/consts.js"

export const adminMiddleware = (ctx, next) => {
    return LIST_OF_ADMINS.includes(ctx.getUserId(ctx)) ? next() : false
}