# optimach-fe
Official project for the Optimach Front End Web Apps

*Frontend: Optimach - Web Client*

Optimach is a comprehensive nutrition calculator progressive application which born out of a personal mission. Initially designed as a mobile application solution to help my mother track calories for her weight loss program, which was crucial for managing her osteoarthritis. The project evolved into a Progressive Web App (PWA). This transition was driven by her need for a desktop-accessible tool while working, ensuring her health goals remained within reach regardless of the device. in which she was able to lose over 5 kilograms through this program over a 3 month period. What started as a focused mobile utility has expanded into a full-stack ecosystem, refined by my experience as a Full-Stack Application Developer Intern at Kalbe Consumer Health.


*Frontend Tech Stack*
Framework: Next.js 16.0.8

Styling & UI: * RSuite: Utilized for its robust, enterprise-grade component library, ensuring a consistent and reliable user experience.

Lucide React: Chosen for its sleek, consistent, and intuitive iconography that guides the user through complex nutritional data.

Tailwind CSS: For custom, responsive utility-first styling.


*Key Features & Performance*
Optimistic UI with SWR: To combat the inherent latency of a distributed multi-region system hosting, I implemented SWR (Stale-While-Revalidate). This allows the UI to update "optimistically"  while syncing with the backend in the background.

Skeleton UI : To bridge the gap during initial data fetches across regions, I designed custom Skeleton UI loaders. This ensures the layout remains stable and the user remains engaged.

PWA Ready: Built to be installed on desktop and mobile, providing a native-app feel with the convenience of a web platform.


*Technical Challenges*
The primary challenge in the frontend was managing distributed system latency. With the backend and database hosted across different regions (Vercel, Leapcell, Neon), inter-region connectivity introduced noticeable delays. The combination of SWR and Skeleton screens was a strategic architectural choice to maintain the user experience despite these network hurdles.
