from flask import Flask, jsonify, request, make_response
import flask_pymongo as PM
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from flask_cors import CORS
import datetime

# import pytz

app = Flask(__name__)

# Configuraciones
app.config["MONGO_URI"] = "mongodb://localhost/shopTAP"
app.config["JWT_SECRET_KEY"] = "ShopTAPKeySecret"
# MongoDB
mongo = PM.PyMongo(app)  # Instancia de PyMongo
dbProd = mongo.db.products  # Instancia de la base de datos de productos
dbUser = mongo.db.users  # Instancia de la base de datos de usuarios
# Cors
CORS(app)
# JWT
jwt = JWTManager(app)
# Zona horaria de la Ciudad de México
# timezone = pytz.timezone("America/Mexico_City")


@app.route("/")
def helloWorld():
    return "<body><h1>Bienvenido a ShopTAP</h1><p>Página de inicio</p></body>"


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    user = dbUser.find_one({"username": username})

    # Si el usuario no existe, retornar un mensaje de error
    if user is None:
        return jsonify({"message": "User not found"}), 404

    # Si el password no coincide, retornar un mensaje de error
    if user["password"] != password:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(PM.ObjectId(user["_id"]))
    )  # Expira en 30 minutos
    # Obtener la hora actual en la zona horaria de la Ciudad de México
    current_time = datetime.datetime.now()  # .now(timezone)
    expiration_time = current_time + datetime.timedelta(minutes=30)
    expiration_time_str = expiration_time.strftime("%Y-%m-%d %H:%M:%S %Z%z")

    return (
        jsonify(
            access_token=access_token,
            expires_in=expiration_time_str,
            user={
                "id": str(PM.ObjectId(user["_id"])),
                "username": user["username"],
            },
        ),
        200,
    )


# Listar todos los productos
@app.route("/products", methods=["GET"])
def getProducts():
    products = []
    for product in dbProd.find():
        products.append(
            {
                "id": str(PM.ObjectId(product["_id"])),
                "name": product["name"],
                "description": product["description"],
                "price": product["price"],
                "stock": product["stock"],
                "category": product["category"],
                "image": product["image"],
                "user_created": product["user_created"],
                "date_created": product["date_created"],
                "user_updated": product["user_updated"],
                "date_updated": product["date_updated"],
            }
        )
    return jsonify(products), 200


# Listar un producto por su id
@app.route("/products/<id>", methods=["GET"])
def getProduct(id):
    try:
        objectId = PM.ObjectId(id)
    except:
        return jsonify({"message": "Invalid id"}), 400

    product = dbProd.find_one({"_id": objectId})

    if product is None:
        return jsonify({"message": "Product not found"}), 404

    return (
        jsonify(
            {
                "id": str(PM.ObjectId(product["_id"])),
                "name": product["name"],
                "description": product["description"],
                "price": product["price"],
                "stock": product["stock"],
                "category": product["category"],
                "image": product["image"],
                "user_created": product["user_created"],
                "date_created": product["date_created"],
                "user_updated": product["user_updated"],
                "date_updated": product["date_updated"],
            }
        ),
        200,
    )


# Crear un producto
@app.route("/products", methods=["POST"])
@jwt_required()
def createProduct():
    name = request.json.get("name")
    description = request.json.get("description")
    price = request.json.get("price")
    stock = request.json.get("stock")
    category = request.json.get("category")
    image = request.json.get("image")

    required = [name, price, category]

    for field in required:
        if field is None:
            return (
                jsonify(
                    {"message": "Error: Missing required fields: name, price, category"}
                ),
                400,
            )

    product = {
        "name": name,
        "description": description or "",
        "price": price,
        "stock": stock or 0,
        "category": category,
        "image": image,
        "user_created": get_jwt_identity(),
        "date_created": datetime.datetime.now(),
        "user_updated": None,
        "date_updated": None,
    }
    dbProd.insert_one(product)

    product["_id"] = str(PM.ObjectId(product["_id"]))

    return jsonify(product), 201


# Actualizar un producto
@app.route("/products/<id>", methods=["PUT"])
@jwt_required()
def updateProduct(id):
    try:
        objectId = PM.ObjectId(id)
    except:
        return jsonify({"message": "Invalid id"}), 400

    name = request.json.get("name")
    description = request.json.get("description")
    price = request.json.get("price")
    stock = request.json.get("stock")
    category = request.json.get("category")
    image = request.json.get("image")

    required = [name, price, category]

    for field in required:
        if field is None:
            return (
                jsonify(
                    {"message": "Error: Missing required fields: name, price, category"}
                ),
                400,
            )

    product = {
        "name": name,
        "description": description,
        "price": price,
        "stock": stock or 0,
        "category": category,
        "image": image,
        "user_updated": get_jwt_identity(),
        "date_updated": datetime.datetime.now(),
    }
    dbProd.update_one({"_id": objectId}, {"$set": product})

    product["_id"] = str(PM.ObjectId(id))
    return jsonify(product), 200


# Eliminar un producto
@app.route("/products/<id>", methods=["DELETE"])
@jwt_required()
def deleteProduct(id):
    try:
        objectId = PM.ObjectId(id)
    except:
        return jsonify({"message": "Invalid id"}), 400

    product = dbProd.delete_one({"_id": objectId})

    return make_response(
        jsonify(
            {
                "message": product.deleted_count > 0
                and "Product deleted"
                or "Product not found",
                "rows_affected": product.deleted_count,
            }
        ),
        product.deleted_count > 0 and 200 or 404,
    )


# Método main
if __name__ == "__main__":
    app.run(debug=True)
