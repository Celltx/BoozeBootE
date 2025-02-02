import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Pago.css';

function Pago() {
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  const selectedLiquors = location.state?.selectedLiquors || [];
  const selectedRefreshments = location.state?.selectedRefreshments || [];
  const selectedFruits = location.state?.selectedFruits || [];
  const selectedExtras = location.state?.selectedExtras || [];

  const allSelectedItems = [
    ...selectedProducts,
    ...selectedLiquors,
    ...selectedRefreshments,
    ...selectedFruits,
    ...selectedExtras
  ];

  const totalPrice = allSelectedItems.reduce((total, item) => total + item.totalPrice, 0);

  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.post('http://localhost/generar_factura.php', {
        items: allSelectedItems,
        total: totalPrice
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'factura.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al generar la factura:', error);
    }
  };

  useEffect(() => {
    // Script de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AcKp0WMNoFxG2YdrbCmmYJPdc7_EZzgmON74FZXGpdxneI7U1JvHfFRifS8lsIvWj3_JekMus5jndS-9&currency=MXN`;
    script.async = true;

    script.onload = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice.toString() // total a pagar
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Transacción completada por ${details.payer.name.given_name}`);
            // Editar para como guardar en tu backend.
          });
        },
        onError: (err) => {
          console.error("Error en la transacción de PayPal:", err);
        }
      }).render('#paypal-button-container');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Limpia el script
    };
  }, [totalPrice]);

  return (
    <div className="summary-container">
      <div className="summary-box">
        <h1>Resumen de Compra</h1>
        <div className="product-list">
          {allSelectedItems.map((item, index) => (
            <div className="product-item" key={index}>
              <img src={item.image_url} alt={item.nombre} className="product-image" />
              <div className="product-details">
                <span className="product-name">{item.nombre}</span>
                <span className="product-quantity">
                  {item.tipo === 'catalogo'
                    ? `${item.quantity} x $${item.precio} = $${item.totalPrice}`
                    : `${item.quantity} ${item.unidad ? item.unidad : ''} x $${item.precio} = $${item.totalPrice}`}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="total-amount">
          <span>Total:</span>
          <span>${totalPrice}</span>
        </div>

        {/* Botón para recoger en tienda (Generar factura en PDF) */}
        <button onClick={handleGenerateInvoice} className="pickup-button">Recoger en tienda</button>

        {/* Contenedor del botón de PayPal */}
        <div id="paypal-button-container"></div>
      </div>
    </div>
  );
}

export default Pago;
