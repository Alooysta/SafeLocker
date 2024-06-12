import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./paginas/login";
import Acessos from "./paginas/tabelas";
import Configurar from "./paginas/configurar";
import Creditos from "./paginas/creditos"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tabelas" element={<Acessos />} />
          <Route path="/Codigo/:codigo" element={<Configurar />} />
          <Route path="/Creditos" element={<Creditos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

