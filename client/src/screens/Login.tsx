import { Col, Row, Container, Button, Card } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import React from "react";

import { login } from "../services/LoginService";
import { LoginData } from "../models/User";

const Login: React.FC = () => {
  const loginServer = useMutation({
    mutationFn: login,
    onSuccess: (resp) => {
      if (!("message" in resp)) {
        localStorage.setItem("token", resp.access_token);
        localStorage.setItem("expires_in", resp.expires_in);
        localStorage.setItem("user", JSON.stringify(resp.user));
        window.location.href = "/products";
      } else {
        if (resp.message === "User not found") {
          form.setError("username", {
            message: "Usuario no encontrado",
          });
        } else if (resp.message === "Invalid credentials") {
          form.setError("password", {
            message: "Contraseña incorrecta",
          });
        } else {
          form.setError("username", {
            message: resp.message,
          });
        }
      }
    },
  });

  const form = useForm<LoginData>();

  const handleLogin: SubmitHandler<LoginData> = (data) => {
    loginServer.mutate(data);
  };

  return (
    <Container
      className="text-center d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card>
        <Card.Header>
          <Card.Title>
            <h2>INICIAR SESIÓN</h2>
          </Card.Title>
          <Card.Subtitle>Ingresa tus datos</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <Row>
              <Col xs={12}>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  {...form.register("username", {
                    required: "Ingresa un nombre de usuario",
                  })}
                />
                {form.formState.errors.username && (
                  <div className="text-danger">
                    {form.formState.errors.username.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="p-2">
                <input
                  type="password"
                  placeholder="Contraseña"
                  {...form.register("password", {
                    required: "Ingresa una contraseña",
                  })}
                />
                {form.formState.errors.password && (
                  <div className="text-danger">
                    {form.formState.errors.password.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="pt-2">
                <Button type="submit">Entrar</Button>
              </Col>
            </Row>
          </form>
        </Card.Body>
        <Card.Footer>
          TESCHA 4471 - Tópicos Avanzados de Programación
          <p>
            By{" "}
            <Card.Link href="https://github.com/DavichoStar">
              DavichoStar
            </Card.Link>
          </p>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Login;
