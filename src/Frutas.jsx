import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Frutas.css';

function Frutas() {
  const [fruits, setFruits] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProducts, selectedLiquors, selectedRefreshments, totalAmount } = location.state || { selectedProducts: [], selectedLiquors: [], selectedRefreshments: [], totalAmount: 0 };

  useEffect(() => {
    axios.get('http://localhost/frutas_read.php')
      .then(response => {
        setFruits(response.data);
        const initialQuantities = {};
        response.data.forEach(fruit => {
          initialQuantities[fruit.id] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Error fetching fruits:', error);
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
    const selectedFruits = fruits.filter(fruit => quantities[fruit.id] > 0).map(fruit => ({
      ...fruit,
      quantity: quantities[fruit.id],
      totalPrice: (quantities[fruit.id] / 10) * fruit.precio
    }));
    const totalFruitsAmount = selectedFruits.reduce((total, fruit) => total + fruit.totalPrice, 0);
    const newTotalAmount = totalAmount + totalFruitsAmount;

    navigate('/Extras', { state: { selectedProducts, selectedLiquors, selectedRefreshments, selectedFruits, totalAmount: newTotalAmount } });
  };

  return (
    <div className="catalog-container">
      <h1>Personaliza tu fruta</h1>
      <h2>Elige mínimo 50 gramos.</h2>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {fruits.map((fruit) => (
            <div className="swiper-slide" key={fruit.id}>
              <div className="icons">
                <i className="fa-solid fa-circle-arrow-left"></i>
                <img src="src/img/logo2.png" alt="logo" />
              </div>
              <div className="product-content">
                <div className="product-txt">
                  <span>${fruit.precio}</span>
                  <h3>{fruit.nombre}</h3>
                </div>
                <div className="product-img">
                  <img src={fruit.image_url} alt={fruit.nombre} />
                </div>
              </div>
              <div className="control-panel">
                <a href="#" className="btn-1 minus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(fruit.id, -10); }}>-</a>
                <span className="quantity-counter">{quantities[fruit.id]} gramos</span>
                <a href="#" className="btn-1 plus-btn" onClick={(e) => { e.preventDefault(); handleQuantityChange(fruit.id, 10); }}>+</a>
              </div>
              <p className="status-msg">{quantities[fruit.id] > 0 ? `Ya elegiste ${quantities[fruit.id]} gramos.` : 'Selecciona la cantidad.'}</p>
            </div>
          ))}
        </div>
      </div>
      {Object.values(quantities).reduce((total, qty) => total + qty, 0) >= 50 && (
        <div className="btn-container">
          <button className="btn-1" onClick={handleNextClick}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default Frutas;
