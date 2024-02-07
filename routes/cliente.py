from flask import Blueprint, request, render_template
from database.clientes import CLIENTES


""" listar os clientes """
""" inserir os dados do cliente """
""" formulario para cadastrar um cliente """
""" exibir detalhes do cliente """
""" formulario para editar um cliente """
""" atualizar informacoes do cliente """
""" deletar cliente """


cliente_route = Blueprint('cliente', __name__)

@cliente_route.route("/")
def lista_clientes():
    return render_template("lista_clientes.html", clientes=CLIENTES)

@cliente_route.route("/", methods=["POST"])
def inserir_cliente():

    data = request.json

    novo_usr = {
        "id": len(CLIENTES) + 1,
        "nome": data["nome"],
        "email": data["email"],
    }

    CLIENTES.append(novo_usr)

    return render_template("item_cliente.html", cliente=novo_usr)

@cliente_route.route("/new")
def form_cliente():
    return render_template("form_cliente.html")

@cliente_route.route("/<int:cliente_id>")
def detalhe_cliente():
    pass

@cliente_route.route("/<int:cliente_id>/edit")
def edit_cliente():
    pass

@cliente_route.route("/<int:cliente_id>/update", methods=['PUT'])
def update_cliente():
    pass

@cliente_route.route("/<int:cliente_id>/delete", methods=['DELETE'])
def delete_cliente(cliente_id):

    global CLIENTES
    CLIENTES = [c for c in CLIENTES if c['id'] != cliente_id ]

    return "ok"