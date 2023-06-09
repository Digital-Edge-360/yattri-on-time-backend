const { Reminder } = require("../models/Reminder.js");
const moment = require("moment");
const cron = require("node-cron");
const schedule = require("node-schedule");
const { getISTTime } = require("../util/helpers.js");
const { remindUser } = require("../services/twilio.service.js");

// function checkReminders(frequency) {
//     return cron.schedule(`*/${frequency} * * * *`, async function () {
//         const currTime = new Date(Date.now());
//         const nextTime = new Date(
//             currTime.getTime() + frequency * 5 * 1000
//         ); 

//         const reminders = await Reminder.find({
//         }).populate("user_id", "name phone");
//         console.log({ reminders });
//         const filteredReminders = reminders.reduce((acc, curr) => {
//             const hasCallTime = curr.call_times.filter(
//                 (callTime) => callTime >= currTime && callTime < nextTime
//             );
//             if (hasCallTime.length) {
//                 curr.call_times = hasCallTime;
//                 acc.push(curr);
//             }
//             return acc;
//         }, []);
//         console.log({ filteredReminders });
//         if (!reminders.length) return;
//         for (const reminder of filteredReminders) {
//             const reminderCallTimes = reminder.call_times;
//             console.log(reminderCallTimes);
//             for (const callTime of reminderCallTimes) {
//                 const callTimeDate = new Date(callTime);
//                 const timeDiff = callTimeDate.getTime() - currTime.getTime();
//                 const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//                 const minutes = Math.floor(timeDiff / (1000 * 60)) - hours * 60;
//                 const messageToSay = `Hello ${reminder.user_id.name}, you have booked a ${reminder.category} from ${reminder.source} to ${reminder.destination} after ${hours} hours and ${minutes} minutes.Your ${reminder.category} number is ${reminder.number} The message you wanted is: ${reminder.message}`;
//                 setTimeout(async () => {
//                     // todo: make Calls
//                     const status = await remindUser({
//                         to: reminder.user_id.phone,
//                         message: messageToSay,
//                     });                    
//                     console.log({
//                         callStatus: status,
//                     });
            
//                 }, timeDiff);
               
//             }
//         }
//     });
// }

async function filterTimes(arr, currTime, nextTime) {
    try {
      let filteredArray = await arr.filter((elem) => {
        let reminderTime = Math.floor(new Date(elem.call_time).getTime()/1000);
        console.log("remi", reminderTime);
        let curr = Math.floor(new Date(currTime).getTime()/1000);
        let next = Math.floor(new Date(nextTime).getTime()/1000);
        console.log({curr , next});
        if (reminderTime >= curr && reminderTime <= next) {
          return true;
        }
        return false;
      });
  
      console.log({ filteredArray });
      return filteredArray;
    } catch (error) {
      console.log("error", error);
    }
  }
  

function checkReminders(frequency) {
    try{
    return cron.schedule(`*/${frequency} * * * *`, async function () {
        const currTime = new Date(Date.now());
        const nextTime = new Date(
            currTime.getTime() + frequency * 5 * 1000
        ); 
        console.log({currTime, nextTime});
        let reminders = await Reminder.find({
        }).populate("user_id", "name phone");
        reminders= await filterTimes(reminders, currTime, nextTime);
        console.log( "reminders", reminders );
        // const filteredReminders = reminders.reduce((acc, curr) => {
        //     const hasCallTime = curr.call_times.filter(
        //         (callTime) => callTime >= currTime && callTime < nextTime
        //     );
        //     if (hasCallTime.length) {
        //         curr.call_times = hasCallTime;
        //         acc.push(curr);
        //     }
        //     return acc;
        // }, []);
        // console.log({ filteredReminders });
        // if (!reminders.length) return;
        for (const reminder of reminders) {
            const reminderCallTimes = reminder.call_times;
            let date_time=new Date(reminder.date_time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            console.log("check", date_time.split(','));
            let hour =date_time.split(',')[1].split(':')[0];
            console.log({hour});
            console.log({date_time});
            console.log({reminderCallTimes});
            for (const callTime of reminderCallTimes) {
                console.log("kkkk");
                const callTimeDate = new Date(callTime);
                const timeDiff = callTimeDate.getTime() - currTime.getTime();
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor(timeDiff / (1000 * 60)) - hours * 60;
                // const messageToSay = `Hello ${reminder.user_id.name}, you have booked a ${reminder.category} from ${reminder.source} to ${reminder.destination} at ${date_time.split(',')[1].split(':')[0]} hours and ${date_time.split(',')[1].split(':')[1]} minutes. Your ${reminder.category} number is ${reminder.number} The message you wanted is: ${reminder.message}`;
                const messageToSay = `Hello ${reminder.user_id.name}, you have booked a ${reminder.category} from ${reminder.source} to ${reminder.destination} at ${date_time.split(", ")[1].replaceAll(":"," ")}. Your ${reminder.category} number is ${reminder.number}. The message you wanted is: ${reminder.message}`
                setTimeout(async () => {
                    // todo: make Calls
                    const status = await remindUser({
                        to: reminder.user_id.phone,
                        message: messageToSay,
                    });                    
                    console.log({
                        callStatus: status,
                    });
            
                }, timeDiff);
               
            }
            setTimeout(async () => {
                
                await Reminder.findByIdAndDelete(reminder._id);
            }, 1000*60*60*2);
        }
    });
}catch(error){
    console.log("error", error);
}
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
