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

Data will be collected from user interactions, and there will be an "admin dashboard" to upload content.

This is a website.

## Project Goal
The project goal is to enable end users of medical devices to complete basic troubleshooting on their devices without having to wait on a support agent to be available. The secondary goal will be to gather data on the types of issues and steps taken by end users for product improvement. 

## Users
The users will be existing users of a hardware/software ecosystem, looking for support. For example, an EMT needing assistance troubleshooting a medical device that stores blood.
The internal users will be support personnel.

## Data
Data will be in the following formats:
- Diagnostic Steps
- User sessions & Resolutions

## Database Schema
- Potential issues:
  - Sensitive information: Users' names, emails, other contact information will need to be collected.
- Functionality:
  - User flow: I imagine the users' flow to be an interactive branching decision tree or a "choose your own adventure" style experience. They will begin by choosing the particular product they need help with, then narrow down the type of issue they are experiencing with checks along the way to redirect them if needed. 
- Beyond CRUD: This website will be interactive in that it will guide the user to (hopefully) a resolution. In order to reach that resolution, they will have to interact with the website, provide information, try out steps, and report back results.

# Project Approach
1. Database Schema
    - Content: Stores articles, steps, user info, user sessions & resolutions
    - Categories: Categorize by Product Type, Resolution Type
2. Potential API Issues
    - Data Consistency: Ensuring valid data is collected from users and repeat users are properly identified.
    - Scalability: Large-scale platform adoption could cause issues.
    - Error Handling: Safely handle errors and display client-side, so the user isn't troubleshooting the troubleshooting app.
3. Sensitive Information: User Email Addresses
4. Functionality
    - Content Display: Users can view articles, work through resolution steps
    - Activity Tracking: Track which steps of which article the users are resolving their issues at, or if the issue needed to be escalated.
5. User Flow
    - User must sign up to access the app
    - Homepage: Displays articles, grouped by product
    - Article: Step-by-step guide detailing troubleshooting steps, with an option to record if the issue was resolved.

