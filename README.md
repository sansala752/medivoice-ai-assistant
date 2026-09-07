# MediVoice AI Assistant

Build a simple, professional web application UI called "MediVoice" — a multilingual AI medical appointment booking system.

IMPORTANT:

This is an interview MVP. Focus on clean UI/UX, realistic functionality, and a structure that can later connect to a FastAPI REST API and MySQL database. Do not over-engineer the UI.

TECH STACK:

- React

- TypeScript

- Vite

- Tailwind CSS

- Lucide React icons

- Use reusable components

- No unnecessary animations

- Responsive desktop and mobile design

DESIGN:

- Modern healthcare SaaS dashboard

- Clean, minimal, professional appearance

- White/light gray background

- Primary color: deep blue

- Secondary accent: teal

- Rounded cards

- Subtle borders and shadows

- Good typography and spacing

- Avoid excessive gradients

- The application should look like a real healthcare product rather than a generic AI chatbot.

APPLICATION STRUCTURE:

Create two main areas:

1. PATIENT / AI VOICE ASSISTANT

2. STAFF / ADMIN DASHBOARD

--------------------------------------------------

PATIENT AI VOICE ASSISTANT

--------------------------------------------------

Create a page called "AI Appointment Assistant".

Layout:

Top navigation:

- MediVoice logo/icon

- "AI Appointment Assistant"

- Language selector

- "Staff Login" button

Main content should have two columns on desktop.

LEFT:

A large voice assistant card.

Show:

- AI assistant avatar

- Microphone button in the center

- Voice status such as:

  "Ready to help"

  "Listening..."

  "Processing..."

  "Speaking..."

- Start Conversation button

- End Conversation button

Use a professional microphone icon.

RIGHT:

Conversation transcript panel.

Example conversation:

AI:

"Hello! Welcome to MediVoice. How can I help you today?"

Patient:

"I want to book an appointment with a cardiologist."

AI:

"Certainly. I found Dr. Sarah Perera, Cardiologist. What date would you prefer?"

Patient:

"September 10."

AI:

"Dr. Sarah Perera is available at 9:00 AM, 10:30 AM, 2:00 PM and 3:30 PM."

Include timestamps.

Below the transcript:

- Text input

- Send button

- Microphone button

Add a small status indicator:

"AI Assistant Online"

--------------------------------------------------

LANGUAGE SELECTOR

--------------------------------------------------

Create a dropdown with these 10 languages:

English

Sinhala

Tamil

Hindi

Arabic

French

German

Spanish

Japanese

Mandarin Chinese

Show the selected language clearly.

The UI should make it obvious that the AI can conduct the appointment booking conversation in the selected language.

--------------------------------------------------

APPOINTMENT CONFIRMATION

--------------------------------------------------

After the AI collects the required information, display a confirmation card.

Example:

Appointment Summary

Doctor:

Dr. Sarah Perera

Specialty:

Cardiology

Date:

September 10, 2026

Time:

10:30 AM

Patient:

John Smith

Language:

English

Buttons:

[Confirm Appointment]

[Change Details]

After confirmation show:

✓ Appointment Confirmed

Appointment ID:

MED-1024

Buttons:

[View Appointment]

[Start New Booking]

--------------------------------------------------

DOCTORS PAGE

--------------------------------------------------

Create a "Doctors" page.

Display exactly 5 doctors.

Use realistic fictional data:

1. Dr. Sarah Perera

   Cardiology

2. Dr. Michael Silva

   Neurology

3. Dr. Nadeesha Fernando

   Dermatology

4. Dr. James Wilson

   General Medicine

5. Dr. Anjali Kumar

   Pediatrics

Each doctor card should show:

- Doctor name

- Specialty

- Short description

- Available today/tomorrow indicator

- "View Availability" button

--------------------------------------------------

AVAILABILITY

--------------------------------------------------

Create an availability modal/page.

Allow the user to select:

- Doctor

- Date

