{\rtf1\ansi\ansicpg1252\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Firebase Configuration\
const firebaseConfig = \{\
  apiKey: "YOUR_API_KEY",\
  authDomain: "YOUR_AUTH_DOMAIN",\
  projectId: "YOUR_PROJECT_ID",\
  storageBucket: "YOUR_STORAGE_BUCKET",\
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",\
  appId: "YOUR_APP_ID"\
\};\
\
// Initialize Firebase\
firebase.initializeApp(firebaseConfig);\
const db = firebase.firestore();\
\
// DOM Elements\
const timerDisplay = document.getElementById("timer");\
const resetButton = document.getElementById("resetButton");\
\
let timerInterval;\
let isRunning = true;\
\
// Fetch initial timer state and start the timer\
async function fetchTimer() \{\
  const timerDoc = await db.collection("timer").doc("globalTimer").get();\
  const data = timerDoc.data();\
  if (data.isRunning) \{\
    startTimer(data.startTimestamp.toDate());\
  \} else \{\
    updateDisplay(0);\
  \}\
\}\
\
// Update the display with the remaining time\
function updateDisplay(timeInMs) \{\
  const days = Math.floor(timeInMs / (1000 * 60 * 60 * 24));\
  const hours = Math.floor((timeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));\
  const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));\
  const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);\
\
  timerDisplay.textContent = `$\{days.toString().padStart(2, "0")\}:$\{hours.toString().padStart(2, "0")\}:$\{minutes.toString().padStart(2, "0")\}:$\{seconds.toString().padStart(2, "0")\}`;\
\}\
\
// Start the timer counting down from the start time\
function startTimer(startTimestamp) \{\
  clearInterval(timerInterval);\
  const startTime = startTimestamp.getTime();\
\
  timerInterval = setInterval(() => \{\
    const currentTime = new Date().getTime();\
    const elapsedTime = currentTime - startTime;\
    updateDisplay(elapsedTime);\
  \}, 1000);\
\}\
\
// Reset timer and update Firebase\
resetButton.addEventListener("click", async () => \{\
  const newStartTimestamp = new Date();\
  await db.collection("timer").doc("globalTimer").set(\{\
    startTimestamp: newStartTimestamp,\
    isRunning: true\
  \});\
  startTimer(newStartTimestamp);\
\});\
\
// Real-time listener for timer updates\
db.collection("timer").doc("globalTimer").onSnapshot((doc) => \{\
  const data = doc.data();\
  if (data.isRunning) \{\
    startTimer(data.startTimestamp.toDate());\
  \} else \{\
    clearInterval(timerInterval);\
    updateDisplay(0);\
  \}\
\});\
\
// Initialize the timer on page load\
fetchTimer();\
}