import React from "react";
import BodyComponent from "./components/bodyComponent";
import HeaderComponent from "./components/headerComponent";

export default function App() {
  return (
    <div>
      <HeaderComponent />
      <BodyComponent />
    </div>
  );
}

// npx create-react-app covid19tracker
// npm start
