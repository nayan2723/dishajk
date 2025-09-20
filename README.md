# 🎓 DISHA - Personalized Career & Education Advisor

## 🚀 Project Overview

**DISHA** is a web platform providing personalized career and education guidance for students in Jammu & Kashmir. It helps students choose the right stream after Class 10/12, discover nearby colleges, and explore potential career paths with AI-powered insights.

**Key Features:**
- 📝 Interactive Quiz to assess interests and strengths  
- 🏫 College recommendations based on Supabase database  
- 🧠 AI-generated career flowcharts (Stream → Recommended Course → Higher Studies → Job Titles)  
- 💼 Job title suggestions for each recommended course  
- 📩 “Get in Touch” form to collect student interest  
- 🌗 Dark/Light mode support and modern interactive UI  
- 🔐 Secure access with Clerk authentication  

---

## 🛠 Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn-ui  
- **Bundler & Build:** Vite  
- **Authentication:** Clerk  
- **Backend & Database:** Supabase (PostgreSQL)  
- **AI Integration:** Google Gemini API  
- **Flowcharts & Visualization:** React Flow / Mermaid.js  
- **Animations & UI Enhancements:** Framer Motion  

---

## ✨ Features

### 1️⃣ Quiz & Recommendations
- 5-question quiz: area, ownership preference, stream, marks, and location  
- Dynamic college recommendations based on Supabase data  
- Smooth scroll to recommendation section after quiz submission  

### 2️⃣ Career Flowchart
- Auto-generates career flowchart using AI  
- Downloadable as PDF  
- Clear white background for optimal readability  

### 3️⃣ College Information
- College cards: Name, Type, District, Urban/Rural Status, Courses, Links  
- Job titles for each course displayed below recommended courses  
- Pop-up if selected government colleges are unavailable, showing private alternatives  

### 4️⃣ Get in Touch Form
- Collects Name, Email, Phone, Message  
- Data stored in `interested_students` table in Supabase  
- Fully responsive design  

### 5️⃣ Theme & UI Enhancements
- Dark and Red theme optimized for readability and interactivity  
- Clean layout with professional spacing and modern animations  

---

## ⚙️ Setup & Development

### Prerequisites
- Node.js & npm (or Yarn)

### Installation
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
