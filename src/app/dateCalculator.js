function formatDate(day, month, year) {
    return `${day
        .toString()
        .padStart(2, "0")}/${(month + 1).toString().padStart(2, "0")}/${year}`;
}

function calculateDays(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInMs = date2.getTime() - date1.getTime();
    return Math.round(diffInMs / oneDay);
   }

export function processDate(date) {
  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  let today = new Date();
  let dayOfWeek = date.getDay();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let text = formatDate(day, month, year);

  //Checar se a data é hoje
  if (calculateDays(date, today) < 1) {
    text = 'Hoje';
  }
  //Calcular dias da semana
  else if (calculateDays(date, today) < 8) {
    text = daysOfWeek[dayOfWeek];
  }
  return text
}