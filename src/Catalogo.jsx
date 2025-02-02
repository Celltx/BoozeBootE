import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Catalogo.css';

function Catalogo() {
  const [catalogData, setCatalogData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/catalog.php')
      .then(response => {
        setCatalogData(response.data);
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Error datos del catalogo:', error);
      });

    var swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      coverflowEffect: {
        depth: 500,
        modifier: 1,
        slideShadows: true,
        rotate: 0,
        stretch: 0
      }
    });
  }, []);

  const handleQuantityChange = (id, change) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: Math.max(0, (prevQuantities[id] || 0) + change) 
    }));
  };

  const handleBuyClick = () => {
    const selectedProducts = catalogData.filter(product => quantities[product.id] > 0).map(product => ({
      ...product,
      quantity: quantities[product.id],
      totalPrice: quantities[product.id] * product.precio,
      tipo: 'catalogo'
    }));
    const totalAmount = selectedProducts.reduce((total, product) => total + product.totalPrice, 0);

    navigate('/pago', { state: { selectedProducts, totalAmount } });
  };

  return (
    <div className="catalog-container">
      <h1>CATÁLOGO</h1>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {catalogData.map(product => (
            <div className="swiper-slide" key={product.id}>
              <div className="icons">
                <i className="fa-solid fa-circle-arrow-left"></i>
                <img src="src/img/logo2.png" alt="logo" />
                <i className="fa-regular fa-heart"></i>
              </div>

              <div className="product-content">
                <div className="product-txt">
                  <span>${product.precio}</span>
                  <h3>{product.nombre}</h3>
                  <ul>
                    {product.ingredientes.split(',').map((ingrediente, index) => (
                      <li key={index}>{ingrediente}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-img">
                  <img src={product.image_url} alt={product.nombre} />
                </div>
              </div>

              <div className="control-panel">
                <a href="#" className="btn-1 minus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(product.id, -1); }}>-</a>
                <span className="quantity-counter">{quantities[product.id]}</span>
                <a href="#" className="btn-1 plus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(product.id, 1); }}>+</a>
              </div>
              <p className="status-msg">{quantities[product.id] > 0 ? `Has seleccionado ${quantities[product.id]} unidades.` : 'Selecciona la cantidad.'}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="btn-container">
        <button className="btn-1" onClick={handleBuyClick}>Comprar</button>
      </div>
    </div>
  );
}

export default Catalogo;
