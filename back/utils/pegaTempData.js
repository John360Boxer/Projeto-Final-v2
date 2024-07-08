const fetch = require('node-fetch');

async function pegaTempData(date) {
  const dataFormatada = new Date(date).toISOString().split('T')[0];
  const url = `https://climate-api.open-meteo.com/v1/climate?latitude=-22.4256&longitude=-45.4528&start_date=${dataFormatada}&end_date=${dataFormatada}&models=MRI_AGCM3_2_S&timezone=America%2FSao_Paulo&daily=temperature_2m_max`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados climáticos');
  }
  
  const data = await response.json();
  // Retorna a temperatura máxima do dia
  return data.daily.temperature_2m_max[0];
}

module.exports = pegaTempData;
