import React from 'react';
import image_guilherme from "../images/guilherme.jpeg";
import image_joao from "../images/joao.jpeg";
import image_kevin from "../images/kevin.jpeg";
import image_batista from "../images/batista.jpeg";

const creditos = () => {
    return (
        <html>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
                <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
            </head>
            <body className="font-[Poppins] bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen flex items-center justify-center">
                <header className="bg-white absolute top-0 w-full">
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
                <main className="w-[92%] mx-auto py-10 flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl font-bold text-center mb-8">Créditos</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
                            <img className="w-32 h-32 mx-auto rounded-full" src={image_guilherme} alt="Nome 1" />
                            <h2 className="text-2xl font-semibold mt-4">Guilherme Santos</h2>
                            <p className="mt-2 text-gray-600">Responsável pelo desenvolvimento do Front-end, Back-end, Database mySQL e integração com o circuito.</p>
                        </div>
                        <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
                            <img className="w-32 h-32 mx-auto rounded-full" src={image_joao} alt="Nome 2" />
                            <h2 className="text-2xl font-semibold mt-4">João Campos</h2>
                            <p className="mt-2 text-gray-600">Responsável pela montagem do circuito, auxílo na integração com a aplicação web e construção da maquete.</p>
                        </div>
                        <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
                            <img className="w-32 h-32 mx-auto rounded-full" src={image_kevin} alt="Nome 3" />
                            <h2 className="text-2xl font-semibold mt-4">Kevin Molinari</h2>
                            <p className="mt-2 text-gray-600">Auxílo na montagem do código do ESP8266, auxílio no Design e construção da maquete.</p>
                        </div>
                        <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
                            <img className="w-32 h-32 mx-auto rounded-full" src={image_batista} alt="Nome 4" />
                            <h2 className="text-2xl font-semibold mt-4">Thomas Batista</h2>
                            <p className="mt-2 text-gray-600">Auxílio na montagem da Database mySQL, auxílio no Design e construção da maquete.</p>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}

export default creditos;
