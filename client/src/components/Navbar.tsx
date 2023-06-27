import { Container } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import React from "react";
import { FirstCapitalLetter } from "../helpers";

const NavBar: React.FC = () => {
  const [user, setUser] = React.useState<{ username: string; id: string }>();

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `px-2 nav-link ${isActive ? "text-primary" : "text-black"}`
          }
          style={{ fontSize: "1.4rem" }}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `nav-link ${isActive ? "text-primary" : "text-black"}`
          }
        >
          Acerca de
        </NavLink>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Registrado como:{" "}
            <NavLink to="/" onClick={() => localStorage.clear()}>
              <a>{FirstCapitalLetter(user?.username || "desconocido")}</a>
            </NavLink>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
