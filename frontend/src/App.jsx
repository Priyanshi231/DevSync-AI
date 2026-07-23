import { UserProvider } from "./context/user.context";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </div>
  )
}

export default App
