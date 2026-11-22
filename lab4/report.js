const form = document.querySelector('.report-form');
const status = form.querySelector('[role="status"]');
const button = form.querySelector('button');
const demo = location.protocol === 'file:' || location.hostname.endsWith('.github.io');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const report = new CaseReport(new FormData(form));
  report.printToConsole();

  button.disabled = true;
  try {
    if (!demo) {
      const response = await fetch(form.action, {
        method: 'POST',
        body: JSON.stringify(report),
        headers: {'Content-Type': 'application/json'},
      });
      if (!response.ok) throw new Error('Ошибка отправки');
    }

    form.reset();
    status.textContent = demo ? 'Данные выведены в консоль.' : 'Сервер принял сведения.';
  } catch {
    status.textContent = 'Не удалось отправить сведения. Попробуй ещё раз.';
  } finally {
    button.disabled = false;
  }
});
