import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "login",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("olaa esse Ã© o backend");
});

app.get("/tabelas", (req, res) => {
  const q = "SELECT * FROM acesso";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/Codigo/:codigo", (req, res) => {
  const { codigo } = req.params;
  const q = `
  SELECT d.*, a.*
  FROM acesso a
  LEFT JOIN dados d ON d.codigo = a.codigo_acesso
  WHERE a.codigo_acesso = ?
`;

  db.query(q, [codigo], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post("/salvarDados", (req, res) => {
  const { codigo, nome, telefone, cpf, nascimento, status } = req.body;
  const qSelect = "SELECT * FROM dados WHERE codigo = ?";
  const qInsert = "INSERT INTO dados (codigo, nome, telefone, cpf, nascimento, status) VALUES (?, ?, ?, ?, ?, ?)";
  const qUpdate = "UPDATE dados SET nome = ?, telefone = ?, cpf = ?, nascimento = ?, status = ? WHERE codigo = ?";

  db.query(qSelect, [codigo], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      db.query(qUpdate, [nome, telefone, cpf, nascimento, status, codigo], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Dados atualizados com sucesso!" });
      });
    } else {
      db.query(qInsert, [codigo, nome, telefone, cpf, nascimento, status], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Dados inseridos com sucesso!" });
      });
    }
  });
});

app.post("/registrarAcesso", (req, res) => {
  const { codigo_acesso, status_acesso, data_acesso, hora_acesso } = req.body;
  
  const qSelectDados = "SELECT * FROM dados WHERE codigo = ?";
  const qInsertDados = "INSERT INTO dados (id, codigo, nome, telefone, cpf, nascimento, status) VALUES (NULL, ?, '', '', '', '', 'Não cadastrado')";
  const qInsertAcesso = "INSERT INTO acesso (codigo_acesso, nome_acesso, telefone_acesso, cpf_acesso, nascimento_acesso, status_acesso, data_acesso, hora_acesso) VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?)";

  db.query(qSelectDados, [codigo_acesso], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      db.query(qInsertDados, [codigo_acesso], (err, results) => {
        if (err) return res.status(500).send(err);
        console.log("Novo cartão registrado na tabela dados");
      });
    } else {
      const { nome, status } = results[0];
      db.query(qInsertAcesso, [codigo_acesso, nome, status, data_acesso, hora_acesso], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Acesso registrado com sucesso!" });
      });
    }
  });
});


app.listen(8800, () => {
  console.log("Connected to backend!");
});