import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Extras.css';

function Extras() {
  const [extras, setExtras] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProducts, selectedLiquors, selectedRefreshments, selectedFruits, totalAmount } = location.state || { selectedProducts: [], selectedLiquors: [], selectedRefreshments: [], selectedFruits: [], totalAmount: 0 };

  useEffect(() => {
    axios.get('http://localhost/extras_read.php')
      .then(response => {
        setExtras(response.data);
        const initialQuantities = {};
        response.data.forEach(extra => {
          initialQuantities[extra.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Error al obtener extras:', error);
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
    const selectedExtras = extras.filter(extra => quantities[extra.id] > 0).map(extra => ({
      ...extra,
      quantity: quantities[extra.id],
      totalPrice: (quantities[extra.id] / 10) * extra.precio
    }));
    const totalExtrasAmount = selectedExtras.reduce((total, extra) => total + extra.totalPrice, 0);
    const newTotalAmount = totalAmount + totalExtrasAmount;

    navigate('/Pago', { state: { selectedProducts, selectedLiquors, selectedRefreshments, selectedFruits, selectedExtras, totalAmount: newTotalAmount } });
  };

  return (
    <div className="catalog-container">
      <h1>Personaliza tus extras</h1>
      <h2>Elige mínimo 40 gramos.</h2>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {extras.map((extra) => (
            <div className="swiper-slide" key={extra.id}>
              <div className="icons">
                <i className="fa-solid fa-circle-arrow-left"></i>
                <img src="src/img/logo2.png" alt="logo" />
              </div>
              <div className="product-content">
                <div className="product-txt">
                  <span>${extra.precio}</span>
                  <h3>{extra.nombre}</h3>
                </div>
                <div className="product-img">
                  <img src={extra.image_url} alt={extra.nombre} />
                </div>
              </div>
              <div className="control-panel">
                <a href="#" className="btn-1 minus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(extra.id, -10); }}>-</a>
                <span className="quantity-counter">{quantities[extra.id]} gramos</span>
                <a href="#" className="btn-1 plus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(extra.id, 10); }}>+</a>
              </div>
              <p className="status-msg">{quantities[extra.id] > 0 ? `Ya elegiste ${quantities[extra.id]} gramos.` : 'Selecciona la cantidad.'}</p>
            </div>
          ))}
        </div>
      </div>
      {Object.values(quantities).reduce((total, qty) => total + qty, 0) >= 10 && (
        <div className="btn-container">
          <button className="btn-1" onClick={handleNextClick}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default Extras;
