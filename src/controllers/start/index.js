import { Scenes } from "telegraf"
import { startKeyboard } from "./keyboards.js"
import User from "../../models/user.js";
const startScene = new Scenes.BaseScene('start-scene')

startScene.enter(async (ctx) => {
    try {
        await User.findOneAndUpdate(
            { user_id: ctx.getUserId() },
            {
                $setOnInsert: {
                    user_id: ctx.getUserId(),
                    to_watch: []
                }
            },
            { new: true, upsert: true }
        );
        await ctx.reply('Привет!', startKeyboard)
    } catch (error) { console.log(error); }
})

export default startScene
