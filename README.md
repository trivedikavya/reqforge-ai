# ReqForge AI - Intelligent BRD Generator

**From Chaos to Clarity in Minutes**

ReqForge AI automatically generates comprehensive Business Requirements Documents (BRDs) by analyzing context, notes, and uploaded documents using advanced generative AI. 

## 🚀 Features

- **AI-Powered Generation**: Leverages Google Gemini 1.5 Flash for rapid, accurate requirement extraction and formatting.
- **Multiple Templates**: Produce documents in Comprehensive, Standard, and Agile Quick-Start formats.
- **Interactive Chat Refinement**: Refine and iterate on your BRD through a natural language chat interface that understands context.
- **Context Injection**: Upload multiple reference documents to ground the BRD generation in your specific use cases.
- **Web Scraping**: Enriches BRDs with live competitive market intelligence.
- **Live Preview & Export**: Instantly preview markdown output and export directly to PDF and DOCX.

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **AI Services**: Google Generative AI (Gemini Flash)
- **Real-time**: Socket.io WebSockets

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd reqforge-ai
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
# You can provide a single key...
GEMINI_API_KEY=your_gemini_api_key_here
# OR provide a comma-separated list of keys to enable automatic rate-limit rotation!
# GEMINI_API_KEYS=key1,key2,key3
JWT_SECRET=your_jwt_secret_string
```
*Note: The backend features an intelligent API Key rotation system. If you often hit `429 Too Many Requests` quota limitations on the free Gemini tier, provide multiple keys in `GEMINI_API_KEYS` and the system will automatically rotate them when rate limits are hit!*

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

You will need to run both the frontend and backend servers concurrently.

**Start the Backend (from `/backend`)**:
```bash
npm run dev
```

**Start the Frontend (from `/frontend`)**:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🎯 Usage Workflow

1. **Register/Login** to your workspace.
2. **Create New Project** and select your desired framework (Comprehensive, Standard, Agile).
3. **Upload Context** documents or describe your project directly.
4. **Generate BRD** and watch the AI instantly format your document.
5. **Chat with the AI Architect** in the split-view workspace to request modifications, resolve conflicts, or add metrics.
6. **Export** the final, polished document as PDF or DOCX.

## 📄 License

MIT License - see LICENSE file