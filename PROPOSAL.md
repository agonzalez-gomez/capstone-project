## Proposal
This is a project proposal for an interactive troubleshooting site for medical devices.

## Tech Stack
MERN Stack, via Render:
- MongoDB (Mongoose) Database
- Express Backend
- React Frontend (primarily MUI)
- Node Environment.

Authentication via JWT with `bcrypt` hashing.

## Type
This is a primarily frontend app to allow for users to diagnose common hardware and software issues.

Data is collected from user interactions as they work through troubleshooting guides. Guide content is loaded into the database with a seed script.

This is a website.

## Project Goal
The project goal is to enable end users of medical devices to complete basic troubleshooting on their devices without having to wait on a support agent to be available. The secondary goal is to gather data on the types of issues and steps taken by end users for product improvement.

## Users
The users are existing users of a hardware/software ecosystem, looking for support. For example, an EMT needing assistance troubleshooting a medical device that stores blood.

Support personnel are the intended recipients of support tickets. Internal tools for support personnel are out of scope for this version.

## Data
Data is stored in the following formats:
- Articles: multi-page troubleshooting guides, grouped by category
- Sessions: each time a user works through an article, including the page they reached, whether it was resolved, and their rating and comments
- Tickets: support requests submitted when an article did not resolve the issue

## Database Schema
- Collections:
  - Users: email (used as the username) and a `bcrypt` password hash
  - Articles: category, title, slug, subtitle, description, and an ordered list of pages (title, optional image, content)
  - Sessions: user id, article slug, current page, resolved, rating (1-5), comments
  - Tickets: user id, session id, article slug, page, description, status
- Potential issues:
  - Sensitive information: Users' email addresses are collected. Passwords are never stored in plain text.
- Functionality:
  - User flow: Users choose a category and article (or search for one), then work through the article one page at a time. Each page asks "Did this fix it?" so the user can stop as soon as their issue is resolved, or continue to the next step.
- Beyond CRUD: This website is interactive in that it guides the user to (hopefully) a resolution. In order to reach that resolution, they interact with the website, try out steps, and report back results. If the article does not resolve the issue, the user can submit a support ticket that includes where they left off.

# Project Approach
1. Database Schema
    - Content: Stores articles, pages, user info, user sessions & resolutions, and support tickets
    - Categories: Articles are categorized by topic (for example Power & Battery, Connectivity, Temperature & Storage)
2. Potential API Issues
    - Data Consistency: All session and ticket data is validated on the server. User ids come from the login token, and users can only update their own sessions and view their own tickets.
    - Scalability: Large-scale platform adoption could cause issues.
    - Error Handling: Safely handle errors and display client-side, so the user isn't troubleshooting the troubleshooting app.
3. Sensitive Information: User Email Addresses
    - Article statistics shown to users are aggregated, and never include user ids or comments.
4. Functionality
    - Content Display: Users can search and browse articles by category, and work through each article's steps.
    - Activity Tracking: A session is recorded when a user opens an article, and updated as they move between pages, so we can see which step resolved the issue or where users stopped.
    - Feedback: When an issue is resolved, users rate the article (1-5 stars) and can leave comments.
    - Escalation: If an article does not resolve the issue, users can submit a support ticket describing the problem.
    - Article Statistics: Each article shows its average rating, resolution rate, number of uses, and the page where it most often resolves the issue.
5. User Flow
    - User must sign up to access the app
    - Homepage: Search for articles, or browse articles grouped by category with a category filter
    - Article: Step-by-step guide detailing troubleshooting steps. Each page has a "Did this fix it?" option:
        - Yes: the user rates the article and the session is recorded as resolved
        - No: the user continues to the next step
        - On the last step, "No" (or choosing "No" after Finish) opens a support ticket form
    - My Tickets: A customer portal listing the user's submitted tickets, with the article and page, description, status, and when it was submitted
    - About: An overview of the app and how it works

# Future Work
- Admin dashboard for support personnel to create and edit articles, and to view and respond to tickets
- Branching "choose your own adventure" articles, where answers send the user to different steps
- Grouping articles by product, in addition to topic
