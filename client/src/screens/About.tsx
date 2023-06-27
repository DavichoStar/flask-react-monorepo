import { Col, Row } from "react-bootstrap";
import React from "react";

const About: React.FC = () => {
  return (
    <Row className="mt-2">
      <Col>
        <h1>Acerca de esta página</h1>
        <p>
          Esta página fue creada para el curso de Tópicos Avanzados de
          programación del Tecnológico de Estudios Superiores de Chalco.
        </p>

        <p>
          El objetivo de esta página es mostrar el uso de React como aplicación
          cliente (Front-End) y Flask como aplicación servidor (Back-End) y con
          el cuál se accede a una base de datos MongoDB (NoSQL).
        </p>

        <p>
          El código fuente de esta página se encuentra en el siguiente
          repositorio de
          <a
            href="https://github.com/DavichoStar/flask-react-monorepo"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>

        <p>Elaborado por: Erick Flores (DavichoStar) del grupo 4471</p>
      </Col>
    </Row>
  );
};

export default About;
