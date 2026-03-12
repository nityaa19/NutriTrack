# NutriTrack - AI-Powered Nutrition Management

NutriTrack is a modern, personalized health and nutrition tracking application. It leverages AI to provide deep insights into your dietary habits, helping you reach your fitness goals faster.

## Features

- **Daily Nutrition Diary**: Log your meals with an extensive database of 100+ Indian and Global cuisines.
- **AI Label Scanning**: Snap a photo of any nutrition label to instantly extract and log data.
- **Smart Reports**: Get structured Daily and Weekly progress reports.
- **Personalized Goals**: Automatically calculated caloric and macronutrient targets based on your body metrics and fitness objectives.
- **Nutritional Database**: A personalized library that grows as you log new items.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Shadcn UI
- **Backend & Auth**: Firebase (Firestore & Authentication)
- **AI Engine**: Google Genkit (Gemini 2.5 Flash)

## How to Upload to GitHub

Follow these steps exactly in your terminal:

1. **Initialize Git**:
   ```bash
   git init
   ```

2. **Add Files**:
   ```bash
   git add .
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Initial commit: NutriTrack MVP"
   ```

4. **Set Main Branch**:
   ```bash
   git branch -M main
   ```

5. **Connect to your GitHub Repo**:
   ```bash
   git remote add origin https://github.com/nityaa19/NutriTrack.git
   ```

6. **Push to GitHub**:
   Run this command:
   ```bash
   git push -u origin main
   ```
   - When it asks for **Username**, type: `nityaa19`
   - When it asks for **Password**, paste your **token** (`ghp_...`) and press Enter. 
   *(Note: The terminal won't show characters while you paste/type the password, just press Enter when done)*

---
*Note: Ensure you have your Firebase configuration and any necessary environment variables set up in your hosting environment.*
