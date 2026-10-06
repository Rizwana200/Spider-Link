# 🕷️ Spider-Link

### AI-Powered College Campus Lost & Found Platform

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/Rizwana200/Spider-Link)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-326CE5?logo=kubernetes)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazon-aws)](https://aws.amazon.com/)
[![GitHub%20Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions)](https://github.com/features/actions)

Spider-Link is a full-stack lost-and-found platform designed primarily for college campuses with multiple blocks, rooms, laboratories, libraries, hostels, canteens, parking areas, and common spaces.

It allows students and staff to report lost and found items and uses an explainable **Spider Sense matching workflow** to identify potentially related reports using attributes such as category, color, description, location, time, and image-related information.

The project was developed as a full-stack application and then extended with **Docker, Docker Compose, GitHub Actions, GitHub Container Registry (GHCR), Kubernetes, and AWS EC2 deployment**.

---

## 🌐 Live Demo

### 🚀 Live Application

**http://13.218.226.157**

### 💻 GitHub Repository

**https://github.com/Rizwana200/Spider-Link**

---

# 🎯 Problem Statement

Finding a lost item in a large college campus can be difficult.

A college may have:

- Multiple academic blocks
- Different floors and rooms
- Laboratories
- Libraries
- Hostels
- Canteens
- Parking areas
- Classrooms
- Seminar halls
- Common areas

Students usually depend on WhatsApp groups, class groups, notice boards, or manually asking other students.

These approaches make it difficult to:

- Organize lost and found reports
- Search for relevant items
- Identify potential matches
- Track notifications
- Protect user contact information

Spider-Link provides a centralized platform to solve this problem.

---

# 💡 Solution

Spider-Link provides a complete lost-and-found workflow.

```text
                    USER
                      │
                      ▼
             ┌─────────────────┐
             │ Report Lost /   │
             │ Found Item      │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Spider Sense   │
             │ Matching Logic  │
             └────────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    Category       Location        Time
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
               Potential Match
                      │
                      ▼
                 Notification
                      │
                      ▼
              Mutual Acceptance
                      │
                      ▼
             Contact Information
```
# ✨ Features

## 👤 User Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Authentication persistence
- Logout functionality

---

## 📦 Lost Item Reporting

Users can report items they have lost.

Information can include:

- Item name
- Category
- Color
- Description
- Location
- Time
- Other identifying details

---

## 🔎 Found Item Reporting

Users can report items they have found.

The information can later be compared with lost reports to identify possible owners.

---

# 🕷️ Spider Sense Matching

Spider-Link's main functionality is its matching workflow.

The system compares relevant information from lost and found reports to identify potentially related items.

Matching can consider:

- Category
- Color
- Description/text
- Location
- Time
- Image-related information

### Example

```text
Lost Item
│
├── Category: Electronics
├── Color: Black
├── Location: Block A
├── Time: 2:30 PM
└── Description: Black wireless earbuds
          │
          ▼
   Spider Sense
          │
          ▼
Found Item
│
├── Category: Electronics
├── Color: Black
├── Location: Block A
├── Time: 3:00 PM
└── Description: Black earbuds
          │
          ▼
    Potential Match

The goal is to reduce the amount of manual searching required by users.
```
---

# 🔔 Notifications

Users can receive notifications when relevant matching reports or interactions are identified.

This allows users to respond to potential matches without continuously searching through all reports.

---

# 🔐 Privacy-Aware Contact Sharing

Spider-Link does not immediately expose user contact information.

A mutual interaction and acceptance workflow is used before contact information is shared.

This helps protect user privacy while still allowing successful item recovery.

# 🎨 Frontend

The Spider-Link frontend is built using **React and Vite**.

It provides the user interface for:

- User registration and login
- Reporting lost items
- Reporting found items
- Viewing potential matches
- Viewing notifications
- Managing user information
- Interacting with the matching workflow

### Frontend Technologies

- React
- Vite
- JavaScript
- HTML
- CSS

### Run Frontend Locally

```bash
cd client
npm install
npm run dev
```
The frontend development server normally runs at:

    http://localhost:5173

### Frontend Docker Image

Build the frontend image:

    docker build -t spider-link-frontend:v1 ./client

Run the frontend container:

    docker run -d \
      --name spider-link-frontend \
      -p 8081:80 \
      spider-link-frontend:v1

Check the running container:

    docker ps

---

# ⚙️ Backend

The backend is built using **Node.js and Express.js**.

It provides REST APIs for:

- Authentication
- User profiles
- Lost item reports
- Found item reports
- Matching
- Notifications
- Location search

### Backend Technologies

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- REST APIs

### Run Backend Locally

    cd server
    npm install
    npm start

The backend runs on:

    http://localhost:5000

### Backend Docker Image

Build the backend image:

    docker build -t spider-link-backend:v1 ./server

Run the backend container:

    docker run -d \
      --name spider-link-backend \
      -p 5000:5000 \
      spider-link-backend:v1

View backend logs:

    docker logs spider-link-backend

---

# 🐳 Docker

Docker was used to containerize both the frontend and backend.

This makes the application easier to run consistently across development and deployment environments.

### Build Frontend

    docker build -t spider-link-frontend:v1 ./client

### Build Backend

    docker build -t spider-link-backend:v1 ./server

### Check Docker Images

    docker images

### Check Running Containers

    docker ps

### Stop Containers

    docker stop spider-link-frontend
    docker stop spider-link-backend

### Remove Containers

    docker rm spider-link-frontend
    docker rm spider-link-backend
    ```
    ---

# 🔗 Docker Compose

Docker Compose was used to manage the frontend and backend services together.

### Start the Services

    docker compose up --build

### Run in Detached Mode

    docker compose up -d --build

### Check Services

    docker compose ps

### View Logs

    docker compose logs

### Stop Services

    docker compose down

---

# ⚙️ GitHub Actions CI/CD

GitHub Actions was used to automate the build and deployment workflow.

The workflow files are stored inside:

    .github/workflows/

The CI/CD process follows this flow:

    Developer
        │
        │ git push
        ▼
    GitHub Repository
        │
        ▼
    GitHub Actions
        │
        ├── Checkout Code
        ├── Build Application
        ├── Build Docker Images
        └── Push Images
                │
                ▼
               GHCR

This automation reduces manual work whenever changes are pushed to the repository.

---

# 📦 GitHub Container Registry

Docker images are stored using **GitHub Container Registry (GHCR)**.

The workflow is:

    Source Code
         │
         ▼
    GitHub Actions
         │
         ▼
    Docker Build
         │
         ├───────────────┐
         ▼               ▼
    Frontend Image   Backend Image
         │               │
         └───────┬───────┘
                 ▼
                GHCR

### Login to GHCR

    echo $CR_PAT | docker login ghcr.io \
      -u YOUR_GITHUB_USERNAME \
      --password-stdin

### Build Frontend Image

    docker build \
      -t ghcr.io/rizwana200/spider-link-frontend:latest \
      ./client

### Push Frontend Image

    docker push ghcr.io/rizwana200/spider-link-frontend:latest

### Build Backend Image

    docker build \
      -t ghcr.io/rizwana200/spider-link-backend:latest \
      ./server

### Push Backend Image

    docker push ghcr.io/rizwana200/spider-link-backend:latest

---

# ☸️ Kubernetes

Kubernetes was used to deploy and manage the containerized Spider-Link application.

It provides:

- Container orchestration
- Deployment management
- Service management
- Container restart and recovery
- Scalable deployment

Kubernetes configuration files are stored inside:

    k8s/

### Start Minikube

    minikube start --driver=docker

### Check Minikube Status

    minikube status

### Check Kubernetes Cluster

    kubectl cluster-info

### Check Nodes

    kubectl get nodes

### Deploy the Application

    kubectl apply -f k8s/

### Check Deployments

    kubectl get deployments

### Check Pods

    kubectl get pods

### Check Services

    kubectl get services

### Check All Resources

    kubectl get all

### Kubernetes Debugging

View pod logs:

    kubectl logs <pod-name>

Describe a pod:

    kubectl describe pod <pod-name>

Delete the Kubernetes deployment:

    kubectl delete -f k8s/

---

# ☁️ AWS Deployment

Spider-Link was deployed to an **AWS EC2 instance** to make the application accessible over the internet.

The deployment flow is:

    GitHub
       │
       ▼
    GitHub Actions
       │
       ▼
    Docker Build
       │
       ▼
    GHCR
       │
       ▼
    AWS EC2
       │
       ▼
    Kubernetes
       │
       ▼
    Spider-Link
       │
       ▼
    Public Internet

### AWS EC2

The EC2 instance acts as the cloud server for the application.

Connect to the EC2 instance:

    ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

Depending on the operating system, the SSH username may be different.

### Check Docker

    docker --version

### Check Kubernetes

    kubectl version --client

### Pull Frontend Image

    docker pull ghcr.io/rizwana200/spider-link-frontend:latest

### Pull Backend Image

    docker pull ghcr.io/rizwana200/spider-link-backend:latest

### Deploy Kubernetes Resources

    kubectl apply -f k8s/

### Check Deployment

    kubectl get pods
    kubectl get services
    kubectl get deployments

---

# 🌐 Live Deployment

Spider-Link is deployed and publicly accessible through AWS EC2.

### Live Website

    http://13.218.226.157

---

# 🔄 Complete DevOps Pipeline

    Developer
        │
        ▼
      GitHub
        │
     git push
        │
        ▼
    GitHub Actions
        │
        ▼
    Docker Build
        │
     ┌──┴──┐
     ▼     ▼
    Frontend  Backend
     Image     Image
       │         │
       └────┬────┘
            ▼
           GHCR
            │
            ▼
       Kubernetes
            │
            ▼
         AWS EC2
            │
            ▼
      Live Application
            │
            ▼
    http://13.218.226.157

---

# 🚀 Deployment Summary

| Stage | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | User interface |
| Backend | Node.js + Express | REST APIs |
| Database | MySQL | Store application data |
| ORM | Sequelize | Database interaction |
| Authentication | JWT | Secure authentication |
| Containerization | Docker | Package applications |
| Multi-container | Docker Compose | Run services together |
| CI/CD | GitHub Actions | Automate builds |
| Registry | GHCR | Store Docker images |
| Orchestration | Kubernetes | Manage containers |
| Local Kubernetes | Minikube | Test Kubernetes locally |
| Cloud | AWS EC2 | Host application |
| Public Access | EC2 Public IP | Access application online |
