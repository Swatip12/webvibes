# Image Replacement Guide for WebVibes Technologies

## Current Status

The website now uses **technology-themed gradient backgrounds** with code icons instead of random placeholder images. This provides a professional, tech-focused look while you prepare your own images.

## What You See Now

- **Hero Section**: Purple-blue gradient with `{ code }` overlay
- **Java Course**: Pink-red gradient with code icon
- **Python Course**: Blue-cyan gradient with database icon  
- **MERN Course**: Green-cyan gradient with globe icon

## How to Add Your Own Images

### Step 1: Prepare Your Images

Collect or create these images showing IT training/technology:
- **Hero image**: Technology workspace, students coding (recommended: 800x600px)
- **Java course**: Java development or code editor (recommended: 600x400px)
- **Python course**: Data science or Python coding (recommended: 600x400px)
- **MERN course**: Web development or React (recommended: 600x400px)

### Step 2: Save Images

1. Create the images folder if it doesn't exist:
   ```
   frontend/src/assets/images/
   ```

2. Save your images with these names:
   - `hero-tech.jpg` (or .png)
   - `course-java.jpg` (or .png)
   - `course-python.jpg` (or .png)
   - `course-mern.jpg` (or .png)

### Step 3: Update the Code

**For Hero Image:**

Open `frontend/src/app/components/hero-section/hero-section.component.ts` and uncomment line 15:
```typescript
this.heroImageUrl = 'assets/images/hero-tech.jpg';
```

**For Course Images:**

Open `frontend/src/app/components/home/home.component.ts` and update the courses array (around line 40):
```typescript
courses: CourseCard[] = [
  {
    title: 'Full Stack Java Development',
    description: 'Master Java, Spring Boot, and build enterprise applications',
    imageQuery: 'assets/images/course-java.jpg',  // Changed
    duration: '3 Months',
    studentsCount: 200,
    badge: { text: 'Bestseller', type: 'bestseller' }
  },
  {
    title: 'Python & Data Science',
    description: 'Learn Python, Data Analysis, and Machine Learning',
    imageQuery: 'assets/images/course-python.jpg',  // Changed
    duration: '4 Months',
    studentsCount: 150,
    badge: { text: 'Trending', type: 'trending' }
  },
  {
    title: 'MERN Stack Development',
    description: 'Build modern web apps with MongoDB, Express, React, Node.js',
    imageQuery: 'assets/images/course-mern.jpg',  // Changed
    duration: '3 Months',
    studentsCount: 180,
    badge: { text: 'New', type: 'new' }
  }
];
```

Then update the `getCourseImage` method (around line 70):
```typescript
getCourseImage(query: string): string {
  // Return the image path directly
  return query;
}
```

## Where to Find Relevant Images

### Free Stock Photo Sites:
1. **Pexels.com** - Search: "coding", "programming", "web development", "data science"
2. **Unsplash.com** - Search: "developer", "code", "technology", "laptop coding"
3. **Pixabay.com** - Search: "programming", "computer code", "software development"

### Your Own Photos:
- Take photos of your training center
- Students working on computers
- Code on screens during classes
- Your instructors teaching

### Screenshot Code:
- Take screenshots of actual code from your courses
- Use VS Code or other editors with syntax highlighting
- Make sure the code looks professional and readable

## Image Requirements

- **Format**: JPG or PNG (JPG recommended for photos)
- **Size**: 
  - Hero: 800x600px minimum (can be larger, will scale)
  - Courses: 600x400px minimum (can be larger, will scale)
- **File Size**: Keep under 500KB each for fast loading
- **Content**: Must show technology, coding, or IT training related imagery

## Testing Your Images

After adding images:
1. Save all files
2. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
3. Check that images load correctly
4. Verify they look good on mobile (use browser dev tools)

## Need Help?

If images don't appear:
- Check file paths are correct
- Verify images are in `frontend/src/assets/images/` folder
- Check browser console for errors (F12)
- Make sure image file names match exactly (case-sensitive)
