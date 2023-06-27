import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";

import { NewProduct, Product } from "../models/Product";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../services/ProductService";
import { EventRegister } from "../helpers";

const Products: React.FC = () => {
  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Nombre",
        accessorKey: "name",
      },
      {
        header: "Descripción",
        accessorKey: "description",
      },
      {
        header: "Precio",
        accessorKey: "price",
      },
      {
        header: "Stock",
        accessorKey: "stock",
      },
      {
        header: "Categoría",
        accessorKey: "category",
      },
      {
        header: "Fecha de creación",
        accessorKey: "date_created",
      },
      {
        header: "Fecha de actualización",
        accessorKey: "date_updated",
      },
      {
        header: "Imagen",
        accessorKey: "image",
        cell: ({ row }) =>
          row.original.image.length ? (
            <img
              src={row.original.image}
              alt={row.original.name}
              style={{ width: "100px" }}
            />
          ) : (
            <></>
          ),
      },
      {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => (
          <>
            <Button
              variant="outline-primary"
              onClick={() => handleEdit(row.original)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              className="mt-1"
              onClick={() => {
                setProductDto(row.original);
                setOpenDeleteModal(true);
              }}
            >
              Eliminar
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const products = useQuery({
    queryKey: ["AllProducts"],
    queryFn: getAllProducts,
  });
  const newProduct = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProduct,
    onSuccess: (resp) => {
      if ("msg" in resp) {
        EventRegister.emit("showAlert", {
          type: "error",
          title: "Error",
          message:
            (resp.msg as string) || "Ocurrió un error al crear el producto",
          duration: 3000,
        });
      } else {
        setOpenModal(false);
        EventRegister.emit("showAlert", {
          type: "success",
          title: "Éxito",
          message: "Producto creado correctamente",
          duration: 3000,
        });
        products.refetch();
      }
    },
  });
  const upProduct = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProduct,
    onSuccess: (resp) => {
      if ("msg" in resp) {
        EventRegister.emit("showAlert", {
          type: "error",
          title: "Error",
          message:
            (resp.msg as string) ||
            "Ocurrió un error al actualizar el producto",
          duration: 3000,
        });
      } else {
        setOpenModal(false);
        EventRegister.emit("showAlert", {
          type: "success",
          title: "Éxito",
          message: "Producto actualizado correctamente",
          duration: 3000,
        });
        products.refetch();
      }
    },
  });
  const dtProduct = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProduct,
    onSuccess: (resp) => {
      if ("msg" in resp) {
        EventRegister.emit("showAlert", {
          type: "error",
          title: "Error",
          message:
            (resp.msg as string) || "Ocurrió un error al eliminar el producto",
          duration: 3000,
        });
      } else {
        setOpenDeleteModal(false);
        EventRegister.emit("showAlert", {
          type: "success",
          title: "Éxito",
          message: "Producto eliminado correctamente",
          duration: 3000,
        });
        products.refetch();
      }
    },
  });

  const form = useForm<NewProduct>();
  const table = useReactTable({
    columns,
    data: products.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [productDto, setProductDto] = React.useState<Product | null>(null);

  const handleSave: SubmitHandler<NewProduct> = (data) => {
    if (productDto) {
      const product = { ...productDto, ...data };
      upProduct.mutate(product);
    } else newProduct.mutate(data);
  };

  const handleEdit = (data: Product) => {
    setProductDto(data);
    form.setValue("name", data.name);
    form.setValue("description", data.description);
    form.setValue("price", data.price);
    form.setValue("stock", data.stock);
    form.setValue("category", data.category);

    setOpenModal(true);
  };

  const handleDelete = () => productDto && dtProduct.mutate(productDto.id);

  return (
    <Row>
      <Col xs={12} className="py-2">
        <Button
          variant="primary"
          onClick={() => {
            form.reset();
            setOpenModal(true);
          }}
        >
          Nuevo producto
        </Button>
      </Col>
      <Col xs={12} className="py-2">
        <Table variant="dark" striped bordered hover responsive>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr className="text-center">
                <td colSpan={columns.length}>No hay productos</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>

      {/* Modal Crear/Editar */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{productDto ? "Editar" : "Crear"} producto</Modal.Title>
        </Modal.Header>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <Modal.Body>
            <Row>
              <Col xs={12} className="py-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  {...form.register("name", {
                    required: "El nombre es requerido",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {form.formState.errors.name && (
                  <div className="text-danger">
                    {form.formState.errors.name.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="py-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción"
                  {...form.register("description", {
                    required: false,
                    minLength: {
                      value: 10,
                      message:
                        "La descripción debe tener al menos 10 caracteres",
                    },
                  })}
                />
                {form.formState.errors.description && (
                  <div className="text-danger">
                    {form.formState.errors.description.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="py-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Precio"
                  {...form.register("price", {
                    required: "El precio es requerido",
                    min: {
                      value: 0,
                      message: "El precio debe ser positivo",
                    },
                  })}
                />
                {form.formState.errors.price && (
                  <div className="text-danger">
                    {form.formState.errors.price.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="py-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  {...form.register("stock", {
                    required: "El stock es requerido",
                    min: {
                      value: 0,
                      message: "El stock debe ser positivo",
                    },
                  })}
                />
                {form.formState.errors.stock && (
                  <div className="text-danger">
                    {form.formState.errors.stock.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="py-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Categoría"
                  {...form.register("category", {
                    required: "La categoría es requerida",
                    minLength: {
                      value: 3,
                      message: "La categoría debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 15,
                      message: "La categoría puede tener máximo 15 caracteres",
                    },
                  })}
                />
                {form.formState.errors.category && (
                  <div className="text-danger">
                    {form.formState.errors.category.message}
                  </div>
                )}
              </Col>
              <Col xs={12} className="py-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Imagen"
                  {...form.register("image", {
                    required: false,
                    pattern: {
                      value: /\.(gif|jpe?g|png|webp)$/i,
                      message: "La imagen debe ser una URL válida",
                    },
                  })}
                />
                {form.formState.errors.image && (
                  <div className="text-danger">
                    {form.formState.errors.image.message}
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        show={openDeleteModal}
        onHide={() => {
          setOpenDeleteModal(false);
          setProductDto(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar el producto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setOpenDeleteModal(false);
              setProductDto(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default Products;
