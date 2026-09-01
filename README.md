# SmritiNER: AI-Based Cognitive Gaming & Memory Assistance Platform

![SmritiNER Banner](https://img.shields.io/badge/Status-Complete-brightgreen) ![React](https://img.shields.io/badge/Framework-React_19-blue) ![Vite](https://img.shields.io/badge/Build-Vite-purple) ![License](https://img.shields.io/badge/License-MIT-orange)

**Project for the Ministry of Development of North Eastern Region (MDoNER)**
**Problem Statement ID:** 26003

SmritiNER is an accessible, AI-powered cognitive gaming and memory assistance platform developed explicitly for elderly dementia patients in the North Eastern Region (NER) of India. The platform bridges the gap in specialized neurological care by offering engaging, culturally resonant, and highly accessible digital therapy for patients, alongside robust clinical monitoring for caregivers.

---

## 🎯 Direct Alignment with MDoNER Requirements (ID 26003)

This section maps our platform's capabilities directly to the expected solution outlined in the hackathon problem statement.

### a. Interactive Cognitive Games & Activities
SmritiNER features a comprehensive suite of adaptive modules:
*   **🧠 Memory Improvement:** *Smriti Matching Cards* (Game 1) - Enhances spatial and visual memory using traditional NER cultural heritage items.
*   **🎯 Attention & Concentration:** *Dhyana Focus & Spot* (Game 3) - Improves concentration spans by having users identify specific regional items in complex visual fields.
*   **🌅 Daily Routine Recall:** *Niyama Daily Routine* (Game 2) - Strengthens executive function by allowing patients to order everyday morning and evening tasks.
*   **🗝️ Pattern Recognition (Emotional & Mental Engagement):** *Smriti Escape Room* (Game 6) & *Kutumba Family Recall* (Game 5) - Deeply engaging activities that promote emotional calm, reminiscence, and logic puzzle solving within a soothing 50-Rooms style interface.

### b. AI/ML Algorithms for Adaptive Difficulty
*   **Cognitive Stability Index:** The `CognitiveContext` engine dynamically adjusts game variables (timer speed, visual complexity, memory span) based on real-time performance. Difficulty scales across 3 levels: Gentle (Level 1), Moderate (Level 2), and Active (Level 3).

### c. Multilingual & Voice-Assisted Interaction
*   **Aai Voice Companion:** A fully integrated voice-to-text and text-to-speech companion that understands and responds sympathetically to the elderly user. 
*   **NER Language Localization:** Full structural UI localization and voice synthesis support for **Assamese, Bengali, Manipuri, Bodo, Khasi, Garo, Mizo, Nagamese, Hindi, and English**.

### d. Culturally Familiar Themes for NER
*   **Art & Sound:** The platform utilizes 16:9 cinematic imagery (e.g., Assam Tea Gardens, Ancestral Heritage Rooms) and sound therapy (*Swar Therapy*) featuring traditional NER folk instruments to trigger positive reminiscence.

### e. Comprehensive Reminder Hub
*   Built-in tracking for:
    *   💊 **Medicines** (Dose logging & adherence)
    *   💧 **Hydration** (2000ml daily tracking)
    *   🗓️ **Medical Appointments** (Tele-neurology scheduling)
    *   🚶 **Daily Activities**

### f. Caregiver & Healthcare Worker Dashboard
*   **Clinical Dashboard:** Secure portal for PHC workers and family members to monitor the *Cognitive Health Index*, average response speed, medication compliance, and emotional calm scores. Supports exporting PDF clinical reports.

### g. Offline Functionality for Remote Connectivity
*   **OfflineSync Badge:** The platform operates seamlessly in low-connectivity areas in NER. User data is saved locally and automatically syncs to the cloud once network connectivity is restored.

### h. Elderly-Friendly Mobile & Tablet Interface
*   **Accessible UI/UX:** High-contrast modes, large typography, simple navigation, and a clutter-free design ensuring a dignified user experience for older adults on iPads, Android tablets, and mobile devices.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19 + Vite
*   **Styling & UI:** TailwindCSS 4, Lucide React Icons
*   **Data Visualization:** Recharts (Caregiver Dashboard Analytics)
*   **State Management:** React Context API (`CognitiveContext`, `LanguageContext`)
*   **Voice/AI Integration:** Web Speech API (Synthesis & Recognition)

---

## 🚀 Running the Project Locally

To test the application locally for judging or development:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
3.  **View the App:**
    Open `http://localhost:5173` in your browser. (We recommend testing on tablet resolution for the optimal experience).

---

## 🛡️ License & Copyright
© 2026 SmritiNER Platform — Designed for Dementia Care & Rural Health Connectivity in NER India (MDoNER Initiative). All rights reserved.
