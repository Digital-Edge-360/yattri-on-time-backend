const { Reminder } = require("../models/Reminder.js");
const moment = require("moment");
const cron = require("node-cron");

function checkReminders(frequency) {
    return cron.schedule(`*/${frequency} * * * *`, async function () {
        const currTime = new Date(Date.now());
        const nextTime = new Date(
            currTime.getTime() + frequency * 60 * 60 * 1000
        );

        // const nextSampleTime = new Date(
        //     currTime.getTime() + frequency * 2 * 60 * 60 * 1000
        // );

        const reminders = await Reminder.find({
            call_times: {
                $elemMatch: {
                    $gte: currTime,
                    $lt: nextTime,
                },
            },
        });

        // const callTimes = reminders.map((rem) => rem.call_times);
        const filteredReminders = reminders.reduce((acc, curr) => {
            const hasCallTime = curr.call_times.filter(
                (callTime) => callTime >= currTime && callTime <= nextTime
            );
            if (hasCallTime.length) {
                curr.call_times = hasCallTime;
                acc.push(curr);
            }
            return acc;
        }, []);

        console.log({
            filteredReminders,
        });
        // todo: schedule calls
        // for (const reminder of filteredReminders) {

        // }
    });
}

module.exports = checkReminders;
