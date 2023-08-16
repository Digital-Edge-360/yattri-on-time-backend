const path = require("path");
const fs = require("fs/promises");

const { User } = require("../../models/User");
const { Reminder } = require("../../models/Reminder");

const sendReminder = async (req, res) => {

    try {
        const { remainderId } = req.body;

        let remainder = await Reminder.findOne({ _id: remainderId });
        console.log(remainder);
        //Checking if the remainder exists
        if (!remainder)
            return res.status(404).json({ message: "No Remider Found!" });

        //If the reminder exists then finding  the user existance
        let user = await User.findById(remainder.user_id);

        //Checking if the user exists
        if (!user) return res.status(404).json({ message: "No User Found!" });

        //if user reminder is less than 0 then don't send remainder
        if (user.reminder <= 0)
            return res
                .status(404)
                .json({ message: "Don't have enough reminders left" });
        // else
        else {
            user.reminder = user.reminder - 1;
            user.save();
            return res
                .status(200)
                .json({ message: "Reminded!", data: user.reminder });
        }
    } catch (error) {
        res.status(500)
            .header({ "Content-Type": "text/xml" })
            .send(error.message);
    }
};



const SendVoice = async (req, res) => {
  const voiceFile = req.params.id;
  const fPath = path.join(process.cwd(), "data", "voices", voiceFile);
  const fContent = await fs.readFile(fPath, "utf8");
  await fs.unlink(fPath);
  res.status(200).header({ "Content-Type": "text/xml" }).send(fContent);

};

module.exports = { SendVoice, sendReminder };
