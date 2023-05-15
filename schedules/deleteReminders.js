const { Reminder } = require("../models/Reminder.js");
const cron = require("node-cron");
const { remindUser } = require("../services/twilio.service.js");

function deleteReminders(frequency) {
    return cron.schedule(`*/${frequency} * * * *`, async function () {
        const currTime = new Date(Date.now());
        const nextTime = new Date(
            currTime.getTime() + frequency * 5 * 1000
        ); 

        const deleteReminders = await Reminder.deleteMany({
            call_times: {
                $elemMatch: {
                    $lt: currTime,
                },
            },
        })
        console.log({ deleteReminders });
        
    });
}

module.exports = deleteReminders;

