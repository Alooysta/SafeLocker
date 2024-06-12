import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Orders() {
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8800/tabelas");
        setOrdersData(res.data.reverse()); 
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'cadastrado':
        return 'bg-green-200';
      case 'bloqueado':
        return 'bg-red-200';
      case 'não cadastrado':
        return 'bg-red-200';
      default:
        return 'bg-gray-200';
    }
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ordersData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ordersData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderTable = () => {
    if (currentItems.length === 0) {
      return (
        <p className="text-center text-gray-800">
          Não foram encontrados nenhum acesso referentes a esse cofre.
        </p>
      );
    } else {
      return (
        <div className="overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Código</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">Nome</th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Data</th>
                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">Horário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((order, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <a href={"/Codigo/" + order.codigo_acesso} className="font-bold text-blue-500 hover:underline">{order.codigo_acesso}</a>
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.nome_acesso}</td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`p-1.5 text-xs font-medium uppercase tracking-wider text-gray-800 ${getStatusClass(order.status_acesso)} rounded-lg bg-opacity-50`}>
                      {order.status_acesso}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.data_acesso}</td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.hora_acesso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const renderMobileView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {currentItems.map((order, index) => (
          <div key={index} className="bg-white space-y-3 p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2 text-sm">
              <div>
                <a href={"/Codigo/" + order.codigo} className="text-blue-500 font-bold hover:underline">#{order.codigo_acesso}</a>
              </div>
              <div className="text-gray-500">{order.data_acesso}</div>
              <div>
                <span className={`p-1.5 text-xs font-medium uppercase tracking-wider text-gray-800 ${getStatusClass(order.status_acesso)} rounded-lg bg-opacity-50`}>
                  {order.status_acesso}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-700">{order.nome_acesso}</div>
            <div className="text-sm font-medium text-black">{order.hora_acesso}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
      </head>
      <body className="font-[Poppins] bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen">
        <header className="bg-white">
          <nav className="flex justify-between items-center w-[92%] mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-center py-6">SafeLocker</h2>
            </div>
            <div className="nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5">
              <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                <li>
                  <a className="hover:text-gray-500" href="/tabelas">Histórico</a>
                </li>
                <li>
                  <a className="hover:text-gray-500" href="/creditos">Créditos</a>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-6">
              <a className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]" href="/">Logout</a>
            </div>
          </nav>
        </header>

        <div className="p-5 h-screen bg-gray-100">
        <h1 className="text-xl mb-3 rounded-lg bg-gray-500 font-extrabold flex justify-center text-white">Histórico de Acesso</h1>
          

          {currentItems.length === 0 ? (
            <p className="text-center text-gray-800 font-bold">
              Não foram encontrados nenhum acesso referente a esse cofre.
            </p>
          ) : (
            <div className="overflow-auto rounded-lg shadow hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Código</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">Nome</th>
                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Data</th>
                    <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">Horário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((order, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <a href={"/Codigo/" + order.codigo_acesso} className="font-bold text-blue-500 hover:underline">{order.codigo_acesso}</a>
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.nome_acesso}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <span className={`p-1.5 text-xs font-medium uppercase tracking-wider text-gray-800 ${getStatusClass(order.status_acesso)} rounded-lg bg-opacity-50`}>
                          {order.status_acesso}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.data_acesso}</td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{order.hora_acesso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {currentItems.map((order, index) => (
              <div key={index} className="bg-white space-y-3 p-4 rounded-lg shadow">
                <div className="flex items-center space-x-2 text-sm">
                  <div>
                    <a href={"/Codigo/" + order.codigo} className="text-blue-500 font-bold hover:underline">#{order.codigo_acesso}</a>
                  </div>
                  <div className="text-gray-500">{order.data_acesso}</div>
                  <div>
                    <span className={`p-1.5 text-xs font-medium uppercase tracking-wider text-gray-800 ${getStatusClass(order.status_acesso)} rounded-lg bg-opacity-50`}>
                      {order.status_acesso}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-700">{order.nome_acesso}</div>
                <div className="text-sm font-medium text-black">{order.hora_acesso}</div>
              </div>
            ))}
          </div>

          <ul className="flex justify-center mt-4 space-x-2">
            {pageNumbers.map(number => (
              <li key={number}>
                <button
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 rounded-md focus:outline-none ${currentPage === number ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  );
}