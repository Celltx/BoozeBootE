import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Alcohol.css';

function Alcohol() {
  const [totalSelectedOz, setTotalSelectedOz] = useState(0);
  const [liquors, setLiquors] = useState([]);
  const navigate = useNavigate();
  const ozCountsRef = useRef({}); 

  useEffect(() => {
    const fetchLiquors = async () => {
      try {
        const response = await axios.get('http://localhost/alcohol_read.php');
        setLiquors(response.data);
      } catch (error) {
        console.error('Error fetching liquors:', error);
      }
    };

    fetchLiquors();
  }, []);

  useEffect(() => {
    if (liquors.length > 0) {
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

      const totalOz = 6;

      const handlePlusClick = (liquorName, ozCounter, statusMsg) => {
        if (ozCountsRef.current[liquorName] < totalOz && sumOzCounts() < totalOz) {
          ozCountsRef.current[liquorName] = (ozCountsRef.current[liquorName] || 0) + 1;
          ozCounter.textContent = ozCountsRef.current[liquorName] + ' oz';
          updateStatusMsg(liquorName, statusMsg);
          setTotalSelectedOz(sumOzCounts());
        } else {
          statusMsg.textContent = 'No puedes seleccionar más de 6 oz en total.';
        }
      };

      const handleMinusClick = (liquorName, ozCounter, statusMsg) => {
        if (ozCountsRef.current[liquorName] > 0) {
          ozCountsRef.current[liquorName]--;
          ozCounter.textContent = ozCountsRef.current[liquorName] + ' oz';
          updateStatusMsg(liquorName, statusMsg);
          setTotalSelectedOz(sumOzCounts());
        } else {
          statusMsg.textContent = 'No puedes tener menos de 0 oz.';
        }
      };

      const updateStatusMsg = (liquorName, statusMsg) => {
        const totalOzSelected = sumOzCounts();
        const ozCount = ozCountsRef.current[liquorName];
        if (ozCount < totalOz) {
          statusMsg.textContent = 'Ya elegiste ' + ozCount + ' oz. Te faltan ' + (totalOz - totalOzSelected) + ' oz.';
        } else {
          statusMsg.textContent = 'Ya has alcanzado el límite de 6 oz para ' + liquorName + '.';
        }
      };

      const sumOzCounts = () => {
        let sum = 0;
        Object.values(ozCountsRef.current).forEach((count) => {
          sum += count;
        });
        return sum;
      };

      const initializeSlides = () => {
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach((slide) => {
          const plusBtn = slide.querySelector('.plus-btn');
          const minusBtn = slide.querySelector('.minus-btn');
          const ozCounter = slide.querySelector('.oz-counter');
          const statusMsg = slide.querySelector('.status-msg');
          const liquorName = slide.querySelector('h3').textContent.trim();

          ozCountsRef.current[liquorName] = 0;

          plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handlePlusClick(liquorName, ozCounter, statusMsg);
          });

          minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleMinusClick(liquorName, ozCounter, statusMsg);
          });
        });
      };

      initializeSlides();
    }
  }, [liquors]);

  const handleSiguienteClick = (e) => {
    e.preventDefault();
    if (totalSelectedOz === 6) {
      const selectedLiquors = liquors.filter(liquor => ozCountsRef.current[liquor.nombre] > 0).map(liquor => ({
        ...liquor,
        quantity: ozCountsRef.current[liquor.nombre],
        totalPrice: ozCountsRef.current[liquor.nombre] * liquor.precio
      }));
      navigate('/Refresco', { state: { selectedLiquors } });
    } else {
      alert('Debes seleccionar exactamente 6 oz.');
    }
  };

  return (
    <div className="catalog-container">
      <h1>Personaliza a tú gusto</h1>
      <h2>Elige mínimo 6 onzas.</h2>
      <div className="swiper mySwiper">
        <div className="swiper-wrapper">
          {liquors.map((liquor) => (
            <div className="swiper-slide" key={liquor.id}>
              <div className="icons">
                <i className="fa-solid fa-circle-arrow-left"></i>
                <img src="src/img/logo2.png" alt="logo" />
              </div>
              <div className="product-content">
                <div className="product-txt">
                  <span>${liquor.precio}</span>
                  <h3>{liquor.nombre}</h3>
                </div>
                <div className="product-img">
                  <img src={liquor.image_url} alt={liquor.nombre} />
                </div>
              </div>
              <div className="control-panel">
                <a href="#" className="btn-1 minus-btn">-</a>
                <span className="oz-counter">0 oz</span>
                <a href="#" className="btn-1 plus-btn">+</a>
              </div>
              <p className="status-msg"></p>
            </div>
          ))}
        </div>
      </div>
      <div className="btn-container">
        <a href="#" className="btn-1 siguiente-btn" onClick={handleSiguienteClick}>Siguiente</a>
      </div>
    </div>
  );
}

export default Alcohol;
