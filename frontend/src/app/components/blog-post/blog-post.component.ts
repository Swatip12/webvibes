import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../services/seo.service';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
}

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
  post: BlogPost | undefined;

  private allPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Top 50 Java Interview Questions for Freshers (2024)',
      excerpt: 'Comprehensive list of Java interview questions covering OOP, collections, multithreading, and Spring Boot — with answers to help you crack your first IT job.',
      category: 'Interview Questions', date: 'Apr 15, 2026', readTime: '12 min read',
      tags: ['Java', 'OOP', 'Spring Boot', 'Freshers'],
      content: [
        'Java remains one of the most in-demand programming languages for backend development. If you are preparing for a Java developer interview, here are the most commonly asked questions.',
        '1. What is the difference between JDK, JRE, and JVM?\nJVM (Java Virtual Machine) runs Java bytecode. JRE (Java Runtime Environment) includes JVM + libraries. JDK (Java Development Kit) includes JRE + development tools like javac.',
        '2. What are the four pillars of OOP?\nEncapsulation, Inheritance, Polymorphism, and Abstraction. These are the core principles of Object-Oriented Programming.',
        '3. What is the difference between == and .equals() in Java?\n== compares object references (memory addresses). .equals() compares the actual content/values of objects.',
        '4. What is the difference between ArrayList and LinkedList?\nArrayList uses a dynamic array — fast for random access. LinkedList uses a doubly linked list — fast for insertions and deletions.',
        '5. What is multithreading in Java?\nMultithreading allows concurrent execution of two or more threads. Java provides Thread class and Runnable interface to create threads.',
        '6. What is the difference between abstract class and interface?\nAbstract class can have method implementations and state. Interface (before Java 8) only had abstract methods. From Java 8+, interfaces can have default and static methods.',
        '7. What is Spring Boot?\nSpring Boot is a framework that simplifies Spring application development by providing auto-configuration, embedded servers, and production-ready features.',
        'These are just a few of the 50 questions. Practice these thoroughly and you will be well-prepared for your Java interview.'
      ]
    },
    {
      id: 2,
      title: 'SQL Interview Questions Every Developer Must Know',
      excerpt: 'From basic SELECT queries to complex JOINs, subqueries, and stored procedures — master these SQL questions before your next technical interview.',
      category: 'Interview Questions', date: 'Apr 10, 2026', readTime: '10 min read',
      tags: ['SQL', 'MySQL', 'Database', 'Interview'],
      content: [
        'SQL is a must-know skill for any developer. Here are the most frequently asked SQL interview questions.',
        '1. What is the difference between WHERE and HAVING?\nWHERE filters rows before grouping. HAVING filters groups after the GROUP BY clause.',
        '2. What are the types of JOINs in SQL?\nINNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from the left table. RIGHT JOIN returns all rows from the right table. FULL OUTER JOIN returns all rows when there is a match in either table.',
        '3. What is a primary key vs foreign key?\nPrimary key uniquely identifies each row in a table. Foreign key is a column that references the primary key of another table.',
        '4. What is normalization?\nNormalization is the process of organizing a database to reduce redundancy and improve data integrity. Common forms are 1NF, 2NF, 3NF.',
        '5. What is the difference between DELETE, TRUNCATE, and DROP?\nDELETE removes specific rows (can be rolled back). TRUNCATE removes all rows (faster, cannot be rolled back). DROP removes the entire table structure.',
        'Practice writing queries on real datasets to solidify your understanding of SQL.'
      ]
    },
    {
      id: 3,
      title: 'Angular Interview Questions: Components, Services & RxJS',
      excerpt: 'Prepare for Angular interviews with questions on components, directives, services, dependency injection, and reactive programming with RxJS.',
      category: 'Interview Questions', date: 'Apr 5, 2026', readTime: '9 min read',
      tags: ['Angular', 'TypeScript', 'RxJS', 'Frontend'],
      content: [
        'Angular is a popular frontend framework used in enterprise applications. Here are key interview questions.',
        '1. What is the difference between a Component and a Directive?\nA Component is a directive with a template. Directives add behavior to existing DOM elements without a template.',
        '2. What is dependency injection in Angular?\nDI is a design pattern where Angular provides dependencies to a class instead of the class creating them. Services are injected via constructors.',
        '3. What is the difference between Observable and Promise?\nPromise handles a single async event. Observable handles a stream of async events and supports operators like map, filter, and switchMap.',
        '4. What is lazy loading in Angular?\nLazy loading loads feature modules only when the user navigates to that route, improving initial load performance.',
        '5. What is the difference between ngOnInit and constructor?\nConstructor is called when the class is instantiated. ngOnInit is called after Angular initializes the component\'s inputs.',
        'Understanding these concepts will help you stand out in Angular interviews.'
      ]
    },
    {
      id: 4,
      title: 'Software Testing Interview Questions for QA Engineers',
      excerpt: 'Manual testing, automation testing with Selenium, test case writing, bug lifecycle — everything a QA fresher needs to prepare for interviews.',
      category: 'Interview Questions', date: 'Mar 28, 2026', readTime: '8 min read',
      tags: ['Testing', 'Selenium', 'QA', 'Manual Testing'],
      content: [
        'Software testing is a critical part of the development lifecycle. Here are the most asked QA interview questions.',
        '1. What is the difference between verification and validation?\nVerification checks if we are building the product right (reviews, walkthroughs). Validation checks if we are building the right product (testing).',
        '2. What is the bug lifecycle?\nNew → Assigned → Open → Fixed → Retest → Closed (or Reopened if the fix fails).',
        '3. What is regression testing?\nRegression testing ensures that new code changes have not broken existing functionality.',
        '4. What is Selenium?\nSelenium is an open-source automation testing tool for web applications. It supports multiple browsers and programming languages.',
        '5. What is the difference between smoke testing and sanity testing?\nSmoke testing checks if the build is stable enough for further testing. Sanity testing checks specific functionality after a bug fix.',
        'Practice writing test cases for real applications to build your QA skills.'
      ]
    },
    {
      id: 5,
      title: 'Build a REST API with Spring Boot and MySQL — Step by Step',
      excerpt: 'Learn to build a production-ready REST API from scratch using Spring Boot, JPA, and MySQL. Covers CRUD operations, validation, and error handling.',
      category: 'Tutorials', date: 'Apr 18, 2026', readTime: '15 min read',
      tags: ['Spring Boot', 'REST API', 'MySQL', 'Java'],
      content: [
        'Spring Boot makes it easy to build REST APIs. In this tutorial, we will build a complete CRUD API for a Student Management System.',
        'Step 1: Set up the project\nGo to start.spring.io and create a new project with dependencies: Spring Web, Spring Data JPA, MySQL Driver.',
        'Step 2: Configure application.properties\nspring.datasource.url=jdbc:mysql://localhost:3306/studentdb\nspring.datasource.username=root\nspring.datasource.password=yourpassword\nspring.jpa.hibernate.ddl-auto=update',
        'Step 3: Create the Entity\n@Entity\npublic class Student {\n  @Id @GeneratedValue\n  private Long id;\n  private String name;\n  private String email;\n}',
        'Step 4: Create the Repository\npublic interface StudentRepository extends JpaRepository<Student, Long> {}',
        'Step 5: Create the Service\n@Service\npublic class StudentService {\n  @Autowired\n  private StudentRepository repo;\n  public List<Student> getAll() { return repo.findAll(); }\n}',
        'Step 6: Create the Controller\n@RestController\n@RequestMapping("/api/students")\npublic class StudentController {\n  @GetMapping\n  public List<Student> getAll() { return service.getAll(); }\n}',
        'You now have a working REST API. Add POST, PUT, DELETE endpoints following the same pattern.'
      ]
    },
    {
      id: 6,
      title: 'Getting Started with Angular 15: Components & Routing',
      excerpt: 'A beginner-friendly guide to Angular — setting up your project, creating components, using Angular Router, and making HTTP calls with HttpClient.',
      category: 'Tutorials', date: 'Apr 12, 2026', readTime: '11 min read',
      tags: ['Angular', 'TypeScript', 'Routing', 'Beginner'],
      content: [
        'Angular is a powerful frontend framework by Google. Let\'s get started with the basics.',
        'Step 1: Install Angular CLI\nnpm install -g @angular/cli\nng new my-app\ncd my-app\nng serve',
        'Step 2: Create a Component\nng generate component home\nThis creates home.component.ts, home.component.html, and home.component.css.',
        'Step 3: Set up Routing\nIn app-routing.module.ts:\nconst routes: Routes = [\n  { path: \'\', component: HomeComponent },\n  { path: \'about\', component: AboutComponent }\n];',
        'Step 4: Make HTTP calls\nImport HttpClientModule in app.module.ts.\nInject HttpClient in your service:\nconstructor(private http: HttpClient) {}\ngetData() { return this.http.get(\'/api/data\'); }',
        'Step 5: Use ngFor and ngIf\n<div *ngFor="let item of items">{{ item.name }}</div>\n<p *ngIf="isLoggedIn">Welcome!</p>',
        'Angular has a steep learning curve but is extremely powerful for large applications.'
      ]
    },
    {
      id: 7,
      title: 'Python for Beginners: Variables, Loops & Functions',
      excerpt: 'Start your Python journey with this hands-on tutorial covering data types, control flow, functions, and file handling with practical examples.',
      category: 'Tutorials', date: 'Apr 8, 2026', readTime: '10 min read',
      tags: ['Python', 'Beginner', 'Programming', 'Basics'],
      content: [
        'Python is one of the easiest programming languages to learn. Let\'s cover the fundamentals.',
        'Variables and Data Types:\nname = "Alice"\nage = 25\nheight = 5.6\nis_student = True',
        'Lists and Loops:\nfruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)',
        'Functions:\ndef greet(name):\n    return f"Hello, {name}!"\nprint(greet("Alice"))',
        'Conditionals:\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
        'File Handling:\nwith open("data.txt", "r") as f:\n    content = f.read()\n    print(content)',
        'Python\'s clean syntax makes it perfect for beginners. Practice daily with small programs to build confidence.'
      ]
    },
    {
      id: 8,
      title: 'Git & GitHub for Developers: Complete Beginner Guide',
      excerpt: 'Learn version control with Git — init, commit, branch, merge, pull requests, and how to collaborate on GitHub like a professional developer.',
      category: 'Tutorials', date: 'Mar 30, 2026', readTime: '8 min read',
      tags: ['Git', 'GitHub', 'Version Control', 'DevOps'],
      content: [
        'Git is the most widely used version control system. Every developer must know it.',
        'Basic Commands:\ngit init — Initialize a new repository\ngit add . — Stage all changes\ngit commit -m "message" — Save changes\ngit status — Check current state',
        'Working with Branches:\ngit branch feature-login — Create a branch\ngit checkout feature-login — Switch to branch\ngit merge feature-login — Merge branch into main',
        'Working with GitHub:\ngit remote add origin https://github.com/user/repo.git\ngit push origin main — Push to GitHub\ngit pull origin main — Pull latest changes',
        'Pull Requests:\nPush your branch to GitHub, then open a Pull Request to merge your changes into the main branch. This is how teams collaborate.',
        'Git is essential for any developer. Start using it for all your projects, even personal ones.'
      ]
    },
    {
      id: 9,
      title: 'How to Get Your First IT Job as a Fresher in Pune',
      excerpt: 'A practical roadmap for BCA, MCA, and BE graduates — from building your resume and portfolio to cracking technical interviews and landing your first offer.',
      category: 'Career Guidance', date: 'Apr 17, 2026', readTime: '7 min read',
      tags: ['Career', 'Fresher', 'Job Search', 'Pune'],
      content: [
        'Getting your first IT job as a fresher can feel overwhelming. Here is a practical roadmap.',
        'Step 1: Choose your tech stack\nDon\'t try to learn everything. Pick one path: Java Full Stack, Python, or Testing. Master it deeply.',
        'Step 2: Build 2-3 real projects\nEmployers want to see what you can build. Create a student management system, e-commerce app, or task manager. Put them on GitHub.',
        'Step 3: Create a strong resume\nKeep it to 1 page. Include: skills, projects with GitHub links, education, and any internship experience. Use action verbs.',
        'Step 4: Apply strategically\nApply on LinkedIn, Naukri, and Internshala. Customize your cover letter for each company. Follow up after 1 week.',
        'Step 5: Prepare for interviews\nPractice DSA on LeetCode (easy level). Revise your tech stack fundamentals. Prepare for HR questions like "Tell me about yourself".',
        'Step 6: Get internship experience\nIf you are struggling to get a job, get an internship first. Real project experience changes everything on your resume.',
        'Pune has a thriving IT ecosystem. With the right preparation, your first job is closer than you think.'
      ]
    },
    {
      id: 10,
      title: 'Full Stack vs Backend vs Frontend: Which Path to Choose?',
      excerpt: 'Confused about which development track to pursue? We break down the skills, salaries, and career growth for Full Stack, Backend, and Frontend roles.',
      category: 'Career Guidance', date: 'Apr 11, 2026', readTime: '6 min read',
      tags: ['Career', 'Full Stack', 'Backend', 'Frontend'],
      content: [
        'One of the most common questions from freshers is: which development path should I choose?',
        'Frontend Development:\nYou build what users see. Skills: HTML, CSS, JavaScript, Angular/React. Great if you enjoy design and user experience. Salary range: ₹3-8 LPA for freshers.',
        'Backend Development:\nYou build the server, database, and APIs. Skills: Java/Python, Spring Boot/Django, MySQL. Great if you enjoy logic and data. Salary range: ₹4-10 LPA for freshers.',
        'Full Stack Development:\nYou do both frontend and backend. Skills: All of the above. Most in-demand but requires more learning time. Salary range: ₹5-12 LPA for freshers.',
        'Which should you choose?\nIf you enjoy design → Frontend\nIf you enjoy logic and databases → Backend\nIf you want maximum job opportunities → Full Stack',
        'Regardless of which path you choose, focus on building real projects. That is what gets you hired.'
      ]
    },
    {
      id: 11,
      title: 'Why Internship Experience Matters More Than Your Degree',
      excerpt: 'Recruiters reveal what they actually look for in freshers. Spoiler: it\'s not your CGPA. Here\'s how real project experience changes everything.',
      category: 'Career Guidance', date: 'Apr 3, 2026', readTime: '5 min read',
      tags: ['Internship', 'Career', 'Resume', 'Placement'],
      content: [
        'Every year, thousands of engineering graduates struggle to find jobs despite having good grades. Here is why.',
        'What recruiters actually look for:\nMost recruiters care more about practical skills than CGPA. They want to know: Can you write code? Have you built anything real? Can you work in a team?',
        'The internship advantage:\nA student with a 6.5 CGPA and 3 months of internship experience will almost always beat a student with 8.5 CGPA and no practical experience.',
        'What internship experience gives you:\n- Real project on your resume\n- Understanding of professional workflows (Git, Agile, code reviews)\n- A reference from a working professional\n- Confidence in technical interviews',
        'How to get internship experience:\nApply on Internshala, LinkedIn, and directly to IT companies. WebVibes Technology offers internships with live client projects in Full Stack, Java, Python, and Testing.',
        'Start early. Even a 1-month internship during your final year can make a significant difference in your job search.'
      ]
    },
    {
      id: 12,
      title: 'How to Build a Developer Portfolio That Gets You Hired',
      excerpt: 'Step-by-step guide to creating a portfolio that showcases your projects, skills, and GitHub activity — with templates and real examples.',
      category: 'Career Guidance', date: 'Mar 25, 2026', readTime: '8 min read',
      tags: ['Portfolio', 'GitHub', 'Career', 'Projects'],
      content: [
        'A strong portfolio is your best tool for getting hired as a developer. Here is how to build one.',
        'What to include in your portfolio:\n1. About section — who you are and what you do\n2. Skills — list your tech stack with proficiency levels\n3. Projects — 3-5 real projects with descriptions and GitHub links\n4. Contact — email and LinkedIn',
        'How to showcase projects:\nFor each project, include: what it does, technologies used, your role, and a live demo or GitHub link. Screenshots help a lot.',
        'GitHub profile tips:\n- Keep your profile README updated\n- Pin your best repositories\n- Commit regularly (green squares matter)\n- Write good README files for each project',
        'Portfolio website options:\nBuild it yourself (best option — shows your skills), use GitHub Pages (free hosting), or use portfolio builders like Notion.',
        'The most important thing is to have real projects. A portfolio with 3 solid projects beats a fancy portfolio with no substance.'
      ]
    },
    {
      id: 13,
      title: '10 Java Spring Boot Project Ideas for Your Resume',
      excerpt: 'From student management systems to e-commerce platforms — 10 real-world Spring Boot project ideas with tech stack suggestions and GitHub tips.',
      category: 'Project Ideas', date: 'Apr 16, 2026', readTime: '6 min read',
      tags: ['Java', 'Spring Boot', 'Projects', 'Resume'],
      content: [
        'Building projects is the fastest way to improve your skills and impress employers. Here are 10 Spring Boot project ideas.',
        '1. Student Management System\nCRUD operations for students, courses, and grades. Tech: Spring Boot + Angular + MySQL.',
        '2. E-Commerce Backend API\nProduct catalog, cart, orders, and payment integration. Tech: Spring Boot + JPA + MySQL.',
        '3. Library Management System\nBook inventory, member management, and borrowing records. Tech: Spring Boot + Thymeleaf + H2.',
        '4. Employee Attendance Tracker\nTrack employee check-in/check-out with reports. Tech: Spring Boot + Angular + MySQL.',
        '5. Online Quiz Application\nCreate quizzes, take tests, and view results. Tech: Spring Boot + Angular + MySQL.',
        '6. Hospital Management System\nPatient records, doctor appointments, and billing. Tech: Spring Boot + JPA + MySQL.',
        '7. Blog Platform API\nCreate, read, update, delete blog posts with user authentication. Tech: Spring Boot + JWT + MySQL.',
        '8. Task Management App (Kanban)\nDrag-and-drop task boards with team collaboration. Tech: Spring Boot + Angular + WebSocket.',
        '9. Inventory Management System\nTrack products, suppliers, and stock levels. Tech: Spring Boot + Angular + MySQL.',
        '10. Chat Application\nReal-time messaging using WebSockets. Tech: Spring Boot + Angular + WebSocket.',
        'Pick one project and build it completely. A finished project is worth more than 10 half-built ones.'
      ]
    },
    {
      id: 14,
      title: 'Angular Project Ideas for Beginners to Intermediate Developers',
      excerpt: 'Build a task manager, weather app, quiz platform, or e-commerce UI — 8 Angular project ideas that will strengthen your frontend skills.',
      category: 'Project Ideas', date: 'Apr 9, 2026', readTime: '5 min read',
      tags: ['Angular', 'Frontend', 'Projects', 'Portfolio'],
      content: [
        'Angular projects are great for building your frontend portfolio. Here are 8 ideas from beginner to intermediate.',
        '1. Todo App (Beginner)\nAdd, edit, delete, and filter tasks. Use localStorage for persistence. Great for learning components and data binding.',
        '2. Weather App (Beginner)\nFetch weather data from OpenWeatherMap API. Display temperature, humidity, and forecast. Learn HTTP calls and async data.',
        '3. Quiz App (Beginner-Intermediate)\nMultiple choice questions with timer and score tracking. Learn routing, forms, and state management.',
        '4. Movie Search App (Intermediate)\nSearch movies using OMDB API. Display details, ratings, and posters. Learn reactive forms and HTTP interceptors.',
        '5. E-Commerce UI (Intermediate)\nProduct listing, cart, and checkout flow. Learn complex state management and Angular services.',
        '6. Blog Frontend (Intermediate)\nDisplay blog posts from a REST API. Implement pagination and search. Learn Angular Router and lazy loading.',
        '7. Dashboard with Charts (Intermediate)\nDisplay analytics data using Chart.js or ngx-charts. Learn data visualization in Angular.',
        '8. Real-Time Chat UI (Advanced)\nConnect to a WebSocket backend. Display messages in real-time. Learn RxJS and WebSocket integration.',
        'Start with a beginner project and work your way up. Each project teaches you something new.'
      ]
    },
    {
      id: 15,
      title: 'Python Project Ideas: From Beginner to Advanced',
      excerpt: 'Calculator, web scraper, chatbot, data dashboard — 12 Python project ideas categorized by difficulty to help you build a strong portfolio.',
      category: 'Project Ideas', date: 'Apr 2, 2026', readTime: '7 min read',
      tags: ['Python', 'Projects', 'Data Science', 'Automation'],
      content: [
        'Python is versatile — you can build web apps, automation scripts, data tools, and AI projects. Here are 12 ideas.',
        'Beginner Projects:\n1. Calculator — Basic arithmetic operations with a GUI using Tkinter\n2. Password Generator — Generate strong passwords with customizable options\n3. Number Guessing Game — Simple game with score tracking',
        'Intermediate Projects:\n4. Web Scraper — Scrape job listings from Naukri using BeautifulSoup\n5. Expense Tracker — Track income and expenses with CSV export\n6. Weather CLI Tool — Fetch weather data from an API in the terminal\n7. File Organizer — Automatically sort files into folders by type',
        'Advanced Projects:\n8. Flask REST API — Build a backend API with authentication\n9. Data Dashboard — Visualize CSV data using Pandas and Matplotlib\n10. Chatbot — Simple rule-based chatbot using NLTK\n11. Stock Price Predictor — Use scikit-learn to predict stock trends\n12. Image Classifier — Build a CNN model using TensorFlow',
        'Python projects are highly valued in data science and automation roles. Pick a project that aligns with your career goal.'
      ]
    },
    {
      id: 16,
      title: 'Full Stack Project: Build a Student Management System',
      excerpt: 'A complete walkthrough of building a full-stack student management system using Spring Boot (backend), Angular (frontend), and MySQL (database).',
      category: 'Project Ideas', date: 'Mar 22, 2026', readTime: '14 min read',
      tags: ['Full Stack', 'Spring Boot', 'Angular', 'MySQL'],
      content: [
        'A Student Management System is one of the best full-stack projects for freshers. Here is how to build it end-to-end.',
        'Project Overview:\nFeatures: Add/edit/delete students, view student list, search by name, assign courses.\nTech Stack: Spring Boot (backend) + Angular (frontend) + MySQL (database)',
        'Backend Setup (Spring Boot):\n1. Create entities: Student, Course\n2. Create repositories: StudentRepository, CourseRepository\n3. Create services with business logic\n4. Create REST controllers with CRUD endpoints\n5. Enable CORS for Angular frontend',
        'Database Schema:\nstudents table: id, name, email, phone, course_id\ncourses table: id, name, duration, fee',
        'Frontend Setup (Angular):\n1. Create components: StudentList, StudentForm, CourseList\n2. Create StudentService to call backend APIs\n3. Set up routing between components\n4. Use Angular Material for UI components\n5. Implement search and filter functionality',
        'Connecting Frontend to Backend:\nIn StudentService:\ngetStudents() { return this.http.get<Student[]>(\'/api/students\'); }\naddStudent(s: Student) { return this.http.post(\'/api/students\', s); }',
        'Deployment:\nBuild Angular: ng build --prod\nCopy dist/ to Spring Boot static resources\nDeploy Spring Boot JAR to any server',
        'This project demonstrates your ability to work across the full stack. Add it to your GitHub with a good README and it will stand out to recruiters.'
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.post = this.allPosts.find(p => p.id === id);
      if (!this.post) {
        this.router.navigate(['/blog']);
        return;
      }
      this.seo.setPage({
        title: `${this.post.title} — WebVibes Technology Blog`,
        description: this.post.excerpt,
        keywords: this.post.tags.join(', ') + ', IT training Pune, WebVibes Technology',
        canonical: `https://www.webvibestechnology.in/blog/${this.post.id}`
      });
    });
  }

  getCatClass(category: string): string {
    const map: Record<string, string> = {
      'Interview Questions': 'interview',
      'Tutorials': 'tutorial',
      'Career Guidance': 'career',
      'Project Ideas': 'project'
    };
    return map[category] || 'default';
  }

  getCatGradient(category: string): string {
    const map: Record<string, string> = {
      'Interview Questions': 'linear-gradient(135deg, #7c3aed, #6366f1)',
      'Tutorials': 'linear-gradient(135deg, #2563eb, #0ea5e9)',
      'Career Guidance': 'linear-gradient(135deg, #059669, #10b981)',
      'Project Ideas': 'linear-gradient(135deg, #d97706, #f59e0b)'
    };
    return map[category] || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  }
}
