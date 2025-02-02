import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Refresco.css';

function Refresco() {
  const [refreshments, setRefreshments] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProducts, selectedLiquors, totalAmount } = location.state || { selectedProducts: [], selectedLiquors: [], totalAmount: 0 };

  useEffect(() => {
    axios.get('http://localhost/refresco_read.php')
      .then(response => {
        setRefreshments(response.data);
        const initialQuantities = {};
        response.data.forEach(refreshment => {
          initialQuantities[refreshment.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Error fetching refreshments:', error);
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

  const handleNextClick = () => {
    const selectedRefreshments = refreshments.filter(refreshment => quantities[refreshment.id] > 0).map(refreshment => ({
      ...refreshment,
      quantity: quantities[refreshment.id],
      totalPrice: (quantities[refreshment.id] / 100) * refreshment.precio
    }));
    const totalRefreshmentsAmount = selectedRefreshments.reduce((total, refreshment) => total + refreshment.totalPrice, 0);
    const newTotalAmount = totalAmount + totalRefreshmentsAmount;

    navigate('/Frutas', { state: { selectedProducts, selectedLiquors, selectedRefreshments, totalAmount: newTotalAmount } });
  };

  return (
    <div className="catalog-container">
      <h1>Personaliza tú refresco</h1>
      <h2>Elige mínimo 700 gramos.</h2>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {refreshments.map((refreshment) => (
            <div className="swiper-slide" key={refreshment.id}>
              <div className="icons">
                <i className="fa-solid fa-circle-arrow-left"></i>
                <img src="src/img/logo2.png" alt="logo" />
              </div>
              <div className="product-content">
                <div className="product-txt">
                  <span>${refreshment.precio}</span>
                  <h3>{refreshment.nombre}</h3>
                </div>
                <div className="product-img">
                  <img src={refreshment.image_url} alt={refreshment.nombre} />
                </div>
              </div>
              <div className="control-panel">
                <a href="#" className="btn-1 minus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(refreshment.id, -100); }}>-</a>
                <span className="quantity-counter">{quantities[refreshment.id]} gramos</span>
                <a href="#" className="btn-1 plus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(refreshment.id, 100); }}>+</a>
              </div>
              <p className="status-msg">{quantities[refreshment.id] > 0 ? `Ya elegiste ${quantities[refreshment.id]} gramos.` : 'Selecciona la cantidad.'}</p>
            </div>
          ))}
        </div>
      </div>
      {Object.values(quantities).reduce((total, qty) => total + qty, 0) >= 700 && (
        <div className="btn-container">
          <button className="btn-1" onClick={handleNextClick}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default Refresco;
