// Sample roadmap data
const roadmapData = {
    fullstack: {
        title: 'Full Stack Development',
        icon: 'fas fa-globe',
        description: 'Master both frontend and backend development',
        steps: [
            { title: 'HTML & CSS Basics', description: 'Learn the foundation of web development with HTML5 and CSS3' },
            { title: 'JavaScript Fundamentals', description: 'Master JavaScript ES6+ features and DOM manipulation' },
            { title: 'Frontend Framework', description: 'Learn React, Vue, or Angular for modern UI development' },
            { title: 'Backend Development', description: 'Build APIs with Node.js, Python, or other backend technologies' },
            { title: 'Database Design', description: 'Work with SQL and NoSQL databases' },
            { title: 'DevOps & Deployment', description: 'Deploy applications using cloud platforms and CI/CD' }
        ]
    },
    app: {
        title: 'App Development',
        icon: 'fas fa-mobile-alt',
        description: 'Build native and cross-platform mobile applications',
        steps: [
            { title: 'Programming Fundamentals', description: 'Learn programming basics with your chosen language' },
            { title: 'Mobile UI/UX Design', description: 'Understand mobile design principles and user experience' },
            { title: 'Native Development', description: 'iOS (Swift) or Android (Kotlin/Java) development' },
            { title: 'Cross-Platform Tools', description: 'React Native, Flutter, or Xamarin development' },
            { title: 'API Integration', description: 'Connect your app to backend services and APIs' },
            { title: 'App Store Deployment', description: 'Publish your app to Google Play Store and Apple App Store' }
        ]
    },
    dsa: {
        title: 'Data Structures & Algorithms',
        icon: 'fas fa-sitemap',
        description: 'Master problem-solving and coding interview skills',
        steps: [
            { title: 'Programming Language', description: 'Choose and master one language (C++, Java, Python)' },
            { title: 'Basic Data Structures', description: 'Arrays, Linked Lists, Stacks, Queues' },
            { title: 'Advanced Data Structures', description: 'Trees, Graphs, Hash Tables, Heaps' },
            { title: 'Algorithm Techniques', description: 'Sorting, Searching, Recursion, Dynamic Programming' },
            { title: 'Problem Solving', description: 'Practice on LeetCode, HackerRank, Codeforces' },
            { title: 'System Design Basics', description: 'Learn scalability and system architecture concepts' }
        ]
    },
    cybersecurity: {
        title: 'Cybersecurity',
        icon: 'fas fa-shield-alt',
        description: 'Protect systems and data from cyber threats',
        steps: [
            { title: 'Security Fundamentals', description: 'CIA Triad, Risk Management, Security Frameworks' },
            { title: 'Network Security', description: 'Firewalls, VPNs, Intrusion Detection Systems' },
            { title: 'Ethical Hacking', description: 'Penetration testing and vulnerability assessment' },
            { title: 'Cryptography', description: 'Encryption, Digital Signatures, PKI' },
            { title: 'Incident Response', description: 'Security monitoring and incident handling' },
            { title: 'Compliance & Governance', description: 'Security policies, regulations, and best practices' }
        ]
    },
    network: {
        title: 'Network Engineering',
        icon: 'fas fa-network-wired',
        description: 'Design and manage computer networks',
        steps: [
            { title: 'Networking Basics', description: 'OSI Model, TCP/IP, Subnetting' },
            { title: 'Routing & Switching', description: 'Cisco/Juniper routing protocols and switching concepts' },
            { title: 'Network Security', description: 'VPNs, Firewalls, Access Control Lists' },
            { title: 'Wireless Technologies', description: 'Wi-Fi, Bluetooth, Cellular networks' },
            { title: 'Network Monitoring', description: 'SNMP, Network analysis tools, Performance optimization' },
            { title: 'Cloud Networking', description: 'SDN, Network virtualization, Cloud connectivity' }
        ]
    },
    cloud: {
        title: 'Cloud Engineering',
        icon: 'fas fa-cloud',
        description: 'Build and manage cloud infrastructure',
        steps: [
            { title: 'Cloud Fundamentals', description: 'IaaS, PaaS, SaaS concepts and cloud providers' },
            { title: 'Infrastructure as Code', description: 'Terraform, CloudFormation, ARM templates' },
            { title: 'Containerization', description: 'Docker, Kubernetes, Container orchestration' },
            { title: 'Cloud Services', description: 'AWS/Azure/GCP core services and architectures' },
            { title: 'DevOps Integration', description: 'CI/CD pipelines, Monitoring, Logging' },
            { title: 'Cloud Security', description: 'IAM, Encryption, Compliance in cloud environments' }
        ]
    },
    datascience: {
        title: 'Data Science',
        icon: 'fas fa-chart-line',
        description: 'Extract insights from data using statistical methods',
        steps: [
            { title: 'Programming for Data Science', description: 'Python or R programming fundamentals' },
            { title: 'Statistics & Mathematics', description: 'Descriptive/Inferential statistics, Linear algebra' },
            { title: 'Data Manipulation', description: 'Pandas, NumPy, Data cleaning and preprocessing' },
            { title: 'Data Visualization', description: 'Matplotlib, Seaborn, Plotly, Tableau' },
            { title: 'Machine Learning Basics', description: 'Supervised/Unsupervised learning algorithms' },
            { title: 'Big Data Tools', description: 'Spark, Hadoop, SQL databases' }
        ]
    },
    ml: {
        title: 'Machine Learning',
        icon: 'fas fa-robot',
        description: 'Build intelligent systems that learn from data',
        steps: [
            { title: 'ML Fundamentals', description: 'Types of ML, Model evaluation, Cross-validation' },
            { title: 'Supervised Learning', description: 'Regression, Classification algorithms' },
            { title: 'Unsupervised Learning', description: 'Clustering, Dimensionality reduction' },
            { title: 'Deep Learning Basics', description: 'Neural networks, TensorFlow, PyTorch' },
            { title: 'Model Deployment', description: 'MLOps, Model serving, API development' },
            { title: 'Advanced Topics', description: 'NLP, Computer Vision, Reinforcement Learning' }
        ]
    },
    ai: {
        title: 'Artificial Intelligence',
        icon: 'fas fa-brain',
        description: 'Create intelligent systems and AI applications',
        steps: [
            { title: 'AI Foundations', description: 'History of AI, Search algorithms, Knowledge representation' },
            { title: 'Machine Learning Mastery', description: 'Advanced ML techniques and algorithms' },
            { title: 'Deep Learning', description: 'CNNs, RNNs, Transformers, GANs' },
            { title: 'Natural Language Processing', description: 'Text processing, Language models, ChatBots' },
            { title: 'Computer Vision', description: 'Image processing, Object detection, Recognition' },
            { title: 'AI Ethics & Deployment', description: 'Responsible AI, Bias detection, Production systems' }
        ]
    }
};

// Default data for fallback
const defaultResources = {
    fullstack: {
        free: [
            { id: '1', title: 'freeCodeCamp', url: 'https://freecodecamp.org', description: 'Comprehensive web development curriculum' },
            { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Complete web development documentation' },
            { id: '3', title: 'The Odin Project', url: 'https://theodinproject.com', description: 'Full-stack web development course' }
        ],
        paid: [
            { id: '4', title: 'Complete Web Developer Bootcamp', url: 'https://udemy.com', description: 'Comprehensive paid course on Udemy' },
            { id: '5', title: 'Frontend Masters', url: 'https://frontendmasters.com', description: 'Advanced frontend development courses' }
        ]
    }
};

const defaultEvents = [
    // No default events - create events through the admin interface
];

const defaultAnnouncements = [
    { id: '1', title: 'Welcome to Decryptors!', content: "We're excited to launch our new platform. Start exploring the roadmaps and join our growing community of learners.", date: '2024-12-15' }
];
