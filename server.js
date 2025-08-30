// server.js
import express from "express";
import cors from "cors";
import cron from "node-cron";
import webpush from "web-push";

const app = express();
app.use(cors());
app.use(express.json());

// Your timetable data
const timetable = {
  "Monday": [
    ["08:00", "09:00", "SE&PM"],
    ["09:00", "10:00", "Library"],
    ["10:00", "10:30", "Break"],
    ["10:30", "11:30", "RM&IPR"],
    ["11:30", "12:30", "CV"],
    ["12:30", "13:30", "Lunch"],
    ["13:30", "14:30", "Mentoring"],
    ["14:30", "15:30", "NSS"]
  ],
  "Tuesday": [
    ["08:00", "09:00", "RM&IPR"],
    ["09:00", "10:00", "TC"],
    ["10:00", "10:30", "Break"],
    ["10:30", "12:30", "CN Lab"],
    ["12:30", "13:30", "Lunch"],
    ["13:30", "14:30", "NSS"],
    ["14:30", "16:30", "Mini Project"]
  ],
  "Wednesday": [
    ["08:00", "09:00", "CN"],
    ["09:00", "10:00", "EVS"],
    ["10:00", "10:30", "Break"],
    ["10:30", "11:30", "SE&PM"],
    ["11:30", "12:30", "TC"],
    ["12:30", "13:30", "Lunch"],
    ["13:30", "14:30", "Remedial"],
    ["14:30", "16:30", "Mini Project"]
  ],
  "Thursday": [
    ["08:00", "09:00", "RM&IPR"],
    ["09:00", "10:00", "CV"],
    ["10:00", "10:30", "Break"],
    ["10:30", "11:30", "CN"],
    ["11:30", "12:30", "SE&PM"],
    ["12:30", "13:30", "Lunch"],
    ["13:30", "14:30", "TC"]
  ],
  "Friday": [
    ["08:00", "09:00", "TC"],
    ["09:00", "10:00", "CN"],
    ["10:00", "10:30", "Break"],
    ["10:30", "11:30", "SE&PM"],
    ["11:30", "12:30", "CV"],
    ["12:30", "13:30", "Lunch"],
    ["13:30", "15:30", "Forum Activity"]
  ],
  "Saturday": [
    ["08:00", "10:00", "DV Lab"],
    ["10:00", "10:30", "Break"],
    ["10:30", "11:30", "RM&IPR"],
    ["11:30", "12:30", "TC"],
    ["12:30", "13:30", "Lunch"]
  ]
};

// --- API to get timetable ---
app.get("/timetable", (req, res) => {
  res.json(timetable);
});

// --- Push Notifications Setup ---
const publicVapidKey = "YOUR_PUBLIC_KEY";
const privateVapidKey = "YOUR_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:your@email.com",
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

// Endpoint to save subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// --- Notification Scheduler ---
// Every minute check if class is starting in 10 min
cron.schedule("* * * * *", () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const time = now.toTimeString().slice(0, 5);

  if (timetable[day]) {
    timetable[day].forEach(([start, , subject]) => {
      const [h, m] = start.split(":");
      const classTime = new Date(now);
      classTime.setHours(h, m, 0, 0);

      const diff = (classTime - now) / 60000; // minutes

      if (diff === 10) {
        // Send push notification
        subscriptions.forEach(sub =>
          webpush.sendNotification(
            sub,
            JSON.stringify({
              title: "Class Reminder",
              body: `Your ${subject} class starts at ${start}`
            })
          )
        );
      }
    });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
