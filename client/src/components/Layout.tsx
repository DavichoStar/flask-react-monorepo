import { Outlet, useNavigate } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";
import React from "react";

import NavBar from "./Navbar";
import { AlertContent } from "../models/Global";
import { EventRegister } from "../helpers";
import { checkToken } from "../services/LoginService";

const Layout: React.FC = () => {
  const [alerts, setAlerts] = React.useState<AlertContent[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const isValid = checkToken();
    if (!isValid) return navigate("/");

    EventRegister.on("showAlert", (alert) => {
      setAlerts((prev) => [...prev, alert]);
      if (alert.duration)
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a !== alert));
        }, alert.duration);
    });
  }, []);

  return (
    <>
      {alerts.map((alert) => (
        <Alert
          key={alerts.indexOf(alert)}
          variant={alert.type}
          onClose={() => {
            setAlerts((prev) => prev.filter((a) => a !== alert));
          }}
          dismissible
          className="mt-3"
          style={{ zIndex: 8787, position: "fixed", top: 0, right: 0 }}
        >
          {alert.message && alert.title ? (
            <>
              <Alert.Heading>{alert.title}</Alert.Heading>
              <p>{alert.message}</p>
            </>
          ) : (
            alert.message
          )}
        </Alert>
      ))}
      <NavBar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
