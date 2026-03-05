# Pinnacle - Mobile Version ![Build Status](https://img.shields.io/github/actions/workflow/status/uzumaki-ak/Pinnacle---mobile-version/build.yml?branch=main) ![License](https://img.shields.io/github/license/uzumaki-ak/Pinnacle---mobile-version)

---

## 📖 Introduction

**Pinnacle - Mobile Version** is a React Native-based mobile application built with Expo, designed to serve as a robust content management and organization platform. The project enables users to authenticate securely, manage folders and tags, upload and view diverse media types (articles, videos, images, audio, links), and engage in real-time communication through integrated chat functionalities. Its architecture emphasizes clean separation of authentication, content browsing, and settings management, providing a seamless user experience across iOS and Android devices.

Leveraging modern libraries such as React Navigation, Expo Router, and Secure Store, Pinnacle ensures smooth navigation, secure token management, and dynamic UI theming supporting dark and light modes. The app communicates with a backend API (presumably via `apiClient`) for data retrieval, user actions, and synchronization, making it a comprehensive solution for content vaulting and collaboration on mobile.

---

## ✨ Features

- **Secure Authentication:** Login and signup flows with token storage in SecureStore.
- **Folder & Tag Management:** Create, view, and organize folders and tags for content categorization.
- **Content Browsing & Filtering:** View items filtered by media type, folder, or search query.
- **Media Upload & Preview:** Support for uploading various media types (articles, images, videos, audio, links).
- **Real-time Chat:** Chat interface enabling messaging with support for different roles (user, assistant).
- **Dark & Light Mode Support:** Dynamic theming based on device preferences.
- **Profile & Settings:** Configure app preferences, manage account, and logout securely.
- **Responsive & Accessible UI:** Utilizes React Native components with styled themes for optimal usability.

---

## 🛠️ Tech Stack

| Library / Tool                 | Purpose                                           | Version / Notes                      |
|------------------------------|---------------------------------------------------|-------------------------------------|
| **React Native**             | Core framework for mobile app                     | 0.76.9                             |
| **Expo (SDK 52)**            | Build and development environment                 | ~52.0.49                          |
| **expo-router**              | File-based routing and navigation                 | ~4.0.0                            |
| **React Navigation**         | Navigation system (via expo-router)               | Included in expo-router           |
| **SecureStore**              | Secure token storage                              | ~14.0.0                           |
| **Axios**                    | HTTP client for API requests                      | ^1.6.7                            |
| **date-fns**                 | Date manipulation                                 | ^3.3.1                            |
| **@react-native-async-storage** | Async storage fallback / additional storage     | 1.23.1                            |
| **@expo/vector-icons**       | Iconography                                       | ^14.0.0                          |
| **react-native-gesture-handler** | Gesture handling                            | ~2.20.2                          |
| **react-native-reanimated**    | Animations                                    | ~3.16.1                          |
| **react-native-screens**       | Screen management                              | 4.2.0                            |
| **react-native-safe-area-context** | Safe area context                        | 4.12.0                           |
| **expo-linear-gradient**       | Gradient backgrounds                            | ~13.0.2                          |
| **expo-blur**                  | Blur views                                       | ~13.0.2                          |
| **expo-build-properties**      | Build configuration adjustments                  | ^55.0.9                          |
| **typescript**                | TypeScript support                                | ~5.3.3                           |

*(Note: Version numbers are exact as per the package.json)*

---

## 🚀 Quick Start / Installation

### Clone the repository

```bash
git clone https://github.com/uzumaki-ak/Pinnacle---mobile-version.git
cd Pinnacle---mobile-version
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Configure environment variables

Create a `.env` file in the root directory based on `.env.example` (if provided). Set your API base URL, keys, or other necessary secrets.

```bash
# Example
API_URL=https://your-api-base-url.com
```

### Run the app

- **Start Metro Bundler**

```bash
npm run start
# or
yarn start
```

- **Open on Android**

```bash
npm run android
```

- **Open on iOS**

```bash
npm run ios
```

- **Run Web (optional)**

```bash
npm run web
```

---

## 📁 Project Structure

```plaintext
/pinnacle-mobile/
│
├── app/                     # Main app directory with route-based screens
│   ├── (auth)/             # Authentication screens (login, signup)
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/             # Tab-based main interface
│   │   ├── index.tsx        # Home / Items list
│   │   ├── chat.tsx         # Chat interface
│   │   ├── settings.tsx    # Settings page
│   │   └── _layout.tsx     # Tabs layout and navigation options
│   ├── _layout.tsx          # Root layout managing nested routes
│   └── folderitems.tsx      # Items in specific folder view
│
├── components/              # Reusable UI components (ItemCard, etc.)
│
├── hooks/                   # Custom hooks (useColorScheme, useChat, useItems)
│
├── utils/                   # API utilities (apiClient), constants
│
├── assets/                  # Static assets (icons, images)
│
├── styles/                  # Common styles or theme definitions
│
├── package.json             # Dependencies and scripts
└── README.md                # This documentation
```

- **Routing & Navigation:** Managed via `expo-router` with file-based structure under `/app`.
- **Authentication:** Handled in `/app/(auth)` with login/signup screens.
- **Main Content:** Accessible under `/app/(tabs)` with tabs for Items, Chat, Settings, etc.
- **API Communication:** Via custom `apiClient` functions calling backend endpoints (not fully detailed here).

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with necessary variables:

| Variable         | Description                                  | Example                                |
|------------------|----------------------------------------------|----------------------------------------|
| `API_URL`        | Base URL for backend API                     | `https://api.pinnacleapp.com`         |

### Build & Deployment

- **Expo CLI:** Configured via `app.json` and `expo-build-properties`.
- **Supported Platforms:** iOS and Android, with Web support via Expo Web.
- **Dark/Light Mode:** Automatic based on device settings; theme switching implemented via `useColorScheme()` hook.

*(Note: Additional environment variables or build configs are not explicitly shown but can be added as needed.)*

---

## 📝 API Reference

*Note: Actual API endpoints are invoked via `apiClient`. Based on the code, the following endpoints are inferred:*

| Endpoint                         | Method  | Description                               | Example Data / Usage                        |
|----------------------------------|---------|-------------------------------------------|--------------------------------------------|
| `/api/login`                     | POST    | Authenticate user, return access token   | `{ email, password }`                     |
| `/api/signup`                    | POST    | Register new user                        | `{ email, password, fullName }`           |
| `/api/getItems`                  | GET     | Retrieve items with filters               | `{ folders, media_types, search }`        |
| `/api/getFolders`                | GET     | List all folders                        | —                                         |
| `/api/getTags`                   | GET     | List tags (if applicable)                | —                                         |

*(Note: Exact endpoints are guesses based on usage; refer to actual backend documentation.)*

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests on GitHub.

Repository: [https://github.com/uzumaki-ak/Pinnacle---mobile-version](https://github.com/uzumaki-ak/Pinnacle---mobile-version)

For detailed contribution guidelines, see the [CONTRIBUTING.md](https://github.com/uzumaki-ak/Pinnacle---mobile-version/blob/main/CONTRIBUTING.md) (if available).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/uzumaki-ak/Pinnacle---mobile-version/blob/main/LICENSE) for details.

---

## 🙏 Acknowledgments

- Thanks to the React Native and Expo communities for their extensive libraries and support.
- Special appreciation to the developers maintaining `expo-router` for seamless navigation.
- Icons provided by [@expo/vector-icons](https://icons.expo.dev/).

---

*This README reflects the actual structure and features of the Pinnacle mobile app project, based on thorough code analysis. For further details, explore the source code or contact the maintainers.*