# 📚 B(oo)kWormz Library

A modern, full-stack book club application with React frontend and Flask backend featuring a beautiful glass morphism design and interactive animations.

![BookVerse Library](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop)

## ✨ Features

- **🔍 Smart Search** - Find books by title, author, or genre
- **📖 Genre Browsing** - Interactive genre cards with animations
- **⭐ Book Reviews** - Rate and review your favorite books
- **📚 Reading Lists** - Create and manage personal reading lists
- **➕ Add Books** - Contribute new books with cover images
- **🎨 Modern UI** - Glass morphism design with floating animations
- **📱 Responsive** - Works perfectly on all devices
- **🔥 Trending Section** - See what's popular right now

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd server
pip install -r requirements.txt
python init_db.py  # Initialize database
python app.py      # Start server on port 5001
```

### Frontend Setup
```bash
cd client
npm install
npm start         # Start on port 3000
```

Visit `http://localhost:3000` to see the app!

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Formik & Yup** - Form handling and validation
- **CSS3** - Glass morphism styling with animations

### Backend
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-RESTful** - API endpoints
- **SQLite** - Database (PostgreSQL for production)

## 📁 Project Structure

```
bookclub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API calls
│   │   ├── context/       # React context
│   │   └── styles/        # CSS styles
│   └── public/
├── server/                # Flask backend
│   ├── resources/         # API resources
│   ├── models.py          # Database models
│   ├── app.py            # Flask app
│   └── config.py         # Configuration
└── README.md
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Create new book |
| GET | `/api/books/:id` | Get book by ID |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/books/:id/reviews` | Get book reviews |
| POST | `/api/books/:id/reviews` | Add review |
| GET | `/api/reading-list` | Get reading list |
| POST | `/api/reading-list` | Add to reading list |

## 🎨 Design Features

- **Glass Morphism** - Translucent cards with backdrop blur
- **Floating Animations** - Animated book emojis in hero section
- **Gradient Text** - Colorful gradient text effects
- **Pulse Effects** - Interactive pulse animations on genre cards
- **Hover Transitions** - Smooth hover effects throughout
- **Responsive Grid** - Adaptive layouts for all screen sizes

## 🚀 Deployment

### Render Deployment
1. Push code to GitHub
2. Connect repository to Render
3. Set build command: `./build.sh`
4. Set start command: `cd server && gunicorn app:app`
5. Add PostgreSQL database
6. Deploy!

### Environment Variables
```
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://... (auto-set by Render)
```

## 📝 Sample Data

The app includes 12 sample books across various genres:
- Classic Fiction (To Kill a Mockingbird, The Great Gatsby)
- Science Fiction (Dune, Project Hail Mary)
- Fantasy (Harry Potter, The Hobbit)
- Romance (Pride and Prejudice)
- Thriller (Gone Girl, The Silent Patient)
- And more!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Book cover images from [Unsplash](https://unsplash.com)
- Icons and emojis for enhanced UX
- Glass morphism design inspiration from modern UI trends

---

**Made with ❤️ for book lovers everywhere**

[Render] https://book-club254-gpaw.onrender.com
