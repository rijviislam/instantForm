# InstantForm

A modern, design-focused form builder for creating, customizing, publishing, and managing forms from a simple and intuitive dashboard.

InstantForm is built to make form creation faster and more visual, with customizable styles, responsive public forms, response management, and a clean user experience.

## ✨ Features

* 🔐 Authentication with Email/Password
* 🔵 Google OAuth authentication
* 📊 Dashboard with form and response overview
* 📝 Create and manage forms
* 🎨 Multiple form styles and templates
* 🧩 Customizable form fields
* 🔀 Drag-and-drop field ordering
* 👀 Live form preview
* 🌐 Publish forms with shareable URLs
* 📋 Collect and manage responses
* 📈 Response analytics
* 🔎 Search and filter forms and responses
* 🌓 Light, Dark, and System themes
* 🌍 English and Bangla support
* 📱 Fully responsive design
* ♿ Accessible and keyboard-friendly UI
* ⚡ Optimistic UI and autosave
* ⌨️ Command palette with keyboard shortcuts

## 🛠️ Tech Stack

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* Redux Toolkit
* GSAP
* ScrollTrigger
* Auth.js / NextAuth

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM

### Database

* PostgreSQL
* Neon

## 📁 Project Structure

```text
InstantForm/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── lib/
│   └── ...
│
└── backend/
    ├── src/
    │   ├── modules/
    │   ├── middleware/
    │   ├── routes/
    │   └── ...
    └── ...
```

> The frontend and backend are maintained as separate applications. The frontend communicates with the backend through REST APIs.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL / Neon PostgreSQL
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/rijviislam/instantForm.git

cd instantForm
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Then start the development server:

```bash
npm run dev
```

### 3. Setup Backend

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=
DIRECT_URL=
FRONTEND_URL=
AUTH_SECRET=
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

## 🗄️ Database

InstantForm uses **PostgreSQL** with **Prisma ORM**.

The database is hosted using **Neon**.

Main data models include:

* User
* Account
* Session
* Form
* FormField
* Response
* ResponseAnswer
* Template

Run Prisma migrations when required:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

## 🔐 Authentication

InstantForm supports:

* Email & Password authentication
* Google OAuth
* Persistent sessions
* Protected dashboard routes
* Backend authentication verification
* User ownership and authorization

Private form and response data is scoped to the authenticated user.

## 📝 Form Builder

The form builder allows users to create and customize forms using different field types.

Supported field types include:

* Short Text
* Long Text
* Email
* Phone
* Number
* URL
* Date
* Time
* Single Choice
* Multiple Choice
* Dropdown
* Rating
* Yes / No
* File Upload

Users can:

* Add fields
* Reorder fields
* Edit field settings
* Mark fields as required
* Add descriptions and placeholders
* Configure validation
* Duplicate fields
* Delete fields
* Preview forms
* Save changes automatically
* Publish forms

## 🎨 Form Styles

InstantForm provides multiple visual styles:

* Classic
* Conversation
* Chat
* Editorial
* Minimal

Each form can have its own visual style while maintaining the overall InstantForm design system.

## 📋 Templates

InstantForm includes reusable templates for common use cases such as:

* Customer Feedback
* Quick Survey
* Event Registration
* Job Application
* Lead Capture
* Product Feedback
* Contact Us
* Quiz
* Customer Support

Using a template creates a **new draft form**. The original template remains unchanged.

## 🌐 Public Forms

Published forms are available through shareable URLs.

Example:

```text
/f/your-form-slug
```

Public forms include:

* Responsive layouts
* Client-side validation
* Server-side validation
* Form progress where applicable
* Submission success state
* Accessible form controls
* Mobile-friendly experience

## 📊 Responses & Analytics

Users can view and manage responses from the dashboard.

Response features include:

* Total response count
* Submission list
* Search
* Date filtering
* Response details
* Choice-based analytics
* Rating analytics
* Completion metrics

## 🎨 Theme

InstantForm supports:

* ☀️ Light Mode
* 🌙 Dark Mode
* 💻 System Mode

The dark theme follows the project's purple-based visual identity with near-black backgrounds and dark-purple surfaces.

## 🌍 Internationalization

InstantForm is designed to support:

* English
* Bangla

UI text should remain translation-ready so additional languages can be introduced later.

## ♿ Accessibility

The application focuses on accessible interactions including:

* Keyboard navigation
* Visible focus states
* Semantic form labels
* Accessible interactive controls
* Reduced-motion support
* Responsive layouts

## ⚡ Performance

InstantForm focuses on a fast and smooth user experience through:

* Optimistic UI updates
* Debounced autosave
* Background synchronization
* Selective data fetching
* Preserving unsaved local work
* Avoiding unnecessary full-screen loading states

## 🧑‍💻 Development

Start the frontend and backend separately during development.

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run dev
```

Make sure the frontend API URL and backend environment variables are configured correctly.

## 📌 Project Architecture

```text
                ┌──────────────────┐
                │   Next.js Web    │
                │    Frontend      │
                └────────┬─────────┘
                         │
                         │ REST API
                         ▼
                ┌──────────────────┐
                │  Express Server  │
                │     Backend      │
                └────────┬─────────┘
                         │
                         │ Prisma
                         ▼
                ┌──────────────────┐
                │ Neon PostgreSQL  │
                └──────────────────┘
```

The frontend does not connect directly to PostgreSQL. Database operations are handled by the backend through Prisma.

## 🔒 Security

InstantForm follows ownership-based authorization for private resources.

The backend should never trust a client-provided user ID for authorization.

Protected resources are verified using the authenticated session before performing operations such as:

* Creating forms
* Updating forms
* Deleting forms
* Publishing forms
* Reading responses
* Managing user-owned resources

## 🗺️ Project Roadmap

* [x] Project foundation
* [x] Authentication
* [x] Dashboard
* [x] Forms management
* [x] Templates
* [x] Form builder
* [x] Public forms
* [x] Response management
* [ ] Advanced analytics
* [ ] CSV export
* [ ] Additional templates
* [ ] Further internationalization

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you want to contribute:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, and create a pull request.

## 📄 License

This project is currently for learning and development purposes.

---

Built with ❤️ using Next.js, TypeScript, Node.js, Express, Prisma, and PostgreSQL.
