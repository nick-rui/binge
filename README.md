# 🍽️ Binge - Restaurant Discovery App

> **A Tinder-like experience for discovering your next favorite restaurant**

Binge is a modern web application that reimagines restaurant discovery through an intuitive swipe interface. Built with React and TypeScript, it features a custom-built swiping system optimized for both desktop and mobile experiences.

![Binge App Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Binge+Restaurant+Discovery)

## ✨ Key Features

### 🎯 **Custom Swipe Interface**
- **Intuitive Gestures**: Swipe right to like, left to reject restaurants
- **Visual Feedback**: Real-time drag animations with rotation and positioning
- **Zone-Based Interactions**: Dedicated 1/3 screen zones for like/reject actions
- **Contextual Popups**: Success messages appear in the target zone for immediate feedback

### 🎨 **Advanced UI/UX Design**
- **Single Card Focus**: Only the top card is interactive, eliminating confusion
- **Smooth Animations**: Custom CSS transitions for card movement and zone highlighting
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **Accessibility First**: Full keyboard navigation and screen reader support

### 🔧 **Technical Excellence**
- **Memory Management**: Proper cleanup of timeouts and event listeners
- **Error Handling**: Graceful image loading failures with fallback UI
- **Performance Optimized**: Memoized calculations and efficient re-renders
- **Type Safety**: Full TypeScript implementation with strict type checking

## 🏗️ Architecture & Design Decisions

### **Custom Swipe Implementation**
Instead of using third-party libraries, we built a custom swipe system for maximum control:

```typescript
interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  dragDistance: number;
  dragDirection: 'left' | 'right' | 'center';
}
```

**Why Custom?**
- **Precise Control**: Fine-tuned thresholds and animations
- **Better Performance**: No external dependencies
- **Consistent Experience**: Identical behavior across all devices
- **Accessibility**: Built-in keyboard navigation support

### **Zone-Based Interaction Design**
- **Left Zone (1/3)**: Red "NOPE" zone with X icon
- **Center Zone (1/3)**: Neutral grey area for card positioning
- **Right Zone (1/3)**: Green "LIKE" zone with heart icon

**Design Rationale:**
- **Visual Clarity**: Clear targets reduce user confusion
- **Muscle Memory**: Consistent positioning builds user habits
- **Feedback Loop**: Immediate visual response reinforces actions

### **Single Card Strategy**
Unlike traditional card stacks, we show only the active card:

**Benefits:**
- **Reduced Cognitive Load**: Users focus on one decision at a time
- **Cleaner Interface**: No visual clutter from background cards
- **Performance**: Lighter DOM with fewer rendered elements
- **Accessibility**: Clearer focus management for screen readers

## 🎮 User Experience Features

### **Multi-Input Support**
- **Touch Gestures**: Native mobile swipe support with preventDefault
- **Mouse Interactions**: Desktop drag-and-drop functionality
- **Keyboard Navigation**: Arrow keys for swiping, Enter/Space for details
- **Accessibility**: ARIA labels and screen reader announcements

### **Visual Feedback System**
- **Real-time Animations**: Cards rotate and move during drag
- **Zone Highlighting**: Target areas light up during interaction
- **Success Messages**: Contextual popups in the target zone
- **Smooth Transitions**: CSS transitions for professional feel

### **Error Handling & Resilience**
- **Image Fallbacks**: Graceful handling of failed image loads
- **Data Validation**: Safe rating calculations and null checks
- **Network Resilience**: Proper error states and loading indicators
- **Memory Management**: Cleanup of timeouts and event listeners

## 🚀 Technical Stack

### **Frontend**
- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Full type safety with strict configuration
- **Tailwind CSS**: Utility-first styling with responsive design
- **Vite**: Fast development server and optimized builds

### **Backend**
- **Flask**: Lightweight Python web framework
- **Flask-CORS**: Cross-origin resource sharing support
- **Python 3.8+**: Modern Python with type hints

### **Development Tools**
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Browser compatibility for CSS

## 📱 Responsive Design

### **Mobile-First Approach**
```css
/* Progressive enhancement */
w-16 h-16 sm:w-20 sm:h-20        /* Icons scale up */
text-lg sm:text-xl               /* Typography scales */
w-[280px] h-[400px] sm:w-[320px] sm:h-[480px]  /* Cards adapt */
```

### **Breakpoint Strategy**
- **Mobile**: < 640px - Optimized for one-handed use
- **Tablet**: 640px+ - Balanced layout with larger touch targets
- **Desktop**: 1024px+ - Full feature set with hover states

## ♿ Accessibility Features

### **ARIA Implementation**
- **Role Attributes**: Proper semantic markup
- **Labels**: Descriptive labels for all interactive elements
- **Live Regions**: Screen reader announcements for state changes
- **Focus Management**: Logical tab order and focus indicators

### **Keyboard Navigation**
- **Arrow Keys**: Left/Right for swiping actions
- **Enter/Space**: Access restaurant details
- **Tab Navigation**: Logical focus order
- **Escape**: Close modals and return to main interface

## 🧪 Testing & Quality Assurance

### **Comprehensive Bug Testing**
We conducted **two complete bug test cycles** covering:

**Test Cycle 1:**
- Memory leak prevention
- Event handling consistency
- Performance optimization
- Race condition prevention

**Test Cycle 2:**
- Dynamic data handling
- Touch event robustness
- Multi-touch scenarios
- Error boundary testing

### **Code Quality Measures**
- **TypeScript Strict Mode**: Catch errors at compile time
- **ESLint Rules**: Consistent code style and best practices
- **Memory Management**: Proper cleanup of resources
- **Performance Profiling**: Optimized re-renders and calculations

## 🚦 Getting Started

### **Prerequisites**
- Node.js 16+ and npm
- Python 3.8+ and pip
- Git

### **Quick Start**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/binge.git
   cd binge
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🎯 Usage Guide

### **Basic Interactions**
1. **Swiping**: Drag cards left (reject) or right (like)
2. **Keyboard**: Use arrow keys for quick decisions
3. **Details**: Click info button or press Enter for restaurant details
4. **History**: Switch to "Liked" tab to view saved restaurants

### **Advanced Features**
- **Drag Zones**: Visual feedback when dragging toward like/reject zones
- **Keyboard Shortcuts**: Efficient navigation for power users
- **Responsive**: Seamless experience across all devices
- **Accessibility**: Full screen reader and keyboard support

## 🔮 Future Enhancements

- **User Profiles**: Personal preferences and history
- **Advanced Filtering**: Cuisine type, price range, dietary restrictions
- **Social Features**: Share favorites and see friends' recommendations
- **Offline Support**: PWA capabilities for offline browsing
- **Analytics**: User behavior insights and recommendation improvements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Testing requirements
- Pull request process
- Bug reporting guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the Binge development team.

---

**Ready to discover your next favorite restaurant?** 🍽️✨
