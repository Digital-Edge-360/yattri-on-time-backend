const { Reminder } = require("../models/Reminder.js");
const moment = require("moment");
const cron = require("node-cron");
const schedule = require("node-schedule");
const { getISTTime } = require("../util/helpers.js");

function checkReminders(frequency) {
    return cron.schedule(`*/${frequency} * * * *`, async function () {
        const currTime = getISTTime();
        const nextTime = new Date(
            currTime.getTime() + frequency * 4 * 60 * 60 * 1000
        ); // TODO: set time 1 hour

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
            filteredReminders: filteredReminders.map((rem) => rem.call_times),
            currTime,
            nextTime,
        });
        // todo: schedule calls
        // for (const reminder of filteredReminders) {

        // }

        schedule.scheduleJob("call");
    });
}

module.exports = checkReminders;

function getCronExpression(dateStr) {
    /* take care of the values:
   second: 0-59 same for javascript
   minute: 0-59 same for javascript
   hour: 0-23 same for javascript
   day of month: 1-31 same for javascript
   month: 1-12 (or names) is not the same for javascript 0-11
   day of week: 0-7 (or names, 0 or 7 are sunday) same for javascript
   */
    const date = new Date(dateStr);
    return `${date.getSeconds()} ${
        date.getMinutes() + 1
    } ${date.getHours()} ${date.getDate()} ${
        date.getMonth() + 1
    } ${date.getDay()}`;
}