Then display available appointment slots:

09:00 AM

10:30 AM

02:00 PM

03:30 PM

Use selectable slot buttons.

Selected slot should be visually highlighted.

--------------------------------------------------

STAFF DASHBOARD

--------------------------------------------------

Create a separate staff dashboard.

Sidebar:

MediVoice

Dashboard

Appointments

Doctors

Patients

AI Requests

Human Requests

Settings

Top bar:

- Search

- Notifications

- Staff profile

Dashboard cards:

Today's Appointments

24

AI Bookings

12

Human Bookings

8

Pending Requests

4

Below the cards create a "Today's Appointments" table.

Columns:

Patient

Doctor

Specialty

Date

Time

Source

Status

Example:

John Smith

Dr. Sarah Perera

Cardiology

Sep 10

10:30 AM

AI

Confirmed

Maria Silva

Dr. Anjali Kumar

Pediatrics

Sep 10

11:00 AM

Human

Confirmed

David Chen

Dr. Michael Silva

Neurology

Sep 10

2:00 PM

AI

Pending

Use badges for:

Confirmed

Pending

Cancelled

Use badges for booking source:

AI

Human

--------------------------------------------------

HUMAN HANDOFF

--------------------------------------------------

Create an "AI Requests" / "Human Requests" page.

Show requests generated when a patient asks to speak to a human.

Example:

Patient: John Smith

Language: Sinhala

Reason: Patient requested human assistance

Time: 10:32 AM

Status: Waiting

Buttons:

[Accept Request]

[View Conversation]

When accepted, change status to:

"Assigned to You"

--------------------------------------------------

APPOINTMENTS PAGE

--------------------------------------------------

Create an appointments management page.

Features:

- Search appointments

- Filter by doctor

- Filter by status

- Filter by booking source

- Date filter

Actions:

- View

- Reschedule

- Cancel

Use mock data for now.

--------------------------------------------------

DOCTORS MANAGEMENT

--------------------------------------------------

Staff should be able to view the 5 doctors.

Show:

- Name

- Specialty

- Languages

- Availability

- Status

Add:

"+ Add Doctor"

button, but this can be a UI-only interaction for now.

--------------------------------------------------

IMPORTANT UX BEHAVIOR

--------------------------------------------------

The application should feel functional even though the backend is currently mocked.

Implement frontend state for:

- Starting/stopping voice conversation

- Selecting language

- Selecting doctor

- Selecting date

- Selecting appointment slot

- Confirming appointment

- Human handoff

- Appointment status

- Dashboard statistics

Do NOT build a real voice API yet.

Create clean placeholder functions/services so that a real FastAPI backend can later replace the mock data.

For example, structure API calls conceptually around:

GET /api/doctors

GET /api/doctors/{id}/availability

POST /api/appointments

GET /api/appointments

PUT /api/appointments/{id}

DELETE /api/appointments/{id}

POST /api/human-requests

GET /api/human-requests

Do not hardcode the UI around a specific AI provider.

--------------------------------------------------

COMPONENTS

--------------------------------------------------

Create reusable components:

VoiceAssistant

ConversationPanel

LanguageSelector

DoctorCard

DoctorAvailability

AppointmentSummary

AppointmentTable

DashboardCard

StatusBadge

HumanRequestCard

Sidebar

TopNavigation

--------------------------------------------------

FINAL REQUIREMENTS

--------------------------------------------------

Make the application polished enough to demonstrate during a software engineering interview.

Prioritize:

1. Clear user flow

2. Professional healthcare UI

3. Voice AI concept

4. Multilingual support

5. Appointment booking

6. Human handoff

7. Staff dashboard

8. Extensible component architecture

Keep the UI simple and fast.

Do not add unnecessary features such as payments, medical records, prescriptions, insurance processing, or complex authentication.

Use fictional doctors and fictional patient information only.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de74d9b0-a6d4-451a-ad09-1763dd3a249f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
