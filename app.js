// URL of your backend (replace when deployed)
const backendUrl = "https://my-ej63.onrender.com";// URL of your backend (replace when deployed)

// Load timetable
fetch(`${backendUrl}/timetable`)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("timetable");
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    if (data[today]) {
      data[today].forEach(([start, end, subject]) => {
        const li = document.createElement("li");
        li.textContent = `${start} - ${end}: ${subject}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No classes today 🎉</li>";
    }
  });

// Service Worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}

// Push notification subscription
document.getElementById("enable-notifications").addEventListener("click", async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>"
  });

  // Send subscription to backend
  await fetch(`${backendUrl}/subscribe`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" }
  });

  alert("✅ Notifications enabled!");
});

// Load timetable
fetch(`${backendUrl}/timetable`)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("timetable");
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    if (data[today]) {
      data[today].forEach(([start, end, subject]) => {
        const li = document.createElement("li");
        li.textContent = `${start} - ${end}: ${subject}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No classes today 🎉</li>";
    }
  });

// Service Worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}

// Push notification subscription
document.getElementById("enable-notifications").addEventListener("click", async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>"
  });

  // Send subscription to backend
  await fetch(`${backendUrl}/subscribe`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" }
  });

  alert("✅ Notifications enabled!");
});

